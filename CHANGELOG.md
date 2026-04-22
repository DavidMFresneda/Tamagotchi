# Changelog

All notable changes to this project are documented here, one entry per working session.

---

## [2026-04-22] - Phase 3 complete: Walking skeleton UI

- `src/index.css` — replaced Vite template styles with pixel art baseline: Press Start 2P font, dark background, stat bar styles
- `src/components/StatBar.tsx` — new component: label, ★ marker for special stats, fill bar scaled to `value/max`
- `src/components/PetDisplay.tsx` — new component: reads store, renders pet name + three StatBar instances, null guard
- `src/App.tsx` — temporary hardcoded seed pet (Pochi) via useEffect; mounts PetDisplay
- `src/components/__tests__/StatBar.test.tsx` — covers label, fill width, star, .special class
- `src/components/__tests__/PetDisplay.test.tsx` — covers name, stat labels, null render
- `specs/roadmap.md` — Phase 3 marked as completed

---

## [2026-04-22] - Phase 2 complete: Domain types and Zustand store skeleton

- `src/types/index.ts` — added `Stat` interface; `Pet` now uses `Stat` objects for all three stats
- `src/store/usePetStore.ts` — replaced name-only store with full `PetStore` interface; `pet: null` initial state; five no-op action stubs (`feed`, `play`, `rest`, `tick`, `generatePet`)
- `src/types/__tests__/index.test.ts` — updated type-shape contracts for `Stat` and upgraded `Pet`
- `src/store/__tests__/usePetStore.test.ts` — replaced name tests with null-init and stub-callable assertions
- `specs/roadmap.md` — Phase 2 marked as completed

---

## [2026-04-22] - Phase 1 complete: DB & persistence foundation merged

- Phase 1 merged to `main` — SQLite save/load cycle fully working via sql.js + localStorage
- `specs/roadmap.md` — Phase 1 marked as completed

---

## [2026-04-21] - Unit testing infrastructure and auto-run hook

- Installed Vitest + `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- `src/test/setup.ts` — global jest-dom matcher registration
- `src/types/__tests__/index.test.ts` — type-shape contracts for `Pet` and `PetState`
- `src/store/__tests__/usePetStore.test.ts` — Zustand store unit tests (name slice)
- `src/db/__tests__/database.test.ts` — db singleton tests with mocked sql.js (no WASM)
- `src/components/__tests__/App.test.tsx` — smoke test for root component
- `.claude/hooks/run-layer-tests.js` — PostToolUse hook; runs the modified layer's tests, re-wakes Claude on failure (exit code 2)
- `vite.config.ts` — added `test` block (jsdom, globals, setupFiles, coverage)
- `tsconfig.app.json` — added `vitest/globals` type; excluded test dirs from production build
- `package.json` — added `test`, `test:watch`, `test:coverage` scripts
- `.claude/settings.json` — added test-runner PostToolUse hook entry
- `specs/tech-stack.md` — added Testing section

---

## [2026-04-21] - Project constitution and tooling setup

- Scaffolded Vite + React 19 + TypeScript project with Zustand and sql.js
- Copied `sql-wasm.wasm` to `public/` for in-browser SQLite
- Created three-layer `src/` structure: `components/`, `store/`, `db/`, `types/`
- `src/db/database.ts` — sql.js singleton initialiser
- `src/store/usePetStore.ts` — Zustand store skeleton
- `src/types/index.ts` — `Pet` and `PetState` domain types
- `ARCHITECTURE.md` with ADR-001 through ADR-007
- `specs/mission.md`, `specs/tech-stack.md`, `specs/roadmap.md` — SDD constitution
- `README.md` — tech stack table, run/build instructions, ports, SDD section
- `.claude/settings.json` — Stop hook (CHANGELOG reminder) and PostToolUse hook (doc check)
- `.claude/hooks/check-docs.js` — Node.js script backing the doc-check hook
- `specs/mission.md` updated: audience 10–14 y/o, pixel art constraint, random pet creation with 10% special-stat rule
- `specs/roadmap.md` updated: `Stat` object type (Phase 2), special-stat UI (Phase 3), random generation (Phase 4)
