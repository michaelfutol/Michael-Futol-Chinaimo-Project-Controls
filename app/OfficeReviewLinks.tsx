'use client';

import { useEffect } from 'react';

const officeRoutes: Record<string,string> = {
  '/downloads/Michael_Futol_Chinaimo_Project_Controls_FINAL_BEAUTIFIED_NATIVE_CPM_2026-08-31.xlsx': '/review-file/master-excel',
  '/downloads/CHINAIMO_PROJECT_CONTROLS_REVIEWER_COMPANION_EN_FINAL_NATIVE_CPM_2026-08-31.docx': '/review-file/reviewer-companion',
  '/downloads/Michael_Futol_Chinaimo_Schedule_Logic_Progress_SCurve_ANNEX_FINAL_2026-08-31.xlsx': '/review-file/schedule-annex',
};

export default function OfficeReviewLinks(){
  useEffect(() => {
    if (window.location.pathname !== '/') return;

    document.querySelectorAll('a[href]').forEach((node) => {
      const anchor = node as HTMLAnchorElement;
      const raw = anchor.getAttribute('href');
      if (!raw) return;
      const route = officeRoutes[raw];
      if (!route) return;
      anchor.href = route;
      anchor.dataset.reviewFirst = '1';
      anchor.title = 'Review file details before downloading';
    });
  }, []);

  return null;
}
