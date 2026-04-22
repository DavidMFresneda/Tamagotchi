# Requirements — Phase 6 Final Steps

## Goal

Complete all remaining work from Phase 6 so the pet has full gameplay feedback loop:
- state transitions
- persisted state
- visual state feedback
- personality reactions
- easter egg behavior
- final UI polish

## Scope

In scope for this feature:
1. State transitions after every tick and every care action.
2. Persist pet state together with stats on every mutation.
3. Visual differentiation for normal, sick, and evolved states.
4. Reaction messages on care actions.
5. One easter egg sequence with a hidden reaction.
6. Light CSS polish (including smooth bar transitions) while keeping pixel-art style.

Out of scope:
1. New backend or cloud persistence.
2. New gameplay systems outside Phase 6 remaining tasks.
3. Multiplayer or authentication.

## Context

From mission and tech stack:
1. Target audience is ages 10-14, so behavior must be obvious and rewarding.
2. Pixel-art aesthetic is a hard constraint.
3. App is React + Zustand + sql.js with localStorage persistence.
4. Minimum viewport support is 360 px and touch targets remain usable.

## Functional Rules

### State transitions

Evaluate state immediately after each tick and each care action:
1. If any stat is 0, state is sick.
2. Else if all three stats are >= 80% of each stat max for 3 consecutive ticks, state is evolved.
3. Else state is normal.
4. Recovery rule: if pet is sick and all stats are above 0, pet returns to normal.

Notes:
1. Consecutive counter resets when the >=80% condition breaks.
2. Consecutive check is tick-based (not wall-clock).
3. Care actions can move pet out of sick immediately via recovery rule.

### Persistence

1. Persist state in database on every action and every tick update, together with hunger, happiness, energy.
2. On boot, hydrate state from DB as source of truth.

### Visual states

1. Pet UI must clearly indicate normal, sick, evolved.
2. Visual difference can be via class, color accents, iconography, or combination.
3. Keep pixel-art readability and avoid style drift.

### Personality and polish

1. Show short reaction message after feed, play, rest.
2. Add one easter egg sequence of actions with a unique hidden message.
3. Add smooth stat bar transition and keep layout readable on desktop and mobile.

## Decisions

1. Sustained evolution window: 3 consecutive ticks.
Reason: aligns with requested rule and keeps progress visible without long waits.

2. Evolution threshold: >= 80% for each stat using each stat own max.
Reason: consistent with special stats design.

3. State evaluation trigger: after tick and after care actions.
Reason: immediate feedback for players and deterministic logic.

4. Personality delivery: short, non-blocking text near pet display.
Reason: simple implementation and child-friendly clarity.
