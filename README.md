# Tamagotchi

A browser-based virtual pet game built with React. The pet has needs (hunger, happiness, energy) that decay over time, and the player must keep it alive and happy through actions like feeding, playing, and resting.

## Core Features

- **Living Vitals** — Hunger, Happiness, and Energy stats that tick down automatically over time.
- **The Care Loop** — Feed, Play, and Rest actions to replenish stats.
- **Dynamic States** — Normal, Sick, and Evolved states giving immediate visual feedback.
- **Personal Touches** — Quirky reactions and easter eggs that give the pet a unique personality.

## Project Scope

| Aspect | Details |
| --- | --- |
| Pet | Naming, 1 user, 1 evolution, 1 recovery path |
| Stats (0–100) | Hunger, Happiness, Energy |
| Actions | Feed, Play, Rest |
| States | Normal, Sick, Evolved |

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vite.dev/) |
| Business logic | [Zustand](https://zustand-demo.pmnd.rs/) |
| Local database | [sql.js](https://sql.js.org/) (SQLite compiled to WebAssembly) |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The dev server starts at **<http://localhost:5173>** (Vite default). The port is printed in the terminal on startup; if 5173 is taken Vite will pick the next available one.

## Building for production

```bash
# Type-check and bundle
npm run build

# Preview the production build locally (http://localhost:4173)
npm run preview
```

`npm run build` runs `tsc -b` first — the build will fail if there are TypeScript errors. The output goes to `dist/`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with HMR at <http://localhost:5173> |
| `npm run build` | Type-check (`tsc -b`) then bundle with Vite into `dist/` |
| `npm run preview` | Serve the production `dist/` locally at <http://localhost:4173> |
| `npm run lint` | Run ESLint across all source files |

## Project Structure

```text
src/
├── components/   # React UI components
├── store/        # Zustand stores (business logic layer)
├── db/           # sql.js database access layer
├── types/        # Shared TypeScript type definitions
└── assets/       # Static assets
```

## Specification-Driven Development (SDD)

This project follows a **specification-first** approach: before any feature is implemented, its intent, constraints, and acceptance criteria are written down in the `specs/` folder. Code is written to satisfy those specs, not the other way around.

This keeps decisions explicit, makes the implementation order deliberate, and leaves a readable trail of *why* choices were made — which is especially valuable when revisiting the project after time away.

### Specs folder

```text
specs/
├── mission.md      # Purpose, audience, success criteria, and non-goals
├── tech-stack.md   # What is used, where it lives, and integration details
└── roadmap.md      # High-level implementation order in small, shippable phases
```

| File | Description |
| --- | --- |
| [specs/mission.md](specs/mission.md) | Defines *why* this project exists, who it is for, and what done looks like |
| [specs/tech-stack.md](specs/tech-stack.md) | Documents each technology, its role, and non-obvious integration details (including the sql.js localStorage persistence strategy) |
| [specs/roadmap.md](specs/roadmap.md) | Nine micro-phases (1–3 h each), ordered so every phase produces one working slice of the app |

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for individual architectural decision records (ADRs).
