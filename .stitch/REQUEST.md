# Stitch Design Request

## Target
`/reviewer-intelligence` -- 137-only Owner Analytics Console.

## Problem
The current dark owner analytics page is functional and already separates Vercel aggregate analytics from Munigen Reviewer Intelligence, but its visual hierarchy can be more coherent, more premium, and more useful when real session data starts to accumulate.

## Preserve
- Public Chinaimo assessment must remain completely unchanged.
- 137 gesture remains the entry point.
- No second password screen.
- Vercel Analytics remains available as the aggregate traffic view.
- Supabase Reviewer Intelligence remains the session-journey view.
- Five KPI concepts remain: Sessions, Technical, High Depth, Active Time, Downloads.
- Session list + selected journey remains the core investigative interaction.
- Privacy boundary remains visible but quiet.

## Design objective
Create a modern, dark, quietly futuristic internal control room that feels like a serious engineering intelligence product rather than a generic AI dashboard.

The current screen is too pale in the upper background and visually split between a bright atmospheric hero and dark cards. Seek stronger compositional unity, better information density, better session-list/journey balance, and a more intentional empty state.

## Required output
Generate exactly **3 materially different variants**:

1. **Variant A -- Executive Control Room**
   - strongest hierarchy and calmest composition
   - premium dark surfaces
   - restrained visual effects
   - ideal for frequent owner use

2. **Variant B -- Analytical Workbench**
   - denser information architecture
   - emphasizes session comparison, filters, and evidence navigation
   - suitable when many applications/sites are connected later

3. **Variant C -- Spatial Intelligence**
   - more experimental but still professional
   - uses depth, layered panels, or subtle spatial organization
   - must remain practical and readable

Do not make the three variants mere color changes. Explore meaningful differences in layout, hierarchy, KPI treatment, session navigation, and journey visualization.

## Implementation constraint
Use the existing `app/reviewer-intelligence/page.tsx` as source context. Generated concepts must remain realistic to implement in React / Next.js without a heavy visualization framework.
