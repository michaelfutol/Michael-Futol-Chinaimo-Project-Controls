import { NextRequest, NextResponse } from 'next/server';

const nativeOfficeFiles = new Set([
  '/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx',
  '/downloads/CHINAIMO_PROJECT_CONTROLS_QA_FINAL_REVIEWED_EN.docx',
  '/downloads/CHINAIMO_PROJECT_CONTROLS_QA_JAPANESE_REVIEWER_COMPANION.docx',
]);

export function middleware(request: NextRequest) {
  if (nativeOfficeFiles.has(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/submission-files';
    url.searchParams.set('requested', request.nextUrl.pathname.split('/').pop() || 'native-office-file');
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/downloads/:path*'],
};
