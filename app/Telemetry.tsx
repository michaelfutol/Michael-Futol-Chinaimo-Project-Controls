'use client';

import { useEffect } from 'react';
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

  return null;
}
