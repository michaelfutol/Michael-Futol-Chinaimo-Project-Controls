export default function DecisionSimulatorPage(){
  return <main id="top" style={{maxWidth:1180,margin:'0 auto',padding:'88px 24px 48px'}}>
    <section className="hero" style={{marginBottom:24}}>
      <div className="heroCopy">
        <div className="eyebrow">BONUS CONCEPT · FUTURE PROJECT-CONTROLS EXTENSION</div>
        <h1>AI-Assisted Project Decision Simulator</h1>
        <p className="heroLead">Before changing the real project, explore the consequences digitally first.</p>
        <div className="heroTags"><span>Activity-level risk decomposition</span><span>CPM simulation</span><span>QUBO / MILP / CP-SAT optimization</span><span>Human approval</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">CONCEPT STATUS</div>
        <div className="notice" style={{margin:0}}><b>Future concept only.</b> This page is not part of the validated Chinaimo schedule calculation and does not claim that QUBO or AI optimization was used to produce the submitted recovery programme.</div>
        <div className="heroButtonRow"><a className="secondaryBtn" href="/">Back to Assessment</a><a className="secondaryBtn" href="/ja/decision-simulator">日本語</a></div>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">01 · THE PROBLEM</span><h2>A Gantt change is easy. Real-world recovery is not.</h2><p>A large WBS can contain hundreds or thousands of activities. Each activity may depend on drawings, materials, work fronts, crews, plant, permits, RFIs, QA hold points, HSE controls, weather, procurement and subcontractor interfaces. No single person can continuously micro-analyse every combination.</p></div></div>
      <div className="authorityGrid">
        <div><span className="authorityTool">ACTIVITY</span><b>Activity Control Passport</b><p>Prerequisites → drawings → materials → work fronts → crew / plant → productivity → QA/QC → HSE → interfaces → risks → cost → float → downstream consequences → recovery options.</p></div>
        <div><span className="authorityTool">QUESTION</span><b>What must become true?</b><p>Instead of simply reducing a duration by five days, ask what technical, resource and organizational conditions must become true for those five days to be genuinely recoverable.</p></div>
        <div><span className="authorityTool">OUTPUT</span><b>Decision-ready options</b><p>Each intervention is assessed for time gain, incremental cost, congestion, fatigue, HSE exposure, QA burden, resource demand, procurement dependency and new critical-path risk.</p></div>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">02 · SIMULATE FIRST</span><h2>Test the consequence before committing the project.</h2><p>The system would explore alternatives such as second crews, additional work fronts, overtime, zone turnover, prefabrication, resequencing, selective overlap, equipment changes and procurement expediting—then test their combined consequences through CPM, cost and risk simulation.</p></div></div>
      <div className="commentaryRule"><b>Example questions</b><span>What if Crew B opens Zone 2 five days earlier?</span><span>What if procurement slips seven days?</span><span>What if overtime adds capacity but congestion reduces productivity?</span><span>What if recovery creates a new critical path?</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">03 · DECISION ENGINE</span><h2>Optimization searches the feasible decision space.</h2><p>QUBO can be useful when many recovery choices are discrete: use or do not use a crew, shift, work front, overlap or expediting option. But it is one optimizer among several—not the engineering authority.</p></div></div>
      <div className="resultStrip"><div><small>OBJECTIVE</small><b>Minimize recovery cost + delay exposure + safety / quality / resource penalties</b></div><div><small>CONSTRAINT</small><b>Forecast Finish ≤ required completion</b></div><div><small>SOLVER BENCHMARK</small><b>QUBO · MILP · CP-SAT · heuristics</b></div></div>
      <div className="controlRule"><b>Solver-neutral doctrine</b><span>Use the best feasible solution, not a preferred technology.</span><span>Engineering rules define what is allowed.</span><span>The optimizer only searches among allowed options.</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">04 · GOVERNANCE</span><h2>Human-in-command workflow</h2><p>The model proposes and tests. The project team validates. The Project Manager approves.</p></div></div>
      <div className="reviewPath" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
        <div className="reviewStep"><span>01</span><div><b>Engineering / construction rules</b><small>Define physical, technical and contractual feasibility.</small></div></div>
        <div className="reviewStep"><span>02</span><div><b>AI decomposition</b><small>Expose dependencies, risks and candidate interventions.</small></div></div>
        <div className="reviewStep"><span>03</span><div><b>CPM + simulation + optimization</b><small>Test time, cost, resource and risk consequences.</small></div></div>
        <div className="reviewStep"><span>04</span><div><b>Team validation & PM approval</b><small>Construction · Engineering · Procurement · QA/QC · HSE · Commercial.</small></div></div>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">05 · THE PRINCIPLE</span><h2>QUBO is the strategist, not the engineer.</h2></div></div>
      <div className="doctrineCard"><div><small>PROJECT DECISION SIMULATOR</small><h3>The schedule identifies where intervention is required. Engineering and construction define what is physically achievable. Simulation tests the consequences. Optimization searches for the best feasible combination. The project team remains responsible for the decision.</h3></div></div>
      <p className="controlNote" style={{marginTop:18}}><b>Goal:</b> not simply to recover days, but to identify the safest, most economical and operationally credible way to protect completion, quality and project margin.</p>
    </section>

    <footer><div><b>Michael Futol</b><span>Project Controls & Construction Planning Technical Assessment · Future Concept Note</span></div><a href="/">Return to assessment ↑</a></footer>
  </main>
}
