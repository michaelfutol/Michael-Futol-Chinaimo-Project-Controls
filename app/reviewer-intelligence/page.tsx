'use client';

import { useEffect, useMemo, useState } from 'react';

type SessionEvent = {t:string|null;seq:number;event:string;path:string;href:string;label:string;asset:string;activeSeconds:number;depth:number;targetKind:string};
type Session = {sessionId:string;visitorId:string;country:string;platform:string;browser:string;device:string;source:string;firstAt:string|null;lastAt:string|null;activeSeconds:number;pageViews:number;technicalActions:number;downloads:number;maxDepth:number;score:number;behavior:string;events:SessionEvent[]};
type Totals = {sessions:number;technical:number;highDepth:number;activeSeconds:number;downloads:number};
type Payload = {configured:boolean;sessions:Session[];totals:Totals;reason?:string;error?:string};

const OWNER_KEY='chinaimo_owner_exempt';
const VERCEL_ANALYTICS='https://vercel.com/michael-futol-projects/michael-futol-chinaimo-project-controls/analytics';
const EMPTY_TOTALS:Totals={sessions:0,technical:0,highDepth:0,activeSeconds:0,downloads:0};
const fmtTime=(s:number)=>s<60?`${s}s`:`${Math.floor(s/60)}m ${Math.round(s%60)}s`;
const fmtDate=(iso:string|null)=>iso?new Date(iso).toLocaleString(undefined,{month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
const short=(id:string)=>id?`${id.slice(0,8)}…${id.slice(-5)}`:'—';

export default function ReviewerIntelligence(){
  const [owner,setOwner]=useState(false);
  const [data,setData]=useState<Payload|null>(null);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState<string|null>(null);

  const load=async()=>{
    setLoading(true);
    try{
      const r=await fetch('/api/reviewer-sessions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({limit:1500}),cache:'no-store'});
      const j=await r.json() as Payload;
      setData(j);
    }catch{
      setData({configured:true,sessions:[],totals:EMPTY_TOTALS,error:'Unable to load Reviewer Intelligence.'});
    }finally{setLoading(false)}
  };

  useEffect(()=>{
    try{
      const isOwner=localStorage.getItem(OWNER_KEY)==='1';
      setOwner(isOwner);
      if(isOwner) void load();
    }catch{}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const active=useMemo(()=>data?.sessions.find(s=>s.sessionId===selected)||null,[data,selected]);

  if(!owner){
    return <main className="owner-shell gate-only">
      <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
      <section className="gate-card">
        <div className="eyebrow">MUNIGEN / OWNER ANALYTICS</div>
        <h1>Private console</h1>
        <p>Return to the assessment and use the 1 → 3 → 7 owner gesture.</p>
        <a className="ghost-button" href="/">Return to assessment</a>
      </section>
      <OwnerStyles/>
    </main>;
  }

  const totals=data?.totals||EMPTY_TOTALS;

  return <main className="owner-shell">
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <div className="grid-haze"/>
    <div className="owner-wrap">
      <header className="topbar">
        <div>
          <div className="eyebrow">MUNIGEN / CHINAIMO / PRIVATE OWNER VIEW</div>
          <h1>Owner Analytics</h1>
          <p>Aggregate traffic and anonymous reviewer journeys in one quiet control room.</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" onClick={()=>void load()} disabled={loading}>{loading?'Refreshing…':'Refresh'}</button>
          <a className="ghost-button" href="/">Assessment</a>
        </div>
      </header>

      <section className="source-grid">
        <a className="source-card cyan" href={VERCEL_ANALYTICS} target="_blank" rel="noreferrer">
          <div className="source-icon">V</div>
          <div><span className="mini-label">VERCEL ANALYTICS</span><h2>Traffic overview</h2><p>Visitors, countries, devices, operating systems and page activity.</p></div>
          <span className="arrow">↗</span>
        </a>
        <div className="source-card violet">
          <div className="source-icon">M</div>
          <div><span className="mini-label">MUNIGEN REVIEWER INTELLIGENCE</span><h2>Session journeys</h2><p>Anonymous navigation order, active time, downloads and technical depth.</p></div>
          <span className="status-dot" title="Supabase persistent store"/>
        </div>
      </section>

      <section className="kpi-grid">
        {[
          ['Sessions',totals.sessions,'All anonymous sessions'],
          ['Technical',totals.technical,'Technical-review behavior'],
          ['High depth',totals.highDepth,'Strong technical engagement'],
          ['Active time',fmtTime(totals.activeSeconds),'Recorded active reading'],
          ['Downloads',totals.downloads,'Tracked evidence downloads']
        ].map(([label,value,sub],i)=><article className="kpi-card" key={String(label)}>
          <div className={`kpi-pip p${i}`}/><span>{label}</span><strong>{value}</strong><small>{sub}</small>
        </article>)}
      </section>

      {data?.error&&<section className="notice-card"><strong>Reviewer store unavailable</strong><span>{data.error}</span></section>}

      {!data?.error&&<section className="workspace">
        <div className="sessions-panel panel">
          <div className="panel-head"><div><span className="mini-label">RECENT ACTIVITY</span><h3>Reviewer sessions</h3></div><span className="live-badge"><i/>LIVE STORE</span></div>
          <div className="session-list">
            {!data&&<div className="empty-state">Loading reviewer sessions…</div>}
            {data&&data.sessions.length===0&&<div className="empty-state">No persisted reviewer sessions yet. New non-owner visits will appear here automatically.</div>}
            {data?.sessions.map(s=><button key={s.sessionId} onClick={()=>setSelected(s.sessionId)} className={`session-row ${selected===s.sessionId?'active':''}`}>
              <div className="session-place"><strong>{s.country}</strong><span>{s.device}</span></div>
              <div className="session-main"><strong>{s.platform} · {s.browser}</strong><span>{s.behavior} · {s.pageViews} pages · {fmtTime(s.activeSeconds)}</span><small>{fmtDate(s.firstAt)} · {short(s.sessionId)}</small></div>
              <div className="score"><strong>{s.score}</strong><span>DEPTH</span></div>
            </button>)}
          </div>
        </div>

        <aside className="journey-panel panel">
          <div className="panel-head"><div><span className="mini-label">SELECTED SESSION</span><h3>Journey</h3></div></div>
          {!active&&<div className="empty-state journey-empty">Select a reviewer session to inspect the path through the assessment.</div>}
          {active&&<>
            <div className="journey-summary">
              <div><span>LOCATION</span><strong>{active.country}</strong></div>
              <div><span>ENVIRONMENT</span><strong>{active.platform} · {active.browser}</strong></div>
              <div><span>ACTIVE</span><strong>{fmtTime(active.activeSeconds)}</strong></div>
              <div><span>CLASS</span><strong>{active.behavior}</strong></div>
            </div>
            <div className="timeline">
              {active.events.map((e,i)=><div className="event" key={`${e.seq}-${i}`}>
                <div className="event-rail"><span className={`node depth-${Math.min(3,e.depth)}`}/>{i<active.events.length-1&&<i/>}</div>
                <div className="event-body"><small>#{String(e.seq||i+1).padStart(2,'0')} · {e.event}</small><strong>{e.path||e.href||e.asset||e.event}</strong><span>{e.targetKind||'page'}{e.activeSeconds?` · ${fmtTime(e.activeSeconds)}`:''}</span>{e.label&&<em>{e.label}</em>}</div>
              </div>)}
            </div>
          </>}
        </aside>
      </section>}

      <footer>COARSE COUNTRY / OS / BROWSER / DEVICE + RANDOM FIRST-PARTY SESSION IDS ONLY · NO NAME · NO EMAIL · NO IP DISPLAY</footer>
    </div>
    <OwnerStyles/>
  </main>;
}

function OwnerStyles(){
  return <style>{`
    :root{color-scheme:dark}
    html,body{margin:0;background:#070b12}
    *{box-sizing:border-box}
    .owner-shell{--bg:#070b12;--panel:#0e1521;--panel2:#111b2a;--line:rgba(148,171,204,.14);--text:#edf4ff;--muted:#8b9bb2;--cyan:#69d3ff;--violet:#9d8cff;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 18% -5%,rgba(60,150,200,.10),transparent 34%),radial-gradient(circle at 92% 0%,rgba(118,82,220,.10),transparent 30%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .owner-wrap{position:relative;z-index:2;max-width:1480px;margin:0 auto;padding:38px 36px 56px}
    .ambient{position:absolute;border-radius:999px;filter:blur(90px);opacity:.16;pointer-events:none}.ambient-a{width:360px;height:360px;background:#34b9eb;left:-170px;top:140px}.ambient-b{width:420px;height:420px;background:#765cff;right:-240px;top:260px}
    .grid-haze{position:absolute;inset:0;pointer-events:none;opacity:.12;background-image:linear-gradient(rgba(140,170,205,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(140,170,205,.07) 1px,transparent 1px);background-size:56px 56px;mask-image:linear-gradient(to bottom,black,transparent 72%)}
    .topbar{display:flex;justify-content:space-between;align-items:flex-end;gap:28px;padding:8px 2px 28px;border-bottom:1px solid var(--line)}
    .eyebrow,.mini-label{font:700 10px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.13em;color:#7d92aa}.topbar h1{margin:8px 0 5px;font-size:clamp(34px,5vw,58px);line-height:1;font-weight:620;letter-spacing:-.04em}.topbar p{margin:0;color:var(--muted);font-size:15px}
    .header-actions{display:flex;gap:8px}.ghost-button{appearance:none;border:1px solid rgba(151,174,207,.18);background:rgba(15,23,36,.72);color:#dbe7f7;text-decoration:none;border-radius:12px;padding:11px 15px;font-weight:650;font-size:12px;cursor:pointer;backdrop-filter:blur(12px);transition:.18s ease}.ghost-button:hover{border-color:rgba(105,211,255,.42);background:rgba(24,36,54,.88);transform:translateY(-1px)}.ghost-button:disabled{opacity:.55;cursor:wait}
    .source-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.source-card{position:relative;display:grid;grid-template-columns:42px 1fr auto;gap:15px;align-items:center;padding:19px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,rgba(17,27,42,.94),rgba(11,18,29,.88));color:inherit;text-decoration:none;overflow:hidden}.source-card:before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.025),transparent 70%)}.source-card.cyan{box-shadow:inset 0 1px rgba(255,255,255,.025),0 18px 55px rgba(0,0,0,.16)}.source-card.violet{box-shadow:inset 0 1px rgba(255,255,255,.025),0 18px 55px rgba(0,0,0,.16)}.source-icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:#0a1019;border:1px solid var(--line);font-weight:800}.cyan .source-icon{color:var(--cyan);box-shadow:0 0 24px rgba(105,211,255,.08)}.violet .source-icon{color:var(--violet);box-shadow:0 0 24px rgba(157,140,255,.08)}.source-card h2{margin:5px 0 3px;font-size:19px;letter-spacing:-.02em}.source-card p{margin:0;color:var(--muted);font-size:13px;line-height:1.5}.arrow{font-size:20px;color:var(--cyan)}.status-dot{width:9px;height:9px;border-radius:50%;background:#69e6b1;box-shadow:0 0 16px rgba(105,230,177,.65)}
    .kpi-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:12px}.kpi-card{position:relative;padding:16px;border:1px solid var(--line);border-radius:16px;background:rgba(14,21,33,.78);backdrop-filter:blur(14px);overflow:hidden}.kpi-card>span{display:block;color:#8193aa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}.kpi-card strong{display:block;margin:7px 0 4px;font-size:28px;line-height:1;font-weight:650;letter-spacing:-.035em}.kpi-card small{color:#73839a;font-size:11px}.kpi-pip{position:absolute;left:0;top:0;bottom:0;width:2px}.p0,.p3{background:#69d3ff}.p1{background:#6ee7b7}.p2{background:#9d8cff}.p4{background:#f7b977}
    .notice-card{margin-top:12px;padding:18px;border:1px solid rgba(247,185,119,.2);border-radius:14px;background:rgba(92,60,25,.13);display:flex;gap:10px;flex-direction:column}.notice-card span{color:#b9a68f}
    .workspace{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(380px,.85fr);gap:12px;margin-top:12px;align-items:start}.panel{border:1px solid var(--line);border-radius:18px;background:rgba(12,19,30,.84);backdrop-filter:blur(18px);overflow:hidden}.panel-head{display:flex;justify-content:space-between;align-items:center;padding:15px 16px;border-bottom:1px solid var(--line)}.panel-head h3{margin:4px 0 0;font-size:17px;letter-spacing:-.02em}.live-badge{display:flex;align-items:center;gap:7px;color:#88a0b6;font-size:9px;font-weight:800;letter-spacing:.08em}.live-badge i{width:6px;height:6px;border-radius:50%;background:#69e6b1;box-shadow:0 0 12px rgba(105,230,177,.8)}
    .session-list{max-height:68vh;overflow:auto}.session-row{width:100%;display:grid;grid-template-columns:90px 1fr 72px;gap:12px;padding:14px 16px;border:0;border-bottom:1px solid rgba(148,171,204,.085);background:transparent;color:var(--text);text-align:left;cursor:pointer;transition:.16s ease}.session-row:hover{background:rgba(105,211,255,.035)}.session-row.active{background:linear-gradient(90deg,rgba(105,211,255,.075),rgba(157,140,255,.025));box-shadow:inset 2px 0 var(--cyan)}.session-place strong{display:block;color:#cfe9f5;font-size:12px}.session-place span,.session-main span,.session-main small{display:block;color:#788a9f}.session-place span{font-size:10px;margin-top:4px}.session-main strong{display:block;font-size:13px}.session-main span{font-size:11.5px;margin-top:3px}.session-main small{font-size:10px;margin-top:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.score{text-align:right}.score strong{display:block;font-size:20px;color:#8ddfff}.score span{font-size:8px;color:#67798f;font-weight:800;letter-spacing:.11em}
    .journey-panel{position:sticky;top:16px}.journey-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:14px 15px;border-bottom:1px solid var(--line)}.journey-summary div{padding:10px;border-radius:12px;background:rgba(18,29,45,.75)}.journey-summary span{display:block;font-size:8px;font-weight:800;letter-spacing:.1em;color:#6f8298}.journey-summary strong{display:block;margin-top:4px;font-size:11.5px;color:#dce8f8}.timeline{max-height:54vh;overflow:auto;padding:15px 15px 20px}.event{display:grid;grid-template-columns:24px 1fr;gap:10px}.event-rail{position:relative;display:flex;justify-content:center}.event-rail i{position:absolute;top:18px;bottom:-8px;width:1px;background:rgba(136,160,190,.14)}.node{position:relative;z-index:2;width:8px;height:8px;margin-top:5px;border-radius:50%;background:#66778e;box-shadow:0 0 0 4px rgba(102,119,142,.06)}.depth-1{background:#7f9db2}.depth-2{background:#9d8cff;box-shadow:0 0 14px rgba(157,140,255,.35)}.depth-3{background:#69d3ff;box-shadow:0 0 14px rgba(105,211,255,.4)}.event-body{padding:0 0 17px}.event-body small{display:block;color:#65778e;font:700 8.5px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em}.event-body strong{display:block;margin-top:4px;font-size:12.5px;word-break:break-word}.event-body span{display:block;margin-top:3px;color:#788a9f;font-size:10.5px}.event-body em{display:block;margin-top:4px;color:#8ca0b5;font-size:10.5px;font-style:normal}.empty-state{padding:30px;color:#74869c;font-size:13px;line-height:1.6}.journey-empty{min-height:220px;display:grid;place-items:center;text-align:center}
    footer{padding:20px 2px 4px;color:#53657a;font:700 8.5px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.07em}.gate-only{display:grid;place-items:center;padding:24px}.gate-card{position:relative;z-index:2;width:min(520px,100%);padding:30px;border:1px solid var(--line);border-radius:20px;background:rgba(14,21,33,.88);box-shadow:0 25px 90px rgba(0,0,0,.38);backdrop-filter:blur(18px)}.gate-card h1{margin:8px 0 5px;font-size:36px;letter-spacing:-.04em}.gate-card p{color:var(--muted);line-height:1.6;margin:0 0 18px}
    @media(max-width:1000px){.kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.workspace{grid-template-columns:1fr}.journey-panel{position:static}.source-grid{grid-template-columns:1fr}}
    @media(max-width:640px){.owner-wrap{padding:25px 16px 42px}.topbar{align-items:flex-start;flex-direction:column}.header-actions{width:100%}.ghost-button{flex:1;text-align:center}.kpi-grid{grid-template-columns:1fr 1fr}.session-row{grid-template-columns:66px 1fr 52px}.journey-summary{grid-template-columns:1fr}.source-card{grid-template-columns:38px 1fr auto}}
  `}</style>;
}
