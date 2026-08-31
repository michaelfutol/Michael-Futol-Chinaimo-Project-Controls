'use client';

import { useEffect, useRef } from 'react';
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

const ANALYTICS_URL = 'https://vercel.com/ikel-eidras-projects/michael-futol-chinaimo-project-controls/analytics';
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

  useEffect(() => {
    const visitorId = getStoredId(localStorage, 'chinaimo_visitor_id', 'v');
    const sessionId = getStoredId(sessionStorage, 'chinaimo_session_id', 's');
    const source = new URLSearchParams(window.location.search).get('ref') || undefined;

    const base = { visitorId, sessionId, source };
    send({ event: 'page_view', path: window.location.pathname, ...base });

    try {
      track('Reviewer Page View', {
        path: window.location.pathname,
        source: source || 'direct',
      });
    } catch {
      // Runtime-log telemetry remains the fallback if Web Analytics is not enabled yet.
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.origin);
      const label = (anchor.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      const sameOrigin = url.origin === window.location.origin;

      if (sameOrigin && url.pathname.startsWith('/downloads/')) {
        const asset = decodeURIComponent(url.pathname.split('/').pop() || '').slice(0, 160);
        send({
          event: 'download_click',
          path: window.location.pathname,
          href: url.pathname,
          label,
          asset,
          ...base,
        });
        try {
          track('Reviewer Download', { asset, label: label || asset });
        } catch {}
        return;
      }

      if (sameOrigin && (url.pathname === '/dossier-jp' || url.pathname.startsWith('/dossier-jp/'))) {
        send({
          event: 'japanese_dossier_open',
          path: window.location.pathname,
          href: url.pathname,
          label,
          ...base,
        });
        try {
          track('Japanese Dossier Open', { from: window.location.pathname });
        } catch {}
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  const onGateTile = (tile: number) => {
    if (gateTimer.current) clearTimeout(gateTimer.current);

    const expected = ADMIN_SEQUENCE[gateStep.current];
    if (tile === expected) {
      gateStep.current += 1;
      if (gateStep.current === ADMIN_SEQUENCE.length) {
        const visitorId = getStoredId(localStorage, 'chinaimo_visitor_id', 'v');
        const sessionId = getStoredId(sessionStorage, 'chinaimo_session_id', 's');
        send({
          event: 'admin_analytics_gate_open',
          path: window.location.pathname,
          visitorId,
          sessionId,
        });
        gateStep.current = 0;
        window.open(ANALYTICS_URL, '_blank', 'noopener,noreferrer');
        return;
      }
    } else {
      gateStep.current = tile === ADMIN_SEQUENCE[0] ? 1 : 0;
    }

    gateTimer.current = setTimeout(() => {
      gateStep.current = 0;
    }, 4500);
  };

  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: 7,
        padding: '2px 0 7px',
        opacity: 0.18,
        userSelect: 'none',
      }}
    >
      {Array.from({ length: 10 }, (_, i) => i + 1).map((tile) => (
        <span
          key={tile}
          data-a-tile={tile}
          onClick={() => onGateTile(tile)}
          style={{
            width: 7,
            height: 7,
            display: 'block',
            borderRadius: 2,
            background: '#68747b',
            cursor: 'default',
          }}
        />
      ))}
    </div>
  );
}
