import type { Metadata } from 'next';
import assessment from '../data/assessment.json';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Recovery Controls Assessment',
  description: 'Lean project-controls assessment: Baseline, Actual Progress and Recovery, anchored to public Chinaimo project records.'
};

const money=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
const pct=(n:number)=>`${n.toFixed(2)}%`;

export default function Page(){
  const m=assessment.meta;
  return <main id="top">
    <div className="projectChrome" aria-label="Project controls workspace header">
      <div className="projectTitleBar"><span className="projectAppMark">P</span><div><b>Project Controls Recovery Workspace</b><small>Chinaimo Technical Assessment · Michael Futol</small></div><span className="projectState">LEAN REVIEW</span></div>
      <div className="projectRibbon"><span>BASELINE</span><span>STATUS</span><span>RECOVERY</span><b>Schedule authority: Microsoft Project</b></div>
    </div>

    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">MICHAEL FUTOL · PROJECT CONTROLS TECHNICAL ASSESSMENT</div>
        <h1>Chinaimo Recovery Controls</h1>
        <p className="heroLead">Public facts stay public. Assessment assumptions stay visible. The submission shows only the controls needed to explain baseline, current status and recovery.</p>
        <div className="heroTags"><span>Baseline → Actual Progress → Recovery</span><span>Assessment Data Date · 31-Aug-2026</span><span>Simulated BOQ Progress · {pct(m.assessmentProgress)}</span><span>Public checkpoint · {pct(m.publicProgress)} @ 05-May-2026</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">FORMAL SUBMISSION</div>
        <div className="notice" style={{margin:0}}><b>Six files only.</b><br/>1 master Excel · 2 Word reviewer companions · 3 native Microsoft Project files.</div>
      </div>
    </section>

    <section className="notice"><b>Assessment boundary:</b> {m.dataBoundary}</section>

    <section className="kpis">
      <Kpi label="Assessment Progress · 31-Aug-2026" value={pct(m.assessmentProgress)}/>
      <Kpi label="Public Checkpoint · 05-May-2026" value={pct(m.publicProgress)}/>
      <Kpi label="Published Construction Period" value={`${m.publishedDurationMonths} months`}/>
      <Kpi label="Latest Public Completion Target" value={m.publicCurrentCompletion}/>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">01 · PUBLIC FACTS + ASSESSMENT STATUS</span><h2>Use the public record without pretending it is live project data</h2><p>Public reporting placed construction from October 2025 over a 30-month implementation period. The latest public Chinaimo-specific checkpoint used here is {pct(m.publicProgress)} overall progress on 05-May-2026, with completion reported for {m.publicCurrentCompletion}. For this employment assessment, the working data date is 31-Aug-2026 and BOQ/value-weighted progress is simulated at {pct(m.assessmentProgress)}.</p></div><span className="statusPill muted">BOUNDARY CONTROL</span></div>
      <div className="commentaryRule"><b>Interpretation</b><span><strong>Public fact:</strong> {pct(m.publicProgress)} at 05-May-2026.</span><span><strong>Assessment simulation:</strong> {pct(m.assessmentProgress)} at 31-Aug-2026.</span><span><strong>Not claimed:</strong> Kubota internal task actuals, causes, responsibility, entitlement or confidential commercial records.</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">02 · THREE-MODEL GOVERNANCE</span><h2>Baseline → Actual Progress → Recovery</h2><p>The original assessment baseline is preserved. Periodic updates record actuals and remaining forecast without rewriting history. A revised baseline would only be created after a formally approved change that requires rebaselining.</p></div></div>
      <div className="scenarioGrid">
        {assessment.models.map((model,index)=><article className="scenario" key={model.id}>
          <div className="scenarioTop"><span>{String(index+1).padStart(2,'0')}</span><b className={model.id==='actual'?'impactBad':'impactOk'}>{model.delta}</b></div>
          <h3>{model.name}</h3><p className="activityName">Anchor: {model.anchor}</p>
          <div className="scenarioDates"><div><small>FORECAST FINISH</small><b>{model.finish}</b></div></div>
          <div className="solutionBox"><small>CONTROL PURPOSE</small><strong>{model.purpose}</strong></div>
        </article>)}
      </div>
      <p className="controlNote"><b>Contract boundary:</b> a {m.currentDifferenceWorkingDays}-working-day model difference is a forecast variance between assessment states. It is not automatically an EOT, compensable delay or responsibility determination.</p>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">03 · RECOVERY TEST</span><h2>Recover what can be defended, not what looks impressive</h2><p>The assessment recovery test targets {m.recoveryGainWorkingDays} working days of improvement, moving the modeled current finish from {m.currentForecast} to {m.recoveryForecast}. A residual {m.residualDifferenceWorkingDays}-working-day difference from the assessment baseline remains visible rather than being hidden through rebaselining.</p></div><span className="statusPill">FIELD-VALIDATE</span></div>
      <div className="tableScroll"><table><thead><tr><th>Activity</th><th>Workfront</th><th>Gain target</th><th>Assessment action</th><th>Execution gate</th></tr></thead><tbody>
        {assessment.recoveryActions.map(r=><tr key={r.activity}><td><code>{r.activity}</code></td><td>{r.workfront}</td><td>{r.gain} wd</td><td>{r.action}</td><td>{r.gate}</td></tr>)}
      </tbody></table></div>
      <div className="controlRule"><b>Recovery approval gate</b><span>Construction</span><span>Engineering</span><span>Procurement</span><span>QA/QC</span><span>HSE</span><span>Commercial</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">04 · MONTHLY CONTROL / IPC</span><h2>Simple periodic control chain</h2><p>The assessment uses monthly reporting as a transparent working convention: measurement → earned progress → current forecast → sample interim payment certificate. Exact billing cut-off, retention, advance recovery, taxes and certification terms remain subject to the actual Contract Particular Conditions.</p></div></div>
      <div className="commentaryRule"><b>Baseline governance</b><span><strong>Rev 0:</strong> preserve the original assessment baseline.</span><span><strong>Monthly update:</strong> record actuals, remaining durations and forecast.</span><span><strong>Revised baseline:</strong> create only after formal approval when an authorized change genuinely requires it.</span></div>
    </section>

    <section className="panel downloads" id="submission">
      <div className="downloadIntro"><span className="sectionNo">05 · FORMAL ATTACHMENT SET</span><h2>Exactly six files</h2><p>The website is presentation-only. The authoritative working files are supplied directly with the application.</p></div>
      <div className="authorityGrid">
        <div><span className="authorityTool">EXCEL</span><b>Michael_Futol_Chinaimo_Project_Controls.xlsx</b><p>Master controls workbook with monthly status and one sample IPC.</p></div>
        <div><span className="authorityTool">WORD</span><b>English + 日本語 reviewer companions</b><p>Concise reviewer FAQ and control rationale.</p></div>
        <div><span className="authorityTool">MS PROJECT</span><b>Baseline + Actual Progress + Recovery</b><p>Exactly three native .mpp files.</p></div>
      </div>
    </section>

    <section className="panel" id="sources">
      <div className="sectionHead"><div><span className="sectionNo">06 · SOURCES</span><h2>Public facts are traceable</h2><p>Public project anchors are separated from assessment-derived data. Public package value: ¥{money(m.publicPackageValue)}.</p></div></div>
      <div className="sourceList">{assessment.sources.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.label} ↗</a>)}</div>
    </section>

    <footer><div><b>Michael Futol</b><span>Chinaimo Project Controls Recovery Assessment</span></div><a href="#top">Back to top ↑</a></footer>
  </main>
}

function Kpi({label,value}:{label:string,value:string}){return <div className="kpi"><small>{label}</small><strong>{value}</strong></div>}