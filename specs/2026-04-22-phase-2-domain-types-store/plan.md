# Plan — Phase 2: Domain Types and Zustand Store Skeleton

## Task Group 1 — Upgrade `src/types/index.ts`

1. Add `Stat` interface (`value`, `max`, `isSpecial`).
2. Update `Pet` interface: replace `hunger: number`, `happiness: number`, `energy: number` with `hunger: Stat`, `happiness: Stat`, `energy: Stat`.
3. Keep `PetState` union unchanged.
4. Export all three: `Stat`, `Pet`, `PetState`.

## Task Group 2 — Rewrite `src/store/usePetStore.ts`

1. Define `PetStore` interface with `pet: Pet | null` and five action signatures (`feed`, `play`, `rest`, `tick`, `generatePet`), all `() => void`.
2. Replace the existing store with a `create<PetStore>` call.
3. Set initial state to `{ pet: null }`.
4. Implement all five actions as silent no-ops `() => {}`.

## Task Group 3 — Update tests

1. Update `src/types/__tests__/index.test.ts`: add type-shape contract for `Stat`; update `Pet` assertions to expect `Stat` objects instead of numbers.
2. Update `src/store/__tests__/usePetStore.test.ts`: verify initial state has `pet: null`; verify all five actions exist and are callable without throwing.

## Task Group 4 — Verify build

1. Run `npm run build` — must complete with zero TypeScript errors.
2. Run `npm test` — all tests must pass.
