# Plan — Phase 1: DB & Persistence Foundation

## Group 1 — Schema

1. Create `src/db/schema.ts` exporting a `SCHEMA_SQL` constant with the `CREATE TABLE IF NOT EXISTS pets (...)` statement (flat integer stats, as decided).
2. Export a `USER_VERSION = 1` constant to track migration state via SQLite's `PRAGMA user_version`.

## Group 2 — Database initialiser

3. Update `src/db/database.ts`:
   - On init, read `localStorage["tamagotchi_db"]`.
   - If present: base64-decode to `Uint8Array`, pass to `new SQL.Database(bytes)`.
   - If absent or corrupt: catch silently, create `new SQL.Database()`, apply `SCHEMA_SQL`, set `PRAGMA user_version = 1`.
   - Expose the singleton via `getDatabase()` (already exists — extend it).

## Group 3 — Save helper

4. Implement `saveDb()` in `src/db/database.ts`:
   - Call `db.export()` → `Uint8Array`.
   - Base64-encode via `btoa(String.fromCharCode(...bytes))`.
   - Write to `localStorage["tamagotchi_db"]`.

## Group 4 — Smoke test (temporary)

5. In `src/main.tsx`, after the React render call, add a `smokeTest()` async function:
   - Call `getDatabase()`.
   - Insert a test row into `pets`.
   - Call `saveDb()`.
   - Log the row back via `db.exec('SELECT * FROM pets')`.
   - Guard with `if (import.meta.env.DEV)` so it never runs in production.
6. Manually verify in the browser: insert → save → reload → row still present.
7. Remove `smokeTest()` and its call from `main.tsx` once verified.

## Group 5 — Unit tests

8. Update `src/db/__tests__/database.test.ts`:
   - Add tests for the localStorage load path (mock `localStorage.getItem` returning a valid base64 snapshot).
   - Add a test for the silent-reset path (mock `localStorage.getItem` returning garbage).
   - Add a test for `saveDb()` (spy on `localStorage.setItem`, verify a base64 string is written).
9. Run `npm test` — all tests green.

## Group 6 — Build check

10. Run `npm run build` — must exit 0 with no type errors.
