'use client';

import { useEffect } from 'react';

type ZoomMode = 'fit' | number;

const ZOOM_STEPS = [80, 100, 125, 150, 175, 200, 250] as const;

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
      let applying = false;

      const toolbar = document.createElement('div');
      toolbar.className = 'gantt-zoom-toolbar';
      toolbar.setAttribute('role', 'toolbar');
      toolbar.setAttribute('aria-label', 'Gantt PDF viewer controls');

      const label = document.createElement('span');
      label.className = 'gantt-zoom-label';
      label.textContent = 'FIT WIDTH';

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

      const applyZoom = (mode: ZoomMode, baseOverride?: string) => {
        zoom = mode;
        const base = baseOverride || getBase();
        const fragment = mode === 'fit' ? 'page=1&view=FitH' : `page=1&zoom=${mode}`;
        const next = `${base}#${fragment}`;
        label.textContent = mode === 'fit' ? 'FIT WIDTH' : `${mode}%`;
        if (frame.src !== next) {
          applying = true;
          frame.src = next;
          requestAnimationFrame(() => { applying = false; });
        }
      };

      const stepZoom = (direction: -1 | 1) => {
        const current = zoom === 'fit' ? 100 : zoom;
        let index = ZOOM_STEPS.findIndex((value) => value >= current);
        if (index < 0) index = ZOOM_STEPS.length - 1;
        if (direction < 0 && ZOOM_STEPS[index] >= current) index -= 1;
        if (direction > 0 && ZOOM_STEPS[index] <= current) index += 1;
        index = Math.max(0, Math.min(ZOOM_STEPS.length - 1, index));
        applyZoom(ZOOM_STEPS[index]);
      };

      makeButton('FIT WIDTH', 'Fit the A2 Gantt page to the viewer width', () => applyZoom('fit'));
      makeButton('−', 'Zoom out', () => stepZoom(-1));
      toolbar.appendChild(label);
      makeButton('+', 'Zoom in', () => stepZoom(1));

      [100, 125, 150, 200].forEach((value) => {
        makeButton(`${value}%`, `Zoom to ${value}%`, () => applyZoom(value));
      });

      makeButton('FULL SCREEN', 'Inspect the embedded Gantt in full screen', async () => {
        try {
          if (frame.requestFullscreen) await frame.requestFullscreen();
        } catch {}
      });

      makeButton('OPEN FULL', 'Open this Gantt PDF in a full browser tab', () => {
        const base = getBase();
        const fragment = zoom === 'fit' ? 'page=1&view=FitH' : `page=1&zoom=${zoom}`;
        window.open(`${base}#${fragment}`, '_blank', 'noopener,noreferrer');
      });

      frame.insertAdjacentElement('beforebegin', toolbar);

      // The existing tab controller replaces iframe.src when a reviewer changes Gantt views.
      // Preserve the selected zoom and strip the old hidden-toolbar fragment each time.
      observer = new MutationObserver(() => {
        if (applying) return;
        const base = getBase();
        requestAnimationFrame(() => applyZoom(zoom, base));
      });
      observer.observe(frame, { attributes: true, attributeFilter: ['src'] });

      // Start with an actual readable fit-width view; native PDF toolbar remains available.
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
          .gantt-zoom-button{
            min-height:31px;padding:6px 10px;border:1px solid #a9afad;background:#fbfaf7;
            color:#354247;font:700 11px/1 'Courier New',monospace;letter-spacing:.025em;
            cursor:pointer;transition:background .14s ease,border-color .14s ease,box-shadow .14s ease;
          }
          .gantt-zoom-button:hover{background:#f2f3ef;border-color:#747e80;box-shadow:0 0 13px rgba(51,66,72,.08)}
          .gantt-zoom-label{
            min-width:78px;padding:7px 10px;text-align:center;border:1px solid #2e4149;background:#2e4149;
            color:#faf9f5;font:700 11px/1 'Courier New',monospace;letter-spacing:.03em;
          }
          iframe[data-gantt-gallery="1"]{
            height:min(1120px,78vh) !important;min-height:860px;background:#fff;
          }
          iframe[data-gantt-gallery="1"]:fullscreen{width:100vw!important;height:100vh!important;min-height:100vh!important;border:0!important;background:#fff}
          @media(max-width:820px){
            .gantt-zoom-toolbar{gap:5px;padding:7px 6px}
            .gantt-zoom-button{padding:6px 8px;font-size:10px}
            .gantt-zoom-label{min-width:68px;font-size:10px}
            iframe[data-gantt-gallery="1"]{height:72vh!important;min-height:640px}
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
