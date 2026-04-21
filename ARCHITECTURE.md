# Architecture

This document records architectural decisions for the Tamagotchi project. Each entry explains the choice made and the reasoning behind it.

---

## ADR-001 — React as the UI framework

**Decision:** Use React 19 for all UI rendering.

**Reasoning:** React is the dominant choice for component-based web UIs, has excellent TypeScript support, and the stable v19 release is actively maintained. The component model maps naturally to the pet's discrete visual states (normal, sick, evolved).

---

## ADR-002 — Vite as the build tool

**Decision:** Use Vite instead of Create React App or Webpack.

**Reasoning:** Vite provides near-instant HMR and fast cold starts via native ES modules. Create React App is unmaintained. Vite is now the recommended scaffold for new React projects and has first-class TypeScript support.

---

## ADR-003 — TypeScript throughout

**Decision:** Use TypeScript for all source files.

**Reasoning:** The project has clearly defined domain types (Pet, PetState, stats). TypeScript enforces these contracts across the UI, business logic, and data layers, catching mis-wiring at compile time rather than runtime.

---

## ADR-004 — Zustand for the business logic layer

**Decision:** Use Zustand as the state management library that holds all business logic.

**Reasoning:** Zustand is minimal, has no boilerplate, and does not couple logic to React component lifecycle. Stores can be tested independently of React. The business rules (stat decay, state transitions) live in the store actions, keeping React components as pure display logic.

**Trade-off:** Zustand has less structure than Redux Toolkit, which could matter in a larger team. For this project scope (1 user, 1 pet) the simplicity is a net win.

---

## ADR-005 — sql.js for local persistence

**Decision:** Use sql.js (SQLite compiled to WebAssembly) for local data storage.

**Reasoning:** The project requires structured relational storage that runs entirely in-browser with no backend. sql.js provides full SQLite semantics (SQL queries, transactions, schema migrations) without a server. The WASM binary is served statically from `/public/sql-wasm.wasm`.

**Trade-off:** sql.js stores the database in memory and must be serialised to `localStorage` or `IndexedDB` manually to survive page reloads. This serialisation step must be implemented before any persistent feature is considered complete. An alternative like Dexie.js would handle persistence automatically but loses SQL query expressiveness.

---

## ADR-006 — Three-layer separation

**Decision:** Enforce a strict separation between UI, business logic, and data access.

```text
src/components/  →  React components (display only, no business logic)
src/store/       →  Zustand stores (business rules, state transitions)
src/db/          →  sql.js access (schema, queries, persistence)
```

**Reasoning:** Each layer has a single responsibility and can evolve or be replaced independently. Components do not query the database directly; they dispatch actions to the store. The store coordinates with the db layer when persistence is needed.

---

## ADR-007 — Pixel art as the visual style

**Decision:** All graphics, sprites, fonts, and UI elements must follow a pixel art aesthetic. This is a product constraint defined in [specs/mission.md](specs/mission.md), not an implementation detail.

**Technical implications:**

| Concern | Rule |
| --- | --- |
| Image rendering | All `<img>` and canvas elements use `image-rendering: pixelated` in CSS to prevent the browser from smoothing scaled-up sprites. |
| Asset resolution | Sprites are authored at low resolution (16×16 or 32×32 px) and displayed at 2×–4× scale via CSS `width`/`height`. Never scale up via asset export. |
| Font | Use a bitmap/pixel font. *Press Start 2P* (Google Fonts) is the default choice — no system serif or sans-serif for game UI text. |
| Animations | Use CSS `steps()` easing or sprite-sheet frame switching. Avoid `ease`, `ease-in-out`, or any interpolation that produces sub-pixel smoothing. |
| SVG | Avoid smooth-curve SVG icons in game UI. If SVG is used, it must be drawn on a pixel grid (integer coordinates, no `stroke-linecap: round`). |
| Borders and layout | UI chrome (stat bars, panels, buttons) follows a blocky, pixel-grid-aligned style. Border radii are 0 or in whole pixel increments. |

**Trade-off:** Pixel fonts reduce readability at small sizes. Keep all game UI text at a minimum of 8 px rendered size (which typically means the font-size is set to 8 px and the element is scaled up, or the font is used at 16 px+).
