import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Engineer's Note 002 - Value Over Recovery",
  description: 'Why the fastest recovery programme is not always the best project decision.'
};

const sectionStyle: CSSProperties = {marginTop:32,paddingTop:17,borderTop:'1px solid #b8bbb7'};
const h2Style: CSSProperties = {margin:'0 0 11px',fontFamily:"'Bodoni 72',Didot,'Bodoni MT',Baskerville,'Times New Roman',serif",fontSize:25,lineHeight:1.15,fontWeight:600,letterSpacing:'.012em',color:'#293a42',textTransform:'uppercase'};
const pStyle: CSSProperties = {margin:'0 0 14px',fontSize:16.5,lineHeight:1.76,color:'#3f494d',textAlign:'justify'};
const smallStyle: CSSProperties = {fontSize:14,lineHeight:1.55,color:'#687074'};

function Section({title,children}:{title:string;children:ReactNode}){
  return <section style={sectionStyle}><h2 style={h2Style}>{title}</h2>{children}</section>;
}

function Flow({children}:{children:ReactNode}){
  return <div style={{margin:'19px auto',padding:'15px 18px',maxWidth:800,borderTop:'1px solid #aeb2ae',borderBottom:'1px solid #aeb2ae',textAlign:'center',font:"700 13.5px/1.7 'Courier New',monospace",letterSpacing:'.025em',color:'#34454c'}}>{children}</div>;
}

