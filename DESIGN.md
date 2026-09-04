# Chinaimo / Munigen Design System

## Purpose
This file is the shared design contract for Google AI Studio, Google Stitch, Lum, and implementation agents working in this repository. Preserve intent before style. Never let private-tool aesthetics leak into the public assessment experience.

## Two visual worlds

### 1. Public assessment
- Preserve the current Chinaimo assessment as-is unless a request explicitly targets it.
- Default theme: warm near-white paper-matte background; restrained late-20th-century Japanese technical/editorial character.
- Optional dark theme is allowed as a user-controlled **paper-at-night** treatment of the same assessment: charcoal/ink surfaces, warm ivory text, restrained rust accents, and equivalent information hierarchy.
- The public dark theme must remain recognizably Chinaimo editorial/technical -- never become the private 137 analytics/control-room aesthetic.
- The first-visit default remains light; a visitor's Light/Dark choice may persist locally in their browser.
- Minimal decoration, readable engineering evidence, calm typography, auditable interaction.
- No generic AI/SaaS visual language, neon cyber grids, glossy black dashboards, floating HUDs, or decorative clutter.

### 2. Private 137 analytics space
- Applies only after the 1 -> 3 -> 7 gesture and to private routes such as `/reviewer-intelligence`.
- Supports both light and dark modes.
- Modern editorial / investigative engineering interface with high legibility, restrained atmospheric color, technical notebook cues, and calm motion.
- Avoid cyberpunk, hacker-green, gaming UI, excessive glow, gratuitous charts, hexagons, or generic AI-dashboard tropes.
- Prefer generous spacing, strong information architecture, readable metrics, evidence-led composition, and purposeful asymmetry.

## Readable typography standard -- mandatory
All semantic text must remain comfortably readable at normal browser zoom. Visual minimalism is never a reason to make text microscopic.

- Default body/interface text: **16 px minimum target**.
- Supporting descriptions/helper text: **14 px minimum**.
- Buttons, links, form controls, and other interactive labels: **14 px minimum**.
- Metadata, mono labels, timestamps, indices, and technical annotations that carry meaning: **12 px absolute minimum**; 13-14 px is preferred when space allows.
- Text below 12 px is allowed only for purely decorative/non-semantic drafting marks that a user does not need to read.
- Normal body/supporting text should generally use line-height **1.4-1.6**.
- Do not use low opacity, extreme letter-spacing, condensed width, or all-caps styling in a way that defeats the minimum-size rule.
- Desktop layouts must be readable at **100% browser zoom** on common 1440-1920 px displays; users should never need to zoom merely to read labels.
- Mobile layouts must not shrink semantic text to preserve a desktop composition; reflow instead.

## Interaction doctrine
- Every control should have a reason to exist.
- Prefer meaningful hover/focus feedback over decorative animation.
- Charts and timelines should reveal evidence, not merely decorate.
- Responsive behavior is mandatory for desktop and mobile.
- Accessibility: preserve keyboard focus, contrast, and semantic structure; aim for WCAG AA.

## Reviewer Intelligence priorities
1. Immediate comprehension of aggregate vs session-level intelligence.
2. Five KPI readings: Sessions, Technical, High Depth, Active Time, Downloads.
3. Session list and selected journey should read as one coherent investigative workflow.
4. Country / OS / browser / device are coarse context only; never imply identity.
5. Empty state must still look intentional and useful.
6. Vercel Analytics remains the aggregate traffic authority; Supabase is the private anonymous journey ledger.
7. Never expose names, email addresses, displayed IPs, exact location, or fingerprinting data.

## Variant policy
When Stitch is used, generate exactly **three materially different production-feasible variants** unless the user explicitly requests otherwise. Differences should be meaningful in layout, hierarchy, navigation, or interaction -- not merely three color swaps.

Lum reviews all generated UI against:
- information hierarchy
- readability
- restraint
- engineering/professional character
- implementation feasibility
- responsiveness
- accessibility
- consistency with this DESIGN.md

Google AI Studio may be used as the primary creative UI/art-direction partner when it produces a stronger result. The approved design is the visual source of truth; integration should preserve its composition while connecting real application logic and data.
