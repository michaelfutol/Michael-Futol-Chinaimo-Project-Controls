import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_REVIEWER_SUPABASE_URL || 'https://bpiwbibldjdiojqaznzc.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_REVIEWER_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaXdiaWJsZGpkaW9qcWF6bnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTQwOTAsImV4cCI6MjEwMzk5MDA5MH0.q0ONSswmdEdSIS1AVHjqmUvzOvaSm6C5uIqzXhJb458';

type EventRow = {
  created_at?: string;
  event?: string;
  visitor_id?: string;
  session_id?: string;
  seq?: number;
  path?: string;
  href?: string;
  label?: string;
  asset?: string;
  source?: string;
  active_seconds?: number;
  depth?: number;
  target_kind?: string;
  platform?: string;
  browser?: string;
  device?: string;
  country?: string;
};

const clean = (value: unknown, max = 120) =>
  typeof value === 'string' ? value.replace(/[\r\n\t]/g, ' ').slice(0, max) : '';

function summarize(rows: EventRow[]) {
  const bySession = new Map<string, EventRow[]>();
  for (const row of rows) {
    const id = clean(row.session_id, 96);
    if (!id) continue;
    const list = bySession.get(id) || [];
    list.push(row);
    bySession.set(id, list);
  }

  const sessions = [...bySession.entries()].map(([sessionId, raw]) => {
    const events = raw.sort((a,b) => {
      const sa = Number(a.seq || 0); const sb = Number(b.seq || 0);
      if (sa !== sb) return sa - sb;
      return String(a.created_at || '').localeCompare(String(b.created_at || ''));
    });
    const first = events[0] || {};
    const pageViews = events.filter(e => e.event === 'page_view');
    const activeSeconds = events.reduce((sum,e) => sum + Number(e.active_seconds || 0), 0);
    const maxDepth = events.reduce((m,e) => Math.max(m, Number(e.depth || 0)), 0);
    const technicalActions = events.filter(e => Number(e.depth || 0) >= 2 || ['document-review','schedule-evidence','dossier','interactive-demo'].includes(String(e.target_kind || ''))).length;
    const downloads = events.filter(e => e.event === 'download_click').length;
    const firstAt = events.map(e => e.created_at).filter(Boolean).sort()[0] || null;
    const lastAt = events.map(e => e.created_at).filter(Boolean).sort().at(-1) || null;
    const score = Math.min(100, Math.round(maxDepth * 20 + Math.min(technicalActions,8) * 6 + Math.min(activeSeconds / 60,20) * 1.5 + Math.min(downloads,3) * 5));
    const behavior = score >= 70 ? 'HIGH TECHNICAL DEPTH' : score >= 40 ? 'TECHNICAL REVIEW' : score >= 20 ? 'EXPLORATORY' : 'BRIEF VISIT';

    return {
      sessionId,
      visitorId: clean(first.visitor_id,96),
      country: clean(first.country,8) || '—',
      platform: clean(first.platform,32) || 'Other',
      browser: clean(first.browser,32) || 'Other',
      device: clean(first.device,24) || 'Other',
      source: clean(first.source,80) || 'direct',
      firstAt,
      lastAt,
      activeSeconds,
      pageViews: pageViews.length,
      technicalActions,
      downloads,
      maxDepth,
      score,
      behavior,
      events: events.map(e => ({
        t: e.created_at || null,
        seq: Number(e.seq || 0),
        event: clean(e.event,64),
        path: clean(e.path,180),
        href: clean(e.href,220),
        label: clean(e.label,140),
        asset: clean(e.asset,180),
        activeSeconds: Number(e.active_seconds || 0),
        depth: Number(e.depth || 0),
        targetKind: clean(e.target_kind,48),
      }))
    };
  }).sort((a,b) => String(b.lastAt || '').localeCompare(String(a.lastAt || '')));

  return {
    sessions,
    totals: {
      sessions: sessions.length,
      technical: sessions.filter(s => s.score >= 40).length,
      highDepth: sessions.filter(s => s.score >= 70).length,
      activeSeconds: sessions.reduce((n,s) => n + s.activeSeconds,0),
      downloads: sessions.reduce((n,s) => n + s.downloads,0),
    }
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = clean(body?.key, 256);
    const limit = Math.max(50, Math.min(2000, Number(body?.limit || 1000)));
    if (!key) return NextResponse.json({configured:true, error:'Owner access key required.', sessions:[], totals:{sessions:0,technical:0,highDepth:0,activeSeconds:0,downloads:0}},{status:401});

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_reviewer_events`, {
      method:'POST',
      headers:{
        apikey: SUPABASE_KEY,
        Authorization:`Bearer ${SUPABASE_KEY}`,
        'Content-Type':'application/json',
        'Cache-Control':'no-store',
      },
      body:JSON.stringify({p_key:key,p_limit:limit}),
      cache:'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({configured:true,error:'Invalid owner access key.',sessions:[],totals:{sessions:0,technical:0,highDepth:0,activeSeconds:0,downloads:0}},{status:401});
    }

    const rows = await response.json() as EventRow[];
    return NextResponse.json({configured:true, ...summarize(Array.isArray(rows) ? rows : [])},{headers:{'Cache-Control':'no-store'}});
  } catch {
    return NextResponse.json({configured:true,error:'Unable to read reviewer sessions.',sessions:[],totals:{sessions:0,technical:0,highDepth:0,activeSeconds:0,downloads:0}},{status:500});
  }
}
