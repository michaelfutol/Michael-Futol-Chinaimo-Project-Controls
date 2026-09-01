'use client';

import { useEffect } from 'react';

const SVG_SELECTOR = 'svg[aria-label="Baseline, current forecast and recovery S-curve"]';
const NS = 'http://www.w3.org/2000/svg';

function makeSvg<K extends keyof SVGElementTagNameMap>(name: K) {
  return document.createElementNS(NS, name);
}

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

      const chartW = 1000;
      const chartH = 430;
      const left = 72;
      const right = 976;
      const top = 28;
      const bottom = 368;
      const plotW = right - left;
      const plotH = bottom - top;
      const xForIndex = (i: number) => left + (i / 32) * plotW;
      const yForValue = (v: number) => top + (1 - v) * plotH;

      // Extend the engineering inspection crosshair across the complete SVG window,
      // including axis-label margins, while retaining the existing monthly snap logic.
      const crosshairLines = Array.from(layer.querySelectorAll('line.curve-crosshair-line')) as SVGLineElement[];
      if (crosshairLines[0]) {
        crosshairLines[0].setAttribute('y1', '0');
        crosshairLines[0].setAttribute('y2', String(chartH));
      }
      if (crosshairLines[1]) {
        crosshairLines[1].setAttribute('x1', '0');
        crosshairLines[1].setAttribute('x2', String(chartW));
      }

      // Add a restrained school-graph-paper grid behind the data.
      // Major gridlines remain stronger; minor lines show 10% and monthly increments.
      if (!svg.querySelector('[data-notebook-grid]')) {
        const grid = makeSvg('g');
        grid.setAttribute('data-notebook-grid', '1');
        grid.setAttribute('pointer-events', 'none');

        [0.1, 0.3, 0.5, 0.7, 0.9].forEach((value) => {
          const line = makeSvg('line');
          line.setAttribute('x1', String(left));
          line.setAttribute('x2', String(right));
          line.setAttribute('y1', String(yForValue(value)));
          line.setAttribute('y2', String(yForValue(value)));
          line.setAttribute('class', 'notebook-grid-minor');
          grid.appendChild(line);
        });

        const majorMonthIndexes = new Set([0, 4, 8, 12, 16, 20, 24, 28, 32]);
        for (let i = 1; i < 32; i += 1) {
          if (majorMonthIndexes.has(i)) continue;
          const line = makeSvg('line');
          line.setAttribute('x1', String(xForIndex(i)));
          line.setAttribute('x2', String(xForIndex(i)));
          line.setAttribute('y1', String(top));
          line.setAttribute('y2', String(bottom));
          line.setAttribute('class', 'notebook-grid-minor');
          grid.appendChild(line);
        }

        const plotBackground = svg.querySelector('rect');
        if (plotBackground) plotBackground.insertAdjacentElement('afterend', grid);
        else svg.insertBefore(grid, svg.firstChild);
      }

      // Tint the original major graph lines toward a muted green notebook tone.
      svg.querySelectorAll('line[stroke="#dedbd3"]').forEach((line) => {
        line.setAttribute('stroke', '#9eaf98');
        line.setAttribute('opacity', '.46');
      });
      svg.querySelectorAll('line[stroke="#eeeae2"]').forEach((line) => {
        line.setAttribute('stroke', '#b7c4b1');
        line.setAttribute('opacity', '.43');
      });

      // Make the baseline visually originate at 0% without changing any Annex value.
      // The first Annex control point remains Oct-25 = 1%; this is only a commencement anchor.
      const baseline = svg.querySelector('polyline') as SVGPolylineElement | null;
      if (baseline && baseline.dataset.originAnchored !== '1') {
        const existing = (baseline.getAttribute('points') || '').trim();
        if (existing) baseline.setAttribute('points', `${left},${bottom} ${existing}`);
        baseline.dataset.originAnchored = '1';

        const anchor = makeSvg('circle');
        anchor.setAttribute('cx', String(left));
        anchor.setAttribute('cy', String(bottom));
        anchor.setAttribute('r', '2.8');
        anchor.setAttribute('fill', '#263b49');
        anchor.setAttribute('stroke', '#f9f8f3');
        anchor.setAttribute('stroke-width', '1.2');
        anchor.setAttribute('data-baseline-origin', '1');
        baseline.insertAdjacentElement('afterend', anchor);
      }

      // Ground the known progress evidence in the published project commencement.
      // This is deliberately a dashed connector between three known anchors only:
      // public start 0%, public 4.19% checkpoint, and simulated 12.095% assessment status.
      // It is NOT a monthly actual-progress series and does not invent intermediate actuals.
      if (!svg.querySelector('[data-evidence-trace]')) {
        const evidenceGroup = makeSvg('g');
        evidenceGroup.setAttribute('data-evidence-trace', '1');
        evidenceGroup.setAttribute('pointer-events', 'none');

        const p0 = { x: left, y: bottom };
        const p1 = { x: xForIndex(7), y: yForValue(0.0419) };
        const p2 = { x: xForIndex(10), y: yForValue(0.12095) };

        const trace = makeSvg('polyline');
        trace.setAttribute('points', `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`);
        trace.setAttribute('fill', 'none');
        trace.setAttribute('class', 'evidence-anchor-trace');
        evidenceGroup.appendChild(trace);

        const startRing = makeSvg('circle');
        startRing.setAttribute('cx', String(p0.x));
        startRing.setAttribute('cy', String(p0.y));
        startRing.setAttribute('r', '5.2');
        startRing.setAttribute('fill', '#f9f8f3');
        startRing.setAttribute('stroke', '#617b61');
        startRing.setAttribute('stroke-width', '1.7');
        startRing.setAttribute('class', 'evidence-start-ring');
        evidenceGroup.appendChild(startRing);

        // Insert before the existing evidence circles/text so the original evidence points stay crisp on top.
        const firstEvidenceCircle = Array.from(svg.querySelectorAll('circle')).find(
          (circle) => circle.getAttribute('fill') === '#0b6b50'
        );
        if (firstEvidenceCircle) svg.insertBefore(evidenceGroup, firstEvidenceCircle);
        else svg.appendChild(evidenceGroup);
      }

      // Make the legend explicit that the green line is only an anchor connector.
      const reportedLegend = Array.from(document.querySelectorAll('span')).find((span) =>
        (span.textContent || '').trim().toUpperCase().includes('REPORTED / ASSESSMENT POINTS')
      ) as HTMLSpanElement | undefined;
      if (reportedLegend && reportedLegend.dataset.traceLegend !== '1') {
        const swatch = reportedLegend.querySelector('i') as HTMLElement | null;
        if (swatch) {
          swatch.style.width = '20px';
          swatch.style.height = '0';
          swatch.style.borderRadius = '0';
          swatch.style.background = 'transparent';
          swatch.style.borderTop = '2px dashed #617b61';
        }
        Array.from(reportedLegend.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && (node.textContent || '').includes('Reported / assessment points')) {
            node.textContent = ' Reported / assessment anchors';
          }
        });
        reportedLegend.dataset.traceLegend = '1';
      }

      // Clarify the visual connector so no reviewer can mistake it for invented monthly actuals.
      const note = Array.from(document.querySelectorAll('p')).find((p) =>
        (p.textContent || '').startsWith('The plotted monthly curve values reproduce the S-Curve Annex')
      ) as HTMLParagraphElement | undefined;
      if (note && note.dataset.evidenceNote !== '1') {
        note.textContent = `${note.textContent} The thin green dashed connector joins only the published project start, the 4.19% public checkpoint, and the 12.095% assessment status anchor; it is not an interpolated monthly actual-progress series.`;
        note.dataset.evidenceNote = '1';
      }

      if (!document.getElementById('chinaimo-scurve-precision-style')) {
        const style = document.createElement('style');
        style.id = 'chinaimo-scurve-precision-style';
        style.textContent = `
          ${SVG_SELECTOR} { cursor: crosshair; }
          ${SVG_SELECTOR} .notebook-grid-minor {
            stroke: rgba(116,139,110,.22);
            stroke-width: .72;
            vector-effect: non-scaling-stroke;
          }
          ${SVG_SELECTOR} .evidence-anchor-trace {
            stroke: #617b61;
            stroke-width: 1.7;
            stroke-dasharray: 6 5;
            opacity: .78;
            vector-effect: non-scaling-stroke;
          }
          ${SVG_SELECTOR} .evidence-start-ring {
            vector-effect: non-scaling-stroke;
          }
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
