# Requirements — Phase 6: Care Actions

## Goal

The player can actively care for the pet by pressing Feed, Play, or Rest. Each action replenishes its primary stat and has a small secondary effect. Changes are clamped to the stat's own ceiling and persisted immediately.

## Scope

| File | Change |
| --- | --- |
| `src/config.ts` | Add `REPLENISH` and `SIDE_EFFECT` constants |
| `src/store/usePetStore.ts` | Implement `feed()`, `play()`, `rest()` |
| `src/components/ActionBar.tsx` | New component: three emoji+text buttons |
| `src/App.tsx` | Mount `<ActionBar>` below `<PetDisplay>` |
| `src/index.css` | Button styles (pixel art, 44×44 px min touch target) |

## Action definitions

| Action | Primary effect | Secondary effect |
| --- | --- | --- |
| `feed()` | hunger += 20 | happiness += 5 |
| `play()` | happiness += 20 | energy −= 5 (clamped to 0) |
| `rest()` | energy += 20 | happiness += 5 |

All increments are clamped to the stat's own `max` (`Math.min(stat.max, stat.value + amount)`).
All decrements are clamped to 0 (`Math.max(0, stat.value - amount)`).

## Constants (`src/config.ts` additions)

```ts
export const REPLENISH = 20

export const SIDE_EFFECT = 5
```

Keeping amounts in config makes balancing trivial without touching store logic.

## `<ActionBar>` component

- Three `<button>` elements, each at least 44×44 px (pixel art style).
- Labels: `🍖 Feed`, `🎮 Play`, `💤 Rest`.
- Buttons are disabled (and visually dimmed) when `pet` is null — guards against clicks before boot completes.
- No cooldown in this phase.

## Persistence

After each action, `UPDATE pets SET hunger=?, happiness=?, energy=? WHERE 1` + `saveDb()` — same pattern as `tick()`.

## Decisions

| Topic | Decision | Reason |
| --- | --- | --- |
| Replenish amount | +20 (all actions) | 4× the highest decay rate (5/tick); actions feel impactful but not instant full-heal |
| Cross-effects | feed→happiness+5, play→energy−5, rest→happiness+5 | Adds personality without complex balancing; play has a cost, feeding/resting feel nurturing |
| Button style | Emoji + text label | No external assets; works in pixel font; emoji conveys meaning at a glance for 10–14 y/o |
| Disabled state | When `pet === null` | Boot is async; buttons appearing before a pet exists would throw |
| Clamping | `Math.min(max, value + amount)` / `Math.max(0, value - amount)` | Consistent with `tick()` pattern; handles special stats (max 200) automatically |

## Out of scope

- No cooldowns or action limits.
- No state transitions (`sick`, `evolved`) — Phase 7.
- No visual feedback beyond stat bar update (no animation, no "Yum!" message — Phase 9).
