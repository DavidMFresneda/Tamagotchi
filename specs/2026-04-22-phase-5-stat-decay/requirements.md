# Requirements — Phase 5: Stat Decay (The Game Tick)

## Goal

Stats drop automatically over time while the app is open. The pet becomes gradually more needy — this is the core game loop that makes caring for it feel meaningful.

## Scope

| File | Change |
| --- | --- |
| `src/config.ts` | New file: `TICK_INTERVAL_MS` and `DECAY` constants |
| `src/store/usePetStore.ts` | Implement `tick()`: decrement stats, clamp to 0, persist |
| `src/hooks/useGameTick.ts` | New custom hook: starts/clears the setInterval |
| `src/App.tsx` | Call `useGameTick()` |

## Constants (`src/config.ts`)

```ts
export const TICK_INTERVAL_MS = 30_000   // 30 seconds

export const DECAY = {
  hunger:    5,
  happiness: 4,
  energy:    3,
} as const
```

Keeping constants in a dedicated file makes balancing trivial and tests explicit.

## `tick()` logic

1. Read `pet` from the store. If `pet` is null, return immediately (no-op).
2. Compute new stat values: `Math.max(0, stat.value - DECAY[stat])` for each stat.
3. Call `set(...)` with the updated pet (same `max`, `isSpecial`, and `state` — those do not change in this phase).
4. Persist asynchronously: `UPDATE pets SET hunger=?, happiness=?, energy=? WHERE 1`, then `saveDb()`.

### Decay rates

| Stat | Decrement per tick | Rationale |
| --- | --- | --- |
| Hunger | −5 | Most urgent need |
| Happiness | −4 | Important but slightly slower |
| Energy | −3 | Slowest to deplete |

Special stats (max 200) decay at the same numeric rate, so they naturally last twice as long before hitting 0 — this is the intended advantage of a special stat.

### Clamping

Values never go below 0. `Math.max(0, value - decay)` is applied to each stat independently.

## `useGameTick()` hook (`src/hooks/useGameTick.ts`)

```ts
export function useGameTick(): void {
  useEffect(() => {
    const id = setInterval(() => {
      usePetStore.getState().tick()
    }, TICK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])
}
```

- Starts the interval when the component mounts.
- Clears it on unmount (prevents memory leaks and ghost ticks if the component remounts).
- The hook calls `tick()` only — `tick()` itself handles state and persistence.

## Decisions

| Topic | Decision | Reason |
| --- | --- | --- |
| Interval | 30 s | Stats last ~10 min (normal) / ~20 min (special) — visible in a short session, not instant |
| Decay rates | 5 / 4 / 3 (hunger / happiness / energy) | Different urgency per stat adds personality without complex balancing |
| Persistence | Inside `tick()` | Consistent with `generatePet()` pattern; hook stays free of DB logic |
| Tick location | `useGameTick()` hook | Isolated, testable separately from App; easy to disable in tests |
| WHERE clause | `UPDATE pets SET ... WHERE 1` | Single-pet invariant — no need to track the row id in the store |

## Out of scope

- No state transitions (`sick`, `evolved`) — Phase 7.
- No care actions to replenish stats — Phase 6.
- No UI feedback for the tick (no animation, no counter).
