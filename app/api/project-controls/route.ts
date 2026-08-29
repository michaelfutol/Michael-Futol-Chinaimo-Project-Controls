import { NextResponse } from 'next/server';
import { getProjectControlsData } from '../../../lib/projectControls';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(getProjectControlsData(), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
      'X-Project-Controls-Authority': 'Excel+Microsoft-Project',
    },
  });
}
