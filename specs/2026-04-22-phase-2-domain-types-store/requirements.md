# Requirements — Phase 2: Domain Types and Zustand Store Skeleton

## Goal

Upgrade the domain types and Zustand store so the entire codebase has a single, authoritative model of what a pet is. No UI, no persistence wired yet — this phase is a pure compilation target.

## Scope

| File | Change |
| --- | --- |
| `src/types/index.ts` | Replace flat stat numbers with `Stat` object; keep `PetState` union; add `Pet` |
| `src/store/usePetStore.ts` | Replace minimal name-only store with full `PetStore` interface; all actions as no-op stubs |

## Type definitions

### `Stat`

```ts
interface Stat {
  value: number
  max: number
  isSpecial: boolean
}
```

A stat carries its own ceiling. Normal stats have `max: 100`; special stats have `max: 200`. All arithmetic in later phases uses `stat.max` as the reference, never a hardcoded 100.

### `PetState`

```ts
type PetState = 'normal' | 'sick' | 'evolved'
```

Unchanged from Phase 1.

### `Pet`

```ts
interface Pet {
  name: string
  hunger: Stat
  happiness: Stat
  energy: Stat
  state: PetState
}
```

### `PetStore` (Zustand interface)

```ts
interface PetStore {
  pet: Pet | null
  feed: () => void
  play: () => void
  rest: () => void
  tick: () => void
  generatePet: () => void
}
```

`pet` starts as `null`. Phase 4 will implement `generatePet()` to create and hydrate it.

## Decisions

| Topic | Decision | Reason |
| --- | --- | --- |
| Zustand interface name | `PetStore` (not `PetState`) | `PetState` is already the union type; reusing it for the store interface creates a name collision |
| Initial store value | `pet: null` | Honest with the lifecycle — no pet exists until `generatePet()` runs in Phase 4. Avoids placeholder data leaking into production |
| Action stubs | Silent no-ops `() => {}` | Build and tests pass without noise; logic is filled in per phase without forcing earlier phases to implement or throw |
| `Stat` location | `src/types/index.ts` | Single source of truth — store, components, and db layer all import from the same place |

## Out of scope

- No implementation of any action (`feed`, `play`, `rest`, `tick`, `generatePet`).
- No persistence — `saveDb()` is not called.
- No UI changes.
- No DB schema changes (Phase 4 adds `max` and `isSpecial` columns).
