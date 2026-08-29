'use client';

import { useMemo, useState } from 'react';

type Scenario = {
  id:string; name:string; activity:string; reportedDelay:number; baselineCritical:string;
  baselineFinish:string; forecastFinish:string; netImpact:number; result:string; why:string;
  planningResponse?:string; residualRisk?:string;
};
type Activity = {
  id:string; wbs:string; name:string; duration:number; predecessors:string; relationships:string;
  workstream:string; baselineStart:string; baselineFinish:string; totalSlackDays:number; critical:boolean;
};

type View='BASE'|'A'|'B'|'C'|'D';

const isoDate=(value:string)=>new Date(`${value}T00:00:00`);
const addWorkingDays=(iso:string,days:number)=>{
  const d=isoDate(iso);
  let remaining=Math.max(0,days);
  while(remaining>0){
    d.setDate(d.getDate()+1);
    if(d.getDay()!==0) remaining--;
  }
  return d.toISOString().slice(0,10);
};

const keyWatchIds=['PROC-010','PROC-030','RES-030','BLDG-030','SAL-020','PWR-030'];

export default function ScheduleExplorer({schedule,scenarios,criticalPath,statusDate}:{schedule:Activity[];scenarios:Scenario[];criticalPath:string[];statusDate:string}){
  const [view,setView]=useState<View>('BASE');
  const selected=view==='BASE'?null:scenarios.find(s=>s.id===view)!;
  const first=schedule.reduce((a,b)=>a.baselineStart<b.baselineStart?a:b);
  const completion=schedule.find(a=>a.id==='COMM-080')!;
  const baselineEnd=isoDate(completion.baselineFinish);
  const forecastEnd=selected?isoDate(selected.forecastFinish):baselineEnd;
  const start=isoDate(first.baselineStart);
  const horizon=Math.max(baselineEnd.getTime(),forecastEnd.getTime())-start.getTime();
  const pos=(d:string)=>Math.max(0,Math.min(100,((isoDate(d).getTime()-start.getTime())/horizon)*100));

  const selectedIds=useMemo(()=>{
    if(!selected) return new Set<string>();
    return new Set((selected.activity.match(/[A-Z]+(?:-[A-Z]+)*-\d+/g)||[]));
  },[selected]);

  const criticalDelay=view==='A'||view==='C';
  const shiftStart=criticalDelay?criticalPath.indexOf('WTP-CIV-060'):-1;
  const shifted=(a:Activity)=>shiftStart>=0&&criticalPath.indexOf(a.id)>=shiftStart;
  const scenarioShift=selected?.netImpact||0;
  const display=schedule.filter(a=>a.critical||keyWatchIds.includes(a.id));

  const branchSets=[
    {name:'Controlling WTP / Commissioning Path',tone:'critical',ids:criticalPath},
    {name:'Reservoir Parallel Path',tone:'parallel',ids:['RES-010','RES-020','RES-030','RES-040','RES-050','RES-060']},
    {name:'Power / Energization Watch',tone:'watch',ids:['PWR-010','PWR-020','PWR-030','PWR-040','COMM-020']},
    {name:'Salakham Parallel Path',tone:'parallel',ids:['SAL-010','SAL-020','SAL-030','SAL-040','COMM-040']},
  ];

  const floatWatch=schedule.filter(a=>!a.critical).sort((a,b)=>a.totalSlackDays-b.totalSlackDays).slice(0,8);

  return <div className="scheduleExplorer">
    <div className="viewTabs scenarioTabs" role="tablist" aria-label="Schedule scenarios">
      <button className={view==='BASE'?'active':''} onClick={()=>setView('BASE')}>Baseline</button>
      {scenarios.map(s=><button key={s.id} className={view===s.id?'active':''} onClick={()=>setView(s.id as View)}>Scenario {s.id}</button>)}
    </div>

    <div className="scenarioSummary">
      <div className="scenarioName"><small>SELECTED VIEW</small><b>{selected?selected.name:'Baseline Programme'}</b><span>{selected?selected.activity:'Native Microsoft Project baseline and saved baseline fields'}</span></div>
      <div><small>BASELINE FINISH</small><b>{selected?.baselineFinish||completion.baselineFinish}</b></div>
      <div><small>FORECAST FINISH</small><b className={selected&&selected.netImpact>0?'negative':''}>{selected?.forecastFinish||completion.baselineFinish}</b></div>
      <div><small>NET IMPACT</small><b className={selected&&selected.netImpact>0?'negative':'positive'}>{selected?`${selected.netImpact>0?'+':''}${selected.netImpact} wd`:'0 wd'}</b></div>
    </div>

    {selected&&<div className={`resultBanner ${selected.netImpact>0?'resultDelay':'resultNoDelay'}`}>
      <div><small>RESULT</small><strong>{selected.result}</strong></div>
      <div className="resultFacts"><span><b>{selected.reportedDelay}</b> reported wd</span><span><b>{selected.baselineCritical}</b> baseline critical?</span><span><b>{selected.netImpact}</b> net project wd</span></div>
    </div>}

    <div className="ganttShell">
      <div className="vizTitle"><div><small>TRACKING GANTT / BASELINE VS UPDATED</small><b>{selected?'Scenario recalculation view':'Native baseline schedule view'}</b></div><div className="vizLegend"><span><i className="legendBase"/>Baseline / non-critical</span><span><i className="legendCritical"/>Critical</span><span><i className="legendDelay"/>Affected</span></div></div>
      <div className="ganttWrap scenarioGantt">
        <div className="ganttHead"><span>Activity</span><span>Sep 2026</span><span>2027</span><span>2028</span><span>Jan 2029</span></div>
        {display.map(a=>{
          const isShifted=shifted(a)&&scenarioShift>0;
          const startDate=isShifted?addWorkingDays(a.baselineStart,scenarioShift):a.baselineStart;
          const finishDate=isShifted?addWorkingDays(a.baselineFinish,scenarioShift):a.baselineFinish;
          const left=pos(startDate), right=pos(finishDate), width=Math.max(a.duration===0?.7:right-left,.7);
          const selectedActivity=selectedIds.has(a.id);
          return <div className="ganttRow" key={a.id}>
            <div className="ganttLabel"><b>{a.id}</b><span>{a.name}</span>{selectedActivity&&<em>AFFECTED</em>}</div>
            <div className="ganttTrack">
              {selected&&isShifted&&<div className="baselineGhost" style={{left:`${pos(a.baselineStart)}%`,width:`${Math.max(pos(a.baselineFinish)-pos(a.baselineStart),.7)}%`}}/>}
              <div className={`${a.critical?'ganttBar criticalBar':'ganttBar'} ${selectedActivity?'selectedDelay':''}`} style={{left:`${left}%`,width:`${width}%`}}/>
              <div className="dataDate" style={{left:`${pos(statusDate)}%`}} title={`Data date ${statusDate}`}/>
            </div>
          </div>
        })}
      </div>
    </div>

    <div className="networkCard">
      <div className="networkTitle"><div><small>ADVANCED SCHEDULE EVIDENCE</small><b>Controlling path plus parallel watch paths</b></div><span className="networkLegend"><i/>Critical / controlling</span></div>
      <div className="networkLanes">
        {branchSets.map(branch=><div className={`networkLane ${branch.tone}`} key={branch.name}>
          <div className="laneLabel"><b>{branch.name}</b><small>{branch.tone==='critical'?'Current controlling chain':'Parallel interface path'}</small></div>
          <div className="networkScroller"><div className="networkChain">
            {branch.ids.map((id,i)=>{
              const a=schedule.find(x=>x.id===id); if(!a) return null;
              const hit=selectedIds.has(id);
              return <div className="networkItem" key={id}><div className={`networkNode ${hit?'delayNode':''} ${a.critical?'criticalNode':''}`}><code>{id}</code><span>{a.name}</span><small>{a.duration} wd · slack {a.totalSlackDays} wd</small></div>{i<branch.ids.length-1&&<b className="networkArrow">→</b>}</div>
            })}
          </div></div>
        </div>)}
      </div>
    </div>

    <div className="floatPanel">
      <div><small>FLOAT / SLACK HEALTH</small><b>Native Microsoft Project Total Slack</b></div>
      <div className="floatBands"><span><i className="f0"/>0d Critical</span><span><i className="f1"/>1–5d Near-critical</span><span><i className="f2"/>6–15d Watch</span><span><i className="f3"/>&gt;15d Available</span></div>
      <div className="floatWatchGrid">{floatWatch.map(a=><div key={a.id}><code>{a.id}</code><span>{a.name}</span><b>{a.totalSlackDays} wd</b></div>)}</div>
      <p>Total Slack and Critical fields are read from the recalculated Microsoft Project baseline and mirrored by Activity ID.</p>
    </div>

    {selected&&<div className="scenarioCommentary">
      <div><small>WHY / DECISION BASIS</small><p>{selected.why}</p></div>
      {selected.planningResponse&&<div><small>PLANNING RESPONSE / CONTROL ACTION</small><p>{selected.planningResponse}</p></div>}
      {selected.residualRisk&&<div><small>RESIDUAL RISK / WATCH ITEM</small><p>{selected.residualRisk}</p></div>}
    </div>}
  </div>
}
