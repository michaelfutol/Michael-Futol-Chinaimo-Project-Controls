'use client';

import { useEffect, useMemo, useState } from 'react';

type SessionEvent = {t:string|null;seq:number;event:string;path:string;href:string;label:string;asset:string;activeSeconds:number;depth:number;targetKind:string};
type Session = {sessionId:string;visitorId:string;country:string;platform:string;browser:string;device:string;source:string;firstAt:string|null;lastAt:string|null;activeSeconds:number;pageViews:number;technicalActions:number;downloads:number;maxDepth:number;score:number;behavior:string;events:SessionEvent[]};
type Totals = {sessions:number;technical:number;highDepth:number;activeSeconds:number;downloads:number};
type Payload = {configured:boolean;sessions:Session[];totals:Totals;reason?:string;error?:string};
type ThemeMode = 'light'|'dark';

const OWNER_KEY='chinaimo_owner_exempt';
const THEME_KEY='chinaimo_analytics_theme';
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
  const [theme,setTheme]=useState<ThemeMode>('dark');
  const [lights,setLights]=useState(true);
  const [lastSync,setLastSync]=useState<string>('—');

  const load=async()=>{
    setLoading(true);
    try{
      const r=await fetch('/api/reviewer-sessions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({limit:1500}),cache:'no-store'});
      const j=await r.json() as Payload;
      setData(j);
      setLastSync(new Date().toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    }catch{
      setData({configured:true,sessions:[],totals:EMPTY_TOTALS,error:'Unable to load Reviewer Intelligence.'});
      setLastSync(new Date().toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    }finally{setLoading(false)}
  };

  useEffect(()=>{
    try{
      const isOwner=localStorage.getItem(OWNER_KEY)==='1';
      const storedTheme=localStorage.getItem(THEME_KEY);
      const storedLights=localStorage.getItem(LIGHTS_KEY);
      setOwner(isOwner);
      setTheme(storedTheme==='light'?'light':'dark');
      setLights(storedLights!=='off');
      if(isOwner) void load();
    }catch{}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const active=useMemo(()=>data?.sessions.find(s=>s.sessionId===selected)||null,[data,selected]);
  const totals=data?.totals||EMPTY_TOTALS;
  const isDark=theme==='dark';
  const metric=(value:string|number)=>data?value:'—';

  const toggleTheme=()=>setTheme(prev=>{
    const next:ThemeMode=prev==='dark'?'light':'dark';
    try{localStorage.setItem(THEME_KEY,next)}catch{}
    return next;
  });
  const toggleLights=()=>setLights(prev=>{
    const next=!prev;
    try{localStorage.setItem(LIGHTS_KEY,next?'on':'off')}catch{}
    return next;
  });

  if(!owner){
    return <main className="gate-shell">
      <section className="gate-card">
        <div className="mono-kicker">MUNIGEN / ANALYTICS</div>
        <h1>Private console</h1>
        <p>Return to the assessment and use the 1 → 3 → 7 gesture.</p>
        <a href="/">Return to assessment</a>
      </section>
      <StudioStyles/>
    </main>;
  }

  return <main className={`studio-shell ${isDark?'theme-dark':'theme-light'}`}>
    <div className="dot-grid" aria-hidden="true"/>
    <div className="atmosphere a" aria-hidden="true"/><div className="atmosphere b" aria-hidden="true"/><div className="atmosphere c" aria-hidden="true"/>
    <NotebookMarks/>
    {lights&&<ChristmasLights/>}

    <div className="studio-wrap">
      <header className="hero-header">
        <div className="hero-copy">
          <div className="mono-kicker"><span className="status-bead"/>MUNIGEN / CHINAIMO / ANALYTICS</div>
          <div className="title-row"><h1>Analytics Console</h1><span className="sheet-ref">SEC-137</span></div>
          <p>Traffic, reviewer journeys and engagement signals in one control room.</p>
        </div>
        <div className="instrument-bar" aria-label="Analytics controls">
          <div className="sync-readout"><span>LAST SYNC</span><strong>{lastSync}</strong></div>
          <button type="button" onClick={toggleTheme} title={isDark?'Switch to light mode':'Switch to dark mode'}><span className="toolbar-icon">{isDark?'☼':'◐'}</span>{isDark?'LIGHT MODE':'DARK MODE'}</button>
          <button type="button" onClick={()=>void load()} disabled={loading} title="Refresh analytics"><span className={`toolbar-icon ${loading?'spin':''}`}>↻</span>{loading?'SYNCING':'REFRESH'}</button>
          <a href="/" title="Return to assessment"><span className="toolbar-icon">⌖</span>ASSESSMENT</a>
          <button type="button" onClick={toggleLights} title={lights?'Turn festive lights off':'Turn festive lights on'}><span className="toolbar-icon">✦</span>{lights?'LIGHTS OFF':'LIGHTS ON'}</button>
        </div>
      </header>

      <section className="source-zone">
        <a className="evidence-plate vercel" href={VERCEL_ANALYTICS} target="_blank" rel="noreferrer">
          <div className="plate-index">01</div>
          <div className="plate-copy"><span className="mono-label">VERCEL ANALYTICS</span><h2>Traffic overview</h2><p>Visitors, countries, devices, operating systems and page activity.</p></div>
          <div className="plate-mark"><span>V</span><small>AGGREGATE</small></div>
          <div className="plate-foot"><span>Open Vercel Analytics</span><b>↗</b></div>
        </a>
        <article className="evidence-plate munigen">
          <div className="plate-index">02</div>
          <div className="plate-copy"><span className="mono-label">MUNIGEN REVIEWER INTELLIGENCE</span><h2>Session journeys</h2><p>Anonymous navigation order, active time, downloads and technical depth.</p></div>
          <div className="plate-mark"><span>M</span><small>JOURNEY</small></div>
          <div className="plate-foot"><span><i className="live-dot"/>Persistent session ledger</span><b>LIVE</b></div>
        </article>
      </section>

      <JourneyMap active={!!active} />

      <section className="kpi-strip" aria-label="Reviewer intelligence metrics">
        {[
          ['SESSIONS',metric(totals.sessions),'anonymous sessions'],
          ['TECHNICAL',metric(totals.technical),'technical-review behavior'],
          ['HIGH DEPTH',metric(totals.highDepth),'strong engagement'],
          ['ACTIVE TIME',metric(fmtTime(totals.activeSeconds)),'recorded reading'],
          ['DOWNLOADS',metric(totals.downloads),'evidence downloads']
        ].map(([label,value,note],i)=><article className={`kpi-cell k${i}`} key={String(label)}>
          <div className="measure-ticks" aria-hidden="true"/><span className="mono-label">{label}</span><strong>{value}</strong><small>{note}</small>
        </article>)}
      </section>

      {data?.error&&<section className="error-note"><strong>Reviewer store unavailable</strong><span>{data.error}</span></section>}

      {!data?.error&&<section className="investigation-workspace">
        <div className="sessions-sheet">
          <div className="workspace-head">
            <div><span className="mono-label">RECENT ACTIVITY</span><h3>Reviewer sessions</h3><p>Anonymous session ledger from the live assessment.</p></div>
            <span className="ledger-status"><i/>LIVE STORE</span>
          </div>
          <div className="session-list">
            {!data&&<EmptySessions loading/>}
            {data&&data.sessions.length===0&&<EmptySessions/>}
            {data?.sessions.map((s,index)=><button key={s.sessionId} onClick={()=>setSelected(s.sessionId)} className={`session-row ${selected===s.sessionId?'active':''}`}>
              <span className="row-index">{String(index+1).padStart(2,'0')}</span>
              <div className="session-place"><strong>{s.country}</strong><span>{s.device}</span></div>
              <div className="session-main"><strong>{s.platform} · {s.browser}</strong><span>{s.behavior} · {s.pageViews} pages · {fmtTime(s.activeSeconds)}</span><small>{fmtDate(s.firstAt)} · {short(s.sessionId)}</small></div>
              <div className="score"><strong>{s.score}</strong><span>DEPTH</span></div>
            </button>)}
          </div>
        </div>

        <aside className="journey-sheet">
          <div className="workspace-head"><div><span className="mono-label">SELECTED SESSION</span><h3>Journey</h3><p>Trace the reviewer path through real assessment evidence.</p></div></div>
          {!active&&<EmptyJourney/>}
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

      <footer className="privacy-footer"><span>COARSE COUNTRY / OS / BROWSER / DEVICE + RANDOM FIRST-PARTY SESSION IDS ONLY</span><span>NO NAME · NO EMAIL · NO IP DISPLAY</span></footer>
    </div>
    <StudioStyles/>
  </main>;
}

function EmptySessions({loading=false}:{loading?:boolean}){
  return <div className="empty-composition sessions-empty">
    <svg viewBox="0 0 360 120" aria-hidden="true"><path d="M16 86 C74 26 117 101 177 52 S287 31 344 70"/><circle cx="16" cy="86" r="3"/><circle cx="177" cy="52" r="3"/><circle cx="344" cy="70" r="3"/><line x1="54" y1="18" x2="54" y2="101"/><line x1="276" y1="18" x2="276" y2="101"/></svg>
    <strong>{loading?'Loading reviewer sessions…':'No persisted reviewer sessions yet.'}</strong>{!loading&&<small>New non-owner visits will appear here automatically.</small>}
  </div>;
}

function EmptyJourney(){
  return <div className="empty-composition journey-empty">
    <svg viewBox="0 0 260 160" aria-hidden="true"><circle cx="130" cy="80" r="46"/><circle cx="130" cy="80" r="25"/><path d="M18 80 H84 M176 80 H242 M130 12 V34 M130 126 V148"/><path d="M94 113 L72 138 M166 47 L191 23"/></svg>
    <strong>Select a reviewer session.</strong><small>The event path will resolve here as a measured evidence trace.</small>
  </div>;
}

function JourneyMap({active}:{active:boolean}){
  return <section className={`journey-map ${active?'has-active':''}`}>
    <div className="map-heading"><div><span className="mono-label">SIGNATURE TRACE</span><h3>Traffic → reviewer → evidence → journey</h3></div><small>{active?'A live session is selected':'Idle evidence path'}</small></div>
    <div className="map-canvas">
      <svg viewBox="0 0 900 150" preserveAspectRatio="none" aria-hidden="true">
        <path className="path-main" d="M80 82 C172 25 235 128 326 70 S495 40 580 78 S737 115 820 56"/>
        <path className="path-ghost" d="M80 82 C172 25 235 128 326 70 S495 40 580 78 S737 115 820 56"/>
        {[{x:80,t:'TRAFFIC',n:'01'},{x:326,t:'SESSION',n:'02'},{x:580,t:'EVIDENCE',n:'03'},{x:820,t:'JOURNEY',n:'04'}].map((p,i)=><g key={p.t}><circle className={`map-node mn${i}`} cx={p.x} cy={i===0?82:i===1?70:i===2?78:56} r="9"/><text x={p.x} y="26" textAnchor="middle">{p.t}</text><text className="map-index" x={p.x} y="134" textAnchor="middle">§ {p.n}</text></g>)}
      </svg>
      <div className="map-note n1">aggregate traffic authority</div><div className="map-note n2">anonymous session ledger</div><div className="map-note n3">real page / file evidence</div>
    </div>
  </section>;
}

function NotebookMarks(){
  return <div className="notebook-marks" aria-hidden="true">
    <svg className="ratio-study" viewBox="0 0 320 320"><circle cx="160" cy="160" r="140"/><circle cx="160" cy="160" r="86"/><circle cx="160" cy="160" r="53"/><rect x="61" y="61" width="198" height="198"/><line x1="20" y1="20" x2="300" y2="300"/><line x1="300" y1="20" x2="20" y2="300"/><path d="M107 160 A53 53 0 0 1 160 107"/></svg>
    <svg className="leaf-study" viewBox="0 0 240 240"><path d="M20 220 L220 30 M20 220 L210 60 M20 220 L190 95 M20 220 L165 135 M20 220 L135 170 M20 220 L95 195"/><path d="M95 195 C140 180 180 140 220 30 M115 175 C150 160 180 120 205 50"/></svg>
    <div className="datum-line"><span/><span/><span/><span/><span/></div>
    <div className="margin-scale">0<span/>1<span/>2<span/>3<span/>4</div>
  </div>;
}

function ChristmasLights(){
  const colors=['amber','teal','coral','violet','blue'];
  return <div className="christmas-lights" aria-hidden="true"><svg viewBox="0 0 1200 36" preserveAspectRatio="none"><path d="M0 2 Q150 22 300 4 Q450 24 600 4 Q750 24 900 4 Q1050 23 1200 3"/></svg>{Array.from({length:25},(_,i)=><span key={i} className={`studio-bulb ${colors[i%colors.length]}`} style={{left:`${2+i*4}%`,top:`${7+Math.sin(i*.95)*7}px`,animationDelay:`${(i%8)*.31}s`}}/> )}</div>;
}

function StudioStyles(){
  return <style>{`
    :root{color-scheme:dark light}html,body{margin:0;padding:0}*{box-sizing:border-box}button,a{font:inherit}.studio-shell{--paper:#f4f0e5;--paper2:#eae2d1;--ink:#111719;--ink2:#172024;--muted:#6f7776;--line:rgba(17,23,25,.16);--surface:rgba(255,255,255,.48);--surface-strong:rgba(244,240,229,.88);--dark-surface:#172024;--dark-panel:#20292b;--teal:#4e9f94;--teal2:#2f766f;--amber:#e8a857;--coral:#e07a5f;--violet:#9e86b8;--blue:#5d8aa8;min-height:100vh;position:relative;overflow:hidden;color:var(--ink);background:var(--paper);font-family:Inter,Arial,Helvetica,sans-serif;transition:background .28s ease,color .28s ease}.theme-dark{--paper:#111719;--paper2:#172024;--ink:#f4f0e5;--ink2:#eae2d1;--muted:#b9b29f;--line:rgba(234,226,209,.16);--surface:rgba(20,28,31,.64);--surface-strong:rgba(23,32,36,.91);--dark-surface:#0d1214;--dark-panel:#172024;background:#111719;color:#f4f0e5}.theme-light{color-scheme:light}.theme-dark{color-scheme:dark}.studio-wrap{position:relative;z-index:10;width:min(1520px,calc(100% - 44px));margin:0 auto;padding:48px 0 34px}.dot-grid{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(currentColor .55px,transparent .55px);background-size:24px 24px;color:rgba(17,23,25,.18);opacity:.18}.theme-dark .dot-grid{color:rgba(234,226,209,.18);opacity:.14}.atmosphere{position:fixed;z-index:0;pointer-events:none;border-radius:50%;filter:blur(115px)}.atmosphere.a{width:420px;height:420px;right:3%;top:15%;background:#2dd4bf;opacity:.10}.atmosphere.b{width:360px;height:360px;left:2%;bottom:8%;background:#fb7185;opacity:.07}.atmosphere.c{width:420px;height:300px;left:37%;top:42%;background:#8b5cf6;opacity:.05}.theme-light .atmosphere.a{opacity:.08}.theme-light .atmosphere.b{opacity:.055}.theme-light .atmosphere.c{opacity:.045}
    .hero-header{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:32px;padding:15px 0 18px;border-bottom:1px solid var(--line)}.hero-copy{min-width:0}.mono-kicker,.mono-label{font:650 9.5px/1.25 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.16em;text-transform:uppercase}.mono-kicker{display:flex;align-items:center;gap:8px;color:color-mix(in srgb,var(--ink) 56%,transparent)}.status-bead{width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 0 3px color-mix(in srgb,var(--teal) 14%,transparent)}.title-row{display:flex;align-items:flex-end;gap:16px;margin-top:5px}.title-row h1{margin:0;font-family:Georgia,'Times New Roman',serif;font-size:clamp(42px,5vw,66px);line-height:.96;font-weight:400;font-style:italic;letter-spacing:-.042em;color:var(--ink2)}.sheet-ref{font:650 9px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;padding-bottom:5px;border-bottom:1px solid var(--line);color:color-mix(in srgb,var(--ink) 42%,transparent)}.hero-copy p{margin:9px 0 0;font-size:14px;line-height:1.5;color:color-mix(in srgb,var(--ink) 67%,transparent)}.instrument-bar{display:flex;align-items:center;justify-content:flex-end;gap:18px;padding:0 0 7px;border-bottom:1px solid color-mix(in srgb,var(--ink) 40%,transparent);flex-wrap:wrap}.instrument-bar button,.instrument-bar a{display:inline-flex;align-items:center;gap:6px;padding:0;border:0;background:none;color:var(--ink);text-decoration:none;font:650 9.5px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.08em;cursor:pointer;transition:opacity .16s ease,color .16s ease}.instrument-bar button:hover,.instrument-bar a:hover{opacity:.62}.instrument-bar button:disabled{opacity:.35;cursor:wait}.toolbar-icon{font-size:14px;line-height:1;color:var(--teal)}.instrument-bar button:last-child .toolbar-icon{color:var(--amber)}.sync-readout{display:flex;flex-direction:column;align-items:flex-end;margin-right:3px;font:600 8px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.09em;color:color-mix(in srgb,var(--ink) 42%,transparent)}.sync-readout strong{font-weight:650;color:color-mix(in srgb,var(--ink) 72%,transparent)}.spin{display:inline-block;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
    .source-zone{display:grid;grid-template-columns:5fr 7fr;gap:26px;margin-top:24px}.evidence-plate{position:relative;display:grid;grid-template-columns:38px 1fr 72px;gap:14px;min-height:128px;padding:13px 14px 30px 15px;border-left:2px solid var(--ink);color:inherit;text-decoration:none;background:linear-gradient(90deg,color-mix(in srgb,var(--surface) 82%,transparent),transparent 88%);overflow:hidden}.evidence-plate.vercel{border-left-color:var(--teal)}.evidence-plate.munigen{border-left-color:var(--coral)}.plate-index{font:700 9px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:color-mix(in srgb,var(--ink) 33%,transparent)}.plate-copy{align-self:center}.plate-copy h2{margin:5px 0 3px;font-family:Georgia,'Times New Roman',serif;font-size:25px;font-weight:400;font-style:italic;color:var(--ink2)}.plate-copy p{margin:0;max-width:560px;font-size:12px;line-height:1.55;color:color-mix(in srgb,var(--ink) 65%,transparent)}.plate-mark{align-self:center;justify-self:end;width:62px;height:62px;border:1px solid var(--line);display:grid;place-items:center;align-content:center;background:color-mix(in srgb,var(--dark-surface) 96%,transparent);color:#f4f0e5}.plate-mark span{font-family:Georgia,serif;font-size:25px;line-height:1}.plate-mark small{margin-top:4px;font:600 7px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;color:#9ab7b3}.plate-foot{position:absolute;left:68px;right:14px;bottom:8px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--line);padding-top:6px;font:600 8.5px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.07em;color:color-mix(in srgb,var(--ink) 48%,transparent)}.plate-foot b{font-weight:700;color:var(--teal)}.evidence-plate.munigen .plate-foot b{color:var(--coral)}.live-dot{display:inline-block;width:5px;height:5px;margin-right:6px;border-radius:50%;background:#69e6b1;box-shadow:0 0 8px rgba(105,230,177,.58)}
    .journey-map{margin-top:19px;padding:14px 16px 11px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--surface) 44%,transparent),transparent)}.map-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:18px}.map-heading h3{margin:3px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;font-style:italic;color:var(--ink2)}.map-heading small{font:600 8.5px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;color:color-mix(in srgb,var(--ink) 42%,transparent)}.map-canvas{position:relative;height:144px;margin-top:2px}.map-canvas svg{width:100%;height:100%;overflow:visible}.map-canvas text{fill:color-mix(in srgb,var(--ink) 61%,transparent);font:650 8px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.11em}.map-canvas .map-index{fill:color-mix(in srgb,var(--ink) 28%,transparent);font-size:7.5px}.path-main{fill:none;stroke:color-mix(in srgb,var(--ink) 22%,transparent);stroke-width:1.2}.path-ghost{fill:none;stroke:var(--teal);stroke-width:1.6;stroke-dasharray:4 7;opacity:.48}.has-active .path-ghost{animation:dash 8s linear infinite;opacity:.78}@keyframes dash{to{stroke-dashoffset:-88}}.map-node{fill:var(--paper);stroke-width:1.5}.theme-dark .map-node{fill:#111719}.mn0{stroke:var(--teal)}.mn1{stroke:var(--amber)}.mn2{stroke:var(--coral)}.mn3{stroke:var(--blue)}.map-note{position:absolute;font:italic 10px/1.2 Georgia,serif;color:color-mix(in srgb,var(--ink) 34%,transparent)}.map-note.n1{left:15%;top:73%}.map-note.n2{left:45%;top:13%}.map-note.n3{right:14%;top:72%}
    .kpi-strip{display:grid;grid-template-columns:1.15fr 1fr 1fr 1.2fr 1fr;margin-top:20px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.kpi-cell{position:relative;min-height:102px;padding:15px 17px 13px;border-right:1px solid var(--line);overflow:hidden}.kpi-cell:last-child{border-right:0}.kpi-cell .mono-label{color:color-mix(in srgb,var(--ink) 52%,transparent)}.kpi-cell strong{display:block;margin:6px 0 2px;font-family:Georgia,'Times New Roman',serif;font-size:31px;line-height:1;font-weight:400;color:var(--ink2)}.kpi-cell small{font-size:9.5px;color:color-mix(in srgb,var(--ink) 46%,transparent)}.measure-ticks{position:absolute;right:8px;top:7px;width:26px;height:9px;border-top:1px solid color-mix(in srgb,var(--ink) 18%,transparent);background:repeating-linear-gradient(90deg,transparent 0 4px,color-mix(in srgb,var(--ink) 16%,transparent) 4px 5px)}.k0{box-shadow:inset 2px 0 var(--teal)}.k1{box-shadow:inset 2px 0 #65b89f}.k2{box-shadow:inset 2px 0 var(--violet)}.k3{box-shadow:inset 2px 0 var(--blue)}.k4{box-shadow:inset 2px 0 var(--amber)}
    .investigation-workspace{display:grid;grid-template-columns:minmax(0,1.48fr) minmax(360px,1fr);gap:28px;margin-top:24px;align-items:start}.sessions-sheet,.journey-sheet{position:relative;min-height:330px;border-top:1px solid var(--line);background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 50%,transparent),transparent 38%)}.sessions-sheet:before,.journey-sheet:before{content:'';position:absolute;top:-1px;left:0;width:64px;height:2px;background:var(--teal)}.journey-sheet:before{background:var(--amber)}.workspace-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:14px 8px 12px}.workspace-head h3{margin:4px 0 3px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;font-style:italic;color:var(--ink2)}.workspace-head p{margin:0;font-size:10.5px;color:color-mix(in srgb,var(--ink) 48%,transparent)}.ledger-status{display:flex;align-items:center;gap:6px;margin-top:2px;font:650 8px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;color:color-mix(in srgb,var(--ink) 52%,transparent)}.ledger-status i{width:5px;height:5px;border-radius:50%;background:#69e6b1;box-shadow:0 0 8px rgba(105,230,177,.65)}.session-list{border-top:1px solid var(--line);max-height:56vh;overflow:auto}.session-row{width:100%;display:grid;grid-template-columns:34px 82px 1fr 62px;gap:11px;align-items:center;padding:13px 8px;border:0;border-bottom:1px solid color-mix(in srgb,var(--line) 60%,transparent);background:transparent;color:var(--ink);text-align:left;cursor:pointer;transition:background .16s ease,box-shadow .16s ease}.session-row:hover{background:color-mix(in srgb,var(--teal) 5%,transparent)}.session-row.active{background:linear-gradient(90deg,color-mix(in srgb,var(--teal) 10%,transparent),transparent);box-shadow:inset 2px 0 var(--teal)}.row-index{font:650 8.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:color-mix(in srgb,var(--ink) 31%,transparent)}.session-place strong,.session-main strong{display:block;font-size:11.5px}.session-place span,.session-main span,.session-main small{display:block;color:color-mix(in srgb,var(--ink) 52%,transparent)}.session-place span{font-size:9px;margin-top:3px}.session-main span{font-size:10px;margin-top:2px}.session-main small{font:550 8.5px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;margin-top:3px}.score{text-align:right}.score strong{font-family:Georgia,serif;font-size:19px;font-weight:400;color:var(--teal)}.score span{display:block;font:650 7px/1.1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.1em;color:color-mix(in srgb,var(--ink) 39%,transparent)}.journey-sheet{position:sticky;top:14px}.journey-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--line)}.journey-summary div{padding:10px 11px;background:var(--paper)}.theme-dark .journey-summary div{background:#131b1e}.journey-summary span{display:block;font:650 7.5px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.1em;color:color-mix(in srgb,var(--ink) 43%,transparent)}.journey-summary strong{display:block;margin-top:4px;font-size:10.5px;font-weight:650;color:var(--ink2)}.timeline{max-height:46vh;overflow:auto;padding:15px 8px 19px}.event{display:grid;grid-template-columns:24px 1fr;gap:10px}.event-rail{position:relative;display:flex;justify-content:center}.event-rail i{position:absolute;top:18px;bottom:-8px;width:1px;background:var(--line)}.node{position:relative;z-index:2;width:8px;height:8px;margin-top:5px;border-radius:50%;background:#748083;box-shadow:0 0 0 4px color-mix(in srgb,#748083 8%,transparent)}.depth-1{background:#8aa7a3}.depth-2{background:var(--violet);box-shadow:0 0 12px color-mix(in srgb,var(--violet) 34%,transparent)}.depth-3{background:var(--teal);box-shadow:0 0 12px color-mix(in srgb,var(--teal) 38%,transparent)}.event-body{padding:0 0 16px}.event-body small{display:block;font:650 8px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;color:color-mix(in srgb,var(--ink) 40%,transparent)}.event-body strong{display:block;margin-top:4px;font-size:11.5px;word-break:break-word;color:var(--ink2)}.event-body span,.event-body em{display:block;margin-top:3px;font-size:9.5px;color:color-mix(in srgb,var(--ink) 49%,transparent)}.event-body em{font-style:italic;font-family:Georgia,serif}.empty-composition{min-height:260px;display:grid;place-items:center;align-content:center;text-align:center;padding:24px;color:color-mix(in srgb,var(--ink) 54%,transparent)}.empty-composition svg{width:min(360px,80%);height:120px;margin-bottom:9px;fill:none;stroke:color-mix(in srgb,var(--ink) 21%,transparent);stroke-width:1}.journey-empty svg{height:140px}.empty-composition strong{font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:400;font-style:italic;color:color-mix(in srgb,var(--ink) 69%,transparent)}.empty-composition small{margin-top:5px;font-size:9.5px;max-width:350px}.error-note{display:flex;flex-direction:column;gap:4px;margin-top:20px;padding:14px 16px;border-left:2px solid var(--coral);background:color-mix(in srgb,var(--coral) 7%,transparent)}.error-note strong{font-family:Georgia,serif;font-weight:400;font-style:italic}.error-note span{font-size:11px;color:color-mix(in srgb,var(--ink) 58%,transparent)}.privacy-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:27px;padding-top:14px;border-top:1px solid var(--line);font:600 7.8px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;color:color-mix(in srgb,var(--ink) 40%,transparent)}
    .notebook-marks{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;color:var(--ink)}.notebook-marks svg{fill:none;stroke:currentColor}.ratio-study{position:absolute;left:-78px;top:96px;width:330px;height:330px;opacity:.055;stroke-width:.75}.leaf-study{position:absolute;right:-75px;top:34%;width:280px;height:280px;opacity:.055;stroke-width:.7}.datum-line{position:absolute;left:0;right:0;top:29%;height:1px;background:color-mix(in srgb,var(--ink) 5%,transparent)}.datum-line span{position:absolute;top:-4px;width:1px;height:9px;background:color-mix(in srgb,var(--ink) 16%,transparent)}.datum-line span:nth-child(1){left:6%}.datum-line span:nth-child(2){left:27%}.datum-line span:nth-child(3){left:50%;height:15px;top:-7px}.datum-line span:nth-child(4){left:74%}.datum-line span:nth-child(5){right:6%}.margin-scale{position:absolute;left:14px;top:195px;bottom:80px;width:24px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font:600 6px ui-monospace,SFMono-Regular,Menlo,monospace;color:color-mix(in srgb,var(--ink) 17%,transparent)}.margin-scale span{display:block;width:18px;height:1px;background:currentColor}
    .christmas-lights{position:absolute;z-index:30;top:0;left:0;right:0;height:38px;pointer-events:none;overflow:hidden}.christmas-lights svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:color-mix(in srgb,var(--ink) 22%,transparent);stroke-width:.85}.studio-bulb{position:absolute;width:7px;height:9px;border-radius:2px 2px 5px 5px;transform:translateX(-50%);animation:breath 5.2s ease-in-out infinite}.studio-bulb:before{content:'';position:absolute;left:2px;top:-3px;width:3px;height:3px;background:#2c383b}.studio-bulb.amber{background:#e8a857;box-shadow:0 0 8px rgba(232,168,87,.46),0 0 16px rgba(232,168,87,.19)}.studio-bulb.teal{background:#4e9f94;box-shadow:0 0 8px rgba(78,159,148,.44),0 0 16px rgba(78,159,148,.18)}.studio-bulb.coral{background:#e07a5f;box-shadow:0 0 8px rgba(224,122,95,.44),0 0 16px rgba(224,122,95,.18)}.studio-bulb.violet{background:#9e86b8;box-shadow:0 0 8px rgba(158,134,184,.44),0 0 16px rgba(158,134,184,.18)}.studio-bulb.blue{background:#5d8aa8;box-shadow:0 0 8px rgba(93,138,168,.44),0 0 16px rgba(93,138,168,.18)}@keyframes breath{0%,100%{opacity:.48;filter:saturate(.78)}48%{opacity:.96;filter:saturate(1.06)}60%{opacity:.7}}
    .gate-shell{min-height:100vh;display:grid;place-items:center;padding:24px;background:#111719;color:#f4f0e5;font-family:Inter,Arial,sans-serif}.gate-card{width:min(520px,100%);padding:28px;border:1px solid rgba(234,226,209,.16);background:#172024}.gate-card h1{margin:7px 0 5px;font:400 italic 38px/1 Georgia,serif}.gate-card p{margin:0 0 17px;color:#b9b29f;line-height:1.55}.gate-card a{display:inline-block;color:#f4f0e5;text-decoration:none;border-bottom:1px solid #4e9f94;padding-bottom:2px;font:650 10px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em}
    @media(max-width:1050px){.hero-header{align-items:flex-start;flex-direction:column}.instrument-bar{justify-content:flex-start}.sync-readout{align-items:flex-start}.source-zone{grid-template-columns:1fr}.investigation-workspace{grid-template-columns:1fr}.journey-sheet{position:static}.kpi-strip{grid-template-columns:repeat(3,1fr)}.kpi-cell:nth-child(3){border-right:0}.kpi-cell:nth-child(4),.kpi-cell:nth-child(5){border-top:1px solid var(--line)}}
    @media(max-width:680px){.studio-wrap{width:min(100% - 28px,1520px);padding-top:42px}.title-row h1{font-size:43px}.sheet-ref{display:none}.instrument-bar{gap:12px}.sync-readout{display:none}.source-zone{gap:10px}.evidence-plate{grid-template-columns:28px 1fr 50px;padding-left:8px}.plate-mark{width:48px;height:48px}.plate-foot{left:50px}.journey-map{padding-left:3px;padding-right:3px}.map-note{display:none}.map-canvas{height:125px}.kpi-strip{grid-template-columns:repeat(2,1fr)}.kpi-cell{border-top:1px solid var(--line)}.kpi-cell:nth-child(1),.kpi-cell:nth-child(2){border-top:0}.kpi-cell:nth-child(2n){border-right:0}.kpi-cell:nth-child(5){grid-column:1/-1}.session-row{grid-template-columns:24px 62px 1fr 50px;padding-left:0;padding-right:0}.journey-summary{grid-template-columns:1fr}.privacy-footer{align-items:flex-start;flex-direction:column}.margin-scale,.ratio-study{display:none}.studio-bulb:nth-of-type(even){display:none}}
    @media(prefers-reduced-motion:reduce){.studio-bulb,.has-active .path-ghost,.spin{animation:none}.studio-shell{transition:none}}
  `}</style>;
}
