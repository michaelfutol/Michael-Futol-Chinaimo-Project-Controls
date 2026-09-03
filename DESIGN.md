# Chinaimo / Munigen Design System

## Purpose
This file is the shared design contract for Google Stitch, Lum, and implementation agents working in this repository. Preserve intent before style. Never let private-tool aesthetics leak into the public assessment experience.

## Two visual worlds

### 1. Public assessment
- Preserve the current Chinaimo assessment as-is unless a request explicitly targets it.
- Warm near-white paper-matte background; restrained late-20th-century Japanese technical/editorial character.
- Minimal decoration, readable engineering evidence, calm typography, auditable interaction.
- No generic AI/SaaS visual language, neon cyber grids, glossy black dashboards, floating HUDs, or decorative clutter.

### 2. Private 137 owner space
- Applies only after the 1 -> 3 -> 7 owner gesture and to private owner/admin routes such as `/reviewer-intelligence`.
- Modern dark mode; quiet futuristic control-room feel.
- Deep graphite / blue-black surfaces, high legibility, restrained cyan/teal/violet accents.
- Subtle glass, depth, gradients, and glow are allowed only when they support hierarchy or interaction.
- Avoid cyberpunk, hacker-green, gaming UI, excessive glow, gratuitous charts, hexagons, or generic AI-dashboard tropes.
- Prefer generous spacing, strong information architecture, modern sans-serif typography, large readable metrics, and calm motion.

## Interaction doctrine
- Every control should have a reason to exist.
- Prefer meaningful hover/focus feedback over decorative animation.
- Charts and timelines should reveal evidence, not merely decorate.
- Responsive behavior is mandatory for desktop and mobile.
- Accessibility: preserve keyboard focus, contrast, and semantic structure; aim for WCAG AA.

## Reviewer Intelligence priorities
1. Immediate comprehension of aggregate vs session-level intelligence.
2. Five KPI cards: Sessions, Technical, High Depth, Active Time, Downloads.
3. Session list and selected journey should read as one coherent investigative workflow.
4. Country / OS / browser / device are coarse context only; never imply identity.
5. Empty state must still look intentional and useful.
6. Vercel Analytics remains the aggregate traffic authority; Supabase is the private anonymous journey ledger.
7. Never expose names, email addresses, displayed IPs, exact location, or fingerprinting data.

## Variant policy
For every Stitch design request, generate exactly **three materially different production-feasible variants**. Differences should be meaningful in layout, hierarchy, navigation, or interaction -- not merely three color swaps.

Lum reviews all three against:
- information hierarchy
- readability
- restraint
- engineering/professional character
- implementation feasibility
- responsiveness
- accessibility
- consistency with this DESIGN.md

Only the selected variant is eligible for integration into production.
