# Roadmap

Phases are ordered so that each one produces a working, independently verifiable slice of the application. Each phase is sized for 1–3 hours of focused work.

The persistence foundation comes first so that every subsequent phase can write and read durable data from day one — no throwaway code.

---

## Phase 1 — DB & persistence foundation ✅

**Delivers:** A working save/load cycle for the SQLite database, proven with a console smoke test. No UI.

- [x] Implement `src/db/database.ts`: initialise sql.js, load existing DB from `localStorage` on start, create schema on first boot.
- [x] Implement `src/db/schema.ts`: `CREATE TABLE IF NOT EXISTS pets (...)` with all pet fields.
- [x] Implement `saveDb()`: export DB as `Uint8Array`, base64-encode, write to `localStorage["tamagotchi_db"]`.
- [x] Smoke test in `main.tsx`: insert a row, call `saveDb()`, reload, verify the row is still there.

---

## Phase 2 — Domain types and Zustand store skeleton ✅

**Delivers:** A fully typed store that compiles cleanly. No UI, no persistence wired yet.

- [x] Finalise `src/types/index.ts`:
  - `Stat { value: number; max: number; isSpecial: boolean }` — a stat carries its own ceiling (100 normal, 200 special).
  - `Pet { name: string; hunger: Stat; happiness: Stat; energy: Stat; state: PetState }`.
  - `PetState` (`normal | sick | evolved`).
- [x] Build `src/store/usePetStore.ts`: initial state `pet: null`, typed action stubs (`feed`, `play`, `rest`, `tick`, `generatePet`) as silent no-ops.
- [x] Verify with `npm run build`.

---

## Phase 3 — Walking skeleton UI ✅

**Delivers:** The app renders the pet's name and three stat bars on screen, reading from the store. Special stats are visually marked.

- [x] Add a `<PetDisplay>` component: name, and one `<StatBar>` per stat.
- [x] `<StatBar>` receives the full `Stat` object; if `isSpecial` is true it renders a ★ icon and a gold bar color.
- [x] The bar fill is `value / max * 100%` — so a special stat at 60/200 fills to 30%, same visual proportion as a normal stat at 60/100.
- [x] Mount in `App.tsx` with a temporary hardcoded seed pet (removed in Phase 4).
- [x] Press Start 2P pixel font and dark background applied globally.

---

## Phase 4 — Random pet generation ✅

**Delivers:** On first launch, a pet is created automatically and fully at random. No player input required.

- [x] Implement `generatePet()` in the store: random name from `PET_NAMES`, 10% special-stat roll, `value = max`, persists to DB.
- [x] On app boot: async `boot()` in `App.tsx` — loads from DB if pet exists, otherwise calls `generatePet()`.
- [x] `src/db/schema.ts` upgraded to USER_VERSION 2: added `_max` and `_special` columns per stat.
- [x] Migration gate in `database.ts`: silently resets v1 DBs to v2 schema on load.
- [x] `src/data/petNames.ts`: 20 quirky pixel-art names.

---

## Phase 5 — Stat decay (the game tick) ✅

**Delivers:** Stats drop automatically over time while the app is open.

- [x] Implement `tick()` in the store: hunger −5, happiness −4, energy −3 per tick, clamped to 0.
- [x] `src/config.ts`: `TICK_INTERVAL_MS = 30_000` and `DECAY` constants.
- [x] `useGameTick()` custom hook: `setInterval` every 30 s, clears on unmount.
- [x] Call `saveDb()` after each tick via DB UPDATE.
- [x] Stats reach 0 and stop there (Math.max clamp).

---

## Phase 6 — Care, state system, visual feedback, and polish ✅

**Delivers:** Complete gameplay loop for the remaining scope: care actions, state transitions, state-based visuals, and personality polish.

- [x] Implement `feed()`, `play()`, `rest()` in the store: add stat points, clamp to each stat's own `max` (100 or 200).
- [x] Add an `<ActionBar>` component with three buttons wired to the store actions.
- [x] Call `saveDb()` after each action.
- [x] After every `tick()` and care action, evaluate state:
  - Any stat at 0 -> `sick`.
  - All stats >= 80% of their `max` for a sustained period -> `evolved`.
  - Otherwise -> `normal`.
  - Recovery: from `sick` back to `normal` when all stats > 0.
- [x] Persist the current state with each `saveDb()` call.
- [x] `<PetDisplay>` renders a different class, color, or icon per `PetState`.
- [x] No full animation required, but a clear visual difference is required.
- [x] Add reaction messages triggered by care actions (e.g., "Yum!" on feed).
- [x] Add at least one easter egg (e.g., hidden reaction after a specific action sequence).
- [x] Light CSS polish: smooth stat bar transitions and readable layout.
