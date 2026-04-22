# Validation — Phase 5: Stat Decay (The Game Tick)

All of the following must be true before this phase is merged to `main`.

---

## Constants

- [ ] `src/config.ts` exists and exports `TICK_INTERVAL_MS = 30000` and `DECAY = { hunger: 5, happiness: 4, energy: 3 }`.

## `tick()`

- [ ] Each tick decrements `hunger` by 5, `happiness` by 4, `energy` by 3.
- [ ] Values never go below 0 — calling `tick()` on a stat already at 0 leaves it at 0.
- [ ] `tick()` is a no-op when `pet` is null — no errors thrown, state unchanged.
- [ ] After `tick()`, the DB row is updated (hunger, happiness, energy columns) and `saveDb()` is called.
- [ ] Special stats (max 200) decay at the same numeric rate as normal stats.

## `useGameTick()` hook

- [ ] `src/hooks/useGameTick.ts` exists and exports `useGameTick`.
- [ ] On mount, `setInterval` is called with `TICK_INTERVAL_MS` as the interval.
- [ ] On unmount, `clearInterval` is called — no interval leaks.
- [ ] Each interval fire calls `usePetStore.getState().tick()`.

## App wiring

- [ ] `useGameTick()` is called inside `App`.
- [ ] Opening the app and waiting 30 s causes the stat bars to visibly decrease.
- [ ] Reloading after a tick shows the decremented values (not the original ones).

## Build & tests

- [ ] `npm run build` exits with code 0 and zero TypeScript errors.
- [ ] `npm test` exits with code 0, all test files pass.
- [ ] `src/store/__tests__/usePetStore.test.ts` covers: decrement amounts, clamping, null guard, special stat.
- [ ] `src/hooks/__tests__/useGameTick.test.ts` covers: interval start, cleanup, tick invocation.

## Git

- [ ] Branch `phase-5-stat-decay` is up to date with `main`.
- [ ] No unrelated files changed.
- [ ] `TICK_INTERVAL_MS` and `DECAY` are imported from `src/config.ts` — no magic numbers in store or hook.
