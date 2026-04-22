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

## Phase 4 — Random pet generation

**Delivers:** On first launch, a pet is created automatically and fully at random. No player input required.

- Implement `generatePet()` in the store:
  - Pick a name at random from a hardcoded list of ~20 names.
  - For each of the three stats, roll `Math.random() < 0.1` to decide if it is special.
  - A special stat gets `max: 200`; a normal stat gets `max: 100`. Initial `value` is set to `max` (pet starts healthy).
- On app boot: check the DB for a saved pet row.
  - If found: load it and hydrate the store.
  - If not found: call `generatePet()`, persist the result to the DB, call `saveDb()`.
- Update `src/db/schema.ts` to store `isSpecial` (boolean) and `max` for each stat alongside `value`.

---

## Phase 5 — Stat decay (the game tick)

**Delivers:** Stats drop automatically over time while the app is open.

- Implement `tick()` in the store: decrement hunger, happiness, energy by configured amounts, clamp to 0.
- Start a `setInterval` in `App.tsx` (or a custom hook) that calls `tick()` every N seconds.
- Call `saveDb()` after each tick.
- Verify that stats reach 0 and stop there.

---

## Phase 6 — Care actions

**Delivers:** Feed, Play, and Rest buttons that replenish stats and persist the change.

- Implement `feed()`, `play()`, `rest()` in the store: add stat points, clamp to the stat's own `max` (100 or 200).
- Add a `<ActionBar>` component with three buttons wired to the store actions.
- Call `saveDb()` after each action.

---

## Phase 7 — State transitions

**Delivers:** The pet transitions between Normal, Sick, and Evolved based on stat values.

- After every `tick()` and care action, evaluate state:
  - Any stat at 0 → `sick`.
  - All stats ≥ 80% of their `max` for a sustained period → `evolved`.
  - Otherwise → `normal`.
  - Recovery: from `sick` back to `normal` when all stats > 0.
- Persist the current state with each `saveDb()` call.

---

## Phase 8 — Visual states

**Delivers:** The UI visually distinguishes Normal, Sick, and Evolved.

- `<PetDisplay>` renders a different class, colour, or icon per `PetState`.
- No full animation required — a clear visual difference is enough for this phase.

---

## Phase 9 — Personality and polish

**Delivers:** Small reactions and quirky messages that give the pet a distinct character.

- Add reaction messages triggered by care actions (e.g., "Yum!" on feed).
- Add at least one easter egg (e.g., a hidden reaction when a specific sequence of actions is performed).
- Light CSS polish: smooth stat bar transitions, readable layout.
