# Validation — Phase 2: Domain Types and Zustand Store Skeleton

All of the following must be true before this phase is merged to `main`.

---

## Types

- [ ] `Stat` is exported from `src/types/index.ts` with fields `value: number`, `max: number`, `isSpecial: boolean`.
- [ ] `Pet` is exported with `hunger: Stat`, `happiness: Stat`, `energy: Stat`, `name: string`, `state: PetState`.
- [ ] `PetState` union (`'normal' | 'sick' | 'evolved'`) is unchanged and exported.
- [ ] No other file in the codebase references `hunger: number`, `happiness: number`, or `energy: number` directly on a `Pet`.

## Store

- [ ] `usePetStore` is typed with a `PetStore` interface (not `PetState`).
- [ ] Initial store state has `pet: null`.
- [ ] All five actions exist on the store: `feed`, `play`, `rest`, `tick`, `generatePet`.
- [ ] Each action is callable (`store.feed()`) without throwing or logging anything.

## Build

- [ ] `npm run build` exits with code 0 and zero TypeScript errors.

## Tests

- [ ] `npm test` exits with code 0, all test files pass.
- [ ] `src/types/__tests__/index.test.ts` asserts the shape of `Stat` and the updated `Pet`.
- [ ] `src/store/__tests__/usePetStore.test.ts` asserts `pet === null` on init and that all five actions are functions.

## Git

- [ ] Branch `phase-2-domain-types-store` is up to date with `main`.
- [ ] No unrelated files changed.
