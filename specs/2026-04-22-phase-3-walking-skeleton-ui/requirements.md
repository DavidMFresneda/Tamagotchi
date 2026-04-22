# Requirements — Phase 3: Walking Skeleton UI

## Goal

Render the pet's name and three stat bars on screen, reading live from the Zustand store. No decay, no buttons, no persistence — the deliverable is a visible, correctly wired UI slice.

## Scope

| File | Change |
| --- | --- |
| `src/components/PetDisplay.tsx` | New component: renders pet name + three `<StatBar>` instances |
| `src/components/StatBar.tsx` | New component: label, fill bar, special marker |
| `src/App.tsx` | Seed a hardcoded pet into the store on mount; mount `<PetDisplay>` |
| `src/index.css` | Pixel art baseline: Press Start 2P font, dark background, bar styles |

## Components

### `<StatBar>`

Props: `label: string`, `stat: Stat`

- Renders a track div containing a fill div.
- Fill width = `stat.value / stat.max * 100%` — works for both normal (100) and special (200) ceilings.
- If `stat.isSpecial === true`: prepend a `★` character to the label and apply the `.special` class to the fill (gold color).
- No animations in this phase.

### `<PetDisplay>`

- Reads `pet` from the Zustand store via `usePetStore`.
- If `pet` is null, renders nothing (guard clause — won't trigger in Phase 3 due to the seed).
- Renders: `<h2>` with the pet name, then one `<StatBar>` each for hunger, happiness, and energy.

### Seed in `App.tsx`

A `useEffect` on mount calls `usePetStore.setState` with a hardcoded pet that exercises special stats:

```ts
{
  name: 'Pochi',
  hunger:    { value: 80,  max: 100, isSpecial: false },
  happiness: { value: 60,  max: 200, isSpecial: true  },
  energy:    { value: 100, max: 100, isSpecial: false },
  state: 'normal',
}
```

This seed is **temporary** and will be removed in Phase 4 when `generatePet()` takes over.

## Visual style

- Font: *Press Start 2P* (Google Fonts) applied globally via `index.css`.
- Background: dark (`#1a1a2e`), light text (`#eee`) — establishes the pixel art palette.
- Stat bar track: fixed-width container (`200px`), short height (`12px`), dark fill background.
- Normal bar fill: green (`#4caf50`). Special bar fill: gold (`#ffd700`).
- Minimum viewport: layout must not break at 360 px width (no interactive elements in this phase).

## Decisions

| Topic | Decision | Reason |
| --- | --- | --- |
| Null pet handling | `<PetDisplay>` returns null if `pet === null` | Defensive — avoids crashes in Phase 4 when the store is briefly null before `generatePet()` runs |
| Test data source | Seed via `usePetStore.setState` in `App.tsx` `useEffect` | Keeps store and types unchanged; trivially removable in Phase 4 |
| Special stat marker | `★` Unicode + `.special` CSS class | Zero dependencies, consistent with pixel font aesthetic |
| CSS scope | Layout + pixel font + bar styles now | Establishes the pixel art constraint from the first visible phase; avoids style debt |

## Out of scope

- No decay, no tick.
- No action buttons.
- No persistence (`saveDb` not called).
- No pet state visuals (`sick`, `evolved` come in Phase 8).
