'use client';

import { useEffect, useMemo, useState } from 'react';

type SessionEvent = {t:string|null;seq:number;event:string;path:string;href:string;label:string;asset:string;activeSeconds:number;depth:number;targetKind:string};
type Session = {sessionId:string;visitorId:string;country:string;platform:string;browser:string;device:string;source:string;firstAt:string|null;lastAt:string|null;activeSeconds:number;pageViews:number;technicalActions:number;downloads:number;maxDepth:number;score:number;behavior:string;events:SessionEvent[]};
type Totals = {sessions:number;technical:number;highDepth:number;activeSeconds:number;downloads:number};
type Payload = {configured:boolean;sessions:Session[];totals:Totals;reason?:string;error?:string};

const OWNER_KEY='chinaimo_owner_exempt';
const DASHBOARD_KEY='chinaimo_reviewer_dashboard_key';
const VERCEL_ANALYTICS='https://vercel.com/michael-futol-projects/michael-futol-chinaimo-project-controls/analytics';
const EMPTY_TOTALS:Totals={sessions:0,technical:0,highDepth:0,activeSeconds:0,downloads:0};
const fmtTime=(s:number)=>s<60?`${s}s`:`${Math.floor(s/60)}m ${Math.round(s%60)}s`;
const fmtDate=(iso:string|null)=>iso?new Date(iso).toLocaleString(undefined,{month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
const short=(id:string)=>id?`${id.slice(0,8)}…${id.slice(-5)}`:'—';

export default function ReviewerIntelligence(){
  const [owner,setOwner]=useState(false);
  const [key,setKey]=useState('');
  const [data,setData]=useState<Payload|null>(null);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState<string|null>(null);

  useEffect(()=>{
    try{
      const isOwner=localStorage.getItem(OWNER_KEY)==='1';
      const stored=sessionStorage.getItem(DASHBOARD_KEY)||'';
      setOwner(isOwner);
      setKey(stored);
      if(isOwner&&stored) void load(stored);
    }catch{}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const load=async(inputKey=key)=>{
    const cleanKey=inputKey.trim();
    if(!cleanKey){
      setData({configured:true,sessions:[],totals:EMPTY_TOTALS,error:'Enter the owner access key to open Reviewer Intelligence.'});
      return;
    }
    setLoading(true);
    try{
      const r=await fetch('/api/reviewer-sessions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key:cleanKey,limit:1500}),cache:'no-store'});
      const j=await r.json() as Payload;
      setData(j);
      if(r.ok&&!j.error){try{sessionStorage.setItem(DASHBOARD_KEY,cleanKey)}catch{}}
    }catch{
      setData({configured:true,sessions:[],totals:EMPTY_TOTALS,error:'Unable to load Reviewer Intelligence.'});
    } finally {setLoading(false)}
  };

  const active=useMemo(()=>data?.sessions.find(s=>s.sessionId===selected)||null,[data,selected]);

  if(!owner){
    return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#efefeb',fontFamily:"Arial,'Helvetica Neue',sans-serif",color:'#35434a'}}>
      <div style={{maxWidth:540,padding:30,border:'1px solid #b9bdb9',background:'#fbfaf7'}}>
        <div style={{font:"700 11px/1.3 'Courier New',monospace",letterSpacing:'.08em',color:'#8e4539'}}>MUNIGEN · OWNER ANALYTICS</div>
        <h1 style={{fontFamily:"'Bodoni 72',Didot,'Times New Roman',serif",fontWeight:600}}>Owner gate required</h1>
        <p style={{lineHeight:1.6}}>Return to the assessment and use the private 1 → 3 → 7 owner gesture. This route does not expose reviewer data without owner mode and the separate access key.</p>
        <a href="/" style={{display:'inline-block',marginTop:8,color:'#35434a'}}>Return to assessment</a>
      </div>
    </main>;
  }

  return <main style={{minHeight:'100vh',background:'#efefeb',padding:'24px',fontFamily:"Arial,'Helvetica Neue',sans-serif",color:'#334047'}}>
    <div style={{maxWidth:1380,margin:'0 auto'}}>
      <header style={{borderTop:'4px solid #293a42',borderBottom:'1px solid #bcc0bc',padding:'22px 2px 18px'}}>
        <div style={{font:"700 10.5px/1.3 'Courier New',monospace",letterSpacing:'.12em',color:'#8e4539'}}>MUNIGEN · CHINAIMO · PRIVATE OWNER VIEW</div>
        <div style={{display:'flex',justifyContent:'space-between',gap:24,alignItems:'end',flexWrap:'wrap'}}>
          <div>
            <h1 style={{margin:'7px 0 2px',fontFamily:"'Bodoni 72',Didot,'Times New Roman',serif",fontSize:40,fontWeight:600,color:'#263840'}}>Owner Analytics Console</h1>
            <p style={{margin:0,color:'#687074'}}>Vercel for aggregate traffic. Munigen Reviewer Intelligence for anonymous session journeys.</p>
          </div>
          <a href="/" style={{height:38,display:'inline-flex',alignItems:'center',padding:'0 14px',border:'1px solid #8d9695',background:'#f8f7f2',color:'#39484e',textDecoration:'none',font:"700 11px 'Courier New',monospace"}}>ASSESSMENT ↗</a>
        </div>
      </header>

      <section style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12,marginTop:18}}>
        <a href={VERCEL_ANALYTICS} target="_blank" rel="noreferrer" style={{padding:'18px 20px',border:'1px solid #bcc1bd',background:'#fbfaf7',color:'#334047',textDecoration:'none'}}>
          <div style={{font:"700 10px 'Courier New',monospace",letterSpacing:'.08em',color:'#8e4539'}}>VERCEL · AGGREGATE ANALYTICS</div>
          <div style={{marginTop:7,fontFamily:"'Bodoni 72',Didot,'Times New Roman',serif",fontSize:25,fontWeight:600}}>Visitors · Countries · Devices · Pages</div>
          <p style={{margin:'7px 0 0',fontSize:13.5,lineHeight:1.55,color:'#687074'}}>Official high-level traffic view. Opens your private Vercel project analytics.</p>
          <div style={{marginTop:13,font:"700 10.5px 'Courier New',monospace"}}>OPEN VERCEL ANALYTICS ↗</div>
        </a>

        <div style={{padding:'18px 20px',border:'1px solid #bcc1bd',background:'#f5f3ec'}}>
          <div style={{font:"700 10px 'Courier New',monospace",letterSpacing:'.08em',color:'#8e4539'}}>MUNIGEN · REVIEWER INTELLIGENCE</div>
          <div style={{marginTop:7,fontFamily:"'Bodoni 72',Didot,'Times New Roman',serif",fontSize:25,fontWeight:600}}>Journeys · Active Time · Technical Depth</div>
          <p style={{margin:'7px 0 0',fontSize:13.5,lineHeight:1.55,color:'#687074'}}>Anonymous first-party session ledger. No names, emails, IP display, exact location, or fingerprinting.</p>
          <div style={{marginTop:13,font:"700 10.5px 'Courier New',monospace"}}>PRIVATE PERSISTENT STORE · SUPABASE</div>
        </div>
      </section>

      {(!data||data.error)&&<section style={{marginTop:12,padding:18,border:'1px solid #c5bfae',background:'#faf7ef'}}>
        <div style={{font:"700 10.5px 'Courier New',monospace",letterSpacing:'.06em'}}>UNLOCK REVIEWER INTELLIGENCE</div>
        <p style={{margin:'7px 0 12px',fontSize:13.5,color:'#687074'}}>The 137 gesture opens owner mode; this second key protects the private session ledger itself. It is remembered only for this browser session.</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <input type="password" value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void load(key)}} placeholder="Owner access key" style={{height:40,minWidth:300,maxWidth:'100%',padding:'0 11px',border:'1px solid #aaa',background:'#fffdf9'}}/>
          <button onClick={()=>load(key)} disabled={loading} style={{height:40,padding:'0 16px',border:'1px solid #59666c',background:'#293a42',color:'#f8f6ef',font:"700 11px 'Courier New',monospace",cursor:'pointer'}}>{loading?'OPENING…':'UNLOCK'}</button>
        </div>
        {data?.error&&<div style={{marginTop:9,fontSize:12.5,color:'#8e4539'}}>{data.error}</div>}
      </section>}

      {data&&!data.error&&<>
        <section style={{display:'grid',gridTemplateColumns:'repeat(5,minmax(0,1fr))',gap:10,marginTop:12}}>
          {[
            ['SESSIONS',data.totals.sessions],['TECHNICAL',data.totals.technical],['HIGH DEPTH',data.totals.highDepth],['ACTIVE TIME',fmtTime(data.totals.activeSeconds)],['DOWNLOADS',data.totals.downloads]
          ].map(([k,v])=><div key={String(k)} style={{padding:'15px 16px',border:'1px solid #c2c5c1',background:'#f9f8f4'}}><div style={{font:"700 9.5px 'Courier New',monospace",letterSpacing:'.08em',color:'#7b8282'}}>{k}</div><div style={{marginTop:5,fontFamily:"'Bodoni 72',Didot,'Times New Roman',serif",fontSize:28,fontWeight:600,color:'#293a42'}}>{v}</div></div>)}
        </section>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginTop:12,padding:'10px 0'}}>
          <div style={{font:"700 10px 'Courier New',monospace",letterSpacing:'.06em',color:'#7a8181'}}>ANONYMOUS REVIEWER SESSIONS</div>
          <button onClick={()=>load(key)} disabled={loading} style={{height:34,padding:'0 12px',border:'1px solid #8d9695',background:'#f8f7f2',font:"700 10px 'Courier New',monospace",cursor:'pointer'}}>{loading?'REFRESHING…':'REFRESH'}</button>
        </div>

        <section style={{display:'grid',gridTemplateColumns:'minmax(0,1.15fr) minmax(380px,.85fr)',gap:12,alignItems:'start'}}>
          <div style={{border:'1px solid #c2c5c1',background:'#fbfaf7'}}>
            <div style={{padding:'12px 14px',borderBottom:'1px solid #d0d2ce',font:"700 10.5px 'Courier New',monospace",letterSpacing:'.06em'}}>RECENT SESSIONS</div>
            <div style={{maxHeight:'70vh',overflow:'auto'}}>
              {data.sessions.length===0&&<div style={{padding:24,color:'#777',lineHeight:1.6}}>No persisted reviewer sessions yet. New non-owner visits after the Supabase connection will appear here automatically.</div>}
              {data.sessions.map(s=><button key={s.sessionId} onClick={()=>setSelected(s.sessionId)} style={{width:'100%',display:'grid',gridTemplateColumns:'96px 1fr 100px',gap:12,textAlign:'left',padding:'13px 14px',border:0,borderBottom:'1px solid #e1e1dc',background:selected===s.sessionId?'#f1f0e9':'transparent',cursor:'pointer',color:'#35434a'}}>
                <div><div style={{font:"700 10px 'Courier New',monospace",color:'#8e4539'}}>{s.country}</div><div style={{fontSize:11,color:'#7b8080',marginTop:4}}>{s.device}</div></div>
                <div><div style={{fontWeight:700,fontSize:13}}>{s.platform} · {s.browser}</div><div style={{fontSize:12.5,color:'#687074',marginTop:3}}>{s.behavior} · {s.pageViews} pages · {fmtTime(s.activeSeconds)}</div><div style={{font:"10px 'Courier New',monospace",color:'#8b8d8b',marginTop:4}}>{fmtDate(s.firstAt)} · {short(s.sessionId)}</div></div>
                <div style={{textAlign:'right'}}><div style={{font:"700 18px 'Courier New',monospace",color:s.score>=70?'#7a3f35':'#465960'}}>{s.score}</div><div style={{font:"9px 'Courier New',monospace",color:'#8b8d8b'}}>DEPTH SCORE</div></div>
              </button>)}
            </div>
          </div>

          <div style={{border:'1px solid #c2c5c1',background:'#fbfaf7',position:'sticky',top:16}}>
            <div style={{padding:'12px 14px',borderBottom:'1px solid #d0d2ce',font:"700 10.5px 'Courier New',monospace",letterSpacing:'.06em'}}>SESSION JOURNEY</div>
            {!active&&<div style={{padding:24,color:'#777',lineHeight:1.6}}>Select a session to inspect its anonymous navigation sequence.</div>}
            {active&&<div style={{padding:15}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:12.5,marginBottom:14}}><div><strong>{active.country}</strong><br/>{active.platform} · {active.browser}</div><div><strong>{active.behavior}</strong><br/>{fmtTime(active.activeSeconds)} active · depth {active.maxDepth}</div></div>
              <div style={{maxHeight:'58vh',overflow:'auto',borderTop:'1px solid #ddd'}}>{active.events.map((e,i)=><div key={`${e.seq}-${i}`} style={{display:'grid',gridTemplateColumns:'38px 1fr',gap:9,padding:'10px 0',borderBottom:'1px solid #ecebe6'}}><div style={{font:"700 10px 'Courier New',monospace",color:'#9a5c4f'}}>#{String(e.seq||i+1).padStart(2,'0')}</div><div><div style={{fontWeight:700,fontSize:12.5}}>{e.path||e.href||e.asset||e.event}</div><div style={{fontSize:11.5,color:'#737a7b',marginTop:2}}>{e.event}{e.targetKind?` · ${e.targetKind}`:''}{e.activeSeconds?` · ${fmtTime(e.activeSeconds)}`:''}</div>{e.label&&<div style={{fontSize:11.5,color:'#8a8d8b',marginTop:2}}>{e.label}</div>}</div></div>)}</div>
            </div>}
          </div>
        </section>
      </>}

      <footer style={{padding:'20px 2px 30px',font:"10px 'Courier New',monospace",color:'#898d8c'}}>PRIVACY BOUNDARY · COARSE COUNTRY / OS / BROWSER / DEVICE + FIRST-PARTY RANDOM SESSION IDS ONLY</footer>
    </div>

    <style>{`@media(max-width:900px){main section[style*="repeat(2"]{grid-template-columns:1fr!important}main section[style*="repeat(5"]{grid-template-columns:repeat(2,minmax(0,1fr))!important}main section[style*="1.15fr"]{grid-template-columns:1fr!important}}`}</style>
  </main>;
}
