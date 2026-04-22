# Plan — Phase 6: Care Actions

## Task Group 1 — Constants (`src/config.ts`)

1. Add `REPLENISH = 20` and `SIDE_EFFECT = 5` to `src/config.ts`.

## Task Group 2 — Implement `feed()`, `play()`, `rest()` (`src/store/usePetStore.ts`)

1. Import `REPLENISH` and `SIDE_EFFECT` from `src/config.ts`.
2. Replace the `feed` no-op:
   - Guard: if `pet` is null, return.
   - `hunger.value = Math.min(hunger.max, hunger.value + REPLENISH)`.
   - `happiness.value = Math.min(happiness.max, happiness.value + SIDE_EFFECT)`.
   - `set(...)` with updated pet, then persist.
3. Replace the `play` no-op:
   - Guard: if `pet` is null, return.
   - `happiness.value = Math.min(happiness.max, happiness.value + REPLENISH)`.
   - `energy.value = Math.max(0, energy.value - SIDE_EFFECT)`.
   - `set(...)` with updated pet, then persist.
4. Replace the `rest` no-op:
   - Guard: if `pet` is null, return.
   - `energy.value = Math.min(energy.max, energy.value + REPLENISH)`.
   - `happiness.value = Math.min(happiness.max, happiness.value + SIDE_EFFECT)`.
   - `set(...)` with updated pet, then persist.
5. Extract a shared `persistStats(pet)` helper inside the store to avoid repeating the UPDATE + saveDb() pattern across three actions and tick().

## Task Group 3 — `<ActionBar>` component (`src/components/ActionBar.tsx`)

1. Read `pet` from `usePetStore` to derive the disabled state.
2. Render three buttons: `🍖 Feed`, `🎮 Play`, `💤 Rest`.
3. Wire each button to the corresponding store action.
4. Disable all buttons when `pet === null`.

## Task Group 4 — CSS (`src/index.css`)

1. Add `.action-bar` layout (flex row, centered, gap).
2. Add `button` base style: pixel font, min 44×44 px, pixel border, hover/active states.
3. Add `button:disabled` style: reduced opacity, no pointer cursor.

## Task Group 5 — Wire into `App.tsx`

1. Import and mount `<ActionBar>` below `<PetDisplay>`.

## Task Group 6 — Tests

1. `src/store/__tests__/usePetStore.test.ts` — add tests for each action:
   - `feed()`: hunger up by 20, happiness up by 5, energy unchanged, clamped to max.
   - `play()`: happiness up by 20, energy down by 5, hunger unchanged, clamped.
   - `rest()`: energy up by 20, happiness up by 5, hunger unchanged, clamped.
   - All three: no-op when `pet` is null.
2. `src/components/__tests__/ActionBar.test.tsx`:
   - Renders three buttons with correct labels.
   - Buttons are disabled when `pet` is null.
   - Clicking Feed calls `feed()`, Play calls `play()`, Rest calls `rest()`.

## Task Group 7 — Verify

1. `npm run build` — zero TypeScript errors.
2. `npm test` — all tests pass.
3. Manual: click each button, observe correct stat changes in the bars.
