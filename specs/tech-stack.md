# Tech Stack

Detailed architectural rationale lives in [ARCHITECTURE.md](../ARCHITECTURE.md). This document is a concise reference for what is used, where it lives, and any non-obvious integration details.

## Layers

```text
src/components/   UI layer      — React 19 + TypeScript
src/store/        Logic layer   — Zustand
src/db/           Data layer    — sql.js (SQLite/WASM)
src/types/        Shared types  — TypeScript interfaces and enums
```

## Package inventory

| Package | Role | Version pin |
| --- | --- | --- |
| `react`, `react-dom` | UI rendering | ^19 |
| `typescript` | Static typing across all layers | ~6 |
| `vite` + `@vitejs/plugin-react` | Dev server and production build | ^8 |
| `zustand` | Business logic and state management | ^5 |
| `sql.js` | SQLite running in-browser via WASM | ^1 |
| `@types/sql.js` | TypeScript definitions for sql.js | ^1 |

## sql.js integration details

sql.js runs SQLite compiled to WebAssembly. The WASM binary is served statically:

```text
public/sql-wasm.wasm   ← copied from node_modules/sql.js/dist/ at setup
```

The database is initialised once and held in memory as a singleton (`src/db/database.ts`). Because sql.js keeps the database in RAM, it must be explicitly serialised and deserialised to survive a page reload.

### Persistence strategy — localStorage

The in-memory database is exported as a `Uint8Array` (sql.js `.export()`) and stored in `localStorage` under a fixed key. On startup, if that key exists the database is initialised from the stored bytes; otherwise a fresh database is created and the schema is applied.

```text
localStorage["tamagotchi_db"]  →  base64-encoded Uint8Array of the SQLite file
```

Save must be triggered after every mutation (care action, stat tick). A helper `saveDb()` in `src/db/database.ts` encapsulates the export + encode + store cycle.

### Schema

The initial schema (applied on first boot) lives in `src/db/schema.ts`. It defines the `pets` table and any future tables. Migrations are additive SQL statements gated on a user-version pragma.

## Testing

**Framework:** [Vitest](https://vitest.dev/) — shares the Vite config pipeline, native TypeScript and ESM support, Jest-compatible API.

**Libraries:**

| Package | Role |
| --- | --- |
| `vitest` | Test runner and assertion library |
| `@vitest/coverage-v8` | V8-native code coverage |
| `jsdom` | DOM simulation for React component tests |
| `@testing-library/react` | Renders components in jsdom, queries by role/text |
| `@testing-library/user-event` | Simulates real user interactions |
| `@testing-library/jest-dom` | Custom DOM matchers (`toBeInTheDocument`, etc.) |

**Test file convention:** tests live in `__tests__/` directories co-located with the layer they test.

```text
src/store/__tests__/      # Business logic (Zustand) — no React, no DOM needed
src/db/__tests__/         # Data layer — sql.js is mocked; WASM cannot run in Node
src/components/__tests__/ # UI layer — jsdom + React Testing Library
src/types/__tests__/      # Type-shape contracts; break intentionally when types change
```

**sql.js in tests:** the WASM binary cannot load in Node. All db-layer tests mock the `sql.js` module via `vi.mock('sql.js', ...)` using a `MockDatabase` class that stubs `run`, `exec`, `export`, and `close`.

**Auto-run hook:** `.claude/hooks/run-layer-tests.js` is a PostToolUse hook that fires after every Write/Edit. It detects which layer was modified, checks that a `__tests__/` directory exists, then runs `npx vitest run --reporter=verbose src/<layer>` in the background. On failure the hook exits with code 2, which re-wakes Claude with the test output. Passing tests are silent.

**Scripts:**

```bash
npm test               # vitest run (one-shot, used by the hook)
npm run test:watch     # vitest (interactive watch mode)
npm run test:coverage  # vitest run --coverage
```

## Build

```bash
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b && vite build (type-check then bundle)
npm run preview  # Serve the production dist/ locally
```

Test files (`src/**/__tests__/`, `src/test/`) are excluded from `tsconfig.app.json` so they never affect the production build.
