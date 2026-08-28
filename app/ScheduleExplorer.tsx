'use client';

import { useMemo, useState } from 'react';

type Scenario = {
  id:string; name:string; activity:string; reportedDelay:number; baselineCritical:string;
  baselineFinish:string; forecastFinish:string; netImpact:number; result:string; why:string;
};
type Activity = {id:string; wbs:string; name:string; duration:number; predecessors:string; relationships:string; workstream:string; baselineStart:string; baselineFinish:string; critical:boolean};

const addCalendarDays=(iso:string,days:number)=>{
  const d=new Date(iso+'T00:00:00'); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10);
};

export default function ScheduleExplorer({schedule,scenarios,criticalPath,statusDate}:{schedule:Activity[];scenarios:Scenario[];criticalPath:string[];statusDate:string}){
  const [view,setView]=useState<'BASE'|'A'|'B'|'C'|'D'>('BASE');
  const selected=view==='BASE'?null:scenarios.find(s=>s.id===view)!;
  const start=new Date(schedule[0].baselineStart+'T00:00:00');
  const baselineEnd=new Date(schedule.find(a=>a.id==='COMM-080')!.baselineFinish+'T00:00:00');
  const forecastEnd=selected?new Date(selected.forecastFinish+'T00:00:00'):baselineEnd;
  const horizon=Math.max(baselineEnd.getTime(),forecastEnd.getTime())-start.getTime();
  const pos=(d:string)=>Math.max(0,Math.min(100,((new Date(d+'T00:00:00').getTime()-start.getTime())/horizon)*100));
  const selectedIds=useMemo(()=>{
    if(!selected) return new Set<string>();
    return new Set((selected.activity.match(/[A-Z]+(?:-[A-Z]+)*-\d+/g)||[]));
  },[selected]);
  const display=schedule.filter(a=>a.critical || ['PROC-010','PROC-030','RES-030','BLDG-030','SAL-020','PWR-030'].includes(a.id));
  const criticalDelay=view==='A'||view==='C';
  const shiftStarts=criticalDelay?criticalPath.indexOf('WTP-CIV-060'):-1;
  const shifted=(a:Activity)=> shiftStarts>=0 && criticalPath.indexOf(a.id)>=shiftStarts;

  return <div className="scheduleExplorer">
    <div className="viewTabs">
      <button className={view==='BASE'?'active':''} onClick={()=>setView('BASE')}>Baseline</button>
      {scenarios.map(s=><button key={s.id} className={view===s.id?'active':''} onClick={()=>setView(s.id as 'A'|'B'|'C'|'D')}>Scenario {s.id}</button>)}
    </div>

    <div className="scenarioSummary">
      <div><small>VIEW</small><b>{selected?selected.name:'Approved / Assessment Baseline'}</b></div>
      <div><small>BASELINE FINISH</small><b>{selected?.baselineFinish||'2029-01-17'}</b></div>
      <div><small>FORECAST FINISH</small><b className={selected&&selected.netImpact>0?'negative':''}>{selected?.forecastFinish||'2029-01-17'}</b></div>
      <div><small>NET IMPACT</small><b className={selected&&selected.netImpact>0?'negative':''}>{selected?`${selected.netImpact>0?'+':''}${selected.netImpact} wd`:'0 wd'}</b></div>
    </div>

    <div className="ganttWrap scenarioGantt"><div className="ganttHead"><span>Activity</span><span>Sep 2026</span><span>2027</span><span>2028</span><span>Jan 2029</span></div>
      {display.map(a=>{
        const startDate=shifted(a)?addCalendarDays(a.baselineStart,12):a.baselineStart;
        const finishDate=shifted(a)?addCalendarDays(a.baselineFinish,12):a.baselineFinish;
        const left=pos(startDate), right=pos(finishDate), width=Math.max(a.duration===0?.8:right-left,.8);
        const selectedActivity=selectedIds.has(a.id);
        return <div className="ganttRow" key={a.id}><div className="ganttLabel"><b>{a.id}</b><span>{a.name}</span>{selectedActivity&&<em>DELAY</em>}</div><div className="ganttTrack"><div className={`${a.critical?'ganttBar criticalBar':'ganttBar'} ${selectedActivity?'selectedDelay':''}`} style={{left:`${left}%`,width:`${width}%`}}/><div className="dataDate" style={{left:`${pos(statusDate)}%`}}/></div></div>
      })}
    </div>

    <div className="networkCard">
      <div className="networkTitle"><div><small>CPM / PRECEDENCE NETWORK</small><b>{selected?'Updated logic impact view':'Baseline controlling path'}</b></div><span className="networkLegend"><i/>Critical / controlling</span></div>
      <div className="networkScroller"><div className="networkChain">
        {criticalPath.map((id,i)=>{
          const a=schedule.find(x=>x.id===id)!; const hit=selectedIds.has(id);
          return <div className="networkItem" key={id}><div className={`networkNode ${hit?'delayNode':''}`}><code>{id}</code><span>{a.name}</span><small>{a.duration} wd</small></div>{i<criticalPath.length-1&&<b className="networkArrow">→</b>}</div>
        })}
      </div></div>
      {selected&&<div className="networkResult"><small>SOLUTION</small><strong>{selected.result}</strong><span>{selected.why}</span></div>}
    </div>

    <div className="floatPanel">
      <div><small>FLOAT / SLACK CONTROL</small><b>Read from Microsoft Project, not hand-assigned</b></div>
      <div className="floatBands"><span><i className="f0"/>0d Critical</span><span><i className="f1"/>1–5d Near-critical</span><span><i className="f2"/>6–15d Watch</span><span><i className="f3"/>&gt;15d Available</span></div>
      <p>Final Total Slack values are synchronized from the native .mpp calculation. The objective is a realistic, resilient network—not artificially maximizing float.</p>
    </div>
  </div>
}
