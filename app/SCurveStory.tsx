'use client';

import { useEffect } from 'react';

const SVG_SELECTOR = 'svg[aria-label="Baseline, current forecast and recovery S-curve"]';
const NS = 'http://www.w3.org/2000/svg';

const months = [
  'Oct-25','Nov-25','Dec-25','Jan-26','Feb-26','Mar-26','Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26',
  'Oct-26','Nov-26','Dec-26','Jan-27','Feb-27','Mar-27','Apr-27','May-27','Jun-27','Jul-27','Aug-27','Sep-27',
  'Oct-27','Nov-27','Dec-27','Jan-28','Feb-28','Mar-28','Apr-28','May-28','Jun-28'
] as const;

const baseline: Array<number | null> = [
  .01,.025,.045,.07,.10,.14,.18,.23,.29,.35,.41,.47,.53,.59,.65,.71,.76,.81,.86,.90,.93,.95,.97,.985,.993,.997,1,1,1,1,1,1,1
];
const current: Array<number | null> = [
  null,null,null,null,null,null,null,null,null,null,.12095,.1262021655,.1419657642,.1662146251,.1995110758,.2401103454,.2821565875,.3336621814,.3874764253,.4461326726,.5048374844,.5664502518,.6279581940,.6863619471,.7445008315,.7976147868,.8481904802,.8933152657,.9296344961,null,null,null,1
];
const recovery: Array<number | null> = [
  null,null,null,null,null,null,null,null,null,null,.12095,.1274934720,.1470261598,.1768767471,.2175610684,.2667470224,.3172204948,.3784023566,.4415338969,.5093496802,.5760633519,.6446482855,.7113765407,.7727578166,.8314099935,.8821379173,.9268492448,.9622283203,.9855345797,null,1,null,null
];

