# Requirements — Phase 1: DB & Persistence Foundation

## Scope

Implement the full save/load cycle for the SQLite database using sql.js and localStorage. No UI is produced in this phase. The deliverable is a working data layer that every subsequent phase can build on.

## Context

sql.js keeps the database entirely in memory. Data is lost on page reload unless explicitly serialised. The persistence strategy is:

1. On startup: check `localStorage["tamagotchi_db"]` for a base64-encoded snapshot.
   - If found: initialise sql.js from those bytes.
   - If not found (or corrupt): create a fresh database and apply the schema.
2. After every mutation: call `saveDb()` to export, base64-encode, and write back to localStorage.

## Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Schema shape | Flat integer columns for stats | Phase 2 will refine stats to `Stat { value, max, isSpecial }`. A simple migration via `ALTER TABLE` is cleaner than anticipating the full shape now. |
| Smoke test fate | Remove after verification | Once the phase is merged, main.tsx is cleaned up. Correctness is covered by Vitest unit tests going forward. |
| Corrupt/incompatible localStorage | Silent reset | On any parse or schema error, clear the key and boot as a first launch. The player gets a new random pet. No error UI required in this phase. |
| Persistence key | `tamagotchi_db` | Fixed key, single user, single pet per browser session. |

## Schema (Phase 1)

```sql
CREATE TABLE IF NOT EXISTS pets (
  id          INTEGER PRIMARY KEY,
  name        TEXT    NOT NULL,
  hunger      INTEGER NOT NULL,
  happiness   INTEGER NOT NULL,
  energy      INTEGER NOT NULL,
  state       TEXT    NOT NULL DEFAULT 'normal'
);
```

Stats are stored as plain integers. Phase 2 will `ALTER TABLE` to add `_max` and `_is_special` columns per stat.

## Out of scope

- Any UI component.
- Loading a pet from the DB into the Zustand store (Phase 4).
- Stat decay, care actions, or state transitions.
- Pixel art styling.
