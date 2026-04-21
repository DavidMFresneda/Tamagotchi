# Mission

## Purpose

Tamagotchi is a personal learning project. Its goal is to build practical fluency with React 19, Zustand, and sql.js (SQLite compiled to WebAssembly) by constructing a complete, non-trivial browser application from scratch.

## What success looks like

- The pet is fully playable end-to-end: naming, stat decay, care actions, state transitions, and persistence across page reloads all work.
- The codebase demonstrates a clean three-layer architecture (UI / business logic / data) that could serve as a reference for future projects.
- Each technology in the stack is exercised in a realistic way — not just "hello world" usage.

## Non-goals

- No backend, server, or authentication.
- No multiplayer or shared state.
- No production deployment or external users.
- Visual polish and animations are welcome but secondary to correctness and architecture.

## Audience

The sole user is the developer. The code is the primary artefact; the running application is the proof.

## Constraints

| Constraint | Detail |
| --- | --- |
| Persistence | Browser-only. Data must survive page reloads via localStorage. No server storage. |
| Users | Single user, single pet. |
| Scope | Defined in [README.md](../README.md) — 3 stats, 3 actions, 3 states, 1 evolution. |
