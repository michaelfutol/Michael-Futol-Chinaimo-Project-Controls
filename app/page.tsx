import type { Metadata } from 'next';
import styles from './page.module.css';
import assessment from '../data/assessment.json';

export const metadata: Metadata = {
  title: 'Michael Futol - Chinaimo Project Controls Assessment',
  description: 'Project controls technical assessment for the Chinaimo Water Treatment Plant project.'
};

const boq = [
  ['PREL-001','Preliminaries / Temporary Works','JPY 300,000,000','5.00%'],
  ['CIV-001','Earthworks / Excavation / Dewatering','JPY 370,000,000','6.17%'],
  ['RC-001','Structural Concrete','JPY 1,350,000,000','22.50%'],
  ['RB-001','Reinforcement Steel','JPY 900,000,000','15.00%'],
  ['FW-001','Formwork','JPY 340,000,000','5.67%'],
  ['WPF-001','Waterproofing / Protective Coating','JPY 170,000,000','2.83%'],
  ['MECH-001','Process Piping / Mechanical','JPY 550,000,000','9.17%'],
  ['PMP-001','Pumps / Major Mechanical Equipment','JPY 500,000,000','8.33%'],
  ['CHEM-001','Chemical Dosing Systems','JPY 240,000,000','4.00%'],
  ['ELEC-001','Electrical / MCC / Cabling','JPY 420,000,000','7.00%'],
  ['SCADA-001','Instrumentation / SCADA','JPY 270,000,000','4.50%'],
  ['PWR-001','22-kV Off-site Power Works','JPY 240,000,000','4.00%'],
  ['BLDG-001','Administration / Lab / Support Buildings','JPY 240,000,000','4.00%'],
  ['COMM-001','Testing / Commissioning / Handover','JPY 110,000,000','1.83%']
] as const;

const printouts = [
  ['Baseline Gantt - A2','/downloads/printouts/Michael_Futol_Chinaimo_Baseline_Gantt_A2.pdf'],
  ['Actual Tracking Gantt - A2','/downloads/printouts/Michael_Futol_Chinaimo_Actual_Tracking_Gantt_A2.pdf'],
  ['Actual Critical Path - A2','/downloads/printouts/Michael_Futol_Chinaimo_Actual_Critical_Path_A2.pdf'],
  ['Recovery Tracking Gantt - A2','/downloads/printouts/Michael_Futol_Chinaimo_Recovery_Tracking_Gantt_A2.pdf'],
  ['Recovery Critical Path - A2','/downloads/printouts/Michael_Futol_Chinaimo_Recovery_Critical_Path_A2.pdf']
] as const;

const chartMonths = [
  'Oct-25','Nov-25','Dec-25','Jan-26','Feb-26','Mar-26','Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26',
  'Oct-26','Nov-26','Dec-26','Jan-27','Feb-27','Mar-27','Apr-27','May-27','Jun-27','Jul-27','Aug-27','Sep-27',
  'Oct-27','Nov-27','Dec-27','Jan-28','Feb-28','Mar-28','Apr-28','May-28','Jun-28'
] as const;

const sCurve = [
  {baseline:.01,current:null,recovery:null},
  {baseline:.025,current:null,recovery:null},
  {baseline:.045,current:null,recovery:null},
  {baseline:.07,current:null,recovery:null},
  {baseline:.10,current:null,recovery:null},
  {baseline:.14,current:null,recovery:null},
  {baseline:.18,current:null,recovery:null},
  {baseline:.23,current:null,recovery:null},
  {baseline:.29,current:null,recovery:null},
  {baseline:.35,current:null,recovery:null},
  {baseline:.41,current:.12095,recovery:.12095},
  {baseline:.47,current:.1262021655,recovery:.1274934720},
  {baseline:.53,current:.1419657642,recovery:.1470261598},
  {baseline:.59,current:.1662146251,recovery:.1768767471},
  {baseline:.65,current:.1995110758,recovery:.2175610684},
  {baseline:.71,current:.2401103454,recovery:.2667470224},
  {baseline:.76,current:.2821565875,recovery:.3172204948},
  {baseline:.81,current:.3336621814,recovery:.3784023566},
  {baseline:.86,current:.3874764253,recovery:.4415338969},
  {baseline:.90,current:.4461326726,recovery:.5093496802},
  {baseline:.93,current:.5048374844,recovery:.5760633519},
  {baseline:.95,current:.5664502518,recovery:.6446482855},
  {baseline:.97,current:.6279581940,recovery:.7113765407},
  {baseline:.985,current:.6863619471,recovery:.7727578166},
  {baseline:.993,current:.7445008315,recovery:.8314099935},
  {baseline:.997,current:.7976147868,recovery:.8821379173},
  {baseline:1,current:.8481904802,recovery:.9268492448},
  {baseline:1,current:.8933152657,recovery:.9622283203},
  {baseline:1,current:.9296344961,recovery:.9855345797}
] as const;

type CurveKey = 'baseline' | 'current' | 'recovery';

