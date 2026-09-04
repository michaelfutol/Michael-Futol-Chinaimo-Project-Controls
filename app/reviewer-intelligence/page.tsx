'use client';

import { useEffect, useMemo, useState } from 'react';

type SessionEvent = {t:string|null;seq:number;event:string;path:string;href:string;label:string;asset:string;activeSeconds:number;depth:number;targetKind:string};
type Session = {sessionId:string;visitorId:string;country:string;platform:string;browser:string;device:string;source:string;firstAt:string|null;lastAt:string|null;activeSeconds:number;pageViews:number;technicalActions:number;downloads:number;maxDepth:number;score:number;behavior:string;events:SessionEvent[]};
type Totals = {sessions:number;technical:number;highDepth:number;activeSeconds:number;downloads:number};
type Payload = {configured:boolean;sessions:Session[];totals:Totals;reason?:string;error?:string};
type ViewMode = 'classic'|'hybrid';

const OWNER_KEY='chinaimo_owner_exempt';
const VIEW_KEY='chinaimo_analytics_view';
const LIGHTS_KEY='chinaimo_festive_lights';
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
  const [view,setView]=useState<ViewMode>('hybrid');
  const [lights,setLights]=useState(true);

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
      const storedView=localStorage.getItem(VIEW_KEY);
      const storedLights=localStorage.getItem(LIGHTS_KEY);
      setOwner(isOwner);
      setView(storedView==='classic'?'classic':'hybrid');
      setLights(storedLights!=='off');
      if(isOwner) void load();
    }catch{}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const active=useMemo(()=>data?.sessions.find(s=>s.sessionId===selected)||null,[data,selected]);
  const setViewMode=(next:ViewMode)=>{setView(next);try{localStorage.setItem(VIEW_KEY,next)}catch{}};
  const toggleLights=()=>setLights(prev=>{const next=!prev;try{localStorage.setItem(LIGHTS_KEY,next?'on':'off')}catch{}return next;});

  if(!owner){
    return <main className="owner-shell gate-only">
      <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
      <section className="gate-card">
        <div className="eyebrow">MUNIGEN / ANALYTICS</div>
        <h1>Private console</h1>
        <p>Return to the assessment and use the 1 → 3 → 7 gesture.</p>
        <a className="ghost-button" href="/">Return to assessment</a>
      </section>
      <OwnerStyles/>
    </main>;
  }

  const totals=data?.totals||EMPTY_TOTALS;
  const hybrid=view==='hybrid';

  return <main className={`owner-shell ${hybrid?'hybrid-shell':'classic-shell'}`}>
    {hybrid&&lights&&<FestiveLights/>}
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/><div className="ambient ambient-c"/>
    <div className="grid-haze"/>
    {hybrid&&<div className="notebook-trace" aria-hidden="true"/>}
    <div className="owner-wrap">
      <header className="topbar">
        <div>
          <div className="eyebrow">MUNIGEN / CHINAIMO / ANALYTICS</div>
          <h1>Analytics Console</h1>
          <p>Traffic, reviewer journeys and engagement signals in one control room.</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" onClick={()=>void load()} disabled={loading}>{loading?'Refreshing…':'Refresh'}</button>
          <a className="ghost-button" href="/">Assessment</a>
          {hybrid&&<button className="ghost-button seasonal-button" onClick={toggleLights}>{lights?'Lights Off':'Lights On'}</button>}
          <button className="ghost-button revert-button" onClick={()=>setViewMode(hybrid?'classic':'hybrid')}>{hybrid?'Revert to Classic':'Return to Hybrid'}</button>
        </div>
      </header>

      {hybrid&&<div className="hybrid-notes" aria-hidden="true">
        <span>FIELD NOTE // aggregate ↔ reviewer path</span><span>trace / evidence / time</span><span>137 · control surface</span>
      </div>}

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
            {data&&data.sessions.length===0&&<div className="empty-state"><span className="empty-mark">◌</span><strong>No persisted reviewer sessions yet.</strong><small>New non-owner visits will appear here automatically.</small></div>}
            {data?.sessions.map(s=><button key={s.sessionId} onClick={()=>setSelected(s.sessionId)} className={`session-row ${selected===s.sessionId?'active':''}`}>
              <div className="session-place"><strong>{s.country}</strong><span>{s.device}</span></div>
              <div className="session-main"><strong>{s.platform} · {s.browser}</strong><span>{s.behavior} · {s.pageViews} pages · {fmtTime(s.activeSeconds)}</span><small>{fmtDate(s.firstAt)} · {short(s.sessionId)}</small></div>
              <div className="score"><strong>{s.score}</strong><span>DEPTH</span></div>
            </button>)}
          </div>
        </div>

        <aside className="journey-panel panel">
          <div className="panel-head"><div><span className="mini-label">SELECTED SESSION</span><h3>Journey</h3></div></div>
          {!active&&<div className="empty-state journey-empty"><span className="empty-mark">⌁</span><strong>No session selected.</strong><small>Select a reviewer session to inspect the path through the assessment.</small></div>}
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

