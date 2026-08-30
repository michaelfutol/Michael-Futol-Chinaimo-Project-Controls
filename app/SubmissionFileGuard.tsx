'use client';

import { useEffect } from 'react';

const suppliedSeparately = [
  '/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx',
  '/downloads/Michael_Futol_Chinaimo_Technical_Assessment.pdf'
];

export default function SubmissionFileGuard(){
  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'));
    anchors.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || !suppliedSeparately.includes(href)) return;
      a.removeAttribute('download');
      a.href = '#submission-file-note';
      a.title = 'Supplied separately with the formal submission package';
      a.addEventListener('click', () => {
        const note = document.getElementById('submission-file-note');
        note?.scrollIntoView({behavior:'smooth', block:'center'});
      });
    });
  }, []);

  return <aside id="submission-file-note" className="notice" style={{margin:'18px auto',maxWidth:'1180px'}}>
    <b>Native attachment note:</b> The final Excel master workbook and reviewer Word documents are supplied directly with the formal submission package. Website downloads provide the native Microsoft Project package and schedule evidence PDFs.
  </aside>;
}