export default function Page(){
  const m = assessment.meta;
  const chartW = 1000;
  const chartH = 430;
  const left = 72;
  const right = 24;
  const top = 28;
  const bottom = 62;
  const plotW = chartW - left - right;
  const plotH = chartH - top - bottom;
  const x = (i:number) => left + (i / (chartMonths.length - 1)) * plotW;
  const y = (v:number) => top + (1 - v) * plotH;
  const points = (key:CurveKey) => sCurve
    .map((d,i) => d[key] == null ? null : `${x(i).toFixed(1)},${y(d[key] as number).toFixed(1)}`)
    .filter(Boolean)
    .join(' ');
  const labelIndexes = [0,4,8,12,16,20,24,28,32];

  return <main className={styles.page}>
    <article className={styles.paper}>
      <header className={styles.header}>
        <p className={styles.name}>MICHAEL FUTOL · CIVIL ENGINEER · PROJECT CONTROLS · QS · PLANNING</p>
        <h1 className={styles.title}>Chinaimo Project Controls Technical Assessment</h1>
        <p className={styles.purpose}>Purpose: demonstrate a simple, auditable project-controls workflow using a preserved baseline, a statused current forecast, a partial recovery model, BOQ/value-based progress control, and a sample interim payment certificate.</p>
        <div className={styles.metaLine}>
          <span>Assessment Data Date: 31-Aug-2026</span>
          <span>Native Microsoft Project CPM: QA PASS</span>
        </div>
      </header>

      <section className={styles.section}>
        <h2>Downloads</h2>
        <p className={styles.sectionIntro}>Core assessment documents</p>
        <div className={styles.downloadGrid}>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Project_Controls_FINAL_BEAUTIFIED_NATIVE_CPM_2026-08-31.xlsx">Final Master Excel</a>
          <a className={styles.downloadButton} href="/downloads/CHINAIMO_PROJECT_CONTROLS_REVIEWER_COMPANION_EN_FINAL_NATIVE_CPM_2026-08-31.docx">English Reviewer Companion</a>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Schedule_Logic_Progress_SCurve_ANNEX_FINAL_2026-08-31.xlsx">Schedule Logic &amp; S-Curve Annex</a>
        </div>
        <p className={styles.sectionIntro} style={{marginTop:24}}>Native Microsoft Project models</p>
        <div className={styles.downloadGrid}>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Baseline.mpp">Baseline MPP</a>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Actual_Progress.mpp">Actual Progress MPP</a>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Recovery.mpp">Recovery MPP</a>
        </div>
        <p className={styles.sectionIntro} style={{marginTop:24}}>A2 schedule printouts</p>
        <div className={styles.downloadGrid}>
          {printouts.map(([label,href])=><a key={href} className={styles.downloadButtonLight} href={href}>{label}</a>)}
        </div>
        <a className={styles.jpLink} href="/dossier-jp">
          <span className={styles.jpMain}>日本語 技術評価資料を見る</span>
          <span className={styles.jpSub}>チャイナイモ・プロジェクト工程リカバリー評価</span>
        </a>
      </section>

      <section className={styles.section}>
        <h2>Project Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}><span>Public construction start</span><strong>October 2025</strong></div>
          <div className={styles.infoRow}><span>Published implementation period</span><strong>30 months</strong></div>
          <div className={styles.infoRow}><span>Public progress checkpoint</span><strong>4.19% at 05-May-2026</strong></div>
          <div className={styles.infoRow}><span>Assessment data date</span><strong>31-Aug-2026</strong></div>
          <div className={styles.infoRow}><span>Assessment progress</span><strong>12.095% simulated</strong></div>
          <div className={styles.infoRow}><span>Public completion target</span><strong>July 2028</strong></div>
          <div className={styles.infoRow}><span>Baseline finish</span><strong>15-Feb-2028</strong></div>
          <div className={styles.infoRow}><span>Native current forecast</span><strong>23-Jun-2028 (+111 wd)</strong></div>
          <div className={styles.infoRow}><span>Native partial recovery</span><strong>14-Apr-2028 (60 wd recovered; 51 wd residual)</strong></div>
          <div className={styles.infoRow}><span>Public package value</span><strong>JPY 6,478,257,873</strong></div>
          <div className={styles.infoRow}><span>Assessment control value</span><strong>JPY 6,000,000,000</strong></div>
          <div className={styles.infoRow}><span>Schedule calendar</span><strong>{m.scheduleCalendar}</strong></div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Schedule Progress S-Curve</h2>
        <p className={styles.sectionIntro}>Annex-based monthly control curves. Reported / assessment progress is shown only as exact evidence points; no monthly actuals are invented.</p>
        <div className={styles.curveLegend}>
          <span><i style={{background:'#263b49'}} />Baseline planned</span>
          <span><i style={{background:'#8a6f36'}} />Current forecast</span>
          <span><i style={{background:'#b3212d'}} />Partial recovery</span>
          <span><i className={styles.dotLegend} style={{background:'#0b6b50'}} />Reported / assessment points</span>
        </div>
        <div className={styles.curveWrap}>
          <svg className={styles.curveSvg} viewBox={`0 0 ${chartW} ${chartH}`} role="img" aria-label="Baseline, current forecast and recovery S-curve">
            <rect x={left} y={top} width={plotW} height={plotH} fill="#fff" />
            {[0,.2,.4,.6,.8,1].map(v => <g key={v}>
              <line x1={left} x2={chartW-right} y1={y(v)} y2={y(v)} stroke="#dedbd3" strokeWidth="1" />
              <text x={left-12} y={y(v)+5} textAnchor="end" fontSize="13" fill="#697078">{Math.round(v*100)}%</text>
            </g>)}
            {labelIndexes.map(i => <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={top} y2={chartH-bottom} stroke="#eeeae2" strokeWidth="1" />
              <text x={x(i)} y={chartH-bottom+26} textAnchor="middle" fontSize="12" fill="#697078">{chartMonths[i]}</text>
            </g>)}

            <line x1={x(28)} x2={x(28)} y1={top} y2={chartH-bottom} stroke="#263b49" strokeWidth="1.5" strokeDasharray="6 6" opacity=".55" />
            <line x1={x(30)} x2={x(30)} y1={top} y2={chartH-bottom} stroke="#b3212d" strokeWidth="1.5" strokeDasharray="6 6" opacity=".55" />
            <line x1={x(32)} x2={x(32)} y1={top} y2={chartH-bottom} stroke="#8a6f36" strokeWidth="1.5" strokeDasharray="6 6" opacity=".55" />

            <polyline points={points('baseline')} fill="none" stroke="#263b49" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={points('current')} fill="none" stroke="#8a6f36" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={points('recovery')} fill="none" stroke="#b3212d" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

            <circle cx={x(7)} cy={y(.0419)} r="7" fill="#0b6b50" stroke="#fff" strokeWidth="3" />
            <text x={x(7)+10} y={y(.0419)-10} fontSize="13" fontWeight="700" fill="#0b6b50">4.19% · 05-May-26</text>
            <circle cx={x(10)} cy={y(.12095)} r="7" fill="#0b6b50" stroke="#fff" strokeWidth="3" />
            <text x={x(10)+10} y={y(.12095)-10} fontSize="13" fontWeight="700" fill="#0b6b50">12.095% · 31-Aug-26 simulated</text>

            <text x={x(28)-6} y={top+17} textAnchor="end" fontSize="12" fontWeight="700" fill="#263b49">Baseline finish · 15-Feb-28</text>
            <text x={x(30)-6} y={top+37} textAnchor="end" fontSize="12" fontWeight="700" fill="#b3212d">Recovery finish · 14-Apr-28</text>
            <text x={x(32)-6} y={top+57} textAnchor="end" fontSize="12" fontWeight="700" fill="#8a6f36">Current finish · 23-Jun-28</text>
          </svg>
        </div>
        <p className={styles.curveNote}>The plotted monthly curve values reproduce the S-Curve Annex through Feb-2028. Finish-date markers are the native Microsoft Project CPM dates. The 4.19% public checkpoint and 12.095% assessment status are intentionally plotted as isolated points rather than an invented actual-progress line.</p>
        <div className={styles.ganttActions}>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Schedule_Logic_Progress_SCurve_ANNEX_FINAL_2026-08-31.xlsx">Download S-Curve Annex</a>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Assessment BOQ / Control Budget</h2>
        <p className={styles.sectionIntro}>Illustrative quantities and rates for method demonstration only. This is not represented as Kubota's contract BOQ.</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>BOQ ID</th><th>Work Package</th><th>Control Amount</th><th>Weight</th></tr></thead>
            <tbody>
              {boq.map(([id,work,amount,weight])=><tr key={id}><td>{id}</td><td>{work}</td><td className={styles.amount}>{amount}</td><td className={styles.weight}>{weight}</td></tr>)}
              <tr><td><strong>TOTAL</strong></td><td></td><td className={styles.amount}><strong>JPY 6,000,000,000</strong></td><td className={styles.weight}><strong>100.00%</strong></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Assessment Baseline Gantt Chart</h2>
        <p className={styles.sectionIntro}>Native Microsoft Project baseline printout · A2 landscape.</p>
        <iframe className={styles.ganttFrame} title="Chinaimo Baseline Gantt Chart" src="/downloads/printouts/Michael_Futol_Chinaimo_Baseline_Gantt_A2.pdf#toolbar=0&navpanes=0" />
        <div className={styles.ganttActions}>
          <a className={styles.downloadButton} href="/downloads/printouts/Michael_Futol_Chinaimo_Baseline_Gantt_A2.pdf">Open / Download Baseline Gantt PDF</a>
          <a className={styles.downloadButtonLight} href="/downloads/Michael_Futol_Chinaimo_Baseline.mpp">Download Baseline MPP</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>Michael Futol</strong> · Chinaimo Project Controls Technical Assessment · 31-Aug-2026
      </footer>
    </article>
  </main>
}
