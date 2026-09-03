'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
  activeSeconds?: number;
  depth?: number;
  targetKind?: string;
};

type ClientContext = { platform: string; browser: string; device: string };

const ANALYTICS_URL = 'https://vercel.com/michael-futol-projects/michael-futol-chinaimo-project-controls/analytics';
const ADMIN_SEQUENCE = [1, 3, 7] as const;
const OWNER_KEY = 'chinaimo_owner_exempt';
const SEQ_KEY = 'chinaimo_session_seq';

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

function isOwnerExempt() {
  try { return localStorage.getItem(OWNER_KEY) === '1'; } catch { return false; }
}

function nextSequence() {
  try {
    const previous = Number(sessionStorage.getItem(SEQ_KEY) || '0');
    const next = Number.isFinite(previous) ? previous + 1 : 1;
    sessionStorage.setItem(SEQ_KEY, String(next));
    return next;
  } catch { return 0; }
}

function clientContext(): ClientContext {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string; mobile?: boolean } };
  const ua = nav.userAgent || '';
  const rawPlatform = nav.userAgentData?.platform || nav.platform || '';

  let platform = 'Other';
  if (/Android/i.test(ua)) platform = 'Android';
  else if (/iPad/i.test(ua)) platform = 'iPadOS';
  else if (/iPhone|iPod/i.test(ua)) platform = 'iOS';
  else if (/Win/i.test(rawPlatform) || /Windows/i.test(ua)) platform = 'Windows';
  else if (/Mac/i.test(rawPlatform) || /Macintosh/i.test(ua)) platform = 'macOS';
  else if (/Linux/i.test(rawPlatform) || /Linux/i.test(ua)) platform = 'GNU/Linux';

  let browser = 'Other';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';

  const mobile = nav.userAgentData?.mobile ?? /Mobi|Android|iPhone|iPod/i.test(ua);
  const tablet = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobi/i.test(ua));
  return { platform, browser, device: tablet ? 'Tablet' : mobile ? 'Mobile' : 'Desktop' };
}

function classifyDepth(path: string) {
  const p = path.toLowerCase();
  if (p.includes('office-review') || p.includes('review-file') || p.includes('schedule') || p.includes('annex') || p.includes('gantt')) return 3;
  if (p.includes('dossier') || p.includes('decision-simulator') || p.includes('progress')) return 2;
  if (p.includes('engineers-notes')) return 1;
  return 0;
}

function classifyTarget(path: string) {
  const p = path.toLowerCase();
  if (p.startsWith('/downloads/')) return 'download';
  if (p.includes('office-review') || p.includes('review-file')) return 'document-review';
  if (p.includes('dossier')) return 'dossier';
  if (p.includes('schedule') || p.includes('gantt') || p.includes('annex')) return 'schedule-evidence';
  if (p.includes('engineers-notes')) return 'technical-note';
  if (p.includes('decision-simulator')) return 'interactive-demo';
  return 'internal-page';
}

function send(payload: TelemetryPayload) {
  if (isOwnerExempt()) return;
  const body = JSON.stringify({ ...payload, seq: nextSequence(), ...clientContext() });
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/telemetry', new Blob([body], { type: 'application/json' }));
  } else {
    fetch('/api/telemetry', { method:'POST', headers:{'content-type':'application/json'}, body, keepalive:true }).catch(() => undefined);
  }
}

export default function Telemetry() {
  const pathname = usePathname();
  const gateStep = useRef(0);
  const gateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const visitorId = getStoredId(localStorage, 'chinaimo_visitor_id', 'v');
    const sessionId = getStoredId(sessionStorage, 'chinaimo_session_id', 's');
    const source = new URLSearchParams(window.location.search).get('ref') || undefined;
    const path = pathname || window.location.pathname;
    const depth = classifyDepth(path);
    const base = { visitorId, sessionId, source };

    send({ event:'page_view', path, depth, targetKind:classifyTarget(path), ...base });
    if (!isOwnerExempt()) {
      try { track('Reviewer Page View', { path, source: source || 'direct' }); } catch {}
    }

    let activeSeconds = 0;
    const activeTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') activeSeconds += 5;
    }, 5000);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const label = (anchor.textContent || '').replace(/\s+/g, ' ').trim().slice(0,120);
      const targetDepth = classifyDepth(url.pathname);
      const targetKind = classifyTarget(url.pathname);

      if (url.pathname.startsWith('/downloads/')) {
        const asset = decodeURIComponent(url.pathname.split('/').pop() || '').slice(0,160);
        send({ event:'download_click', path, href:url.pathname, label, asset, depth:3, targetKind, ...base });
        if (!isOwnerExempt()) { try { track('Reviewer Download', { asset, label: label || asset }); } catch {} }
        return;
      }

      send({ event:'internal_nav', path, href:url.pathname, label, depth:targetDepth, targetKind, ...base });
      if (url.pathname === '/dossier-jp' || url.pathname.startsWith('/dossier-jp/')) {
        send({ event:'japanese_dossier_open', path, href:url.pathname, label, depth:2, targetKind:'dossier', ...base });
      }
    };

    const flushEngagement = () => {
      if (activeSeconds <= 0) return;
      send({ event:'page_engagement', path, activeSeconds, depth, targetKind:classifyTarget(path), ...base });
      activeSeconds = 0;
    };

    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') flushEngagement(); };
    document.addEventListener('click', onClick, true);
    window.addEventListener('pagehide', flushEngagement);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(activeTimer);
      flushEngagement();
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('pagehide', flushEngagement);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [pathname]);

  const onGateTile = (tile: number) => {
    if (gateTimer.current) clearTimeout(gateTimer.current);
    const expected = ADMIN_SEQUENCE[gateStep.current];
    if (tile === expected) {
      gateStep.current += 1;
      if (gateStep.current === ADMIN_SEQUENCE.length) {
        localStorage.setItem(OWNER_KEY, '1');
        sessionStorage.setItem('chinaimo_admin_unlocked', '1');
        gateStep.current = 0;
        window.open(ANALYTICS_URL, '_blank', 'noopener,noreferrer');
        return;
      }
    } else {
      gateStep.current = tile === ADMIN_SEQUENCE[0] ? 1 : 0;
    }
    gateTimer.current = setTimeout(() => { gateStep.current = 0; }, 4500);
  };

  return <>
    <style>{`
      .chinaimo-admin-strip{width:100%;display:flex;justify-content:center;align-items:center;gap:4px;padding:7px 0 12px;user-select:none}
      .chinaimo-admin-tile{width:10px;height:10px;display:block;border:1px solid rgba(76,83,84,.36);border-radius:1px;background:#d6d7d3;box-shadow:inset 0 0 0 1px rgba(255,255,255,.24);opacity:.48;cursor:default;transition:opacity .14s ease,background .14s ease,border-color .14s ease,box-shadow .14s ease}
      .chinaimo-admin-tile:nth-child(3n+2){background:#cfd2d1}.chinaimo-admin-tile:nth-child(4n){background:#ddd9d1}
      .chinaimo-admin-tile:hover{opacity:.78;border-color:rgba(67,77,79,.48);box-shadow:inset 0 0 0 1px rgba(255,255,255,.34),0 0 5px rgba(85,96,98,.12)}
    `}</style>
    <div aria-hidden="true" className="chinaimo-admin-strip">
      {Array.from({ length:10 }, (_,i) => i+1).map(tile => <span key={tile} data-a-tile={tile} onClick={() => onGateTile(tile)} className="chinaimo-admin-tile" />)}
    </div>
  </>;
}
