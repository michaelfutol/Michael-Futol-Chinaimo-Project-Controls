import Link from 'next/link';
import assessment from '../../data/assessment.json';

export default function SubmissionFilesPage(){
  const m=assessment.meta;
  return <main className="page-shell" style={{maxWidth:'980px',margin:'48px auto',padding:'0 24px'}}>
    <p className="eyebrow">SUBMISSION FILE INTEGRITY</p>
    <h1>Five core files, one optional Japanese reviewer dossier</h1>
    <p>The formal application package is deliberately lean: one reconciled master Excel workbook, one English reviewer companion, and exactly three native Microsoft Project files. The Japanese dossier is supporting reviewer communication, not a sixth control authority.</p>
    <p>Excel remains the quantity/commercial authority. Microsoft Project remains the schedule/CPM authority. The QA-passed native schedule result is Baseline 15-Feb-2028, Current Forecast 23-Jun-2028 (+{m.currentDifferenceWorkingDays} working days), and Partial Recovery 14-Apr-2028 ({m.recoveryGainWorkingDays} working days recovered; {m.residualDifferenceWorkingDays} working days residual).</p>
    <div className="notice" style={{marginTop:'24px'}}>
      <b>Public-target boundary:</b> July 2028 is retained as the latest public completion target reference. It is not forced into the native Microsoft Project current forecast.
    </div>
    <div className="notice" style={{marginTop:'16px'}}>
      <b>Baseline governance:</b> Original Assessment Baseline Rev 0 stays frozen. Monthly actual/status updates and recovery tests do not overwrite it; an approved revised baseline is issued only after formal authorization where rebaselining is genuinely required.
    </div>
    <p style={{marginTop:'28px'}}><Link className="primaryBtn" href="/#native-files"><b>Open native schedule files</b><span>3 MPPs + 5 A2 supporting printouts</span></Link></p>
    <p><Link className="secondaryBtn" href="/dossier-jp">Open native-CPM reconciled Japanese dossier</Link></p>
    <p style={{marginTop:'28px'}}><Link href="/">← Return to English assessment</Link></p>
  </main>;
}
