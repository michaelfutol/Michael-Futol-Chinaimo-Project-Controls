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

export default function Page(){
  const m = assessment.meta;
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
        <div className={styles.downloadGrid}>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Baseline.mpp">Baseline MPP</a>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Actual_Progress.mpp">Actual Progress MPP</a>
          <a className={styles.downloadButton} href="/downloads/Michael_Futol_Chinaimo_Recovery.mpp">Recovery MPP</a>
        </div>
        <div className={styles.downloadGrid} style={{marginTop:12}}>
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
