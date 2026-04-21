# Validation — Phase 1: DB & Persistence Foundation

## Definition of done

All of the following must be true before this phase is merged to main.

## 1. Browser smoke test (manual, then removed)

Performed during development, not a permanent artefact.

- [ ] Open the app in the browser with DevTools console visible.
- [ ] Console shows a log of the inserted test row (e.g. `[{name: "test", hunger: 50, ...}]`).
- [ ] Hard-reload the page (Ctrl+Shift+R / Cmd+Shift+R).
- [ ] The same row is logged again — data survived the reload.
- [ ] `localStorage["tamagotchi_db"]` is visible in the Application tab and contains a base64 string.

## 2. Silent-reset path (manual)

- [ ] Open DevTools → Application → Local Storage → delete `tamagotchi_db`.
- [ ] Reload — app boots without errors; a fresh database is created.
- [ ] Open DevTools → Application → Local Storage — `tamagotchi_db` now exists again.

## 3. Corrupt-data path (manual)

- [ ] Set `localStorage["tamagotchi_db"]` to the string `"not_valid_base64!!!!"`.
- [ ] Reload — app boots without errors, no error screen shown.
- [ ] `tamagotchi_db` is overwritten with a valid base64 string.

## 4. Unit tests

- [ ] `npm test` exits 0.
- [ ] `src/db/__tests__/database.test.ts` includes tests for:
  - Happy path: `getDatabase()` returns a usable instance.
  - localStorage load path: valid base64 snapshot → db initialised from bytes.
  - Silent-reset path: corrupt localStorage value → fresh db, no throw.
  - `saveDb()`: `localStorage.setItem` is called with a base64 string.

## 5. Build

- [ ] `npm run build` exits 0 with no TypeScript errors.
- [ ] No test files are included in the production bundle.

## 6. Code cleanliness

- [ ] `main.tsx` contains no smoke test code.
- [ ] No `console.log` or debug statements left in `src/db/`.
- [ ] `saveDb()` is exported from `src/db/database.ts` and ready to be called by future phases.

## Merge checklist

- [ ] All items above are checked.
- [ ] Branch `phase-1-db-persistence` is up to date with `main`.
- [ ] PR description references this validation doc.
