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

const METALLIC_FINISHES = [
  'linear-gradient(112deg,#f1f3f2 0%,#bcc4c6 18%,#6c787d 40%,#eef1ef 57%,#7e898d 76%,#d7dcda 100%)',
  'linear-gradient(112deg,#f3ead7 0%,#cbb992 19%,#827052 41%,#eee1c5 58%,#99846a 77%,#d8c6a5 100%)',
  'linear-gradient(112deg,#c9ced0 0%,#7d878b 20%,#3f494e 42%,#b8c0c2 58%,#596469 78%,#929b9e 100%)',
  'linear-gradient(112deg,#ead8c6 0%,#bf9677 19%,#7a5542 41%,#ddc0aa 58%,#966d55 77%,#cba88d 100%)',
  'linear-gradient(112deg,#e8edf0 0%,#aebcc3 18%,#63747d 40%,#dce5e8 58%,#768892 77%,#c4d0d5 100%)',
] as const;

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
          padding:7px 0 12px;perspective:220px;user-select:none;
        }
        .chinaimo-shimmer-tile{
          position:relative;width:13px;height:15px;display:block;overflow:hidden;
          border:1px solid rgba(63,71,75,.38);border-radius:1px 1px 2px 2px;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),0 1px 1px rgba(31,38,41,.15);
          opacity:.36;transform-origin:50% 1px;backface-visibility:hidden;
          animation-name:chinaimoShimmerWind,chinaimoShimmerLight;
          animation-timing-function:ease-in-out,ease-in-out;
          animation-iteration-count:infinite,infinite;
          will-change:transform,filter,opacity;
          cursor:default;
        }
        .chinaimo-shimmer-tile:before{
          content:'';position:absolute;z-index:2;top:1px;left:50%;width:2px;height:2px;
          margin-left:-1px;border-radius:50%;background:rgba(42,49,52,.65);
          box-shadow:0 0 0 1px rgba(255,255,255,.20);
        }
        .chinaimo-shimmer-tile:after{
          content:'';position:absolute;inset:-5px;
          background:linear-gradient(105deg,transparent 34%,rgba(255,255,255,.82) 49%,transparent 64%);
          transform:translateX(-135%);opacity:0;
        }
        .chinaimo-shimmer-tile:hover{
          opacity:.64;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.24),0 0 4px rgba(120,132,136,.30),0 0 11px rgba(120,132,136,.14);
        }
        .chinaimo-shimmer-tile:hover:after{
          animation:chinaimoShimmerSweep 1.15s ease-out 1;
        }
        @keyframes chinaimoShimmerWind{
          0%,100%{transform:perspective(120px) rotateX(-1deg) rotateY(-4deg)}
          24%{transform:perspective(120px) rotateX(2deg) rotateY(5deg)}
          51%{transform:perspective(120px) rotateX(-2deg) rotateY(2deg)}
          76%{transform:perspective(120px) rotateX(1deg) rotateY(-6deg)}
        }
        @keyframes chinaimoShimmerLight{
          0%,100%{filter:brightness(.88) contrast(1.02)}
          27%{filter:brightness(1.08) contrast(1.04)}
          53%{filter:brightness(.94) contrast(1.03)}
          79%{filter:brightness(1.16) contrast(1.05)}
        }
        @keyframes chinaimoShimmerSweep{
          0%{transform:translateX(-135%);opacity:0}
          34%{opacity:.56}
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
          const windDuration = 8.4 + (tile % 4) * 1.15;
          const lightDuration = 7.2 + (tile % 5) * .95;
          return (
            <span
              key={tile}
              data-a-tile={tile}
              onClick={() => onGateTile(tile)}
              className="chinaimo-shimmer-tile"
              style={{
                background: METALLIC_FINISHES[(tile - 1) % METALLIC_FINISHES.length],
                animationDuration: `${windDuration}s, ${lightDuration}s`,
                animationDelay: `${-tile * .71}s, ${-tile * .47}s`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
