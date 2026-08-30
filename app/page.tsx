import type { Metadata } from 'next';
import assessment from '../data/assessment.json';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Recovery Controls Assessment',
  description: 'Lean project-controls assessment: Baseline, Actual Progress and Recovery, anchored to public Chinaimo project records.'
};

const money=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);

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
        <p className="heroLead">One public-fact boundary. Three controlled schedule states. One recovery story.</p>
        <div className="heroTags"><span>Baseline → Actual Progress → Recovery</span><span>05-May-2026 Data Date</span><span>Public 4.19% checkpoint</span><span>Native Microsoft Project CPM</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">CORE SUBMISSION</div>
        <a className="primaryBtn" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Master Excel Workbook</b><span>Public facts · control data · recovery evidence</span></a>
        <div className="heroButtonRow">
          <a className="secondaryBtn" href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_FINAL_REVIEWED_EN.docx" download>English Reviewer Companion</a>
          <a className="secondaryBtn" href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_JAPANESE_REVIEWER_COMPANION.docx" download>日本語 Companion</a>
        </div>
      </div>
    </section>

    <section className="notice"><b>Assessment boundary:</b> {m.dataBoundary}</section>

    <section className="kpis">
      <Kpi label="Public Progress · 05-May-2026" value={`${m.publicProgress.toFixed(2)}%`}/>
      <Kpi label="Published Construction Period" value={`${m.publishedDurationMonths} months`}/>
      <Kpi label="Public Package Value" value={`¥${money(m.publicPackageValue)}`}/>
      <Kpi label="Current Public Completion" value={m.publicCurrentCompletion}/>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">01 · PUBLIC RECORD</span><h2>Why recovery control matters here</h2><p>Public reporting originally placed construction from October 2025 over a 30-month period with completion in 2028 / early 2028. On 05-May-2026, the project was publicly reported at 4.19% overall progress, with the completion target stated as July 2028.</p></div><span className="statusPill muted">PUBLIC ANCHORS</span></div>
      <div className="commentaryRule"><b>Interpretation</b><span><strong>Fact:</strong> 4.19% was the public overall checkpoint.</span><span><strong>Implication:</strong> current forecast and recovery deserve close control.</span><span><strong>Boundary:</strong> causes, responsibility and entitlement require live project records.</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">02 · THREE-MODEL GOVERNANCE</span><h2>Baseline → Actual Progress → Recovery</h2><p>The old multi-scenario reviewer package has been deliberately removed. The reviewer only needs the three schedule states that would matter in live controls.</p></div></div>
      <div className="scenarioGrid">
        {assessment.models.map((model,index)=><article className="scenario" key={model.id}>
          <div className="scenarioTop"><span>{String(index+1).padStart(2,'0')}</span><b className={model.id==='actual'?'impactBad':'impactOk'}>{model.delta}</b></div>
          <h3>{model.name}</h3><p className="activityName">Anchor: {model.anchor}</p>
          <div className="scenarioDates"><div><small>FORECAST FINISH</small><b>{model.finish}</b></div></div>
          <div className="solutionBox"><small>CONTROL PURPOSE</small><strong>{model.purpose}</strong></div>
          <a className="miniDownload" href={`/downloads/${model.file}`} download>Open native .mpp ↓</a>
        </article>)}
      </div>
      <p className="controlNote"><b>Important:</b> the +143 working-day model difference is not presented as a contractual delay/EOT entitlement. It is a forecast variance between two assessment schedule states.</p>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">03 · RECOVERY TEST</span><h2>Partial recovery, not wishful rebaselining</h2><p>The recovery model targets 60 working days of improvement, moving the assessment forecast from 31-Jul-2028 to 22-May-2028 while retaining an 83-working-day residual difference from the assessment baseline.</p></div><span className="statusPill">FIELD-VALIDATE</span></div>
      <div className="tableScroll"><table><thead><tr><th>Activity</th><th>Workfront</th><th>Gain target</th><th>Assessment action</th><th>Execution gate</th></tr></thead><tbody>
        {assessment.recoveryActions.map(r=><tr key={r.activity}><td><code>{r.activity}</code></td><td>{r.workfront}</td><td>{r.gain} wd</td><td>{r.action}</td><td>{r.gate}</td></tr>)}
      </tbody></table></div>
      <div className="controlRule"><b>Recovery approval gate</b><span>Construction</span><span>Engineering</span><span>Procurement</span><span>QA/QC</span><span>HSE</span><span>Commercial</span></div>
    </section>

    <section className="panel downloads" id="downloads">
      <div className="downloadIntro"><span className="sectionNo">04 · SIX SUBMISSION FILES</span><h2>Nothing extra</h2><p>One master Excel, two reviewer Word companions, and exactly three native Microsoft Project files.</p></div>
      <div className="downloadGrid">
        <a href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Master Excel</b><span>.xlsx · public status · schedule basis · recovery control</span><em>DOWNLOAD ↓</em></a>
        <a href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_FINAL_REVIEWED_EN.docx" download><b>Reviewer Companion — English</b><span>.docx · public boundary · three-model defence · recovery method</span><em>DOWNLOAD ↓</em></a>
        <a href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_JAPANESE_REVIEWER_COMPANION.docx" download><b>Reviewer Companion — 日本語</b><span>.docx · reviewer-convenience Japanese companion</span><em>DOWNLOAD ↓</em></a>
        {assessment.models.map(model=><a href={`/downloads/${model.file}`} download key={model.id}><b>{model.name} — Microsoft Project</b><span>.mpp · {model.finish}</span><em>DOWNLOAD MPP ↓</em></a>)}
      </div>
    </section>

    <section className="panel" id="sources">
      <div className="sectionHead"><div><span className="sectionNo">05 · SOURCES</span><h2>Public facts are traceable</h2><p>Every project fact used to anchor the assessment can be checked independently.</p></div></div>
      <div className="sourceList">{assessment.sources.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.label} ↗</a>)}</div>
    </section>

    <footer><div><b>Michael Futol</b><span>Chinaimo Project Controls Recovery Assessment</span></div><a href="#top">Back to top ↑</a></footer>
  </main>
}

function Kpi({label,value}:{label:string,value:string}){return <div className="kpi"><small>{label}</small><strong>{value}</strong></div>}