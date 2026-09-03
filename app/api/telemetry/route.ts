import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_REVIEWER_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_REVIEWER_SUPABASE_KEY || '';

const clip = (value: unknown, max = 180) =>
  typeof value === 'string' ? value.replace(/[\r\n\t]/g, ' ').slice(0, max) : undefined;

const finiteNumber = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : undefined;
};

async function persist(record: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    const row = {
      created_at: record.t,
      event: record.event,
      visitor_id: record.visitorId,
      session_id: record.sessionId,
      seq: record.seq,
      path: record.path,
      href: record.href,
      label: record.label,
      asset: record.asset,
      source: record.source,
      active_seconds: record.activeSeconds,
      depth: record.depth,
      target_kind: record.targetKind,
      platform: record.platform,
      browser: record.browser,
      device: record.device,
      country: record.country,
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reviewer_events`, {
      method:'POST',
      headers:{
        apikey: SUPABASE_KEY,
        Authorization:`Bearer ${SUPABASE_KEY}`,
        'Content-Type':'application/json',
        Prefer:'return=minimal',
      },
      body:JSON.stringify(row),
      cache:'no-store',
    });
    if (!response.ok) console.warn(`[chinaimo-telemetry-store] ${response.status}`);
  } catch {
    console.warn('[chinaimo-telemetry-store] unavailable');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = clip(body?.event, 64);
    const visitorId = clip(body?.visitorId, 96);
    const sessionId = clip(body?.sessionId, 96);

    if (!event || !visitorId || !sessionId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const record = {
      t: new Date().toISOString(),
      event,
      visitorId,
      sessionId,
      seq: finiteNumber(body?.seq, 0, 100000),
      path: clip(body?.path, 180),
      href: clip(body?.href, 220),
      label: clip(body?.label, 140),
      asset: clip(body?.asset, 180),
      source: clip(body?.source, 80),
      activeSeconds: finiteNumber(body?.activeSeconds, 0, 86400),
      depth: finiteNumber(body?.depth, 0, 10),
      targetKind: clip(body?.targetKind, 48),
      platform: clip(body?.platform, 32),
      browser: clip(body?.browser, 32),
      device: clip(body?.device, 24),
      country: clip(request.headers.get('x-vercel-ip-country'), 8),
    };

    // Privacy boundary: no IP address, no raw user-agent, no exact screen size,
    // no precise location, and no attempt to identify a visitor. Session IDs are
    // random first-party pseudonyms used only to reconstruct navigation order.
    console.log(`[chinaimo-telemetry] ${JSON.stringify(record)}`);
    await persist(record);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
