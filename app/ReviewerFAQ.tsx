const questions = [
  {
    q: 'What is the critical path in this assessment?',
    a: <>Within this assessment model, the controlling chain runs from Notice to Proceed, mobilization and survey into the Chinaimo WTP civil sequence, including the Rapid Sand Filter Structure, then through structural water testing, Process Piping Installation, Instrumentation & SCADA Installation, Electrical / I&C Pre-Commissioning, Dry and Wet Commissioning, Performance / Water Quality Testing, Punch List / Rectification and finally the Taking Over / Completion Milestone. These activities carry zero total slack in the baseline model and therefore control the modelled completion date of 15-Jan-2029.</>
  },
  {
    q: 'Why does the critical-delay case move completion by 10 working days?',
    a: <>Scenario A adds 10 working days to <code>WTP-CIV-060</code>, the Rapid Sand Filter Structure. Native Microsoft Project recalculation carries that added duration through the downstream WTP, process-installation and commissioning logic. The forecast finish therefore moves from 15-Jan-2029 to 26-Jan-2029, a net impact of 10 working days in the assessment calendar.</>
  },
  {
    q: 'Why does a 15-day activity delay in Scenario B produce zero project delay?',
    a: <>Because activity delay and project delay are not the same thing. <code>BLDG-030</code>, the Administration & Laboratory Building, is on a parallel non-critical path with available float in this test network. Adding 15 working days consumes part of that flexibility but does not move the completion milestone. The management action is therefore to track the remaining float and protect downstream interfaces rather than report 15 days of project delay.</>
  },
  {
    q: 'Why are the concurrent delays not simply added together?',
    a: <>Scenario C applies +10 working days to the critical WTP activity and +15 working days to the non-critical building activity. The reported event durations total 25 days, but native CPM recalculation gives only +10 working days of completion impact because the critical WTP path remains controlling while the building delay remains within its parallel-path flexibility. Delay events must be analysed on their logic paths; they should not be added arithmetically.</>
  },
  {
    q: 'What does the procurement-watch scenario demonstrate?',
    a: <>Scenario D delays <code>PROC-030</code>, Electrical / Receiving Equipment Procurement, by 10 working days. In this test case the completion milestone does not move, but procurement float is consumed. The correct response is to monitor required-on-site dates, approvals, manufacturing, shipping, receiving and energization interfaces before the procurement path becomes critical.</>
  },
  {
    q: 'Is the −7.475 percentage-point progress variance the same as a 7.475% schedule delay?',
    a: <>No. At the Data Date, planned value-weighted progress is 47.000% and actual earned progress is 39.525%, giving a variance of −7.475 percentage points. That is a progress-performance signal, not a direct statement of time delay. Schedule delay must be determined from the statused CPM network, remaining logic, available float, critical and near-critical paths and the resulting forecast completion date.</>
  },
  {
    q: 'What recovery action is proposed for the critical-delay case?',
    a: <>The separate recovery test targets downstream critical work after the delayed filter structure: <code>WTP-CIV-070</code> Internal Channels / Pipe Galleries and <code>WTP-CIV-080</code> Waterproofing / Protective Coating, with an illustrative five-working-day duration recovery target on each. Possible implementation methods include resequencing, selective safe fast-tracking and targeted resource increases. Those methods are not assumed to be automatically feasible; they require constructability, resource, safety, quality and cost validation by the project team before commitment.</>
  },
  {
    q: 'Why not simply shorten the delayed activity itself?',
    a: <>Because the delay may already have occurred or may represent a condition that cannot realistically be reversed. Recovery planning should examine the remaining controlling chain rather than rewrite the historical event that caused the delay. In this assessment, intervention is tested on downstream critical work where sequencing, interfaces or resources may provide a genuine opportunity to regain time.</>
  },
  {
    q: 'Why is the Recovery Programme separate from the approved baseline?',
    a: <>Because the baseline is the approved reference against which performance and change are measured. A recovery proposal should not erase the evidence of the original commitment or the current forecast. This assessment therefore preserves the baseline, keeps the delay scenario as a separate test case and develops recovery as a separate programme that can be recalculated, reviewed and accepted or rejected without rewriting history.</>
  },
  {
    q: 'How would the recovery plan be controlled after approval?',
    a: <>Use the same Data Date discipline and common Activity IDs, then update actual starts, finishes, remaining durations and approved logic changes. Review the critical and near-critical paths, float erosion, procurement interfaces and recovery activities at each update. Compare baseline, current forecast and recovery forecast side by side, and track whether the intended finish-date gain is actually being earned rather than merely promised.</>
  },
  {
    q: 'How are Excel and Microsoft Project connected in the control model?',
    a: <>They have different authorities. Excel is the quantity and commercial control record for BOQ quantities, rates, earned progress, S-Curve weighting and payment claim. Microsoft Project is the CPM schedule authority for durations, logic, dates, total slack, critical status and forecast finish. Common Activity, WBS and BOQ identifiers allow the two views to reconcile without pretending that one application should control every discipline.</>
  },
  {
    q: 'Is the Microsoft Project file a contractual cost-loaded or manpower-loaded programme?',
    a: <>No. BOQ-linked control values are mirrored into native Project custom cost fields for reconciliation and reviewer inspection; they are not represented as incurred accounting cost. Resources prefixed <code>CTRL -</code> are normalized schedule-derived control workstreams so that native Work / Resource Usage views are meaningful. Their Work is a schedule-derived control quantity based on task duration, with zero rates; it is not a manpower histogram, staffing commitment or productivity promise.</>
  },
  {
    q: 'Why use native Microsoft Project instead of only showing a static Gantt chart?',
    a: <>Because the schedule should be testable. A static Gantt can look correct while hiding broken logic. The native <code>.mpp</code> files allow a reviewer to inspect predecessors, dates, slack, critical status and scenario changes and to let Microsoft Project recalculate the network. The web and PDF views are presentation layers; the native schedule remains the schedule evidence.</>
  },
  {
    q: 'Are the delay cases presented as actual Chinaimo project events?',
    a: <>No. The project context is informed by public sources, but the quantities, rates, durations, logic, progress, claims and delay scenarios in this technical assessment are independently prepared control data. The scenarios are used solely to demonstrate project-controls reasoning and CPM schedule-impact analysis; they are not represented as actual Kubota or Chinaimo delay records.</>
  },
  {
    q: 'How would this change on a live Kubota project?',
    a: <>The same control architecture would be retained, but the illustrative assessment data would be replaced by the employer-approved baseline, current schedule, actual site progress, approved BOQ / measurement records, procurement register, change records and company procedures. Reporting would then follow the project-specific calendar, coding structure, contractual requirements, approval workflow and document-control rules.</>
  }
];

export default function ReviewerFAQ(){
  return <section className="panel" id="reviewer-qa">
    <div className="sectionHead"><div><span className="sectionNo">07 · REVIEWER Q&A</span><h2>Schedule, Delay & Recovery</h2><p>Short engineering answers to the questions a project manager or reviewer is most likely to test. Each answer separates the model result from the management decision.</p></div><span className="statusPill muted">DEFENCE NOTES</span></div>
    <div className="commentaryRule"><b>Answer discipline</b><span><strong>Fact</strong> — what does the model show?</span><span><strong>Implication</strong> — what does it mean?</span><span><strong>Action</strong> — what should be controlled next?</span></div>
    {questions.map((item,index)=><details className="details" key={item.q} open={index<3}><summary>{String(index+1).padStart(2,'0')} · {item.q}</summary><p>{item.a}</p></details>)}
  </section>
}