## Plan: EAFC26 Live Stats Dashboard

Build a Nuxt 4 + Nuxt UI dashboard that fetches live club member stats from the EAFC26 API at SSR request time, transforms API strings into typed numeric models, and renders a mixed layout with featured players plus a card grid. Use a presentational pattern by keeping data fetching/state/derivations in the page container and moving all UI rendering into typed, reusable components. Include compact/detailed view toggle and a comparison table for up to 4 selected players.

**Steps**
1. Phase 1 - Types and data contracts
2. Create `app/types/eafc-stats.ts` with strict interfaces for raw API response (`RawMemberStatsResponse`, `RawMember`, `RawPositionCount`) and normalized app models (`MemberStats`, `PositionCount`, `MemberComparisonRow`).
3. Add literal/union typing for constrained fields such as favorite positions and sort keys to keep component props and UI controls type-safe.
4. Define transformation helper signatures (parse raw string metrics -> numbers) and derived fields needed by UI (e.g., `goalContributions`, `comparisonMetrics`). *blocks Phase 2 and 3*
5. Phase 2 - Data fetching and container logic (`app/pages/index.vue`)
6. Implement SSR fetch-per-request with `useFetch` against `https://proclubs.ea.com/api/fc/members/stats?platform=common-gen5&clubId=480649` so each request gets live data.
7. Remove/override home prerender behavior for live data path in `nuxt.config.ts` (adjust `routeRules` for `/`) so production behavior matches live SSR intent.
8. Add container-level computed state in `index.vue`: normalized members, featured players selection, compact/detailed toggle state, selected comparison players (max 4), and any required sorting/filtering defaults.
9. Add robust loading/error/empty states at page level using Nuxt UI feedback components while keeping presentational children stateless. *depends on 2-4*
10. Phase 3 - Presentational component split
11. Build `app/components/dashboard/DashboardHeader.vue` for title/subtitle/context about EAFC26 club stats.
12. Build `app/components/dashboard/FeaturedPlayers.vue` for top performers section (driven by container-provided arrays only).
13. Build `app/components/dashboard/PlayerCardGrid.vue` to render member cards responsively.
14. Build `app/components/dashboard/PlayerCard.vue` for per-player stats display with Nuxt UI card primitives and Tailwind utility styling.
15. Build `app/components/dashboard/ViewModeToggle.vue` for compact vs detailed card mode (pure props + emits).
16. Build `app/components/dashboard/CompareSelector.vue` for selecting up to 4 players (pure UI control with emits; limit enforced in container).
17. Build `app/components/dashboard/ComparisonTable.vue` for compact side-by-side metrics table for selected players. *depends on 8*
18. Phase 4 - Page composition and polish
19. Compose all dashboard presentational components in `index.vue` with clean prop/event boundaries and no duplicated business logic inside child components.
20. Ensure mobile-first behavior (stacked sections, scroll-safe comparison table) and desktop optimization (featured + grid balance).
21. Keep visual style consistent with existing Nuxt UI theme (`green`/`slate`) and Tailwind tokens in `app/assets/css/main.css`.
22. Phase 5 - Verification
23. Run `pnpm typecheck` to validate strict TypeScript boundaries.
24. Run `pnpm lint` to ensure style and Nuxt conventions.
25. Run `pnpm dev` and manually verify: live API fetch on refresh, card rendering, compact/detailed toggle, compare selection limit (max 4), comparison table accuracy, responsive layout.

**Relevant files**
- `/home/benjee/code/club-stats/app/pages/index.vue` - container page for SSR fetch, state management, and component composition.
- `/home/benjee/code/club-stats/app/types/eafc-stats.ts` - new typed API/app models and derived metric contracts.
- `/home/benjee/code/club-stats/app/components/dashboard/DashboardHeader.vue` - presentational hero/header section.
- `/home/benjee/code/club-stats/app/components/dashboard/FeaturedPlayers.vue` - featured player blocks.
- `/home/benjee/code/club-stats/app/components/dashboard/PlayerCardGrid.vue` - responsive grid wrapper.
- `/home/benjee/code/club-stats/app/components/dashboard/PlayerCard.vue` - reusable member stat card.
- `/home/benjee/code/club-stats/app/components/dashboard/ViewModeToggle.vue` - compact/detailed control.
- `/home/benjee/code/club-stats/app/components/dashboard/CompareSelector.vue` - player selection UI for comparison.
- `/home/benjee/code/club-stats/app/components/dashboard/ComparisonTable.vue` - compact table view for up to 4 players.
- `/home/benjee/code/club-stats/nuxt.config.ts` - route rule changes required for live SSR behavior on `/`.

**Verification**
1. Static checks: `pnpm typecheck` and `pnpm lint` pass without warnings/errors.
2. Runtime fetch check: on two separate page loads, verify data timestamps/content reflect live API and are not frozen to build output.
3. UI behavior check: toggle compact/detailed mode and confirm cards reflow without losing data.
4. Comparison check: selecting 1-4 players updates table immediately; selecting a 5th is prevented with clear UX feedback.
5. Responsive check: mobile (single-column cards + horizontally scrollable compare table) and desktop (featured section + multi-column grid) both render correctly.

**Decisions**
- Live data source: API only (no mock fallback).
- Fetch mode: SSR per request for freshness with server-rendered output.
- Initial visible metrics on cards: Games, Win Rate, Rating, Goals, Assists, MOTM.
- Layout direction: mixed layout (featured players + grid).
- Interactions in scope: compact/detailed toggle and multi-player comparison (up to 4).
- Sorting/filter/search are excluded from v1 unless required during implementation for featured section logic.
- UI framework: Nuxt UI for consistency with existing styles and components.
- Dark theme Desktop-first design with mobile responsiveness (stacked sections, scrollable compare table).

**Further Considerations**
1. API resilience: if EA endpoint rate-limits intermittently, add minimal non-mock fallback UI messaging (retry affordance) without violating API-only data rule.
2. Comparison metric set: lock exactly which columns appear in comparison table early (recommended: rating, games, win rate, goals, assists, MOTM, pass success).
3. Future iteration: add filter/sort controls after v1 if compare workflow alone is insufficient for analysis.
