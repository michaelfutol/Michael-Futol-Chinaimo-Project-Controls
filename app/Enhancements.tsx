'use client';

import { useEffect } from 'react';

const chartMonths = [
  'Oct-25','Nov-25','Dec-25','Jan-26','Feb-26','Mar-26','Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26',
  'Oct-26','Nov-26','Dec-26','Jan-27','Feb-27','Mar-27','Apr-27','May-27','Jun-27','Jul-27','Aug-27','Sep-27',
  'Oct-27','Nov-27','Dec-27','Jan-28','Feb-28','Mar-28','Apr-28','May-28','Jun-28'
] as const;

const jpHeadings: Record<string,string> = {
  'Downloads':'ダウンロード',
  'Project Information':'プロジェクト情報',
  'Schedule Progress S-Curve':'工程進捗 Sカーブ',
  'Assessment BOQ / Control Budget':'評価用 BOQ / 管理予算',
  'Assessment Baseline Gantt Chart':'工程表ビュー',
  'Schedule View Gallery':'工程表ビュー'
};

const ganttViews = [
  {label:'Baseline Gantt',jp:'ベースライン工程表',src:'/downloads/printouts/Michael_Futol_Chinaimo_Baseline_Gantt_A2.pdf',note:'Preserved baseline programme. Use this as the reference schedule for planned dates and subsequent variance comparison.'},
  {label:'Actual Tracking',jp:'進捗追跡工程表',src:'/downloads/printouts/Michael_Futol_Chinaimo_Actual_Tracking_Gantt_A2.pdf',note:'Statused current-forecast view at the assessment data date. Baseline remains preserved for direct comparison.'},
  {label:'Actual Critical Path',jp:'現況クリティカルパス',src:'/downloads/printouts/Michael_Futol_Chinaimo_Actual_Critical_Path_A2.pdf',note:'Critical-filtered current programme showing the activities that control the forecast completion path.'},
  {label:'Recovery Tracking',jp:'回復工程追跡表',src:'/downloads/printouts/Michael_Futol_Chinaimo_Recovery_Tracking_Gantt_A2.pdf',note:'Partial-recovery programme compared against the preserved baseline and current forecast.'},
  {label:'Recovery Critical Path',jp:'回復クリティカルパス',src:'/downloads/printouts/Michael_Futol_Chinaimo_Recovery_Critical_Path_A2.pdf',note:'Critical-filtered recovery programme showing the residual path controlling the recovery finish.'}
] as const;

type SvgPoint = { x:number; y:number; color:string; label:string; value:number };

function svgEl<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string,string>) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
  return el;
}

