## Plan: Dark Player Dashboard

Build the homepage as a dark-first Nuxt UI dashboard that reads the existing mock JSON, normalizes player stats into typed view models, and renders a responsive summary + filter/sort + compare-ready player-card grid. Use the current Nuxt 4 and @nuxt/ui setup already present in the app instead of adding another UI layer, and force dark mode at the app shell so the landing page stays visually consistent.

**Steps**
1. Phase 1: Data shaping. Add a typed player-dashboard data layer that imports `app/data/mock-data.json`, converts string metrics to numbers, derives trend arrays from `prevGoals1` through `prevGoals10`, and exposes temporary position/nationality labels. This should live in a composable plus a small constants/types layer so the page and cards do not parse raw JSON directly.
2. Phase 1: Summary derivation. In the same data layer, derive dashboard-level aggregates needed by the homepage hero/KPI strip: total players, total goals, total assists, average rating, and position counts. This can be implemented in parallel with step 1 if split between types/constants and derived selectors.
3. Phase 2: Card UI. Create a reusable player card component using Nuxt UI primitives (`UCard`, `UBadge`, `UButton`, `UAvatar` or avatar fallback, `USeparator`) and Tailwind utility layout. Each card should surface overall rating, role, key stats, discipline/precision metrics, and a compact trend visualization based on the historical goal fields.
4. Phase 2: Dashboard shell. Create a dashboard container component that accepts the normalized player list, renders top summary stats, exposes filter and sorting controls, and supports the requested compare-cards workflow by maintaining a lightweight selected-player state. Filters/sorts should operate on the normalized typed data rather than recomputing from raw JSON.
5. Phase 3: Homepage integration. Replace the empty homepage in `/home/benjee/code/club-stats/app/pages/index.vue` with the dashboard shell, import the composable, and set page-level copy/SEO that reflects club stats instead of the starter template.
6. Phase 3: Force dark mode. Update the app shell so the experience is consistently dark: set the color mode at app level, remove or neutralize the existing toggle if it conflicts with the requirement, and keep the rest of the Nuxt UI layout (`UApp`, `UHeader`, `UMain`, `UFooter`) intact. This step depends on agreeing that dark mode is forced.
7. Phase 3: Visual polish. Extend the existing theme only if needed in `app/assets/css/main.css` or `app/app.config.ts` for stronger dashboard contrast, but reuse the current green/slate palette first to stay aligned with the project’s Nuxt UI configuration.
8. Phase 4: Validation. Run typecheck and lint, then manually verify responsive behavior, empty/edge rendering of filters, trend display, and dark-mode consistency on the prerendered homepage.

**Relevant files**
- `/home/benjee/code/club-stats/app/pages/index.vue` — replace the empty page with the dashboard entry point.
- `/home/benjee/code/club-stats/app/app.vue` — reuse the current `UApp` / `UHeader` / `UMain` shell and enforce dark mode at the app level.
- `/home/benjee/code/club-stats/app/app.config.ts` — keep using the existing Nuxt UI color aliases (`primary: green`, `neutral: slate`) and add only minimal UI theme overrides if required.
- `/home/benjee/code/club-stats/app/assets/css/main.css` — existing Tailwind v4 theme entry point for any dark dashboard token tweaks.
- `/home/benjee/code/club-stats/app/data/mock-data.json` — source of member stats and position counts; no schema edits required.
- `/home/benjee/code/club-stats/app/components/PlayerCard.vue` — new reusable player card component.
- `/home/benjee/code/club-stats/app/components/PlayerDashboard.vue` — new dashboard layout/filter/sort/compare orchestration component.
- `/home/benjee/code/club-stats/app/components/PlayerTrendSparkline.vue` — optional small trend component if the inline chart logic would otherwise clutter the card.
- `/home/benjee/code/club-stats/app/composables/usePlayerDashboard.ts` — new normalization and derived-state composable.
- `/home/benjee/code/club-stats/app/types/player.ts` — new shared player and dashboard types.
- `/home/benjee/code/club-stats/app/constants/player-meta.ts` — new temporary lookup map for position/nationality code labels.

**Verification**
1. Run `npm run typecheck` to verify the JSON import, derived types, and component props all typecheck under Nuxt 4.
2. Run `npm run lint` to catch ESLint stylistic issues already noted in repo memory.
3. Manually verify the homepage at desktop and mobile widths: summary stats render, filters/sorts update the grid correctly, compare selection state is visible, and trend visuals do not overflow cards.
4. Confirm the homepage remains dark on reload and that any remaining header/footer controls still look correct against the dark background.
5. Confirm prerender compatibility by ensuring the page relies only on static mock data and does not introduce client-only behavior that breaks the existing `/` prerender rule.

**Decisions**
- Force dark mode for the homepage/app shell rather than preserving the light/dark toggle.
- Include player cards, top summary stats, filters/sorting, and trend visuals.
- Create temporary labels for code-based metadata where useful, instead of hiding all coded fields.
- Keep the data source static and local to the existing mock JSON; API migration is out of scope.
- Reuse Nuxt UI and Tailwind primitives already configured in the repository; do not add a second component library.

**Further Considerations**
1. Compare UX recommendation: use a simple multi-select “compare” state on cards first, then optionally surface a dedicated comparison strip or modal only if the basic card affordance feels insufficient.
2. Trend visualization recommendation: prefer a lightweight custom sparkline/bar strip built with plain divs and Tailwind over adding a chart dependency for only 10 historical points.
3. Because direct Nuxt MCP tooling is not exposed in this planning session, the implementation should follow the existing Nuxt 4 + Nuxt UI best-practice structure already present in the codebase as the practical equivalent.