function svgEl<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string> = {}) {
  const el = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function pct(value: number | null) {
  if (value == null) return '—';
  const n = value * 100;
  const decimals = n < 20 && Math.abs(n - Math.round(n)) > .001 ? 3 : 1;
  return `${n.toFixed(decimals).replace(/\.0$/, '')}%`;
}

export default function SCurveStory() {
  useEffect(() => {
    let cancelled = false;
    let setupRaf = 0;
    let playRaf = 0;
    let attempts = 0;
    let observer: IntersectionObserver | null = null;
    const cleanups: Array<() => void> = [];

    const setup = () => {
      if (cancelled) return;
      attempts += 1;

      const svg = document.querySelector(SVG_SELECTOR) as SVGSVGElement | null;
      const precisionReady = svg?.querySelector('[data-evidence-trace]');
      const crosshairReady = svg?.querySelector('[data-crosshair-layer]');
      if (!svg || !precisionReady || !crosshairReady) {
        if (attempts < 180) setupRaf = requestAnimationFrame(setup);
        return;
      }
      if (svg.dataset.storyReady === '1') return;
      svg.dataset.storyReady = '1';

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

      const primary = Array.from(svg.querySelectorAll('polyline')).slice(0, 3) as SVGPolylineElement[];
      if (primary.length < 3) return;
      const [baselineLine, currentLine, recoveryLine] = primary;
      const meta = [
        { key: 'baseline', line: baselineLine, color: '#263b49', label: 'Baseline' },
        { key: 'current', line: currentLine, color: '#8a6f36', label: 'Current' },
        { key: 'recovery', line: recoveryLine, color: '#b3212d', label: 'Recovery' }
      ] as const;
      meta.forEach((item) => item.line.setAttribute('data-story-series', item.key));

      // Recovery-value band: only where both Annex monthly series actually exist.
      if (!svg.querySelector('[data-recovery-band]')) {
        const currentPoints: string[] = [];
        const recoveryPoints: string[] = [];
        for (let i = 10; i <= 28; i += 1) {
          const cv = current[i];
          const rv = recovery[i];
          if (cv != null && rv != null) {
            currentPoints.push(`${xForIndex(i).toFixed(1)},${yForValue(cv).toFixed(1)}`);
            recoveryPoints.unshift(`${xForIndex(i).toFixed(1)},${yForValue(rv).toFixed(1)}`);
          }
        }
        const band = svgEl('polygon', {
          points: [...currentPoints, ...recoveryPoints].join(' '),
          class: 'scurve-recovery-band',
          'data-recovery-band': '1',
          'pointer-events': 'none'
        });
        baselineLine.parentNode?.insertBefore(band, baselineLine);
      }

      // Fixed assessment data-date ruler.
      if (!svg.querySelector('[data-status-ruler]')) {
        const status = svgEl('g', { 'data-status-ruler': '1', class: 'scurve-status-ruler', 'pointer-events': 'none' });
        const sx = xForIndex(10);
        const line = svgEl('line', { x1: String(sx), x2: String(sx), y1: String(top), y2: String(bottom) });
        const box = svgEl('rect', { x: String(sx - 66), y: String(bottom - 35), width: '132', height: '24', rx: '2' });
        const text = svgEl('text', { x: String(sx), y: String(bottom - 19), 'text-anchor': 'middle' });
        text.textContent = 'DATA DATE · 31 AUG 26';
        status.append(line, box, text);
        svg.appendChild(status);
      }

      // Replace overlapping finish labels with compact evidence flags.
      Array.from(svg.querySelectorAll('text')).forEach((text) => {
        const value = (text.textContent || '').trim();
        if (value.startsWith('Baseline finish') || value.startsWith('Recovery finish') || value.startsWith('Current finish')) {
          text.setAttribute('display', 'none');
        }
      });
      if (!svg.querySelector('[data-finish-flags]')) {
        const flags = svgEl('g', { 'data-finish-flags': '1', class: 'scurve-finish-flags', 'pointer-events': 'none' });
        const rows = [
          { y: 44, color: '#263b49', text: 'BASELINE · 15 FEB 28', targetX: xForIndex(28) },
          { y: 72, color: '#b3212d', text: 'RECOVERY · 14 APR 28 · 60 WD GAIN', targetX: xForIndex(30) },
          { y: 100, color: '#8a6f36', text: 'CURRENT · 23 JUN 28', targetX: xForIndex(32) }
        ];
        rows.forEach((row) => {
          const g = svgEl('g', { class: 'scurve-finish-flag' });
          const connector = svgEl('line', { x1: String(row.targetX), x2: '744', y1: String(top + 2), y2: String(row.y - 5), stroke: row.color });
          const rect = svgEl('rect', { x: '744', y: String(row.y - 18), width: '220', height: '23', rx: '2', stroke: row.color });
          const text = svgEl('text', { x: '754', y: String(row.y - 3), fill: row.color });
          text.textContent = row.text;
          g.append(connector, rect, text);
          flags.appendChild(g);
        });
        svg.appendChild(flags);
      }

      // Replay cursor layer.
      const replayLayer = svgEl('g', { class: 'scurve-replay-layer', 'data-replay-layer': '1', 'pointer-events': 'none', visibility: 'hidden' });
      const replayLine = svgEl('line', { x1: String(left), x2: String(left), y1: String(top), y2: String(bottom), class: 'scurve-replay-line' });
      const replayTag = svgEl('g', { class: 'scurve-replay-tag' });
      const replayRect = svgEl('rect', { x: String(left - 42), y: '4', width: '84', height: '22', rx: '2' });
      const replayText = svgEl('text', { x: String(left), y: '19', 'text-anchor': 'middle' });
      replayText.textContent = months[0];
      replayTag.append(replayRect, replayText);
      replayLayer.append(replayLine, replayTag);
      svg.appendChild(replayLayer);

      const curveWrap = svg.parentElement as HTMLElement | null;
      const section = svg.closest('section') as HTMLElement | null;
      if (!curveWrap || !section) return;

      // Story controls and inspector.
      const controls = document.createElement('div');
      controls.className = 'scurve-story-controls';
      controls.dataset.scurveStoryControls = '1';
      controls.innerHTML = `
        <div class="scurve-story-topline">
          <div>
            <span class="scurve-story-kicker">PROJECT CONTROLS STORY</span>
            <strong>Baseline → status evidence → current consequence → recovery intervention</strong>
          </div>
          <button type="button" class="scurve-replay-button" aria-label="Replay S-curve timeline">▶ Replay timeline</button>
        </div>
        <div class="scurve-inspector" aria-live="polite">
          <span><small>Date</small><strong data-story-date>Oct-25</strong></span>
          <span><small>Baseline</small><strong data-story-baseline>1%</strong></span>
          <span><small>Current</small><strong data-story-current>—</strong></span>
          <span><small>Recovery</small><strong data-story-recovery>—</strong></span>
          <span class="scurve-value-callout"><small>Recovery value</small><strong>60 wd recovered · 51 wd residual vs baseline</strong></span>
        </div>
      `;
      curveWrap.insertAdjacentElement('beforebegin', controls);

      const replayButton = controls.querySelector('.scurve-replay-button') as HTMLButtonElement;
      const dateOut = controls.querySelector('[data-story-date]') as HTMLElement;
      const baselineOut = controls.querySelector('[data-story-baseline]') as HTMLElement;
      const currentOut = controls.querySelector('[data-story-current]') as HTMLElement;
      const recoveryOut = controls.querySelector('[data-story-recovery]') as HTMLElement;

      const updateInspector = (index: number) => {
        const i = Math.max(0, Math.min(32, index));
        dateOut.textContent = months[i];
        baselineOut.textContent = pct(baseline[i] ?? null);
        currentOut.textContent = pct(current[i] ?? null);
        recoveryOut.textContent = pct(recovery[i] ?? null);
      };

      // Make the existing legend act as series-isolation controls.
      const legend = curveWrap.previousElementSibling?.previousElementSibling?.matches?.('[data-scurve-story-controls]')
        ? (controls.previousElementSibling as HTMLElement | null)
        : (controls.previousElementSibling as HTMLElement | null);
      const legendSpans = legend ? Array.from(legend.querySelectorAll('span')) as HTMLSpanElement[] : [];
      let isolated: string | null = null;
      const applyIsolation = () => {
        meta.forEach((item) => {
          item.line.style.opacity = !isolated || isolated === item.key ? '1' : '.12';
          item.line.style.filter = !isolated || isolated === item.key ? '' : 'grayscale(.65)';
        });
        legendSpans.forEach((span) => {
          const key = span.dataset.storySeries;
          if (!key) return;
          span.classList.toggle('story-muted', !!isolated && isolated !== key);
          span.classList.toggle('story-active', isolated === key);
        });
      };
      legendSpans.forEach((span) => {
        const text = (span.textContent || '').toUpperCase();
        const key = text.includes('BASELINE') ? 'baseline' : text.includes('CURRENT') ? 'current' : text.includes('RECOVERY') ? 'recovery' : null;
        if (!key) return;
        span.dataset.storySeries = key;
        span.setAttribute('role', 'button');
        span.setAttribute('tabindex', '0');
        span.setAttribute('aria-label', `Isolate ${key} curve`);
        const activate = () => { isolated = isolated === key ? null : key; applyIsolation(); };
        span.addEventListener('click', activate);
        const keydown = (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
        };
        span.addEventListener('keydown', keydown);
        cleanups.push(() => { span.removeEventListener('click', activate); span.removeEventListener('keydown', keydown); });
      });

      // Hovering anywhere in the plot updates the four-column inspector using source values only.
      const onPointerMove = (event: PointerEvent) => {
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const local = pt.matrixTransform(ctm.inverse());
        if (local.x < left || local.x > right || local.y < top || local.y > bottom) return;
        const index = Math.max(0, Math.min(32, Math.round(((local.x - left) / plotW) * 32)));
        updateInspector(index);
      };
      svg.addEventListener('pointermove', onPointerMove);
      cleanups.push(() => svg.removeEventListener('pointermove', onPointerMove));

      const lengths = meta.map((item) => item.line.getTotalLength());
      meta.forEach((item, i) => {
        item.line.style.strokeDasharray = String(lengths[i]);
        item.line.style.strokeDashoffset = '0';
        item.line.style.willChange = 'stroke-dashoffset';
      });

      const evidenceCircles = Array.from(svg.querySelectorAll('circle')).filter((circle) => circle.getAttribute('fill') === '#0b6b50') as SVGCircleElement[];
      const pulseEvidence = (index: number) => {
        const target = index === 7 ? evidenceCircles[0] : index === 10 ? evidenceCircles[1] : null;
        if (!target) return;
        target.classList.remove('scurve-evidence-pulse');
        void target.getBoundingClientRect();
        target.classList.add('scurve-evidence-pulse');
        window.setTimeout(() => target.classList.remove('scurve-evidence-pulse'), 1200);
      };

      let playing = false;
      const stopReplay = () => {
        playing = false;
        cancelAnimationFrame(playRaf);
        replayLayer.setAttribute('visibility', 'hidden');
        replayButton.disabled = false;
        replayButton.textContent = '▶ Replay timeline';
      };

      const runReplay = (auto = false) => {
        if (playing) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
          updateInspector(10);
          meta.forEach((item) => { item.line.style.strokeDashoffset = '0'; });
          return;
        }
        playing = true;
        replayButton.disabled = true;
        replayButton.textContent = 'Playing…';
        replayLayer.setAttribute('visibility', 'visible');
        meta.forEach((item, i) => {
          item.line.style.transition = 'none';
          item.line.style.strokeDashoffset = String(lengths[i]);
        });
        // Flush the reset before animating.
        void svg.getBoundingClientRect();
        meta.forEach((item, i) => {
          item.line.style.transition = `stroke-dashoffset 5.7s cubic-bezier(.22,.61,.36,1) ${i * .22}s`;
          item.line.style.strokeDashoffset = '0';
        });

        const duration = 6500;
        const started = performance.now();
        let lastIndex = -1;
        const tick = (now: number) => {
          if (!playing) return;
          const progress = Math.min(1, (now - started) / duration);
          const x = left + progress * plotW;
          const index = Math.max(0, Math.min(32, Math.round(progress * 32)));
          replayLine.setAttribute('x1', String(x));
          replayLine.setAttribute('x2', String(x));
          replayRect.setAttribute('x', String(Math.max(left, Math.min(right - 84, x - 42))));
          replayText.setAttribute('x', String(Math.max(left + 42, Math.min(right - 42, x))));
          replayText.textContent = months[index];
          if (index !== lastIndex) {
            updateInspector(index);
            if (index === 7 || index === 10) pulseEvidence(index);
            lastIndex = index;
          }
          if (progress < 1) playRaf = requestAnimationFrame(tick);
          else {
            playing = false;
            replayButton.disabled = false;
            replayButton.textContent = '↻ Replay timeline';
            window.setTimeout(() => replayLayer.setAttribute('visibility', 'hidden'), 650);
          }
        };
        playRaf = requestAnimationFrame(tick);
        if (auto) replayButton.dataset.autoPlayed = '1';
      };

      replayButton.addEventListener('click', () => runReplay(false));
      cleanups.push(() => replayButton.replaceWith(replayButton.cloneNode(true)));

      // One restrained automatic reveal when the chart first enters the viewport.
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && entry.intersectionRatio >= .28 && replayButton.dataset.autoPlayed !== '1') {
          runReplay(true);
          observer?.disconnect();
        }
      }, { threshold: [0, .28, .55] });
      observer.observe(curveWrap);

      if (!document.getElementById('chinaimo-scurve-story-style')) {
        const style = document.createElement('style');
        style.id = 'chinaimo-scurve-story-style';
        style.textContent = `
          .scurve-story-controls{margin:14px 0 10px;border:1px solid #bfc1bd;background:linear-gradient(135deg,rgba(255,255,255,.52),rgba(239,237,228,.72));box-shadow:0 6px 18px rgba(31,36,39,.035)}
          .scurve-story-topline{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:13px 14px 11px;border-bottom:1px solid #d5d5cf}
          .scurve-story-topline>div{display:grid;gap:2px}.scurve-story-kicker{font:700 12px/1.35 'Courier New',ui-monospace,monospace;letter-spacing:.07em;color:#8f3d33}.scurve-story-topline strong{font-size:14px;color:#344148;font-weight:700}
          .scurve-replay-button{min-height:38px;padding:8px 13px;border:1px solid #59666c;background:#27353d;color:#f6f5ef;font:700 12px/1.2 'Courier New',ui-monospace,monospace;letter-spacing:.035em;text-transform:uppercase;cursor:pointer}.scurve-replay-button:hover{background:#17242b}.scurve-replay-button:disabled{opacity:.62;cursor:default}
          .scurve-inspector{display:grid;grid-template-columns:.8fr .8fr .8fr .8fr 2.2fr;min-height:62px}.scurve-inspector>span{display:grid;align-content:center;gap:2px;padding:9px 12px;border-right:1px solid #d5d5cf}.scurve-inspector>span:last-child{border-right:0}.scurve-inspector small{font:700 12px/1.25 'Courier New',ui-monospace,monospace;letter-spacing:.045em;text-transform:uppercase;color:#70777a}.scurve-inspector strong{font-size:16px;color:#25343b;font-variant-numeric:tabular-nums}.scurve-value-callout{background:rgba(179,33,45,.035)}.scurve-value-callout strong{color:#8e2932;font-size:14px!important}
          ${SVG_SELECTOR} .scurve-recovery-band{fill:rgba(179,33,45,.075);stroke:none}
          ${SVG_SELECTOR} .scurve-status-ruler line{stroke:#0b6b50;stroke-width:1.25;stroke-dasharray:5 5;opacity:.56;vector-effect:non-scaling-stroke}${SVG_SELECTOR} .scurve-status-ruler rect{fill:rgba(249,248,243,.95);stroke:#0b6b50;stroke-width:1;vector-effect:non-scaling-stroke}${SVG_SELECTOR} .scurve-status-ruler text{font:700 10px 'Courier New',ui-monospace,monospace;letter-spacing:.02em;fill:#0b6b50}
          ${SVG_SELECTOR} .scurve-finish-flag connector{vector-effect:non-scaling-stroke}${SVG_SELECTOR} .scurve-finish-flag line{stroke-width:.9;stroke-dasharray:2 3;opacity:.52;vector-effect:non-scaling-stroke}${SVG_SELECTOR} .scurve-finish-flag rect{fill:rgba(249,248,243,.94);stroke-width:1;vector-effect:non-scaling-stroke}${SVG_SELECTOR} .scurve-finish-flag text{font:700 10.5px 'Courier New',ui-monospace,monospace;letter-spacing:.02em}
          ${SVG_SELECTOR} .scurve-replay-line{stroke:#a54a3c;stroke-width:1.5;stroke-dasharray:4 4;opacity:.82;vector-effect:non-scaling-stroke}${SVG_SELECTOR} .scurve-replay-tag rect{fill:#27353d;stroke:#f9f8f3;stroke-width:1;vector-effect:non-scaling-stroke}${SVG_SELECTOR} .scurve-replay-tag text{fill:#f9f8f3;font:700 11px 'Courier New',ui-monospace,monospace;letter-spacing:.02em}
          ${SVG_SELECTOR} [data-story-series]{transition:opacity .18s ease,filter .18s ease}
          .curveLegend span[data-story-series]{cursor:pointer;padding:4px 5px;margin:-4px -5px;border:1px solid transparent;transition:opacity .18s ease,border-color .18s ease,background .18s ease}.curveLegend span[data-story-series]:hover,.curveLegend span[data-story-series]:focus-visible{outline:none;border-color:#9da39f;background:rgba(255,255,255,.38)}.curveLegend span.story-muted{opacity:.36}.curveLegend span.story-active{border-color:#59666c;background:rgba(39,53,61,.06)}
          ${SVG_SELECTOR} .scurve-evidence-pulse{transform-box:fill-box;transform-origin:center;animation:scurveEvidencePulse 1.05s ease-out 1}@keyframes scurveEvidencePulse{0%{transform:scale(1);filter:none}38%{transform:scale(1.85);filter:drop-shadow(0 0 5px rgba(11,107,80,.45))}100%{transform:scale(1);filter:none}}
          html[data-assessment-theme='dark'] .scurve-story-controls{border-color:#4a4d49;background:linear-gradient(135deg,rgba(38,43,42,.94),rgba(27,31,31,.94));box-shadow:none}html[data-assessment-theme='dark'] .scurve-story-topline{border-color:#454944}html[data-assessment-theme='dark'] .scurve-story-kicker{color:#d07b69}html[data-assessment-theme='dark'] .scurve-story-topline strong,html[data-assessment-theme='dark'] .scurve-inspector strong{color:#ece8dc}html[data-assessment-theme='dark'] .scurve-inspector>span{border-color:#454944}html[data-assessment-theme='dark'] .scurve-inspector small{color:#b7b2a7}html[data-assessment-theme='dark'] .scurve-value-callout{background:rgba(208,123,105,.07)}html[data-assessment-theme='dark'] .scurve-value-callout strong{color:#e2a093}
          html[data-assessment-theme='dark'] ${SVG_SELECTOR} .scurve-recovery-band{fill:rgba(208,123,105,.10)}html[data-assessment-theme='dark'] ${SVG_SELECTOR} .scurve-status-ruler rect,html[data-assessment-theme='dark'] ${SVG_SELECTOR} .scurve-finish-flag rect{fill:rgba(34,39,38,.96)}html[data-assessment-theme='dark'] ${SVG_SELECTOR} .scurve-finish-flag text{paint-order:stroke fill;stroke:rgba(34,39,38,.8);stroke-width:1px}
          @media(max-width:820px){.scurve-story-topline{align-items:flex-start;flex-direction:column}.scurve-replay-button{width:100%}.scurve-inspector{grid-template-columns:repeat(2,1fr)}.scurve-inspector>span{border-bottom:1px solid #d5d5cf}.scurve-value-callout{grid-column:1/-1}.scurve-inspector strong{font-size:15px}}
          @media(prefers-reduced-motion:reduce){${SVG_SELECTOR} [data-story-series]{transition:none!important}${SVG_SELECTOR} .scurve-evidence-pulse{animation:none!important}}
          @media print{.scurve-story-controls{display:none!important}${SVG_SELECTOR} .scurve-replay-layer{display:none!important}${SVG_SELECTOR} [data-story-series]{stroke-dasharray:none!important;stroke-dashoffset:0!important;transition:none!important;opacity:1!important;filter:none!important}.curveLegend span[data-story-series]{opacity:1!important;border:0!important;background:none!important}}
        `;
        document.head.appendChild(style);
      }

      cleanups.push(() => {
        stopReplay();
        observer?.disconnect();
        controls.remove();
        replayLayer.remove();
        svg.querySelector('[data-recovery-band]')?.remove();
        svg.querySelector('[data-status-ruler]')?.remove();
        svg.querySelector('[data-finish-flags]')?.remove();
        meta.forEach((item) => {
          item.line.style.strokeDasharray = '';
          item.line.style.strokeDashoffset = '';
          item.line.style.transition = '';
          item.line.style.opacity = '';
          item.line.style.filter = '';
          item.line.removeAttribute('data-story-series');
        });
        delete svg.dataset.storyReady;
      });
    };

    setupRaf = requestAnimationFrame(setup);
    return () => {
      cancelled = true;
      cancelAnimationFrame(setupRaf);
      cancelAnimationFrame(playRaf);
      observer?.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
