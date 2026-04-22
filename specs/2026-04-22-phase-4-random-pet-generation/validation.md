# Validation — Phase 4: Random Pet Generation

All of the following must be true before this phase is merged to `main`.

---

## Name list

- [ ] `src/data/petNames.ts` exists and exports `PET_NAMES`.
- [ ] `PET_NAMES` contains exactly 20 entries, all non-empty strings, no duplicates.

## Schema

- [ ] `USER_VERSION` in `schema.ts` is `2`.
- [ ] `SCHEMA_SQL` includes columns: `hunger_max`, `hunger_special`, `happiness_max`, `happiness_special`, `energy_max`, `energy_special`.
- [ ] `database.ts` migration gate: a DB with `user_version < 2` is silently reset to v2 schema on next load.

## `generatePet()`

- [ ] After `generatePet()` is called, `usePetStore.getState().pet` is non-null.
- [ ] `pet.name` is one of the values in `PET_NAMES`.
- [ ] Each stat's `max` is either `100` (normal) or `200` (special).
- [ ] Each stat's `value` equals its `max` (pet starts fully healthy).
- [ ] The pet is persisted: after `generatePet()`, `localStorage["tamagotchi_db"]` is non-null.

## Boot sequence

- [ ] The Phase 3 hardcoded `PHASE3_SEED` and its `useEffect` are removed from `App.tsx`.
- [ ] On first load (empty localStorage): a random pet is generated and displayed.
- [ ] On reload: the same pet (same name, same stats) is loaded from the DB — not regenerated.
- [ ] If localStorage contains a corrupt DB, the app recovers silently and boots as a fresh launch.

## Build & tests

- [ ] `npm run build` exits with code 0 and zero TypeScript errors.
- [ ] `npm test` exits with code 0, all test files pass.
- [ ] `src/data/__tests__/petNames.test.ts` covers: count, types, no duplicates.
- [ ] `src/store/__tests__/usePetStore.test.ts` covers `generatePet()` outcomes.

## Git

- [ ] Branch `phase-4-random-pet-generation` is up to date with `main`.
- [ ] No unrelated files changed.
- [ ] No TODO comments referencing Phase 3 seed remain in the codebase.
