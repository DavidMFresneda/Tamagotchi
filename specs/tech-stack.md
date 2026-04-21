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

## Build

```bash
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b && vite build (type-check then bundle)
npm run preview  # Serve the production dist/ locally
```
