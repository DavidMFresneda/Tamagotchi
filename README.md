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
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```text
src/
├── components/   # React UI components
├── store/        # Zustand stores (business logic layer)
├── db/           # sql.js database access layer
├── types/        # Shared TypeScript type definitions
└── assets/       # Static assets
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for architectural decisions and trade-offs.
