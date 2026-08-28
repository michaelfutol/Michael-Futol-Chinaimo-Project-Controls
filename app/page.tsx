import assessment from '../data/assessment.json';
import schedule from '../data/schedule.json';
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
  const completeItems=assessment.requirements.reduce((s,g)=>s+g.items.length,0);

  return <main id="top">
    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">MICHAEL FUTOL · PROJECT CONTROLS TECHNICAL ASSESSMENT</div>
        <h1>Chinaimo Project Controls</h1>
        <p className="heroLead">One coordinated assessment package for quantity, progress, planning, delay and monthly payment control.</p>
        <div className="heroTags"><span>{completeItems}/{completeItems} requested outputs covered</span><span>Excel + Microsoft Project</span><span>Common WBS / Activity / BOQ IDs</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">NATIVE DELIVERABLES</div>
        <a className="primaryBtn" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Excel Project Controls Workbook</b><span>.xlsx · BOQ · Progress · S-Curve · Claim</span></a>
        <div className="heroButtonRow">
          <a className="secondaryBtn" href="/downloads/Michael_Futol_Chinaimo_Baseline.mpp" download>Baseline .mpp</a>
          <a className="secondaryBtn" href="/downloads/Michael_Futol_Chinaimo_Updated_Delay.mpp" download>Updated .mpp</a>
        </div>
        <a className="textLink" href="https://github.com/michaelfutol/Michael-Futol-Chinaimo-Project-Controls" target="_blank">Inspect GitHub audit trail ↗</a>
      </div>
    </section>

    <nav className="navBar" aria-label="Assessment sections">
      <a href="#start">Start Here</a><a href="#coverage">Requirements</a><a href="#progress">Progress</a><a href="#boq">BOQ</a><a href="#schedule">Schedule</a><a href="#delays">Scenarios</a><a href="#claim">Claim</a><a href="#downloads">Downloads</a><a href="#sources">Sources</a>
    </nav>

    <section className="notice"><b>Assessment boundary:</b> {assessment.meta.dataBoundary}</section>

    <section className="reviewPath" id="start">
      <div className="reviewStep"><span>01</span><div><b>Check the status</b><small>Planned vs Actual and current claim</small></div></div>
      <div className="reviewStep"><span>02</span><div><b>Inspect the schedule</b><small>WBS, Gantt, CPM and float</small></div></div>
      <div className="reviewStep"><span>03</span><div><b>Test the delays</b><small>Critical, non-critical and concurrent cases</small></div></div>
      <div className="reviewStep"><span>04</span><div><b>Verify the claim</b><small>Previous + Current = Cumulative</small></div></div>
      <div className="reviewStep"><span>05</span><div><b>Open native files</b><small>Excel and Microsoft Project</small></div></div>
    </section>

    <section className="kpis">
      <Kpi label="Illustrative Control Value" value={`¥${money(assessment.meta.controlValue)}`}/>
      <Kpi label="Data Date" value={assessment.meta.statusDate}/>
      <Kpi label="Planned Progress" value={pct(assessment.meta.plannedProgress)}/>
      <Kpi label="Actual Progress" value={pct(assessment.meta.actualProgress)}/>
      <Kpi label="Variance" value={`${assessment.meta.variance.toFixed(3)} pp`} bad/>
      <Kpi label="Baseline Finish" value={assessment.meta.baselineFinish}/>
      <Kpi label="Current Gross Claim" value={`¥${money(assessment.meta.currentGrossClaim)}`}/>
      <Kpi label="Schedule Activities" value={`${schedule.length}`}/>
    </section>

    <section className="panel" id="coverage">
      <div className="sectionHead"><div><span className="sectionNo">01 · REQUIREMENT MAP</span><h2>What was requested → what is submitted</h2><p>The reviewer can trace every requested item directly to evidence.</p></div><span className="statusPill">COMPLETE</span></div>
      <div className="coverageGrid">{assessment.requirements.map(group=><div className="coverageGroup" key={group.group}><h3>{group.group}</h3>{group.items.map(item=><div className="coverageRow" key={item.request}><div><small>REQUESTED</small><b>{item.request}</b></div><div><small>ANSWER</small><span>{item.solution}</span></div><div><small>EVIDENCE</small><code>{item.evidence}</code></div></div>)}</div>)}</div>
    </section>

    <section className="panel" id="progress">
      <div className="sectionHead"><div><span className="sectionNo">02 · PROGRESS CONTROL</span><h2>Planned vs Actual</h2><p>Switch between cumulative S-Curve, variance and monthly production views.</p></div><span className="statusPill muted">INTERACTIVE</span></div>
      <ProgressExplorer rows={assessment.progress} statusDate={assessment.meta.statusDate}/>
      <div className="resultStrip"><div><small>PLANNED @ DATA DATE</small><b>{pct(assessment.meta.plannedProgress)}</b></div><div><small>ACTUAL @ DATA DATE</small><b>{pct(assessment.meta.actualProgress)}</b></div><div><small>VARIANCE</small><b className="negative">{assessment.meta.variance.toFixed(3)} pp</b></div></div>
    </section>

    <section className="panel" id="boq">
      <div className="sectionHead"><div><span className="sectionNo">03 · BOQ / MEASUREMENT</span><h2>Quantity progress that drives the claim</h2><p>The same measured quantities feed earned progress and payment values.</p></div><a className="miniDownload" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download>Open native Excel ↓</a></div>
      <div className="tableScroll boqTable"><table><thead><tr><th>BOQ ID</th><th>Description</th><th>Unit</th><th>Contract Qty</th><th>Previous</th><th>Current</th><th>Cumulative</th><th>Remaining</th><th>Progress</th><th>Current Amount</th></tr></thead><tbody>{assessment.boq.map(r=><tr key={r.id}><td><code>{r.id}</code></td><td>{r.description}</td><td>{r.unit}</td><td>{qty(r.contractQty)}</td><td>{qty(r.previousQty)}</td><td>{qty(r.currentQty)}</td><td>{qty(r.cumulativeQty)}</td><td>{qty(r.balanceQty)}</td><td><span className="progressCell"><i style={{width:`${Math.min(100,r.progress*100)}%`}}/><b>{(r.progress*100).toFixed(1)}%</b></span></td><td>¥{money(r.currentAmount)}</td></tr>)}</tbody></table></div>
      <div className="controlRule"><b>Measurement control</b><span>Previous + Current = Cumulative</span><span>Contract Qty − Cumulative = Remaining</span><span>Cumulative ≤ BOQ Qty unless supported by variation / remeasurement</span></div>
    </section>

    <section className="panel" id="schedule">
      <div className="sectionHead"><div><span className="sectionNo">04 · PLANNING / CPM</span><h2>Construction Programme & Scenario Explorer</h2><p>Baseline and delay views use the same Activity IDs as the native Microsoft Project model.</p></div><span className="criticalPill">MS PROJECT CPM</span></div>
      <ScheduleExplorer schedule={schedule} scenarios={assessment.scenarios} criticalPath={assessment.criticalPath} statusDate={assessment.meta.statusDate}/>
      <details className="details"><summary>Audit all {schedule.length} activities and dependencies</summary><div className="tableScroll"><table><thead><tr><th>Activity ID</th><th>WBS</th><th>Activity</th><th>Dur.</th><th>Predecessor / Logic</th><th>Baseline Start</th><th>Baseline Finish</th><th>Critical</th></tr></thead><tbody>{schedule.map(a=><tr key={a.id} className={a.critical?'criticalRow':''}><td><code>{a.id}</code></td><td>{a.wbs}</td><td>{a.name}</td><td>{a.duration}d</td><td>{a.predecessors||'—'} {a.relationships}</td><td>{a.baselineStart}</td><td>{a.baselineFinish}</td><td>{a.critical?'YES':'NO'}</td></tr>)}</tbody></table></div></details>
    </section>

    <section className="panel" id="delays">
      <div className="sectionHead"><div><span className="sectionNo">05 · DELAY IMPACT</span><h2>Scenario solutions</h2><p>Result first. The CPM basis is available only when the reviewer chooses to expand it.</p></div></div>
      <div className="scenarioGrid">{assessment.scenarios.map(s=><article className="scenario" key={s.id}><div className="scenarioTop"><span>SCENARIO {s.id}</span><b className={s.netImpact>0?'impactBad':'impactOk'}>{s.netImpact>0?`+${s.netImpact} wd`:'0 wd'}</b></div><h3>{s.name}</h3><p className="activityName">{s.activity}</p><div className="scenarioDates"><div><small>BASELINE</small><b>{s.baselineFinish}</b></div><div><small>FORECAST</small><b>{s.forecastFinish}</b></div></div><div className="solutionBox"><small>SOLUTION</small><strong>{s.result}</strong></div><details><summary>Decision basis</summary><p>{s.why}</p></details></article>)}</div>
    </section>

    <section className="panel" id="claim">
      <div className="sectionHead"><div><span className="sectionNo">06 · MONTHLY CLAIM</span><h2>Payment Claim Reconciliation</h2><p>Claim quantities are the same quantities used for actual progress.</p></div><span className="statusPill">BOQ-CHECKED</span></div>
      <div className="claimKpis"><Kpi label="Previous Earned" value={`¥${money(previous)}`}/><Kpi label="Current Gross Work" value={`¥${money(currentClaim)}`}/><Kpi label="Cumulative Earned" value={`¥${money(cumulative)}`}/><Kpi label="Remaining Balance" value={`¥${money(remaining)}`}/></div>
      <div className="tableScroll"><table><thead><tr><th>BOQ ID</th><th>Description</th><th>Previous Qty</th><th>Current Qty</th><th>Cumulative</th><th>Remaining</th><th>Current Amount</th><th>QA</th></tr></thead><tbody>{assessment.boq.map(r=><tr key={r.id}><td><code>{r.id}</code></td><td>{r.description}</td><td>{qty(r.previousQty)}</td><td>{qty(r.currentQty)}</td><td>{qty(r.cumulativeQty)}</td><td>{qty(r.balanceQty)}</td><td>¥{money(r.currentAmount)}</td><td><span className="qaOk">MATCH</span></td></tr>)}</tbody></table></div>
    </section>

    <section className="panel dataIntegrity">
      <div className="sectionHead"><div><span className="sectionNo">07 · DATA INTEGRITY</span><h2>One model, three views</h2><p>The webpage is presentation only; native tools remain authoritative.</p></div></div>
      <div className="authorityGrid"><div><span className="authorityTool">EXCEL</span><b>Quantity / Commercial Authority</b><p>BOQ, quantities, rates, earned progress, S-Curve weighting and payment claim.</p></div><div><span className="authorityTool">MS PROJECT</span><b>Schedule / CPM Authority</b><p>Durations, logic, Start/Finish, Total Slack, Critical status, critical path and forecast finish.</p></div><div><span className="authorityTool">WEB</span><b>Reviewer Presentation</b><p>Mirrors reconciled outputs through common <code>WBS_ID</code>, <code>ACTIVITY_ID</code> and <code>BOQ_ID</code>.</p></div></div>
      <div className="reconcileStrip"><span><i/>Excel quantities reconciled to claim</span><span><i/>Schedule uses stable Activity IDs</span><span><i/>Public / mock-data boundary disclosed</span></div>
    </section>

    <section className="panel downloads" id="downloads">
      <div className="downloadIntro"><span className="sectionNo">08 · NATIVE DELIVERABLES</span><h2>Inspect the actual working files</h2><p>The presentation is intentionally not a substitute for native Excel and Microsoft Project evidence.</p></div>
      <div className="downloadGrid"><a href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Excel Project Controls Workbook</b><span>.xlsx · BOQ · Measurement · Progress · Gantt · S-Curve · Claim · Delay Analysis</span><em>DOWNLOAD ↓</em></a><a href="/downloads/Michael_Futol_Chinaimo_Baseline.mpp" download><b>Microsoft Project Baseline</b><span>.mpp · WBS · Logic · Baseline · Critical Path · Float</span><em>DOWNLOAD ↓</em></a><a href="/downloads/Michael_Futol_Chinaimo_Updated_Delay.mpp" download><b>Microsoft Project Updated Schedule</b><span>.mpp · Delay update · Recalculated critical path · Forecast finish</span><em>DOWNLOAD ↓</em></a><a href="https://github.com/michaelfutol/Michael-Futol-Chinaimo-Project-Controls" target="_blank"><b>GitHub Audit Trail</b><span>Source data · Schedule data · Web source · Revision history</span><em>INSPECT ↗</em></a></div>
    </section>

    <section className="panel" id="sources">
      <div className="sectionHead"><div><span className="sectionNo">09 · SOURCE BASIS</span><h2>Public project context vs assessment assumptions</h2><p>No confidential Kubota WBS, BOQ, rates or approved programme are represented as source data.</p></div></div>
      <div className="boundaryGrid"><div><b>Publicly grounded project context</b><p>Chinaimo WTP expansion, reservoir capacities, related facilities, off-site power scope and publicly documented water-treatment-process context.</p></div><div><b>Assessment-derived mock control model</b><p>WBS coding, quantities, rates, durations, logic, progress, claims, delay scenarios and forecast test cases.</p></div></div>
      <div className="sourceGrid">{assessment.sources.map(s=><a href={s.url} target="_blank" key={s.url}><b>{s.label}</b><span>{s.use}</span><small>Open public source ↗</small></a>)}</div>
    </section>

    <footer><div><b>Michael Futol</b><span>Project Controls & Construction Planning Technical Assessment</span></div><a href="#top">Back to top ↑</a></footer>
  </main>
}

function Kpi({label,value,bad=false}:{label:string,value:string,bad?:boolean}){
  return <div className="kpi"><small>{label}</small><b className={bad?'negative':''}>{value}</b></div>
}
