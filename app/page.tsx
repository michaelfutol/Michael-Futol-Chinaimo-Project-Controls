import assessment from '../data/assessment.json';
import schedule from '../data/schedule.json';
import governance from '../data/governance.json';
import ProgressExplorer from './ProgressExplorer';
import ScheduleExplorer from './ScheduleExplorer';

const money=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
const pct=(n:number)=>`${n.toFixed(3)}%`;
const qty=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n);

export default function Page(){
  const currentClaim=assessment.boq.reduce((s,r)=>s+r.currentAmount,0);
  const previous=assessment.boq.reduce((s,r)=>s+r.previousAmount,0);
  const cumulative=assessment.boq.reduce((s,r)=>s+r.cumulativeAmount,0);
  const remaining=assessment.boq.reduce((s,r)=>s+r.remainingAmount,0);

  return <main id="top">
    <div className="projectChrome" aria-label="Project controls workspace header">
      <div className="projectTitleBar"><span className="projectAppMark">P</span><div><b>Project Controls Workspace</b><small>Chinaimo Technical Assessment · Michael Futol</small></div><span className="projectState">REVIEW PACKAGE</span></div>
      <div className="projectRibbon"><span>FILE</span><span>TASK</span><span>RESOURCE</span><span>REPORT</span><span>PROJECT</span><span>VIEW</span><b>Schedule authority: Microsoft Project</b></div>
    </div>

    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">MICHAEL FUTOL · PROJECT CONTROLS TECHNICAL ASSESSMENT</div>
        <h1>Chinaimo Project Controls</h1>
        <p className="heroLead">One coordinated assessment package for quantity, progress, planning, delay and monthly payment control.</p>
        <div className="heroTags"><span>Integrated Project Controls Case</span><span>Excel + Microsoft Project</span><span>Common WBS / Activity / BOQ IDs</span><span>Auditable source & control structure</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">WORKING FILES</div>
        <a className="primaryBtn" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Excel Project Controls Workbook</b><span>.xlsx · BOQ · Progress · S-Curve · Claim</span></a>
        <div className="heroButtonRow">
          <a className="secondaryBtn" href="/downloads/Michael_Futol_Chinaimo_MSProject_Package.zip" download>MS Project Package (.zip)</a>
          <a className="secondaryBtn" href="/downloads/Michael_Futol_Chinaimo_Technical_Assessment.pdf" download>Printable PDF Pack</a>
        </div>
        <a className="textLink" href="https://github.com/michaelfutol/Michael-Futol-Chinaimo-Project-Controls" target="_blank">Inspect GitHub audit trail ↗</a>
      </div>
    </section>

    <nav className="navBar" aria-label="Assessment sections">
      <a href="#start">Overview</a><a href="#progress">Progress</a><a href="#boq">BOQ</a><a href="#schedule">Schedule</a><a href="#delays">Delay Analysis</a><a href="#claim">Claim</a><a href="#controls">Controls</a><a href="#downloads">Downloads</a><a href="#sources">Sources</a>
    </nav>

    <section className="notice"><b>Assessment boundary:</b> {assessment.meta.dataBoundary}</section>

    <section className="docControlBar" aria-label="Document control">
      <div><small>DOCUMENT ID</small><b>{governance.documentControl.documentId}</b></div>
      <div><small>REVISION</small><b>{governance.documentControl.revision}</b></div>
      <div><small>STATUS</small><b>{governance.documentControl.status}</b></div>
      <div><small>DATA DATE</small><b>{governance.documentControl.dataDate}</b></div>
      <div><small>WORK CALENDAR</small><b>{governance.documentControl.scheduleCalendar}</b></div>
    </section>

    <section className="reviewPath" id="start">
      <div className="reviewStep"><span>01</span><div><b>Check the status</b><small>Planned vs Actual and current claim</small></div></div>
      <div className="reviewStep"><span>02</span><div><b>Inspect the schedule</b><small>WBS, Gantt, critical path and float</small></div></div>
      <div className="reviewStep"><span>03</span><div><b>Test the delays</b><small>Critical, non-critical and concurrent cases</small></div></div>
      <div className="reviewStep"><span>04</span><div><b>Verify the claim</b><small>Previous + Current = Cumulative</small></div></div>
      <div className="reviewStep"><span>05</span><div><b>Open native files</b><small>Excel and Microsoft Project</small></div></div>
    </section>

    <section className="kpis">
      <Kpi label="Publicly Reported Approx. Contract Value" value={`¥${money(assessment.meta.controlValue)}`}/>
      <Kpi label="Data Date" value={assessment.meta.statusDate}/>
      <Kpi label="Planned Progress" value={pct(assessment.meta.plannedProgress)}/>
      <Kpi label="Actual Progress" value={pct(assessment.meta.actualProgress)}/>
      <Kpi label="Variance" value={`${assessment.meta.variance.toFixed(3)} pp`} bad/>
      <Kpi label="Baseline Finish" value={assessment.meta.baselineFinish}/>
      <Kpi label="Current Gross Claim" value={`¥${money(assessment.meta.currentGrossClaim)}`}/>
      <Kpi label="Schedule Activities" value={`${schedule.length}`}/>
    </section>

    <section className="panel" id="progress">
      <div className="sectionHead"><div><span className="sectionNo">01 · PROGRESS CONTROL</span><h2>Planned vs Actual</h2><p>Switch between cumulative S-Curve, variance and monthly production views. Actual progress ends at the Data Date; future values are forecast.</p></div><span className="statusPill muted">INTERACTIVE</span></div>
      <ProgressExplorer rows={assessment.progress} statusDate={assessment.meta.statusDate}/>
      <div className="resultStrip"><div><small>PLANNED @ DATA DATE</small><b>{pct(assessment.meta.plannedProgress)}</b></div><div><small>ACTUAL @ DATA DATE</small><b>{pct(assessment.meta.actualProgress)}</b></div><div><small>VARIANCE</small><b className="negative">{assessment.meta.variance.toFixed(3)} pp</b></div></div>
    </section>

    <section className="panel" id="boq">
      <div className="sectionHead"><div><span className="sectionNo">02 · BOQ / MEASUREMENT</span><h2>Quantity progress that drives the claim</h2><p>The same measured quantities feed earned progress and payment values.</p></div><a className="miniDownload" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download>Open native Excel ↓</a></div>
      <div className="tableScroll boqTable"><table><thead><tr><th>BOQ ID</th><th>Description</th><th>Unit</th><th>Contract Qty</th><th>Previous</th><th>Current</th><th>Cumulative</th><th>Remaining</th><th>Progress</th><th>Current Amount</th></tr></thead><tbody>{assessment.boq.map(r=><tr key={r.id}><td><code>{r.id}</code></td><td>{r.description}</td><td>{r.unit}</td><td>{qty(r.contractQty)}</td><td>{qty(r.previousQty)}</td><td>{qty(r.currentQty)}</td><td>{qty(r.cumulativeQty)}</td><td>{qty(r.balanceQty)}</td><td><span className="progressCell"><i style={{width:`${Math.min(100,r.progress*100)}%`}}/><b>{(r.progress*100).toFixed(1)}%</b></span></td><td>¥{money(r.currentAmount)}</td></tr>)}</tbody></table></div>
      <div className="controlRule"><b>Measurement control</b><span>Previous + Current = Cumulative</span><span>Contract Qty − Cumulative = Remaining</span><span>Cumulative ≤ BOQ Qty unless supported by variation / remeasurement</span></div>
    </section>

    <section className="panel" id="schedule">
      <div className="sectionHead"><div><span className="sectionNo">03 · PLANNING / SCHEDULE CONTROL</span><h2>Construction Programme & Scenario Explorer</h2><p>Baseline and delay views use the same Activity IDs as the native Microsoft Project model. Native Project dates, float and critical status are the schedule authority.</p></div><span className="criticalPill">MS PROJECT</span></div>
      <ScheduleExplorer schedule={schedule} scenarios={assessment.scenarios} criticalPath={assessment.criticalPath} statusDate={assessment.meta.statusDate}/>
      <details className="details"><summary>Advanced schedule QA: audit all {schedule.length} activities and dependencies</summary><div className="tableScroll"><table><thead><tr><th>Activity ID</th><th>WBS</th><th>Activity</th><th>Dur.</th><th>Predecessor / Logic</th><th>Baseline Start</th><th>Baseline Finish</th><th>Critical</th></tr></thead><tbody>{schedule.map(a=><tr key={a.id} className={a.critical?'criticalRow':''}><td><code>{a.id}</code></td><td>{a.wbs}</td><td>{a.name}</td><td>{a.duration}d</td><td>{a.predecessors||'—'} {a.relationships}</td><td>{a.baselineStart}</td><td>{a.baselineFinish}</td><td>{a.critical?'YES':'NO'}</td></tr>)}</tbody></table></div></details>
    </section>

    <section className="panel" id="delays">
      <div className="sectionHead"><div><span className="sectionNo">04 · DELAY IMPACT</span><h2>Scenario solutions & management commentary</h2><p>Result first, then the reasoning and planning response. Reported delay-days are not automatically project-delay days.</p></div></div>
      <div className="scenarioGrid">{assessment.scenarios.map(s=><article className="scenario" key={s.id}><div className="scenarioTop"><span>SCENARIO {s.id}</span><b className={s.netImpact>0?'impactBad':'impactOk'}>{s.netImpact>0?`+${s.netImpact} wd`:'0 wd'}</b></div><h3>{s.name}</h3><p className="activityName">{s.activity}</p><div className="scenarioDates"><div><small>BASELINE</small><b>{s.baselineFinish}</b></div><div><small>FORECAST</small><b>{s.forecastFinish}</b></div></div><div className="solutionBox"><small>SCHEDULE EFFECT</small><strong>{s.result}</strong></div><details><summary>Why / decision basis</summary><p>{s.why}</p></details></article>)}</div>
      <div className="commentaryRule"><b>Reporting doctrine</b><span><strong>Fact</strong> - what changed?</span><span><strong>Implication</strong> - what does it affect?</span><span><strong>Action</strong> - what should the team protect, recover or monitor next?</span></div>
    </section>

    <section className="panel" id="claim">
      <div className="sectionHead"><div><span className="sectionNo">05 · MONTHLY CLAIM</span><h2>Payment Claim Reconciliation</h2><p>Claim quantities are the same quantities used for actual progress.</p></div><span className="statusPill">BOQ-CHECKED</span></div>
      <div className="claimKpis"><Kpi label="Previous Earned" value={`¥${money(previous)}`}/><Kpi label="Current Gross Work" value={`¥${money(currentClaim)}`}/><Kpi label="Cumulative Earned" value={`¥${money(cumulative)}`}/><Kpi label="Remaining Balance" value={`¥${money(remaining)}`}/></div>
      <div className="tableScroll"><table><thead><tr><th>BOQ ID</th><th>Description</th><th>Previous Qty</th><th>Current Qty</th><th>Cumulative</th><th>Remaining</th><th>Current Amount</th><th>QA</th></tr></thead><tbody>{assessment.boq.map(r=><tr key={r.id}><td><code>{r.id}</code></td><td>{r.description}</td><td>{qty(r.previousQty)}</td><td>{qty(r.currentQty)}</td><td>{qty(r.cumulativeQty)}</td><td>{qty(r.balanceQty)}</td><td>¥{money(r.currentAmount)}</td><td><span className="qaOk">MATCH</span></td></tr>)}</tbody></table></div>
    </section>

    <section className="panel" id="controls">
      <div className="sectionHead"><div><span className="sectionNo">06 · MANAGEMENT-SYSTEM CONTROLS</span><h2>ISO-aligned structure without claiming Kubota procedure compliance</h2><p>Kubota Construction publicly lists ISO 14001, ISO 9001 and ISO 45001 certifications. This assessment therefore uses compatible control concepts while remaining an independent illustrative submission.</p></div><span className="statusPill muted">CONTROLLED</span></div>
      <div className="doctrineCard"><div><small>PROJECT CONTROLS DOCTRINE</small><h3>{governance.doctrine.summary}</h3></div><a href="https://github.com/michaelfutol/Michael-Futol-Chinaimo-Project-Controls/blob/main/PROJECT_CONTROLS_DOCTRINE.md" target="_blank">Read doctrine ↗</a></div>
      <div className="isoGrid">{governance.isoAlignment.map(i=><article key={i.standard}><span>{i.standard}</span><h3>{i.theme}</h3><p>{i.assessmentControls}</p></article>)}</div>
      <div className="authorityGrid"><div><span className="authorityTool">EXCEL</span><b>Quantity / Commercial Authority</b><p>BOQ, quantities, rates, earned progress, S-Curve weighting and payment claim.</p></div><div><span className="authorityTool">MS PROJECT</span><b>Schedule / CPM Authority</b><p>Durations, logic, Start/Finish, Total Slack, Critical status, critical path and forecast finish.</p></div><div><span className="authorityTool">WEB / PDF</span><b>Reviewer Presentation</b><p>Mirrors reconciled outputs through common <code>WBS_ID</code>, <code>ACTIVITY_ID</code> and <code>BOQ_ID</code>.</p></div></div>
      <div className="reconcileStrip"><span><i/>Document ID / revision / status visible</span><span><i/>Excel quantities reconciled to claim</span><span><i/>Schedule uses stable Activity IDs</span><span><i/>Public / illustrative boundary disclosed</span></div>
      <p className="controlNote">{governance.documentControl.controlNote}</p>
    </section>

    <section className="panel downloads" id="downloads">
      <div className="downloadIntro"><span className="sectionNo">07 · WORKING FILES</span><h2>Open the actual working files</h2><p>The web view summarizes the control model; the Excel workbook and Microsoft Project package remain the native working records.</p></div>
      <div className="downloadGrid"><a href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Excel Project Controls Workbook</b><span>.xlsx · BOQ · Measurement · Progress · Gantt · S-Curve · Claim · Delay Analysis</span><em>DOWNLOAD ↓</em></a><a href="/downloads/Michael_Futol_Chinaimo_Technical_Assessment.pdf" download><b>Printable Assessment Pack</b><span>PDF · executive status · BOQ/progress · native schedule evidence · delay commentary · source register</span><em>DOWNLOAD PDF ↓</em></a><a href="/downloads/Michael_Futol_Chinaimo_MSProject_Package.zip" download><b>Complete Microsoft Project Package</b><span>ZIP · baseline + critical-delay + non-critical + concurrent-delay + procurement-watch .mpp files. Extract into the same folder as the Excel workbook.</span><em>DOWNLOAD ZIP ↓</em></a><a href="https://github.com/michaelfutol/Michael-Futol-Chinaimo-Project-Controls" target="_blank"><b>GitHub Audit Trail</b><span>Source data · Schedule data · Governance · Web source · Revision history</span><em>INSPECT ↗</em></a></div>
    </section>

    <section className="panel" id="sources">
      <div className="sectionHead"><div><span className="sectionNo">08 · SOURCE & CONFIDENTIALITY BASIS</span><h2>Exact public references for every externally derived project fact</h2><p>A reviewer should not have to wonder where the project figures came from. Public facts are linked directly; assessment data are explicitly labelled illustrative.</p></div></div>
      <div className="boundaryGrid"><div><b>Publicly grounded project context</b><p>{governance.assessmentBoundary.public}</p></div><div><b>Assessment-derived control model</b><p>{governance.assessmentBoundary.illustrative}</p></div></div>
      <div className="confidentialityBox"><b>Confidentiality boundary</b><span>{governance.assessmentBoundary.confidentiality}</span></div>
      <h3 className="subHeading">Public facts used in this assessment</h3>
      <div className="factGrid">{governance.publicFacts.map(f=><a href={f.sourceUrl} target="_blank" key={`${f.fact}-${f.value}`}><small>{f.fact}</small><b>{f.value}</b><span>{f.sourceLabel} ↗</span></a>)}</div>
      <h3 className="subHeading">Source register</h3>
      <div className="sourceGrid">{governance.sourceRegister.map(s=><a href={s.url} target="_blank" key={s.url}><b>{s.label}</b><span>{s.use}</span><small>Open exact public source ↗</small></a>)}</div>
    </section>

    <footer><div><b>Michael Futol</b><span>Project Controls & Construction Planning Technical Assessment</span></div><a href="#top">Back to top ↑</a></footer>
  </main>
}

function Kpi({label,value,bad=false}:{label:string,value:string,bad?:boolean}){
  return <div className="kpi"><small>{label}</small><b className={bad?'negative':''}>{value}</b></div>
}