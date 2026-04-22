# Requirements — Phase 4: Random Pet Generation

## Goal

On first launch the game creates a pet automatically — name and stats rolled at random. On subsequent launches the saved pet is loaded from the DB. No player input required at any point.

## Scope

| File | Change |
| --- | --- |
| `src/data/petNames.ts` | New file: exported list of ~20 quirky pixel-art pet names |
| `src/db/schema.ts` | Bump to USER_VERSION 2; redefine `pets` table with `_max` and `_special` columns per stat |
| `src/db/database.ts` | Add migration gate: if `user_version < 2`, drop and recreate the table |
| `src/store/usePetStore.ts` | Implement `generatePet()` with random name, 10% special-stat roll, persist to DB |
| `src/App.tsx` | Replace Phase 3 seed with async boot useEffect: load from DB or call `generatePet()` |

## Name list (`src/data/petNames.ts`)

Twenty quirky Tamagotchi/pixel-art names, exported as `PET_NAMES: string[]`. Examples: Mochi, Pochi, Bloop, Zap, Gloop, Nib, Pixel, Glorp, Digi, Byte, Wump, Fuzz, Qubit, Blip, Snorp, Kiko, Zuzu, Pip, Doot, Morp.

## DB schema (USER_VERSION 2)

Redefined `pets` table (no ALTER TABLE — valid since no live user data exists):

```sql
CREATE TABLE IF NOT EXISTS pets (
  id                INTEGER PRIMARY KEY,
  name              TEXT    NOT NULL,
  hunger            INTEGER NOT NULL,
  hunger_max        INTEGER NOT NULL DEFAULT 100,
  hunger_special    INTEGER NOT NULL DEFAULT 0,
  happiness         INTEGER NOT NULL,
  happiness_max     INTEGER NOT NULL DEFAULT 100,
  happiness_special INTEGER NOT NULL DEFAULT 0,
  energy            INTEGER NOT NULL,
  energy_max        INTEGER NOT NULL DEFAULT 100,
  energy_special    INTEGER NOT NULL DEFAULT 0,
  state             TEXT    NOT NULL DEFAULT 'normal'
);
```

`boolean` stored as `INTEGER` (0/1) — standard SQLite convention.

## Migration gate in `database.ts`

On `getDatabase()`, after loading from localStorage, read `PRAGMA user_version`. If it is less than 2, drop the `pets` table and run the v2 schema SQL, then set `PRAGMA user_version = 2`. This is equivalent to a silent reset — acceptable because no v1 pets exist in the wild.

## `generatePet()` logic

Implemented inside `usePetStore`:

1. Pick a random name from `PET_NAMES`.
2. For each of the three stats, roll `Math.random() < 0.1` → `isSpecial`.
3. `max` = `isSpecial ? 200 : 100`. `value` = `max` (pet starts fully healthy).
4. Build the `Pet` object with `state: 'normal'`.
5. Call `usePetStore.setState({ pet })`.
6. Persist: `INSERT INTO pets (...)` via `getDatabase()`, then `saveDb()`.

## Boot sequence in `App.tsx`

Replaces the Phase 3 hardcoded seed. A single `async` boot function inside `useEffect`:

1. `const db = await getDatabase()` — initialises or loads the DB.
2. `SELECT * FROM pets LIMIT 1` — check for an existing pet.
3. If a row exists → map columns back to `Pet` shape, call `usePetStore.setState({ pet })`.
4. If no row → call `usePetStore.getState().generatePet()`.

## Decisions

| Topic | Decision | Reason |
| --- | --- | --- |
| Schema migration | Redefine CREATE TABLE (USER_VERSION 2) | No live user data exists; simpler than ALTER TABLE and sets the correct column shape for all future phases |
| Name list location | `src/data/petNames.ts` | Keeps the store free of static content; easy to extend without touching logic |
| Boot logic location | `App.tsx` async useEffect | Fewest moving parts; replaces the Phase 3 seed with minimal diff |
| Boolean storage | `INTEGER` 0/1 | Standard SQLite — no extra parsing needed |
| Initial stat values | `value = max` | Pet starts fully healthy; decay begins in Phase 5 |

## Out of scope

- No stat decay or tick.
- No action buttons.
- No pet state transitions.
- No UI changes beyond removing the Phase 3 seed.
