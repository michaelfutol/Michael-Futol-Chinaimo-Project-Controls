'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';

type TelemetryPayload = {
  event: string;
  path: string;
  href?: string;
  label?: string;
  asset?: string;
  visitorId: string;
  sessionId: string;
  source?: string;
};

const ANALYTICS_URL = 'https://vercel.com/michael-futol-projects/michael-futol-chinaimo-project-controls/analytics';
const CLASSIC_URL = 'https://michael-futol-chinaimo-project-controls-8hhdsow8z.vercel.app/';
const ADMIN_SEQUENCE = [1, 3, 7] as const;

function makeId(prefix: string) {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${id}`;
}

function getStoredId(storage: Storage, key: string, prefix: string) {
  let value = storage.getItem(key);
  if (!value) {
    value = makeId(prefix);
    storage.setItem(key, value);
  }
  return value;
}

function send(payload: TelemetryPayload) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/telemetry', new Blob([body], { type: 'application/json' }));
  } else {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }
}

export default function Telemetry() {
  const gateStep = useRef(0);
  const gateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  useEffect(() => {
    const visitorId = getStoredId(localStorage, 'chinaimo_visitor_id', 'v');
    const sessionId = getStoredId(sessionStorage, 'chinaimo_session_id', 's');
    const source = new URLSearchParams(window.location.search).get('ref') || undefined;
    setAdminUnlocked(sessionStorage.getItem('chinaimo_admin_unlocked') === '1');

    const base = { visitorId, sessionId, source };
    send({ event: 'page_view', path: window.location.pathname, ...base });

    try {
      track('Reviewer Page View', {
        path: window.location.pathname,
        source: source || 'direct',
      });
    } catch {}

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.origin);
      const label = (anchor.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      const sameOrigin = url.origin === window.location.origin;

      if (sameOrigin && url.pathname.startsWith('/downloads/')) {
        const asset = decodeURIComponent(url.pathname.split('/').pop() || '').slice(0, 160);
        send({ event: 'download_click', path: window.location.pathname, href: url.pathname, label, asset, ...base });
        try { track('Reviewer Download', { asset, label: label || asset }); } catch {}
        return;
      }

      if (sameOrigin && (url.pathname === '/dossier-jp' || url.pathname.startsWith('/dossier-jp/'))) {
        send({ event: 'japanese_dossier_open', path: window.location.pathname, href: url.pathname, label, ...base });
        try { track('Japanese Dossier Open', { from: window.location.pathname }); } catch {}
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  const adminEvent = (event: string) => {
    const visitorId = getStoredId(localStorage, 'chinaimo_visitor_id', 'v');
    const sessionId = getStoredId(sessionStorage, 'chinaimo_session_id', 's');
    send({ event, path: window.location.pathname, visitorId, sessionId });
  };

  const onGateTile = (tile: number) => {
    if (gateTimer.current) clearTimeout(gateTimer.current);

    const expected = ADMIN_SEQUENCE[gateStep.current];
    if (tile === expected) {
      gateStep.current += 1;
      if (gateStep.current === ADMIN_SEQUENCE.length) {
        adminEvent('admin_analytics_gate_open');
        sessionStorage.setItem('chinaimo_admin_unlocked', '1');
        setAdminUnlocked(true);
        gateStep.current = 0;
        window.open(ANALYTICS_URL, '_blank', 'noopener,noreferrer');
        return;
      }
    } else {
      gateStep.current = tile === ADMIN_SEQUENCE[0] ? 1 : 0;
    }

    gateTimer.current = setTimeout(() => { gateStep.current = 0; }, 4500);
  };

  const openClassic = () => {
    adminEvent('admin_classic_checkpoint_open');
    window.open(CLASSIC_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <style>{`
        .chinaimo-admin-strip{
          width:100%;display:flex;justify-content:center;align-items:center;gap:4px;
          padding:7px 0 12px;user-select:none;
        }
        .chinaimo-admin-tile{
          width:10px;height:10px;display:block;
          border:1px solid rgba(76,83,84,.36);
          border-radius:1px;
          background:#d6d7d3;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.24);
          opacity:.48;
          cursor:default;
          transition:opacity .14s ease,background .14s ease,border-color .14s ease,box-shadow .14s ease;
        }
        .chinaimo-admin-tile:nth-child(3n+2){background:#cfd2d1}
        .chinaimo-admin-tile:nth-child(4n){background:#ddd9d1}
        .chinaimo-admin-tile:hover{
          opacity:.78;
          border-color:rgba(67,77,79,.48);
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.34),0 0 5px rgba(85,96,98,.12);
        }
      `}</style>
      {adminUnlocked && (
        <button
          type="button"
          onClick={openClassic}
          title="Open exact pre-redesign production checkpoint"
          style={{
            position: 'fixed', right: 12, bottom: 12, zIndex: 9999, height: 26, padding: '0 8px',
            border: '1px solid #7e8587', background: '#f4f3ee', color: '#4e575a',
            font: '700 10px/1 Courier New, monospace', letterSpacing: '.04em', opacity: 0.34, cursor: 'pointer',
          }}
        >↶ CLASSIC</button>
      )}
      <div aria-hidden="true" className="chinaimo-admin-strip">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((tile) => (
          <span
            key={tile}
            data-a-tile={tile}
            onClick={() => onGateTile(tile)}
            className="chinaimo-admin-tile"
          />
        ))}
      </div>
    </>
  );
}
