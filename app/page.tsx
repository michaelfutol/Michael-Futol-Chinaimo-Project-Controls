import type { Metadata } from 'next';
import assessment from '../data/assessment.json';

export const metadata: Metadata = {
  title: 'Michael Futol - Chinaimo Recovery Controls Assessment',
  description: 'Lean project-controls assessment: Assessment Baseline, Actual Progress / Current Forecast, and Partial Recovery, anchored to public Chinaimo project records.'
};

const money=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
const pct=(n:number)=>`${n.toFixed(2)}%`;
const prettyDate=(s:string)=>new Date(`${s}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).replace(/ /g,'-');

const printouts=[
  ['Baseline Gantt - A2','/downloads/printouts/Michael_Futol_Chinaimo_Baseline_Gantt_A2.pdf'],
  ['Actual Tracking Gantt - A2','/downloads/printouts/Michael_Futol_Chinaimo_Actual_Tracking_Gantt_A2.pdf'],
  ['Actual Critical Path - A2','/downloads/printouts/Michael_Futol_Chinaimo_Actual_Critical_Path_A2.pdf'],
  ['Recovery Tracking Gantt - A2','/downloads/printouts/Michael_Futol_Chinaimo_Recovery_Tracking_Gantt_A2.pdf'],
  ['Recovery Critical Path - A2','/downloads/printouts/Michael_Futol_Chinaimo_Recovery_Critical_Path_A2.pdf']
] as const;

export default function Page(){
  const m=assessment.meta;
  return <main id="top">
    <div className="projectChrome" aria-label="Project controls workspace header">
      <div className="projectTitleBar"><span className="projectAppMark">P</span><div><b>Project Controls Recovery Workspace</b><small>Chinaimo Technical Assessment - Michael Futol</small></div><span className="projectState">LEAN REVIEW</span></div>
      <div className="projectRibbon"><span>BASELINE</span><span>STATUS</span><span>RECOVERY</span><b>{m.scheduleAuthority}</b></div>
    </div>

    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">MICHAEL FUTOL - PROJECT CONTROLS TECHNICAL ASSESSMENT</div>
        <h1>Chinaimo Recovery Controls</h1>
        <p className="heroLead">Public facts stay public. Assessment assumptions stay visible. The submission shows only the controls needed to explain the preserved baseline, current forecast, measurement logic and partial recovery.</p>
        <div className="heroTags"><span>Baseline - Current Forecast - Partial Recovery</span><span>Assessment Data Date - 31-Aug-2026</span><span>Simulated BOQ Progress - {pct(m.assessmentProgress)}</span><span>Public checkpoint - {pct(m.publicProgress)} @ 05-May-2026</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">FORMAL SUBMISSION</div>
        <div className="notice" style={{margin:0}}><b>Five core files only.</b><br/>1 master Excel - 1 English reviewer companion - 3 native Microsoft Project files.</div>
        <a className="primaryBtn" href="#native-files"><b>Open native schedule files</b><span>3 QA-passed MPPs + 5 supporting A2 printouts</span></a>
      </div>
    </section>

    <section className="notice"><b>Assessment boundary:</b> {m.dataBoundary}</section>

    <section className="kpis">
      <Kpi label="Assessment Progress - 31-Aug-2026" value={pct(m.assessmentProgress)}/>
      <Kpi label="Native Current Forecast" value={prettyDate(m.currentForecast)}/>
      <Kpi label="Native Partial Recovery" value={prettyDate(m.recoveryForecast)}/>
      <Kpi label="Latest Public Target" value={m.publicCurrentCompletion}/>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">01 - PUBLIC FACTS + ASSESSMENT STATUS</span><h2>Use the public record without pretending it is live project data</h2><p>Public reporting placed construction from October 2025 over a 30-month implementation period. The latest public Chinaimo-specific checkpoint used here is {pct(m.publicProgress)} overall progress on 05-May-2026, with completion reported for {m.publicCurrentCompletion}. For this employment assessment, the working data date is 31-Aug-2026 and BOQ/value-weighted progress is simulated at {pct(m.assessmentProgress)}.</p></div><span className="statusPill muted">BOUNDARY CONTROL</span></div>
      <div className="commentaryRule"><b>Interpretation</b><span><strong>Public fact:</strong> {pct(m.publicProgress)} at 05-May-2026.</span><span><strong>Assessment simulation:</strong> {pct(m.assessmentProgress)} at 31-Aug-2026.</span><span><strong>Native CPM:</strong> current forecast {prettyDate(m.currentForecast)}; public July 2028 remains a separate target reference.</span><span><strong>Not claimed:</strong> Kubota internal task actuals, causes, responsibility, entitlement or confidential commercial records.</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">02 - THREE-MODEL GOVERNANCE</span><h2>Assessment Baseline Rev 0 - Actual Progress / Current Forecast - Partial Recovery</h2><p>The original assessment baseline is preserved. Periodic updates record actuals and remaining forecast without rewriting history. A revised baseline would only be created after a formally approved change that genuinely requires rebaselining.</p></div><span className="statusPill">NATIVE CPM QA PASS</span></div>
      <div className="scenarioGrid">
        {assessment.models.map((model,index)=><article className="scenario" key={model.id}>
          <div className="scenarioTop"><span>{String(index+1).padStart(2,'0')}</span><b className={model.id==='actual'?'impactBad':'impactOk'}>{model.delta}</b></div>
          <h3>{model.name}</h3><p className="activityName">Anchor: {model.anchor}</p>
          <div className="scenarioDates"><div><small>NATIVE CPM FINISH</small><b>{model.finish}</b></div></div>
          <div className="solutionBox"><small>CONTROL PURPOSE</small><strong>{model.purpose}</strong></div>
          <a className="miniDownload" href={`/downloads/${model.file}`}>Download native .mpp</a>
        </article>)}
      </div>
      <p className="controlNote"><b>Contract boundary:</b> the +{m.currentDifferenceWorkingDays}-working-day current-forecast variance is a difference between assessment states. It is not automatically an EOT, compensable delay or responsibility determination.</p>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">03 - RECOVERY TEST</span><h2>Recover what can be defended, not what looks impressive</h2><p>Native Microsoft Project recalculation moves the assessment current finish from {prettyDate(m.currentForecast)} to {prettyDate(m.recoveryForecast)} after the targeted recovery changes: {m.recoveryGainWorkingDays} working days recovered, with {m.residualDifferenceWorkingDays} working days still remaining versus Rev 0.</p></div><span className="statusPill">FIELD-VALIDATE</span></div>
      <div className="tableScroll"><table><thead><tr><th>Activity</th><th>Workfront</th><th>Gain target</th><th>Assessment action</th><th>Execution gate</th></tr></thead><tbody>
        {assessment.recoveryActions.map(r=><tr key={r.activity}><td><code>{r.activity}</code></td><td>{r.workfront}</td><td>{r.gain} wd</td><td>{r.action}</td><td>{r.gate}</td></tr>)}
      </tbody></table></div>
      <div className="controlRule"><b>Recovery approval gate</b><span>Construction</span><span>Engineering</span><span>Procurement</span><span>QA/QC</span><span>HSE</span><span>Commercial</span></div>
      <p className="controlNote"><b>Network rule:</b> action-level duration reductions are planning assumptions; the resulting native CPM network forecast governs the actual recovery gain.</p>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">04 - MONTHLY CONTROL / IPC</span><h2>Simple periodic control chain</h2><p>The assessment uses monthly reporting as a transparent working convention: measurement - earned progress - current forecast - sample interim payment certificate. Exact billing cut-off, retention, advance recovery, taxes and certification terms remain subject to the actual Contract Particular Conditions.</p></div></div>
      <div className="commentaryRule"><b>Baseline governance</b><span><strong>Rev 0:</strong> preserve the original assessment baseline.</span><span><strong>Monthly update:</strong> record actuals, remaining durations and forecast.</span><span><strong>Revised baseline:</strong> create only after formal approval when an authorized change genuinely requires it.</span></div>
    </section>

    <section className="panel downloads" id="native-files">
      <div className="downloadIntro"><span className="sectionNo">05 - NATIVE SCHEDULE FILES</span><h2>Three reviewer-facing Microsoft Project models</h2><p>These are the QA-passed native schedule models. The current and recovery finishes are calculated by Microsoft Project, not forced to the public July 2028 target.</p></div>
      <div className="authorityGrid">
        {assessment.models.map(model=><div key={model.id}><span className="authorityTool">MS PROJECT</span><b>{model.name}</b><p>{model.finish} - {model.delta}</p><a className="miniDownload" href={`/downloads/${model.file}`}>Download {model.file}</a></div>)}
      </div>
    </section>

    <section className="panel downloads" id="printouts">
      <div className="downloadIntro"><span className="sectionNo">06 - SUPPORTING PRINTOUTS</span><h2>Five A2 landscape reviewer PDFs</h2><p>Supporting evidence only - not additional schedule models. Baseline uses Gantt Chart; Current and Recovery use Tracking Gantt, with separate critical-path views for the two statused states.</p></div>
      <div className="authorityGrid">
        {printouts.map(([label,href])=><div key={href}><span className="authorityTool">A2 PDF</span><b>{label}</b><p>Generated directly from the corresponding native Microsoft Project model.</p><a className="miniDownload" href={href}>Open / download PDF</a></div>)}
      </div>
    </section>

    <section className="panel downloads" id="submission">
      <div className="downloadIntro"><span className="sectionNo">07 - FORMAL ATTACHMENT SET</span><h2>Five core files</h2><p>The website is a reviewer presentation layer. The master Excel and English Word companion are supplied directly with the application; the native MPPs above are also available here for convenience.</p></div>
      <div className="authorityGrid">
        <div><span className="authorityTool">EXCEL</span><b>Master Project Controls Workbook</b><p>Monthly status, BOQ/value-weighted assessment progress, recovery control and one sample IPC.</p></div>
        <div><span className="authorityTool">WORD</span><b>English Reviewer Companion</b><p>Concise FAQ, control basis, data boundary, baseline governance and IPC rationale.</p></div>
        <div><span className="authorityTool">MS PROJECT</span><b>3 native MPP files</b><p>Assessment Baseline Rev 0 + Actual Progress / Current Forecast + Partial Recovery.</p></div>
      </div>
    </section>

    <section className="panel" id="sources">
      <div className="sectionHead"><div><span className="sectionNo">08 - SOURCES</span><h2>Public facts are traceable</h2><p>Public project anchors are separated from assessment-derived data. Public package value: JPY {money(m.publicPackageValue)}.</p></div></div>
      <div className="sourceList">{assessment.sources.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.label}</a>)}</div>
    </section>

    <footer><div><b>Michael Futol</b><span>Chinaimo Project Controls Recovery Assessment</span></div><a href="#top">Back to top</a></footer>
  </main>
}

function Kpi({label,value}:{label:string,value:string}){return <div className="kpi"><small>{label}</small><strong>{value}</strong></div>}
