# Validation — Phase 6: Care Actions

All of the following must be true before this phase is merged to `main`.

---

## Constants

- [ ] `src/config.ts` exports `REPLENISH = 20` and `SIDE_EFFECT = 5`.

## Store actions

- [ ] `feed()` increases `hunger` by 20 and `happiness` by 5; `energy` is unchanged.
- [ ] `play()` increases `happiness` by 20 and decreases `energy` by 5; `hunger` is unchanged.
- [ ] `rest()` increases `energy` by 20 and `happiness` by 5; `hunger` is unchanged.
- [ ] All increments are clamped to the stat's own `max` — a stat at 95/100 fed +20 becomes 100, not 115.
- [ ] `play()` energy decrement is clamped to 0 — energy at 2 after play becomes 0, not −3.
- [ ] All three actions are no-ops when `pet` is null.
- [ ] After each action, `UPDATE pets SET hunger=?, happiness=?, energy=?` is called and `saveDb()` fires.

## `<ActionBar>`

- [ ] `src/components/ActionBar.tsx` exists and renders three buttons.
- [ ] Button labels contain "Feed", "Play", and "Rest" (and their emoji).
- [ ] All buttons are disabled when `pet === null`.
- [ ] Clicking Feed triggers `feed()`, Play triggers `play()`, Rest triggers `rest()`.
- [ ] Each button is at least 44×44 px (verify in browser DevTools).
- [ ] `<ActionBar>` is mounted in `App.tsx` below `<PetDisplay>`.

## Visual

- [ ] Buttons use the pixel font and are visually consistent with the rest of the UI.
- [ ] Disabled state is visually distinguishable (dimmed / pointer-events none).
- [ ] Layout does not break at 360 px viewport width.

## Build & tests

- [ ] `npm run build` exits with code 0 and zero TypeScript errors.
- [ ] `npm test` exits with code 0, all test files pass.
- [ ] `src/store/__tests__/usePetStore.test.ts` covers all three actions: primary effect, secondary effect, clamping, null guard.
- [ ] `src/components/__tests__/ActionBar.test.tsx` covers: labels, disabled state, click handlers.

## Git

- [ ] Branch `phase-6-care-actions` is up to date with `main`.
- [ ] No unrelated files changed.
- [ ] `REPLENISH` and `SIDE_EFFECT` imported from `src/config.ts` — no magic numbers in the store.
