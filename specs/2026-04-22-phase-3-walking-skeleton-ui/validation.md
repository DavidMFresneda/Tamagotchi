# Validation — Phase 3: Walking Skeleton UI

All of the following must be true before this phase is merged to `main`.

---

## Components

- [ ] `src/components/StatBar.tsx` exists and accepts `label: string` and `stat: Stat` props.
- [ ] Fill width equals `value / max * 100%` (a special stat at 60/200 fills to 30%, a normal stat at 80/100 fills to 80%).
- [ ] When `stat.isSpecial` is true: label is prefixed with `★` and the fill has the `.special` class.
- [ ] When `stat.isSpecial` is false: no star, no `.special` class.
- [ ] `src/components/PetDisplay.tsx` exists and renders the pet name and three stat bars.
- [ ] `<PetDisplay>` returns null (renders nothing) when `pet === null`.

## App wiring

- [ ] `App.tsx` seeds the store with the hardcoded Pochi pet on mount via `useEffect`.
- [ ] `<PetDisplay>` is mounted in `App.tsx`.
- [ ] Opening the app in a browser shows the pet name and three stat bars without console errors.
- [ ] The happiness bar (special, 60/200) is visually distinct: gold fill and `★` in the label.

## Visual style

- [ ] *Press Start 2P* font is applied globally.
- [ ] Background is dark, text is light.
- [ ] At 360 px viewport width: no horizontal scroll, all bars visible.

## Build & tests

- [ ] `npm run build` exits with code 0 and zero TypeScript errors.
- [ ] `npm test` exits with code 0, all test files pass.
- [ ] `src/components/__tests__/StatBar.test.tsx` covers: label, fill width, star presence, `.special` class.
- [ ] `src/components/__tests__/PetDisplay.test.tsx` covers: name rendered, three stat labels, null guard.

## Git

- [ ] Branch `phase-3-walking-skeleton-ui` is up to date with `main`.
- [ ] No unrelated files changed.
- [ ] The hardcoded seed in `App.tsx` is clearly marked as temporary (comment or obvious variable name).
