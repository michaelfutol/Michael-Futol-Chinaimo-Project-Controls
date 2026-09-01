'use client';

import { useEffect } from 'react';

type ZoomMode = 'fit' | 100 | 125 | 150 | 200;
const ZOOM_STEPS = [100, 125, 150, 200] as const;

export default function GanttViewerControls() {
  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let attempts = 0;
    let observer: MutationObserver | null = null;

    const mount = () => {
      if (cancelled) return;
      attempts += 1;

      const frame = document.querySelector('iframe[data-gantt-gallery="1"]') as HTMLIFrameElement | null;
      if (!frame) {
        if (attempts < 180) raf = requestAnimationFrame(mount);
        return;
      }
      if (frame.dataset.zoomControlsMounted === '1') return;
      frame.dataset.zoomControlsMounted = '1';
      frame.setAttribute('allow', 'fullscreen');

      let zoom: ZoomMode = 'fit';
      const isMobile = window.matchMedia('(max-width:820px)').matches;
      const baseHeight = isMobile ? 660 : Math.max(860, Math.min(1080, Math.round(window.innerHeight * 0.78)));

      const toolbar = document.createElement('div');
      toolbar.className = 'gantt-zoom-toolbar';
      toolbar.setAttribute('role', 'toolbar');
      toolbar.setAttribute('aria-label', 'Gantt PDF viewer controls');

      const viewport = document.createElement('div');
      viewport.className = 'gantt-zoom-viewport';
      frame.insertAdjacentElement('beforebegin', viewport);
      viewport.appendChild(frame);
      viewport.insertAdjacentElement('beforebegin', toolbar);

      const status = document.createElement('span');
      status.className = 'gantt-zoom-label';
      status.textContent = 'CURRENT: FIT';

      const makeButton = (text: string, title: string, onClick: () => void) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gantt-zoom-button';
        button.textContent = text;
        button.title = title;
        button.addEventListener('click', onClick);
        toolbar.appendChild(button);
        return button;
      };

      const getBase = () => frame.src.split('#')[0];

      const applyZoom = (mode: ZoomMode) => {
        zoom = mode;
        const percent = mode === 'fit' ? 100 : mode;
        const factor = percent / 100;

        // Deliberately size the iframe itself instead of relying on Chrome PDF hash zoom,
        // which is inconsistent inside embedded PDF viewers. The outer viewport provides pan/scroll.
        frame.style.setProperty('width', `${percent}%`, 'important');
        frame.style.setProperty('height', `${Math.round(baseHeight * factor)}px`, 'important');
        frame.style.setProperty('min-height', `${Math.round(baseHeight * factor)}px`, 'important');
        status.textContent = mode === 'fit' ? 'CURRENT: FIT' : `CURRENT: ${mode}%`;
        toolbar.querySelectorAll<HTMLButtonElement>('[data-zoom-value]').forEach((button) => {
          button.classList.toggle('active', button.dataset.zoomValue === String(percent));
        });
      };

      const stepZoom = (direction: -1 | 1) => {
        const current = zoom === 'fit' ? 100 : zoom;
        let index = ZOOM_STEPS.indexOf(current as (typeof ZOOM_STEPS)[number]);
        if (index < 0) index = 0;
        index = Math.max(0, Math.min(ZOOM_STEPS.length - 1, index + direction));
        applyZoom(ZOOM_STEPS[index]);
      };

      const fitButton = makeButton('FIT', 'Fit the A2 Gantt page to the available viewer width', () => applyZoom('fit'));
      fitButton.dataset.zoomValue = '100';
      makeButton('−', 'Zoom out one step', () => stepZoom(-1));

      ZOOM_STEPS.forEach((value) => {
        const button = makeButton(`${value}%`, `Inspect the Gantt at ${value}%`, () => applyZoom(value));
        button.dataset.zoomValue = String(value);
      });

      makeButton('+', 'Zoom in one step', () => stepZoom(1));
      toolbar.appendChild(status);

      makeButton('FULL SCREEN', 'Inspect the embedded Gantt in full screen', async () => {
        try {
          if (frame.requestFullscreen) await frame.requestFullscreen();
        } catch {}
      });

      makeButton('OPEN FULL', 'Open this Gantt PDF in a full browser tab with native PDF controls', () => {
        window.open(getBase(), '_blank', 'noopener,noreferrer');
      });

      // The existing tab controller replaces iframe.src when the reviewer changes Gantt views.
      // Zoom is now element-based, so the same inspection scale survives the tab change.
      observer = new MutationObserver(() => requestAnimationFrame(() => applyZoom(zoom)));
      observer.observe(frame, { attributes: true, attributeFilter: ['src'] });

      applyZoom('fit');

      if (!document.getElementById('chinaimo-gantt-zoom-style')) {
        const style = document.createElement('style');
        style.id = 'chinaimo-gantt-zoom-style';
        style.textContent = `
          .gantt-zoom-toolbar{
            display:flex;align-items:center;flex-wrap:wrap;gap:6px;
            margin:10px 0 8px;padding:8px 9px;
            border:1px solid #b9bdbb;background:rgba(255,255,255,.38);
          }
          .gantt-zoom-viewport{
            width:100%;height:min(1120px,78vh);min-height:860px;
            overflow:auto;border:1px solid #bfc1bd;background:#fff;
          }
          .gantt-zoom-viewport iframe[data-gantt-gallery="1"]{
            display:block;border:0!important;max-width:none!important;background:#fff;
          }
          .gantt-zoom-button{
            min-height:31px;padding:6px 10px;border:1px solid #a9afad;background:#fbfaf7;
            color:#354247;font:700 11px/1 'Courier New',monospace;letter-spacing:.025em;
            cursor:pointer;transition:background .14s ease,border-color .14s ease,box-shadow .14s ease,color .14s ease;
          }
          .gantt-zoom-button:hover{background:#f2f3ef;border-color:#747e80;box-shadow:0 0 13px rgba(51,66,72,.08)}
          .gantt-zoom-button.active{background:#e5e8e3;border-color:#667476;color:#26373e}
          .gantt-zoom-label{
            min-width:104px;padding:7px 10px;text-align:center;border:1px solid #2e4149;background:#2e4149;
            color:#faf9f5;font:700 11px/1 'Courier New',monospace;letter-spacing:.03em;
          }
          iframe[data-gantt-gallery="1"]:fullscreen{width:100vw!important;height:100vh!important;min-height:100vh!important;border:0!important;background:#fff}
          @media(max-width:820px){
            .gantt-zoom-toolbar{gap:5px;padding:7px 6px}
            .gantt-zoom-button{padding:6px 8px;font-size:10px}
            .gantt-zoom-label{min-width:94px;font-size:10px}
            .gantt-zoom-viewport{height:72vh;min-height:640px}
          }
        `;
        document.head.appendChild(style);
      }
    };

    raf = requestAnimationFrame(mount);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  return null;
}
