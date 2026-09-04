'use client';

import { useEffect, useMemo, useState } from 'react';
import p01 from './studio-parts/p01';
import p02 from './studio-parts/p02';
import p03 from './studio-parts/p03';
import p04 from './studio-parts/p04';
import p05 from './studio-parts/p05';
import p06 from './studio-parts/p06';
import p07 from './studio-parts/p07';

const OWNER_KEY = 'chinaimo_owner_exempt';

export default function ReviewerIntelligence() {
  const [owner, setOwner] = useState(false);
  const studioDoc = useMemo(() => p01 + p02 + p03 + p04 + p05 + p06 + p07, []);

  useEffect(() => {
    try {
      setOwner(localStorage.getItem(OWNER_KEY) === '1');
    } catch {}
  }, []);

  if (!owner) {
    return (
      <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#111719',color:'#F4F0E5',fontFamily:'system-ui,sans-serif'}}>
        <section style={{width:'min(520px,calc(100% - 40px))',padding:28,border:'1px solid rgba(234,226,209,.16)',background:'#172024'}}>
          <div style={{font:'600 10px ui-monospace,monospace',letterSpacing:'.16em',color:'#9FB0A9'}}>MUNIGEN / ANALYTICS</div>
          <h1 style={{font:'italic 400 40px Georgia,serif',margin:'8px 0'}}>Private console</h1>
          <p style={{color:'#B9B29F',lineHeight:1.6}}>Return to the assessment and use the 1 → 3 → 7 gesture.</p>
          <a href="/" style={{color:'#F4F0E5',textDecoration:'none',borderBottom:'1px solid #4E9F94'}}>Return to assessment</a>
        </section>
      </main>
    );
  }

  return (
    <iframe
      title="Munigen Chinaimo Analytics Console"
      srcDoc={studioDoc}
      style={{position:'fixed',inset:0,width:'100vw',height:'100vh',border:0,background:'#F4F0E5'}}
    />
  );
}