function FestiveLights(){
  return <div className="festive-lights" aria-hidden="true"><div className="festive-wire"/>{Array.from({length:28},(_,i)=><span key={i} className={`bulb bulb-${i%5}`} style={{animationDelay:`${(i%9)*.17}s`}}/>)}</div>;
}

function OwnerStyles(){
  return <style>{`
    :root{color-scheme:dark}
    html,body{margin:0;background:#070b12}
    *{box-sizing:border-box}
    .owner-shell{--bg:#070b12;--panel:#0e1521;--panel2:#111b2a;--line:rgba(148,171,204,.14);--text:#edf4ff;--muted:#8b9bb2;--cyan:#69d3ff;--violet:#9d8cff;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 18% -5%,rgba(60,150,200,.10),transparent 34%),radial-gradient(circle at 92% 0%,rgba(118,82,220,.10),transparent 30%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .owner-wrap{position:relative;z-index:2;max-width:1480px;margin:0 auto;padding:38px 36px 56px}
    .ambient{position:absolute;border-radius:999px;filter:blur(90px);opacity:.16;pointer-events:none}.ambient-a{width:360px;height:360px;background:#34b9eb;left:-170px;top:140px}.ambient-b{width:420px;height:420px;background:#765cff;right:-240px;top:260px}.ambient-c{display:none}
    .grid-haze{position:absolute;inset:0;pointer-events:none;opacity:.12;background-image:linear-gradient(rgba(140,170,205,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(140,170,205,.07) 1px,transparent 1px);background-size:56px 56px;mask-image:linear-gradient(to bottom,black,transparent 72%)}
    .topbar{display:flex;justify-content:space-between;align-items:flex-end;gap:28px;padding:8px 2px 28px;border-bottom:1px solid var(--line)}
    .eyebrow,.mini-label{font:700 10px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.13em;color:#7d92aa}.topbar h1{margin:8px 0 5px;font-size:clamp(34px,5vw,58px);line-height:1;font-weight:620;letter-spacing:-.04em}.topbar p{margin:0;color:var(--muted);font-size:15px}
    .header-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.ghost-button{appearance:none;border:1px solid rgba(151,174,207,.18);background:rgba(15,23,36,.72);color:#dbe7f7;text-decoration:none;border-radius:12px;padding:11px 15px;font-weight:650;font-size:12px;cursor:pointer;backdrop-filter:blur(12px);transition:.18s ease}.ghost-button:hover{border-color:rgba(105,211,255,.42);background:rgba(24,36,54,.88);transform:translateY(-1px)}.ghost-button:disabled{opacity:.55;cursor:wait}
    .source-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.source-card{position:relative;display:grid;grid-template-columns:42px 1fr auto;gap:15px;align-items:center;padding:19px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,rgba(17,27,42,.94),rgba(11,18,29,.88));color:inherit;text-decoration:none;overflow:hidden}.source-card:before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.025),transparent 70%)}.source-card.cyan{box-shadow:inset 0 1px rgba(255,255,255,.025),0 18px 55px rgba(0,0,0,.16)}.source-card.violet{box-shadow:inset 0 1px rgba(255,255,255,.025),0 18px 55px rgba(0,0,0,.16)}.source-icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:#0a1019;border:1px solid var(--line);font-weight:800}.cyan .source-icon{color:var(--cyan);box-shadow:0 0 24px rgba(105,211,255,.08)}.violet .source-icon{color:var(--violet);box-shadow:0 0 24px rgba(157,140,255,.08)}.source-card h2{margin:5px 0 3px;font-size:19px;letter-spacing:-.02em}.source-card p{margin:0;color:var(--muted);font-size:13px;line-height:1.5}.arrow{font-size:20px;color:var(--cyan)}.status-dot{width:9px;height:9px;border-radius:50%;background:#69e6b1;box-shadow:0 0 16px rgba(105,230,177,.65)}
    .kpi-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:12px}.kpi-card{position:relative;padding:16px;border:1px solid var(--line);border-radius:16px;background:rgba(14,21,33,.78);backdrop-filter:blur(14px);overflow:hidden}.kpi-card>span{display:block;color:#8193aa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}.kpi-card strong{display:block;margin:7px 0 4px;font-size:28px;line-height:1;font-weight:650;letter-spacing:-.035em}.kpi-card small{color:#73839a;font-size:11px}.kpi-pip{position:absolute;left:0;top:0;bottom:0;width:2px}.p0,.p3{background:#69d3ff}.p1{background:#6ee7b7}.p2{background:#9d8cff}.p4{background:#f7b977}
    .notice-card{margin-top:12px;padding:18px;border:1px solid rgba(247,185,119,.2);border-radius:14px;background:rgba(92,60,25,.13);display:flex;gap:10px;flex-direction:column}.notice-card span{color:#b9a68f}
    .workspace{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(380px,.85fr);gap:12px;margin-top:12px;align-items:start}.panel{border:1px solid var(--line);border-radius:18px;background:rgba(12,19,30,.84);backdrop-filter:blur(18px);overflow:hidden}.panel-head{display:flex;justify-content:space-between;align-items:center;padding:15px 16px;border-bottom:1px solid var(--line)}.panel-head h3{margin:4px 0 0;font-size:17px;letter-spacing:-.02em}.live-badge{display:flex;align-items:center;gap:7px;color:#88a0b6;font-size:9px;font-weight:800;letter-spacing:.08em}.live-badge i{width:6px;height:6px;border-radius:50%;background:#69e6b1;box-shadow:0 0 12px rgba(105,230,177,.8)}
    .session-list{max-height:68vh;overflow:auto}.session-row{width:100%;display:grid;grid-template-columns:90px 1fr 72px;gap:12px;padding:14px 16px;border:0;border-bottom:1px solid rgba(148,171,204,.085);background:transparent;color:var(--text);text-align:left;cursor:pointer;transition:.16s ease}.session-row:hover{background:rgba(105,211,255,.035)}.session-row.active{background:linear-gradient(90deg,rgba(105,211,255,.075),rgba(157,140,255,.025));box-shadow:inset 2px 0 var(--cyan)}.session-place strong{display:block;color:#cfe9f5;font-size:12px}.session-place span,.session-main span,.session-main small{display:block;color:#788a9f}.session-place span{font-size:10px;margin-top:4px}.session-main strong{display:block;font-size:13px}.session-main span{font-size:11.5px;margin-top:3px}.session-main small{font-size:10px;margin-top:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.score{text-align:right}.score strong{display:block;font-size:20px;color:#8ddfff}.score span{font-size:8px;color:#67798f;font-weight:800;letter-spacing:.11em}
    .journey-panel{position:sticky;top:16px}.journey-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:14px 15px;border-bottom:1px solid var(--line)}.journey-summary div{padding:10px;border-radius:12px;background:rgba(18,29,45,.75)}.journey-summary span{display:block;font-size:8px;font-weight:800;letter-spacing:.1em;color:#6f8298}.journey-summary strong{display:block;margin-top:4px;font-size:11.5px;color:#dce8f8}.timeline{max-height:54vh;overflow:auto;padding:15px 15px 20px}.event{display:grid;grid-template-columns:24px 1fr;gap:10px}.event-rail{position:relative;display:flex;justify-content:center}.event-rail i{position:absolute;top:18px;bottom:-8px;width:1px;background:rgba(136,160,190,.14)}.node{position:relative;z-index:2;width:8px;height:8px;margin-top:5px;border-radius:50%;background:#66778e;box-shadow:0 0 0 4px rgba(102,119,142,.06)}.depth-1{background:#7f9db2}.depth-2{background:#9d8cff;box-shadow:0 0 14px rgba(157,140,255,.35)}.depth-3{background:#69d3ff;box-shadow:0 0 14px rgba(105,211,255,.4)}.event-body{padding:0 0 17px}.event-body small{display:block;color:#65778e;font:700 8.5px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em}.event-body strong{display:block;margin-top:4px;font-size:12.5px;word-break:break-word}.event-body span{display:block;margin-top:3px;color:#788a9f;font-size:10.5px}.event-body em{display:block;margin-top:4px;color:#8ca0b5;font-size:10.5px;font-style:normal}.empty-state{padding:30px;color:#74869c;font-size:13px;line-height:1.6}.empty-state strong,.empty-state small{display:block}.empty-state small{margin-top:6px;color:#65778d}.journey-empty{min-height:220px;display:grid;place-items:center;text-align:center;align-content:center}.empty-mark{display:block;margin:0 auto 12px;font:400 30px/1 Georgia,serif;color:#73879e}
    footer{padding:20px 2px 4px;color:#53657a;font:700 8.5px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.07em}.gate-only{display:grid;place-items:center;padding:24px}.gate-card{position:relative;z-index:2;width:min(520px,100%);padding:30px;border:1px solid var(--line);border-radius:20px;background:rgba(14,21,33,.88);box-shadow:0 25px 90px rgba(0,0,0,.38);backdrop-filter:blur(18px)}.gate-card h1{margin:8px 0 5px;font-size:36px;letter-spacing:-.04em}.gate-card p{color:var(--muted);line-height:1.6;margin:0 0 18px}

    /* Lum + Stitch synthesis: A typography + B notebook restraint + C atmosphere. */
    .hybrid-shell{--bg:#090c10;--panel:#11161b;--panel2:#151b21;--line:rgba(201,196,171,.16);--text:#eeeade;--muted:#9aa2a6;--cyan:#69d7df;--violet:#aaa0cf;background:radial-gradient(ellipse at 16% -8%,rgba(55,137,146,.14),transparent 34%),radial-gradient(ellipse at 88% 10%,rgba(122,103,162,.11),transparent 34%),radial-gradient(ellipse at 48% 103%,rgba(180,147,79,.07),transparent 31%),#090c10}
    .hybrid-shell .owner-wrap{max-width:1540px;padding-top:52px}
    .hybrid-shell .ambient-a{background:#5da0a5;opacity:.12;filter:blur(120px)}.hybrid-shell .ambient-b{background:#8a78a9;opacity:.10;filter:blur(130px)}.hybrid-shell .ambient-c{display:block;width:420px;height:300px;background:#9b824f;opacity:.065;left:36%;bottom:-190px;filter:blur(120px)}
    .hybrid-shell .grid-haze{opacity:.17;background-image:linear-gradient(rgba(191,190,170,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(191,190,170,.045) 1px,transparent 1px);background-size:32px 32px;mask-image:linear-gradient(to bottom,black,rgba(0,0,0,.62) 54%,transparent 92%)}
    .notebook-trace{position:absolute;z-index:1;left:22px;top:118px;bottom:70px;width:28px;opacity:.22;pointer-events:none;background:repeating-linear-gradient(to bottom,transparent 0 18px,rgba(216,198,122,.42) 18px 19px,transparent 19px 36px);border-left:1px solid rgba(216,198,122,.20)}
    .notebook-trace:before,.notebook-trace:after{content:"";position:absolute;left:-5px;width:11px;height:11px;border:1px solid rgba(216,198,122,.45);transform:rotate(45deg)}.notebook-trace:before{top:12%}.notebook-trace:after{top:67%}
    .hybrid-shell .topbar{padding-bottom:22px;border-bottom-color:rgba(216,198,122,.22)}
    .hybrid-shell .topbar h1{font-family:Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.035em;color:#f2eee1;text-wrap:balance}
    .hybrid-shell .topbar p{color:#9ca4a7;letter-spacing:.005em}.hybrid-shell .eyebrow,.hybrid-shell .mini-label{color:#a79d78;letter-spacing:.15em}
    .hybrid-shell .ghost-button{border-radius:6px;border-color:rgba(202,197,174,.20);background:rgba(12,17,22,.78);color:#ded9ca;box-shadow:inset 0 1px rgba(255,255,255,.025)}.hybrid-shell .ghost-button:hover{border-color:rgba(216,198,122,.48);background:rgba(27,31,33,.92);color:#f2e8bf}.hybrid-shell .seasonal-button{color:#e6d79e}.hybrid-shell .revert-button{color:#aeb9bd}
    .hybrid-notes{display:flex;justify-content:space-between;gap:14px;padding:9px 2px 0;color:rgba(194,187,157,.48);font:600 8px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.105em;text-transform:uppercase}.hybrid-notes span:nth-child(2){font-family:Georgia,serif;font-style:italic;text-transform:none;letter-spacing:.03em}
    .hybrid-shell .source-grid{margin-top:14px}.hybrid-shell .source-card{border-radius:8px;border-color:rgba(198,195,175,.15);background:linear-gradient(145deg,rgba(20,25,29,.91),rgba(10,15,19,.94));box-shadow:inset 0 1px rgba(255,255,255,.025),0 14px 40px rgba(0,0,0,.18)}.hybrid-shell .source-card:after{content:"";position:absolute;right:12px;bottom:9px;width:22px;height:10px;border-right:1px solid rgba(216,198,122,.18);border-bottom:1px solid rgba(216,198,122,.18);pointer-events:none}.hybrid-shell .source-icon{border-radius:4px;border-color:rgba(198,195,175,.18);background:#0b1014}.hybrid-shell .source-card h2{font-family:Georgia,"Times New Roman",serif;font-size:20px;font-weight:400;color:#e9e5d8}.hybrid-shell .source-card p{color:#919b9f}
    .hybrid-shell .kpi-grid{gap:8px}.hybrid-shell .kpi-card{border-radius:4px;border-color:rgba(198,195,175,.14);background:rgba(16,22,26,.77);backdrop-filter:blur(12px);padding:17px 15px 15px}.hybrid-shell .kpi-card:after{content:"";position:absolute;right:8px;top:8px;width:7px;height:7px;border-top:1px solid rgba(216,198,122,.24);border-right:1px solid rgba(216,198,122,.24)}.hybrid-shell .kpi-card>span{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9.5px;letter-spacing:.11em;color:#989f9e}.hybrid-shell .kpi-card strong{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:30px;color:#eee9da}.hybrid-shell .kpi-card small{color:#747f82}.hybrid-shell .p4{background:#d6bd72}
    .hybrid-shell .workspace{gap:10px}.hybrid-shell .panel{border-radius:6px;border-color:rgba(198,195,175,.14);background:rgba(13,19,23,.84);box-shadow:inset 0 1px rgba(255,255,255,.02)}.hybrid-shell .panel-head{padding:17px 17px 15px;border-bottom-color:rgba(198,195,175,.13)}.hybrid-shell .panel-head h3{font-family:Georgia,"Times New Roman",serif;font-size:19px;font-weight:400;color:#e8e3d4}.hybrid-shell .live-badge{color:#879692}.hybrid-shell .session-row{border-bottom-color:rgba(198,195,175,.07)}.hybrid-shell .session-row:hover{background:rgba(216,198,122,.027)}.hybrid-shell .session-row.active{background:linear-gradient(90deg,rgba(105,215,223,.065),rgba(216,198,122,.018));box-shadow:inset 2px 0 #6dd5da}.hybrid-shell .score strong{color:#7bdade}.hybrid-shell .journey-summary div{border-radius:3px;background:rgba(22,29,33,.74);border:1px solid rgba(198,195,175,.08)}.hybrid-shell .journey-summary span{color:#8d907e}.hybrid-shell .journey-summary strong{color:#e1ddcf}.hybrid-shell .event-rail i{background:rgba(201,196,171,.14)}.hybrid-shell .empty-state{min-height:260px;display:grid;place-items:center;align-content:center;text-align:center;color:#8e9698}.hybrid-shell .empty-mark{color:#b8aa7c;font-size:34px;opacity:.72}.hybrid-shell footer{color:#5d696b;border-top:1px solid rgba(198,195,175,.08);margin-top:18px;padding-top:15px}

    .festive-lights{position:absolute;z-index:6;top:0;left:0;right:0;height:28px;display:flex;align-items:flex-start;justify-content:space-around;padding:0 18px;pointer-events:none;overflow:hidden}.festive-wire{position:absolute;top:4px;left:0;right:0;height:12px;border-top:1px solid rgba(111,116,111,.45);border-radius:50%}.bulb{position:relative;margin-top:8px;width:5px;height:7px;border-radius:45% 45% 55% 55%;opacity:.82;animation:softTwinkle 4.6s ease-in-out infinite}.bulb:before{content:"";position:absolute;top:-3px;left:1px;width:3px;height:3px;background:#3f4543;border-radius:1px}.bulb-0{background:#e7c86b;box-shadow:0 0 8px rgba(231,200,107,.55)}.bulb-1{background:#e18b77;box-shadow:0 0 8px rgba(225,139,119,.45)}.bulb-2{background:#77c9bc;box-shadow:0 0 8px rgba(119,201,188,.42)}.bulb-3{background:#8daeda;box-shadow:0 0 8px rgba(141,174,218,.46)}.bulb-4{background:#c69bd0;box-shadow:0 0 8px rgba(198,155,208,.42)}@keyframes softTwinkle{0%,100%{opacity:.52;filter:saturate(.8)}48%{opacity:.9;filter:saturate(1.05)}55%{opacity:.72}}

    @media(max-width:1000px){.kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.workspace{grid-template-columns:1fr}.journey-panel{position:static}.source-grid{grid-template-columns:1fr}.hybrid-notes span:nth-child(2){display:none}}
    @media(max-width:640px){.owner-wrap{padding:38px 16px 42px}.topbar{align-items:flex-start;flex-direction:column}.header-actions{width:100%;justify-content:flex-start}.ghost-button{flex:1;text-align:center;min-width:42%}.kpi-grid{grid-template-columns:1fr 1fr}.session-row{grid-template-columns:66px 1fr 52px}.journey-summary{grid-template-columns:1fr}.source-card{grid-template-columns:38px 1fr auto}.hybrid-notes span:last-child{display:none}.notebook-trace{display:none}.festive-lights{padding:0 4px}.bulb:nth-of-type(even){display:none}}
    @media(prefers-reduced-motion:reduce){.bulb{animation:none}.ghost-button{transition:none}}
  `}</style>;
}
