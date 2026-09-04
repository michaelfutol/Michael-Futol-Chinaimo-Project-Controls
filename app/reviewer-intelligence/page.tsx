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

const READABILITY_PATCH = String.raw`
<style id="munigen-readable-type-standard">
  html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
  body { font-size: 16px; line-height: 1.5; }
  p, .subtitle, .plate-copy p, .workspace-head p, .empty-composition small {
    font-size: 14px !important;
    line-height: 1.5 !important;
  }
  button, a, input, select, textarea {
    font-size: 14px !important;
    line-height: 1.35 !important;
  }
  small {
    font-size: 12px !important;
    line-height: 1.45 !important;
  }
</style>
<script>
(function () {
  var MIN_META = 12;
  var MIN_SUPPORT = 14;
  var SUPPORT_SELECTOR = 'p,.subtitle,.plate-copy p,.workspace-head p,.empty-composition small';
  var INTERACTIVE_SELECTOR = 'button,a,input,select,textarea';
  var DECORATIVE_SELECTOR = '.notebook,.margin-scale';

  function hasOwnText(el) {
    if (el.tagName && el.tagName.toLowerCase() === 'text') return true;
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeType === 3 && node.textContent && node.textContent.trim()) return true;
    }
    return false;
  }

  function applyReadableType() {
    var nodes = document.querySelectorAll('body *');
    nodes.forEach(function (el) {
      if (el.closest && el.closest(DECORATIVE_SELECTOR)) return;
      if (!hasOwnText(el)) return;

      var style = getComputedStyle(el);
      var size = parseFloat(style.fontSize);
      if (!Number.isFinite(size)) return;

      var floor = MIN_META;
      if (el.matches && el.matches(INTERACTIVE_SELECTOR)) floor = MIN_SUPPORT;
      if (el.matches && el.matches(SUPPORT_SELECTOR)) floor = MIN_SUPPORT;

      if (size < floor) el.style.fontSize = floor + 'px';

      if (el.matches && (el.matches('p,small,.subtitle,.plate-copy p,.workspace-head p,.empty-composition small'))) {
        el.style.lineHeight = '1.5';
      }
    });
  }

  window.addEventListener('DOMContentLoaded', applyReadableType);
  window.addEventListener('load', applyReadableType);

  var observer = new MutationObserver(function () {
    window.requestAnimationFrame(applyReadableType);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

export default function ReviewerIntelligence() {
  const [owner, setOwner] = useState(false);
  const studioDoc = useMemo(() => {
    const source = p01 + p02 + p03 + p04 + p05 + p06 + p07;
    return source.includes('</head>')
      ? source.replace('</head>', `${READABILITY_PATCH}</head>`)
      : `${READABILITY_PATCH}${source}`;
  }, []);

  useEffect(() => {
    try {
      setOwner(localStorage.getItem(OWNER_KEY) === '1');
    } catch {}
  }, []);

  if (!owner) {
    return (
      <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#111719',color:'#F4F0E5',fontFamily:'system-ui,sans-serif',fontSize:16,lineHeight:1.5}}>
        <section style={{width:'min(520px,calc(100% - 40px))',padding:28,border:'1px solid rgba(234,226,209,.16)',background:'#172024'}}>
          <div style={{font:'600 12px ui-monospace,monospace',letterSpacing:'.16em',color:'#9FB0A9'}}>MUNIGEN / ANALYTICS</div>
          <h1 style={{font:'italic 400 40px Georgia,serif',margin:'8px 0'}}>Private console</h1>
          <p style={{fontSize:16,color:'#B9B29F',lineHeight:1.6}}>Return to the assessment and use the 1 → 3 → 7 gesture.</p>
          <a href="/" style={{fontSize:14,color:'#F4F0E5',textDecoration:'none',borderBottom:'1px solid #4E9F94'}}>Return to assessment</a>
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
