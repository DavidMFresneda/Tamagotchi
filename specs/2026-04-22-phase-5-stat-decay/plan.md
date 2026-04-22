# Plan — Phase 5: Stat Decay (The Game Tick)

## Task Group 1 — Constants (`src/config.ts`)

1. Create `src/config.ts` with `TICK_INTERVAL_MS = 30_000` and `DECAY = { hunger: 5, happiness: 4, energy: 3 }`.

## Task Group 2 — Implement `tick()` in the store (`src/store/usePetStore.ts`)

1. Import `DECAY` from `src/config.ts`.
2. Replace the `tick` no-op with a full implementation:
   - Guard: if `pet` is null, return.
   - Compute new values: `Math.max(0, stat.value - DECAY[key])` for hunger, happiness, energy.
   - `set(...)` with the updated pet.
3. Persist after state update: `getDatabase().then(db => { db.run('UPDATE pets SET hunger=?,happiness=?,energy=? WHERE 1', [...]), saveDb() })`.

## Task Group 3 — `useGameTick()` hook (`src/hooks/useGameTick.ts`)

1. Create `src/hooks/useGameTick.ts`.
2. Export `useGameTick()`: `useEffect` with `setInterval(tick, TICK_INTERVAL_MS)`, cleanup via `clearInterval`.

## Task Group 4 — Wire into `App.tsx`

1. Import and call `useGameTick()` inside `App`.

## Task Group 5 — Tests

1. `src/store/__tests__/usePetStore.test.ts` — add `tick()` tests:
   - Decrements hunger by 5, happiness by 4, energy by 3.
   - Clamps at 0 (does not go negative).
   - Is a no-op when `pet` is null.
   - Works correctly with special stats (max 200).
2. `src/hooks/__tests__/useGameTick.test.ts`:
   - `setInterval` is called with `TICK_INTERVAL_MS` on mount.
   - `clearInterval` is called on unmount.
   - Each interval fires calls `tick()` on the store.

## Task Group 6 — Verify

1. `npm run build` — zero TypeScript errors.
2. `npm test` — all tests pass.
3. Manual: open the app, wait 30 s, observe stats decrement; reload and confirm values persisted.
