# Plan — Phase 3: Walking Skeleton UI

## Task Group 1 — CSS baseline (`src/index.css`)

1. Import *Press Start 2P* from Google Fonts.
2. Apply font globally to `body`; set dark background (`#1a1a2e`) and light text (`#eee`).
3. Add `.pet-display` layout styles (flex column, centered, gap).
4. Add `.stat-row`, `.stat-label`, `.stat-bar-track`, `.stat-bar-fill`, and `.stat-bar-fill.special` styles.

## Task Group 2 — `<StatBar>` component (`src/components/StatBar.tsx`)

1. Define props: `label: string`, `stat: Stat`.
2. Compute fill percentage: `Math.round(stat.value / stat.max * 100)`.
3. Render label with `★` prefix when `stat.isSpecial`.
4. Render track div + fill div; apply `.special` class to fill when `stat.isSpecial`.

## Task Group 3 — `<PetDisplay>` component (`src/components/PetDisplay.tsx`)

1. Read `pet` from `usePetStore`.
2. Return `null` if `pet === null`.
3. Render pet name in `<h2>`.
4. Render three `<StatBar>` instances: hunger, happiness, energy.

## Task Group 4 — Wire into `App.tsx`

1. Add `useEffect` that seeds the hardcoded Pochi pet into the store on mount.
2. Mount `<PetDisplay>` in the JSX.

## Task Group 5 — Tests

1. `src/components/__tests__/StatBar.test.tsx` — renders label, correct fill width, star shown only when special, `.special` class applied.
2. `src/components/__tests__/PetDisplay.test.tsx` — renders pet name and three stat labels; returns nothing when pet is null.
3. Update `src/components/__tests__/App.test.tsx` — smoke test still passes with the seed in place.

## Task Group 6 — Verify

1. `npm run build` — zero TypeScript errors.
2. `npm test` — all tests pass.
3. Manual check at 360 px viewport width — no horizontal scroll, bars visible.
