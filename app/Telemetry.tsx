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

const ANALYTICS_URL = 'https://vercel.com/ikel-eidras-projects/michael-futol-chinaimo-project-controls/analytics';
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
        .chinaimo-shimmer-strip{
          width:100%;display:flex;justify-content:center;align-items:flex-start;gap:4px;
          padding:7px 0 12px;perspective:180px;user-select:none;
        }
        .chinaimo-shimmer-tile{
          position:relative;width:13px;height:15px;display:block;overflow:hidden;
          border:1px solid rgba(63,71,75,.42);border-radius:1px 1px 2px 2px;
          background:
            linear-gradient(112deg,rgba(255,255,255,.84) 0%,rgba(210,216,217,.58) 16%,rgba(88,99,104,.72) 39%,rgba(239,241,239,.88) 55%,rgba(103,113,117,.72) 75%,rgba(222,225,224,.62) 100%);
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.13),0 1px 1px rgba(31,38,41,.18);
          opacity:.31;transform-origin:50% 1px;backface-visibility:hidden;
          animation-name:chinaimoShimmerWind,chinaimoShimmerLight;
          animation-timing-function:ease-in-out,ease-in-out;
          animation-iteration-count:infinite,infinite;
          will-change:transform,filter,opacity,box-shadow;
          cursor:default;
        }
        .chinaimo-shimmer-tile:before{
          content:'';position:absolute;z-index:2;top:1px;left:50%;width:2px;height:2px;
          margin-left:-1px;border-radius:50%;background:rgba(42,49,52,.76);
          box-shadow:0 0 0 1px rgba(255,255,255,.22);
        }
        .chinaimo-shimmer-tile:after{
          content:'';position:absolute;inset:-5px;
          background:linear-gradient(105deg,transparent 31%,rgba(255,255,255,.92) 47%,transparent 61%);
          transform:translateX(-135%);opacity:0;
        }
        .chinaimo-shimmer-tile:hover{
          opacity:.72;
          animation-duration:.78s,.52s !important;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),0 0 5px rgba(120,132,136,.46),0 0 15px rgba(120,132,136,.23);
        }
        .chinaimo-shimmer-tile:hover:after{
          animation:chinaimoShimmerSweep .72s ease-out 1;
        }
        @keyframes chinaimoShimmerWind{
          0%,100%{transform:perspective(95px) rotateX(-2deg) rotateY(-8deg) translateY(0)}
          14%{transform:perspective(95px) rotateX(5deg) rotateY(15deg) translateY(.2px)}
          29%{transform:perspective(95px) rotateX(-7deg) rotateY(4deg) translateY(-.3px)}
          47%{transform:perspective(95px) rotateX(2deg) rotateY(-18deg) translateY(.35px)}
          63%{transform:perspective(95px) rotateX(8deg) rotateY(8deg) translateY(-.15px)}
          81%{transform:perspective(95px) rotateX(-4deg) rotateY(20deg) translateY(.25px)}
        }
        @keyframes chinaimoShimmerLight{
          0%,100%{filter:brightness(.72) contrast(1.02)}
          18%{filter:brightness(1.34) contrast(1.08)}
          32%{filter:brightness(.8) contrast(1.06)}
          49%{filter:brightness(1.58) contrast(1.12)}
          67%{filter:brightness(.78) contrast(1.04)}
          82%{filter:brightness(1.24) contrast(1.08)}
        }
        @keyframes chinaimoShimmerSweep{
          0%{transform:translateX(-135%);opacity:0}
          28%{opacity:.78}
          100%{transform:translateX(135%);opacity:0}
        }
        @media (prefers-reduced-motion:reduce){
          .chinaimo-shimmer-tile{animation:none!important;transform:none!important;filter:none!important}
          .chinaimo-shimmer-tile:hover:after{animation:none!important}
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
      <div aria-hidden="true" className="chinaimo-shimmer-strip">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((tile) => {
          const windDuration = 3.25 + (tile % 4) * .43;
          const lightDuration = 2.15 + (tile % 5) * .31;
          return (
            <span
              key={tile}
              data-a-tile={tile}
              onClick={() => onGateTile(tile)}
              className="chinaimo-shimmer-tile"
              style={{
                animationDuration: `${windDuration}s, ${lightDuration}s`,
                animationDelay: `${-tile * .37}s, ${-tile * .23}s`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
