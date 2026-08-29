import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    application: 'Chinaimo Project Controls',
    frontend: 'Next.js App Router',
    backend: 'Next.js Route Handlers',
    hosting: 'Vercel',
  });
}
