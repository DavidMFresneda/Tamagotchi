# Roadmap

Phases are ordered so that each one produces a working, independently verifiable slice of the application. Each phase is sized for 1–3 hours of focused work.

The persistence foundation comes first so that every subsequent phase can write and read durable data from day one — no throwaway code.

---

## Phase 1 — DB & persistence foundation

**Delivers:** A working save/load cycle for the SQLite database, proven with a console smoke test. No UI.

- Implement `src/db/database.ts`: initialise sql.js, load existing DB from `localStorage` on start, create schema on first boot.
- Implement `src/db/schema.ts`: `CREATE TABLE IF NOT EXISTS pets (...)` with all pet fields.
- Implement `saveDb()`: export DB as `Uint8Array`, base64-encode, write to `localStorage["tamagotchi_db"]`.
- Smoke test in `main.tsx`: insert a row, call `saveDb()`, reload, verify the row is still there.

---

## Phase 2 — Domain types and Zustand store skeleton

**Delivers:** A fully typed store that compiles cleanly. No UI, no persistence wired yet.

- Finalise `src/types/index.ts`: `Pet`, `PetState` (`normal | sick | evolved`), stat bounds.
- Build `src/store/usePetStore.ts`: initial state, typed actions stubs (`feed`, `play`, `rest`, `tick`, `setName`).
- Verify with `npm run build`.

---

## Phase 3 — Walking skeleton UI

**Delivers:** The app renders the pet's name and three stat bars on screen, reading from the store.

- Add a `<PetDisplay>` component: name, hunger bar, happiness bar, energy bar.
- Mount it in `App.tsx`.
- No decay, no buttons, no persistence — just static data from the store's initial state.

---

## Phase 4 — Pet naming

**Delivers:** On first launch, the user is prompted to name their pet. The name is persisted.

- Add a `<NameInput>` component shown when `pet.name` is empty.
- On submit: call `store.setName()`, insert or update the pets row in the DB, call `saveDb()`.
- On app boot: load the saved pet row from the DB and hydrate the store.

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

- Implement `feed()`, `play()`, `rest()` in the store: add stat points, clamp to 100.
- Add a `<ActionBar>` component with three buttons wired to the store actions.
- Call `saveDb()` after each action.

---

## Phase 7 — State transitions

**Delivers:** The pet transitions between Normal, Sick, and Evolved based on stat values.

- After every `tick()` and care action, evaluate state:
  - Any stat at 0 → `sick`.
  - All stats ≥ 80 for a sustained period → `evolved`.
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