export default function Enhancements(){
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll('main article section h2').forEach((heading) => {
      const h = heading as HTMLElement;
      if (h.querySelector('.jp-heading')) return;
      const english = (h.textContent || '').trim();
      const jp = jpHeadings[english];
      if (!jp) return;
      const span = document.createElement('span');
      span.className = 'jp-heading';
      span.lang = 'ja';
      span.textContent = jp;
      h.appendChild(span);
    });

    const title = document.querySelector('main article header h1');
    if (title && !document.querySelector('.jp-main-title')) {
      const jp = document.createElement('div');
      jp.className = 'jp-main-title';
      jp.lang = 'ja';
      jp.textContent = 'チャイナイモ・プロジェクト コントロール技術評価';
      title.insertAdjacentElement('afterend', jp);
    }

    const sections = Array.from(document.querySelectorAll('main article section')) as HTMLElement[];
    const ganttSection = sections.find((s) => (s.querySelector('h2')?.textContent || '').includes('Assessment Baseline Gantt Chart'));
    if (ganttSection && !ganttSection.querySelector('[data-gantt-tabs]')) {
      const heading = ganttSection.querySelector('h2') as HTMLElement | null;
      const intro = ganttSection.querySelector('p') as HTMLElement | null;
      const frame = ganttSection.querySelector('iframe') as HTMLIFrameElement | null;
      const actions = ganttSection.querySelector('div:last-child') as HTMLElement | null;
      if (heading && frame && actions) {
        heading.childNodes.forEach((node) => { if (node.nodeType === Node.TEXT_NODE) node.textContent = ''; });
        heading.insertBefore(document.createTextNode('Schedule View Gallery'), heading.firstChild);
        const oldJp = heading.querySelector('.jp-heading');
        if (oldJp) oldJp.textContent = '工程表ビュー';
        if (intro) intro.textContent = 'Five A2 native Microsoft Project schedule views. Select a tab to inspect the baseline, current tracking, critical path, and recovery evidence.';

        const tabs = document.createElement('div');
        tabs.className = 'gantt-tabs';
        tabs.dataset.ganttTabs = '1';
        frame.dataset.ganttGallery = '1';
        frame.title = 'Chinaimo schedule view';
        frame.insertAdjacentElement('beforebegin', tabs);

        const guide = document.createElement('div');
        guide.className = 'gantt-view-guide';
        frame.insertAdjacentElement('afterend', guide);

        const primary = actions.querySelector('a:first-child') as HTMLAnchorElement | null;
        const secondary = actions.querySelector('a:nth-child(2)') as HTMLAnchorElement | null;

        const setView = (index:number) => {
          const item = ganttViews[index];
          frame.src = `${item.src}#toolbar=0&navpanes=0&view=FitH`;
          guide.innerHTML = `<strong>${item.label}</strong><span lang="ja">${item.jp}</span><p>${item.note}</p>`;
          tabs.querySelectorAll('button').forEach((b,i) => b.classList.toggle('active', i === index));
          if (primary) { primary.href = item.src; primary.textContent = `Open / Download ${item.label} PDF`; }
          if (secondary) {
            const isRecovery = index >= 3;
            secondary.href = isRecovery ? '/downloads/Michael_Futol_Chinaimo_Recovery.mpp' : (index === 0 ? '/downloads/Michael_Futol_Chinaimo_Baseline.mpp' : '/downloads/Michael_Futol_Chinaimo_Actual_Progress.mpp');
            secondary.textContent = isRecovery ? 'Download Recovery MPP' : (index === 0 ? 'Download Baseline MPP' : 'Download Actual Progress MPP');
          }
        };

        ganttViews.forEach((item,index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'gantt-tab';
          button.innerHTML = `<span>${item.label}</span><small lang="ja">${item.jp}</small>`;
          button.addEventListener('click', () => setView(index));
          tabs.appendChild(button);
        });
        setView(0);
      }
    }

    const svg = document.querySelector('svg[aria-label="Baseline, current forecast and recovery S-curve"]') as SVGSVGElement | null;
    if (svg && !svg.querySelector('[data-crosshair-layer]')) {
      const left=72, right=976, top=28, bottom=368, plotW=904, plotH=340;
      const xForIndex = (i:number) => left + (i/32)*plotW;
      const layer = svgEl('g', {'data-crosshair-layer':'1','pointer-events':'none'});

      const defs = svgEl('defs',{});
      const filter = svgEl('filter',{id:'curveGlow',x:'-250%',y:'-250%',width:'500%',height:'500%'});
      const blur = svgEl('feGaussianBlur',{stdDeviation:'7',result:'blur'});
      const merge = svgEl('feMerge',{});
      merge.append(svgEl('feMergeNode',{in:'blur'}), svgEl('feMergeNode',{in:'SourceGraphic'}));
      filter.append(blur,merge); defs.append(filter); layer.append(defs);

      const vLine = svgEl('line',{x1:'0',x2:'0',y1:String(top),y2:String(bottom),class:'curve-crosshair-line'});
      const hLine = svgEl('line',{x1:String(left),x2:String(right),y1:'0',y2:'0',class:'curve-crosshair-line'});
      const xTag = svgEl('g',{class:'curve-axis-tag'});
      const xRect = svgEl('rect',{x:'0',y:String(bottom+10),width:'88',height:'25',rx:'2'});
      const xText = svgEl('text',{x:'0',y:String(bottom+27),'text-anchor':'middle'});
      xTag.append(xRect,xText);
      const yTag = svgEl('g',{class:'curve-axis-tag'});
      const yRect = svgEl('rect',{x:'8',y:'0',width:'55',height:'24',rx:'2'});
      const yText = svgEl('text',{x:'35',y:'0','text-anchor':'middle'});
      yTag.append(yRect,yText);
      const glow = svgEl('circle',{cx:'0',cy:'0',r:'13',class:'curve-hit-glow'});
      const hit = svgEl('circle',{cx:'0',cy:'0',r:'4.8',class:'curve-hit-dot'});
      const hitLabel = svgEl('text',{x:'0',y:'0',class:'curve-hit-label'});
      layer.append(vLine,hLine,xTag,yTag,glow,hit,hitLabel);
      svg.appendChild(layer);
      layer.setAttribute('visibility','hidden');

      const polylines = Array.from(svg.querySelectorAll('polyline')).slice(0,3) as SVGPolylineElement[];
      const curveMeta = [
        {label:'BASELINE',color:'#263b49'},
        {label:'CURRENT',color:'#8a6f36'},
        {label:'RECOVERY',color:'#b3212d'}
      ];
      const parsed = polylines.map((line,curveIndex) => (line.getAttribute('points') || '').trim().split(/\s+/).filter(Boolean).map((p) => {
        const [xs,ys] = p.split(','); const xx=Number(xs), yy=Number(ys);
        return {x:xx,y:yy,color:curveMeta[curveIndex].color,label:curveMeta[curveIndex].label,value:(bottom-yy)/plotH};
      }));

      const onMove = (event:PointerEvent) => {
        const ctm = svg.getScreenCTM(); if(!ctm) return;
        const pt = svg.createSVGPoint(); pt.x=event.clientX; pt.y=event.clientY;
        const local = pt.matrixTransform(ctm.inverse());
        if(local.x < left || local.x > right || local.y < top || local.y > bottom){ layer.setAttribute('visibility','hidden'); return; }
        layer.setAttribute('visibility','visible');
        const idx = Math.max(0,Math.min(32,Math.round(((local.x-left)/plotW)*32)));
        const sx = xForIndex(idx);
        let sy = Math.max(top,Math.min(bottom,local.y));
        let nearest:SvgPoint|null = null;
        let nearestDist = Infinity;
        for(const series of parsed){
          const p = series.find((item) => Math.abs(item.x-sx)<1.6);
          if(!p) continue;
          const dist=Math.abs(p.y-local.y);
          if(dist<nearestDist){nearest=p;nearestDist=dist;}
        }
        const isHit = !!nearest && nearestDist <= 16;
        if(isHit && nearest) sy=nearest.y;
        vLine.setAttribute('x1',String(sx)); vLine.setAttribute('x2',String(sx));
        hLine.setAttribute('y1',String(sy)); hLine.setAttribute('y2',String(sy));
        xRect.setAttribute('x',String(Math.max(left,Math.min(right-88,sx-44))));
        xText.setAttribute('x',String(Math.max(left+44,Math.min(right-44,sx)))); xText.textContent=chartMonths[idx];
        yRect.setAttribute('y',String(Math.max(top,Math.min(bottom-24,sy-12))));
        yText.setAttribute('y',String(Math.max(top+16,Math.min(bottom-7,sy+5)))); yText.textContent=`${(((bottom-sy)/plotH)*100).toFixed(1)}%`;
        if(isHit && nearest){
          glow.setAttribute('visibility','visible'); hit.setAttribute('visibility','visible'); hitLabel.setAttribute('visibility','visible');
          glow.setAttribute('cx',String(nearest.x)); glow.setAttribute('cy',String(nearest.y)); glow.setAttribute('fill',nearest.color); glow.setAttribute('filter','url(#curveGlow)');
          hit.setAttribute('cx',String(nearest.x)); hit.setAttribute('cy',String(nearest.y)); hit.setAttribute('fill',nearest.color);
          hitLabel.setAttribute('x',String(Math.min(right-145,nearest.x+11))); hitLabel.setAttribute('y',String(Math.max(top+14,nearest.y-10)));
          hitLabel.textContent=`${nearest.label} ${(nearest.value*100).toFixed(nearest.value<.2?3:1)}%`;
        }else{
          glow.setAttribute('visibility','hidden'); hit.setAttribute('visibility','hidden'); hitLabel.setAttribute('visibility','hidden');
        }
      };
      const onLeave = () => layer.setAttribute('visibility','hidden');
      svg.addEventListener('pointermove',onMove); svg.addEventListener('pointerleave',onLeave);
      cleanups.push(() => {svg.removeEventListener('pointermove',onMove);svg.removeEventListener('pointerleave',onLeave);layer.remove();});
    }

    return () => cleanups.forEach((fn) => fn());
  },[]);

  return null;
}
