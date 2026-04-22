# Plan — Phase 4: Random Pet Generation

## Task Group 1 — Name list (`src/data/petNames.ts`)

1. Create `src/data/petNames.ts` exporting `PET_NAMES: string[]` with 20 quirky pixel-art names.

## Task Group 2 — Schema v2 (`src/db/schema.ts`)

1. Bump `USER_VERSION` to `2`.
2. Redefine `SCHEMA_SQL` with the full `pets` table including `_max` and `_special` columns for all three stats.

## Task Group 3 — Migration gate (`src/db/database.ts`)

1. After loading the DB from localStorage (or creating fresh), read `PRAGMA user_version`.
2. If `user_version < 2`: drop `pets`, run `SCHEMA_SQL`, set `PRAGMA user_version = 2`.
3. Fresh DBs skip this gate (they receive the v2 schema directly on creation).

## Task Group 4 — Implement `generatePet()` (`src/store/usePetStore.ts`)

1. Import `PET_NAMES` from `src/data/petNames.ts`.
2. Import `getDatabase` and `saveDb` from `src/db/database.ts`.
3. Implement `generatePet()`:
   - Roll name, isSpecial per stat, compute max and value.
   - `setState({ pet })`.
   - INSERT the pet row into the DB and call `saveDb()`.

## Task Group 5 — Boot sequence (`src/App.tsx`)

1. Remove the Phase 3 `PHASE3_SEED` constant and its `useEffect`.
2. Add an async `boot()` function inside a new `useEffect`:
   - `getDatabase()` → query `SELECT * FROM pets LIMIT 1`.
   - If row found: map to `Pet`, call `usePetStore.setState({ pet })`.
   - If not found: call `usePetStore.getState().generatePet()`.

## Task Group 6 — Tests

1. `src/data/__tests__/petNames.test.ts` — list has exactly 20 entries, all strings, no duplicates.
2. `src/db/__tests__/schema.test.ts` — `USER_VERSION` equals 2; `SCHEMA_SQL` contains all expected columns.
3. `src/store/__tests__/usePetStore.test.ts` — add tests for `generatePet()`: pet is non-null after call, name is from `PET_NAMES`, each stat has correct `max` (100 or 200), `value === max`.

## Task Group 7 — Verify

1. `npm run build` — zero TypeScript errors.
2. `npm test` — all tests pass.
3. Manual: clear localStorage, open app — a random pet appears. Reload — same pet persists.
