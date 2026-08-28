'use client';

import { useMemo, useState } from 'react';

type ProgressRow = { period:string; planned:number; actual:number|null };

type ViewMode = 'CURVE'|'VARIANCE'|'MONTHLY';

const moneyless = (n:number) => `${n.toFixed(1)}%`;

export default function ProgressExplorer({rows,statusDate}:{rows:ProgressRow[];statusDate:string}){
  const [mode,setMode]=useState<ViewMode>('CURVE');
  const width=980, height=330, padX=52, padTop=22, padBottom=48;
  const chartH=height-padTop-padBottom;
  const x=(i:number)=>padX+(i/(rows.length-1))*(width-padX*2);
  const y=(v:number)=>padTop+chartH-(v/100)*chartH;
  const planned=rows.map((r,i)=>`${x(i)},${y(r.planned)}`).join(' ');
  const actualRows=rows.filter(r=>r.actual!==null);
  const actual=actualRows.map((r,i)=>`${x(i)},${y(Number(r.actual))}`).join(' ');
  const varianceRows=useMemo(()=>actualRows.map(r=>({...r,variance:Number(r.actual)-r.planned})),[actualRows]);
  const maxVar=Math.max(10,Math.ceil(Math.max(...varianceRows.map(r=>Math.abs(r.variance)))/2)*2);
  const monthlyRows=useMemo(()=>rows.map((r,i)=>({
    period:r.period,
    planned:i===0?r.planned:r.planned-rows[i-1].planned,
    actual:r.actual===null?null:i===0?Number(r.actual):Number(r.actual)-Number(rows[i-1].actual ?? 0),
  })),[rows]);
  const dataDateIndex=Math.max(0,rows.findIndex(r=>r.period===statusDate.slice(0,7)));

  return <div className="progressExplorer">
    <div className="viewTabs progressTabs" role="tablist" aria-label="Progress views">
      <button className={mode==='CURVE'?'active':''} onClick={()=>setMode('CURVE')}>S-Curve</button>
      <button className={mode==='VARIANCE'?'active':''} onClick={()=>setMode('VARIANCE')}>Variance</button>
      <button className={mode==='MONTHLY'?'active':''} onClick={()=>setMode('MONTHLY')}>Monthly Progress</button>
    </div>

    {mode==='CURVE'&&<div className="chartCard progressChart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Planned versus actual cumulative progress">
        {[0,20,40,60,80,100].map(v=><g key={v}>
          <line x1={padX} y1={y(v)} x2={width-padX} y2={y(v)} className="gridline"/>
          <text x="8" y={y(v)+4} className="axisText">{v}%</text>
        </g>)}
        <polyline points={planned} className="plannedLine"/>
        <polyline points={actual} className="actualLine"/>
        {actualRows.map((r,i)=><circle key={r.period} cx={x(i)} cy={y(Number(r.actual))} r="3.5" className="actualDot"/>)}
        <line x1={x(dataDateIndex)} y1={padTop} x2={x(dataDateIndex)} y2={height-padBottom} className="statusLine"/>
        <text x={x(dataDateIndex)+7} y={padTop+14} className="statusText">DATA DATE</text>
        {rows.filter((_,i)=>i%3===0||i===rows.length-1).map(r=>{
          const i=rows.indexOf(r); return <text key={r.period} x={x(i)} y={height-15} textAnchor="middle" className="axisText">{r.period.slice(2)}</text>
        })}
      </svg>
      <div className="legend"><span><i className="planSwatch"/>Baseline Planned</span><span><i className="actualSwatch"/>Measured Actual</span><strong>Data date: {statusDate}</strong></div>
    </div>}

    {mode==='VARIANCE'&&<div className="varianceChart" aria-label="Monthly cumulative variance">
      <div className="varianceScale"><span>0 pp</span><span>−{maxVar} pp</span></div>
      <div className="varianceBars">{varianceRows.map(r=>{
        const heightPct=Math.min(100,(Math.abs(r.variance)/maxVar)*100);
        return <div className="varianceCol" key={r.period} title={`${r.period}: ${r.variance.toFixed(3)} pp`}>
          <div className="varianceBarWrap"><div className="varianceBar" style={{height:`${heightPct}%`}}/></div>
          <small>{r.period.slice(5)}</small>
        </div>
      })}</div>
      <div className="varianceNote"><b>{varianceRows.at(-1)?.variance.toFixed(3)} pp</b><span>cumulative variance at the current data date</span></div>
    </div>}

    {mode==='MONTHLY'&&<div className="monthlyProgressGrid">
      {monthlyRows.filter(r=>r.actual!==null).map(r=><div key={r.period} className="monthlyCard">
        <small>{r.period}</small><div><span>Plan</span><b>{moneyless(r.planned)}</b></div><div><span>Actual</span><b>{moneyless(Number(r.actual))}</b></div>
      </div>)}
    </div>}

    <div className="integrityBar"><b>Progress authority</b><span>Completed BOQ quantities → earned value weighting → monthly actual progress → payment claim</span><code>Same BOQ_ID set</code></div>
  </div>
}
