import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const clip = (value: unknown, max = 180) =>
  typeof value === 'string' ? value.replace(/[\r\n\t]/g, ' ').slice(0, max) : undefined;

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
      path: clip(body?.path, 180),
      href: clip(body?.href, 220),
      label: clip(body?.label, 140),
      asset: clip(body?.asset, 180),
      source: clip(body?.source, 80),
    };

    // Intentionally excludes IP address, user-agent and other fingerprinting data.
    console.log(`[chinaimo-telemetry] ${JSON.stringify(record)}`);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
