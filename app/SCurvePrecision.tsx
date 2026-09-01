'use client';

import { useEffect } from 'react';

const SVG_SELECTOR = 'svg[aria-label="Baseline, current forecast and recovery S-curve"]';

export default function SCurvePrecision() {
  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let attempts = 0;

    const apply = () => {
      if (cancelled) return;
      attempts += 1;

      const svg = document.querySelector(SVG_SELECTOR) as SVGSVGElement | null;
      const layer = svg?.querySelector('[data-crosshair-layer]') as SVGGElement | null;

      if (!svg || !layer) {
        if (attempts < 90) raf = requestAnimationFrame(apply);
        return;
      }

      // Extend the engineering inspection crosshair across the complete SVG window,
      // including the axis-label margins, while retaining the existing snap logic.
      const lines = Array.from(layer.querySelectorAll('line.curve-crosshair-line')) as SVGLineElement[];
      if (lines[0]) {
        lines[0].setAttribute('y1', '0');
        lines[0].setAttribute('y2', '430');
      }
      if (lines[1]) {
        lines[1].setAttribute('x1', '0');
        lines[1].setAttribute('x2', '1000');
      }

      // Make the baseline visually originate at 0% without changing any Annex value.
      // The first Annex control point remains Oct-25 = 1%; this is only a commencement anchor.
      const baseline = svg.querySelector('polyline') as SVGPolylineElement | null;
      if (baseline && baseline.dataset.originAnchored !== '1') {
        const existing = (baseline.getAttribute('points') || '').trim();
        if (existing) baseline.setAttribute('points', `72,368 ${existing}`);
        baseline.dataset.originAnchored = '1';

        const anchor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        anchor.setAttribute('cx', '72');
        anchor.setAttribute('cy', '368');
        anchor.setAttribute('r', '2.8');
        anchor.setAttribute('fill', '#263b49');
        anchor.setAttribute('stroke', '#f9f8f3');
        anchor.setAttribute('stroke-width', '1.2');
        anchor.setAttribute('data-baseline-origin', '1');
        baseline.insertAdjacentElement('afterend', anchor);
      }

      if (!document.getElementById('chinaimo-scurve-precision-style')) {
        const style = document.createElement('style');
        style.id = 'chinaimo-scurve-precision-style';
        style.textContent = `
          ${SVG_SELECTOR} { cursor: crosshair; }
          ${SVG_SELECTOR} .curve-crosshair-line {
            stroke: rgba(38,59,73,.34) !important;
            stroke-width: .9 !important;
            stroke-dasharray: 3 4 !important;
            vector-effect: non-scaling-stroke;
          }
          ${SVG_SELECTOR} .curve-hit-glow {
            opacity: .72;
            transform-box: fill-box;
            transform-origin: center;
            animation: chinaimoCurvePointBreath 1.05s ease-in-out infinite;
          }
          ${SVG_SELECTOR} .curve-hit-dot {
            stroke: #f9f8f3 !important;
            stroke-width: 2.2 !important;
            vector-effect: non-scaling-stroke;
          }
          ${SVG_SELECTOR} .curve-hit-label {
            paint-order: stroke fill;
            stroke: rgba(249,248,243,.94);
            stroke-width: 3px;
            stroke-linejoin: round;
          }
          @keyframes chinaimoCurvePointBreath {
            0%,100% { transform: scale(.88); opacity:.50; }
            50% { transform: scale(1.18); opacity:.92; }
          }
          @media (prefers-reduced-motion: reduce) {
            ${SVG_SELECTOR} .curve-hit-glow { animation:none; }
          }
        `;
        document.head.appendChild(style);
      }
    };

    raf = requestAnimationFrame(apply);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