export default function EngineersNote002(){
  return <main style={{minHeight:'100vh',background:'#efefeb',padding:'28px 16px 44px',color:'#283238',fontFamily:"Arial,'Helvetica Neue','Noto Sans JP',sans-serif"}}>
    <article style={{maxWidth:980,margin:'0 auto',background:'#fbfaf7',border:'1px solid #b9bdb9',boxShadow:'0 8px 30px rgba(35,42,45,.055)'}}>
      <header style={{padding:'38px 52px 30px',borderTop:'4px solid #293a42',borderBottom:'1px solid #bbbeba',textAlign:'center'}}>
        <div style={{font:"700 11.5px/1.3 'Courier New',monospace",letterSpacing:'.11em',color:'#8e4539'}}>ENGINEER'S NOTE 002 · VERSION 1.1</div>
        <h1 style={{margin:'13px 0 0',fontFamily:"'Bodoni 72',Didot,'Bodoni MT',Baskerville,'Times New Roman',serif",fontSize:45,lineHeight:1.05,fontWeight:600,color:'#25353c'}}>Value Over Recovery</h1>
        <div style={{marginTop:9,fontFamily:"'Times New Roman',serif",fontSize:17,fontStyle:'italic',color:'#566166'}}>Why the Fastest Recovery Programme Is Not Always the Best Project Decision</div>
        <div style={{marginTop:13,fontFamily:"'Times New Roman',serif",fontStyle:'italic',fontSize:13.5,letterSpacing:'.11em',color:'#686f72'}}>MENS UNA · INGENIA MULTA</div>
      </header>

      <div style={{padding:'28px 52px 48px'}}>
        <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'8px 18px',fontSize:14.5,lineHeight:1.55,borderBottom:'1px solid #c8cbc7',paddingBottom:19,marginBottom:25}}>
          <strong>Subject</strong><span>Selecting recovery interventions by defensible project value</span>
          <strong>Classification</strong><span>Project Controls / Recovery Engineering / Value Recovery</span>
          <strong>Author</strong><span>Michael Futol, Civil Engineer</span>
          <strong>Version / Date</strong><span>1.1 / 3 September 2026</span>
        </div>

        <p style={pStyle}>In delayed projects, management attention often converges on one question: how many days can be recovered? It is an understandable question, but it is incomplete. A project can recover time and still destroy value.</p>
        <p style={pStyle}>Acceleration may succeed on paper while consuming excessive overtime, premium procurement, additional supervision, duplicated resources, contractor profitability, commercial goodwill, and future opportunity. It may also introduce congestion, rework exposure, and reduced safety margin. A technically impressive recovery programme may therefore be a poor project decision.</p>
        <p style={pStyle}>Time recovery is not, by itself, project recovery. The more useful question is how much project value is preserved by recovering that time. This is the principle of <strong>Value Over Recovery</strong>.</p>

        <Section title="1. Schedule Recovery Is a Means, Not the Objective">
          <p style={pStyle}>Time is one dimension of project performance; it is not the project itself. When a programme falls behind, planners properly examine acceleration, crashing, resequencing, additional shifts, alternative construction methods, parallel working, procurement changes, subcontractor reinforcement, scope segmentation, and other interventions. These techniques can recover time, but every intervention also changes the project.</p>
          <p style={pStyle}>It changes cost, risk, and resource demand. It may change productivity, increase workface congestion and interfaces, reduce available float elsewhere, increase claims exposure, and add quality or safety risk. It may also consume management attention needed for other critical work. The correct recovery question is therefore not the maximum number of days that can be recovered, but which recovery strategy produces the highest defensible project value.</p>
          <Flow>DELAY → RECOVERY OPTIONS → TIME RECOVERED<br/>→ COST + RISK + DISRUPTION → VALUE PRESERVED → OPTIMUM INTERVENTION</Flow>
        </Section>

        <Section title="2. Maximum Recovery Is Not Necessarily Optimum Recovery">
          <p style={pStyle}>Consider a project delayed by 100 days. Management develops two alternatives. Scenario A seeks to recover 80 days through extensive overtime, second and third shifts, premium material procurement, overlapping activities, additional subcontractors, and heavy acceleration of critical packages. The programme appears attractive because the delay is almost eliminated, but the intervention introduces substantial additional cost, reduced productivity, site congestion, coordination difficulty, rework exposure, and commercial strain.</p>
          <p style={pStyle}>Scenario B seeks to recover 45 days through selective acceleration, improved sequencing, constraint removal, targeted additional resources, workface optimisation, and early procurement of genuinely critical items. The project remains 55 days late, yet this option may preserve more margin, quality, safety, workforce stability, client confidence, and downstream flexibility.</p>
          <p style={pStyle}>The first programme recovers more time. The second may recover more value. The optimum recovery point is therefore not necessarily the maximum technically achievable recovery.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,margin:'18px 0'}}>
            <div style={{border:'1px solid #c4c6c2',padding:'15px 16px',background:'#f6f5f0'}}><strong>SCENARIO A</strong><div style={smallStyle}>80 days recovered · high acceleration · premium procurement · added shifts and subcontractors · higher congestion and commercial/quality/rework exposure.</div></div>
            <div style={{border:'1px solid #c4c6c2',padding:'15px 16px',background:'#f6f5f0'}}><strong>SCENARIO B</strong><div style={smallStyle}>45 days recovered · selective acceleration · constraint removal · targeted resources · critical procurement intervention · lower disruption and greater retained flexibility.</div></div>
          </div>
          <Flow>MORE TIME RECOVERED ≠ AUTOMATICALLY MORE VALUE</Flow>
        </Section>

        <Section title="3. The Marginal Value of One More Recovered Day">
          <p style={pStyle}>Recovery should be treated as an optimisation problem. Early interventions often produce substantial value. Removing a major constraint, correcting logic, changing work sequence, improving approvals, releasing drawings, resolving access, or obtaining a missing material may recover several weeks with relatively little cost. Progressively deeper acceleration, however, usually becomes more expensive and disruptive.</p>
          <p style={pStyle}>Recovery should continue while the marginal value of time recovered exceeds the marginal cost and risk of recovery. The optimum lies near the point at which the marginal value of additional recovery is approximately equal to its marginal recovery cost and marginal recovery risk. Beyond that point, further acceleration may destroy more value than it preserves. This is the economic and engineering boundary between useful recovery and recovery for appearance.</p>
          <Flow>MARGINAL VALUE OF ADDITIONAL RECOVERY<br/>≈ MARGINAL RECOVERY COST + MARGINAL RECOVERY RISK</Flow>
        </Section>

        <Section title="4. What Is Value?">
          <p style={pStyle}>Value must be defined broadly. It is not limited to direct construction cost. Depending on the project, the value of recovering time may include avoided liquidated damages; reduced prolongation, supervision, site overhead, escalation, financing, and equipment standby; earlier revenue or operational benefit; improved cash flow; reduced contractual exposure; preservation of contractor margin; protection of client relationships, workforce and subcontractor capacity, future tender opportunities and strategic reference value; avoidance of reputational damage; and public-service or societal benefit from earlier completion.</p>
          <p style={pStyle}>Some of these consequences can be monetised reliably; others cannot. Where monetary precision cannot be defended, the planner should not manufacture a false financial number. Non-monetary value should remain explicitly identified and should be evaluated through transparent qualitative or weighted decision criteria. The principle is not that everything must be converted into money. It is that everything material to the decision must be visible.</p>
        </Section>

        <Section title="5. Recovery Has a Cost Curve">
          <p style={pStyle}>Traditional recovery analysis often concentrates on the time-cost trade-off. That remains useful, but a real project requires a broader recovery curve. As acceleration increases, direct cost ordinarily rises because more labour, equipment, subcontractors, logistics, and premium procurement may be required.</p>
          <p style={pStyle}>Productivity may decline at the same time. Adding workers does not guarantee proportional output; congestion, interference, fatigue, limited supervision, and restricted access can reduce the return from each additional resource. Risk also increases as parallel activities create more interfaces, compressed design and approval windows create rework exposure, and testing or commissioning competes with unfinished construction for the same spaces.</p>
          <p style={pStyle}>Commercial exposure may rise through acceleration instructions, changed methods, disrupted sequences, added resources, and overtime. Management bandwidth is also finite. An organisation can spend enormous effort protecting one milestone while weakening control elsewhere. A recovery programme must therefore be evaluated by more than its revised completion date.</p>
        </Section>

        <Section title="6. Never Confuse an Aspirational Date With a Forecast">
          <p style={pStyle}>One of the most dangerous project-control failures occurs when management selects a desired date and the schedule is modified until it appears to support that date. The date may be commercially, politically, contractually, publicly, or emotionally important. None of those conditions automatically makes it achievable.</p>
          <p style={pStyle}>A disciplined project-control system should distinguish at least three states. The committed or target date is a desired or contractual milestone. The current forecast is the date supported by current scope, logic, productivity, resources, constraints, interfaces, risk, and actual performance. A recovery scenario is a modelled intervention showing what may become achievable if defined actions are successfully implemented.</p>
          <p style={pStyle}>These states must never be silently merged. A management target unsupported by executable logic remains an aspiration; it is not a forecast.</p>
          <Flow>TARGET / COMMITTED DATE · CURRENT FORECAST · RECOVERY SCENARIO<br/>THESE STATES MUST REMAIN DISTINCT</Flow>
        </Section>

        <Section title="7. Preserve the Original Baseline">
          <p style={pStyle}>Recovery should never erase history. The original approved baseline must remain visible, as should the current forecast and each recovery scenario. Management must be able to trace the project from original baseline through actual performance, current forecast, recovery intervention, revised forecast, and eventual outcome.</p>
          <p style={pStyle}>Without this chain, project learning disappears. A schedule can appear healthy simply because repeated rebaselining has concealed deterioration. Recovery analysis must therefore preserve provenance. A recovered programme is meaningful only if the organisation knows exactly what it recovered from.</p>
          <Flow>ORIGINAL BASELINE → ACTUAL PERFORMANCE → CURRENT FORECAST<br/>→ RECOVERY SCENARIO(S) → APPROVED INTERVENTION → REVISED FORECAST → ACTUAL OUTCOME</Flow>
        </Section>

        <Section title="8. Partial Recovery Can Be the Correct Engineering Decision">
          <p style={pStyle}>There is often psychological pressure to eliminate the entire delay. If a project is 100 days late, management may assume that anything less than 100 days of recovery represents failure. It does not. If recovering the final 20 days requires excessive risk, cost, congestion, quality compromise, or commercial exposure, retaining part of the delay may preserve greater total value.</p>
          <p style={pStyle}>The planner must be willing to recommend that the project should not recover everything, but should recover what is worth recovering. This is not surrender. It is optimisation.</p>
        </Section>

        <Section title="9. Recovery Must Protect Executability">
          <p style={pStyle}>A schedule is valuable only if people can actually build it. Every recovery programme must be tested against available workfaces, crews, supervision, plant and equipment, materials, procurement lead times, design maturity, approvals, permits, temporary works, access, interfaces, testing requirements, commissioning sequence, safety constraints, subcontractor capacity, and commercial authorisation.</p>
          <p style={pStyle}>A mathematically valid CPM schedule can still be physically impossible. The recovered date must therefore survive both logic validation and executability validation.</p>
        </Section>

        <Section title="10. A Practical Value-Over-Recovery Framework">
          <p style={pStyle}>For every major alternative, the project team should evaluate time, cost, risk, probability of success, value preserved, residual exposure, reversibility, downstream effects, and executability. Time asks how many days can realistically be recovered; cost identifies the additional direct and indirect expenditure required. Risk considers new safety, quality, interface, rework, commercial, procurement, and commissioning exposure, while probability tests how likely the intervention itself is to succeed.</p>
          <p style={pStyle}>The assessment must also identify the costs, damages, revenue losses, strategic consequences, and operational impacts that the intervention may avoid. It should state what delay or risk remains after intervention, whether the decision can be changed if performance differs from assumptions, and whether acceleration of one package simply transfers delay or disruption elsewhere.</p>
          <p style={pStyle}>The preferred option should not automatically be the one with the earliest completion date. It should be the option with the strongest defensible project-value proposition.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,margin:'18px 0',fontSize:13.5,lineHeight:1.45,color:'#4f5a5e'}}>
            {['TIME','COST','RISK','PROBABILITY OF SUCCESS','VALUE PRESERVED','RESIDUAL EXPOSURE','REVERSIBILITY','DOWNSTREAM EFFECTS','EXECUTABILITY'].map(x=><div key={x} style={{border:'1px solid #c7c9c5',padding:'11px 10px',textAlign:'center',fontFamily:"'Courier New',monospace",fontWeight:700}}>{x}</div>)}
          </div>
          <Flow>ALL RELEVANT CONDITIONS PASS → CREDIBLE RECOVERY FORECAST</Flow>
        </Section>

        <Section title="11. The Planner's Responsibility">
          <p style={pStyle}>The planner is not merely a producer of dates. The planner is part of the project's decision system. That responsibility includes stating when a recovery scenario is unrealistic, exposing assumptions, showing the cost of acceleration, identifying physical interference created by compression, and distinguishing target dates from credible forecasts.</p>
          <p style={pStyle}>Sometimes that responsibility includes advising management that accepting part of the delay is economically and operationally preferable to pursuing total recovery. A good planner does not make the schedule say what management wants to hear. A good planner helps management understand what the project can actually achieve and what each alternative will cost.</p>
        </Section>

        <Section title="12. The LUM Planner Principle">
          <p style={pStyle}>For LUM Planner, recovery should be modelled as a value decision rather than merely a schedule exercise. The conceptual decision structure is:</p>
          <Flow>RECOVERY DECISION VALUE = VALUE PRESERVED<br/>- INCREMENTAL RECOVERY COST - INCREMENTAL RECOVERY RISK</Flow>
          <p style={pStyle}>This expression is not intended to create false numerical precision or to imply that every project consequence can be reduced to money. Where reliable monetisation is not possible, explicit qualitative or weighted decision criteria should be retained rather than manufacturing numbers. The purpose of the expression is to enforce the correct decision structure.</p>
          <p style={pStyle}>LUM should ultimately be capable of generating multiple recovery scenarios and comparing them across schedule, cost, resources, productivity, risk, commercial exposure, operational consequences, and strategic value. Instead of asking only how the project can finish earlier, it should ask which intervention creates the greatest defensible project value.</p>
        </Section>

        <Section title="Closing Principle">
          <p style={pStyle}>Project recovery should not become a race to erase red bars from a schedule. Sometimes recovering one month is enormously valuable; sometimes recovering another week is irrationally expensive. The proper decision may be acceleration, resequencing, scope segmentation, staged operation, or acceptance of a controlled delay.</p>
          <p style={pStyle}>Engineering judgement begins when the planner stops treating time as the only objective. Recovery should continue when recovering time creates value, and it should stop when further acceleration would destroy more value than it preserves.</p>
        </Section>

        <div style={{marginTop:38,paddingTop:23,borderTop:'1px solid #aeb2ae',textAlign:'center'}}>
          <div style={{fontFamily:"'Bodoni 72',Didot,'Bodoni MT',Baskerville,'Times New Roman',serif",fontSize:22,fontWeight:600,color:'#293a42'}}>Recover time when recovering time creates value.<br/>Protect value when further recovery would destroy it.</div>
          <div style={{marginTop:15,fontFamily:"'Times New Roman',serif",fontStyle:'italic',fontSize:13.5,letterSpacing:'.11em',color:'#686f72'}}>VALUE OVER RECOVERY · MENS UNA · INGENIA MULTA</div>
          <div style={{marginTop:22,font:"700 10.5px/1.3 'Courier New',monospace",letterSpacing:'.08em',color:'#777'}}>-- ENGINEER'S NOTE 002 --</div>
        </div>

        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:32,paddingTop:20,borderTop:'1px solid #d1d3cf'}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',minHeight:42,padding:'8px 14px',border:'1px solid #9ea4a2',color:'#35464d',textDecoration:'none',font:"700 11px/1.2 'Courier New',monospace",letterSpacing:'.05em'}}>← RETURN TO ASSESSMENT</Link>
        </div>
      </div>
    </article>
  </main>;
}
