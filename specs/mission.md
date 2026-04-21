# Mission

## Purpose

Tamagotchi is a browser-based virtual pet game aimed at **young players aged 10–14**. The primary purpose is to be genuinely fun, to create emotional attachment to a personal pet, and to build a small daily habit of checking in and caring for it.

The secondary purpose, from the developer's perspective, is to build practical fluency with React 19, Zustand, and sql.js through a real, complete project.

## Audience

| | Detail |
| --- | --- |
| **Primary** | Young players aged 10–14. They want to have fun, see their pet react, and feel rewarded for coming back each day. |
| **Secondary** | The developer — learning through building. |

The game must be immediately understandable without instructions. A 10-year-old opening the app for the first time must know what to do within the first 30 seconds.

## What success looks like

**For the player:**

- The pet feels alive — stats decay, the pet reacts, and neglect has visible consequences.
- There is a genuine reason to open the app every day (caring for the pet, checking its state, working toward evolution).
- The player feels attachment: discovering their randomly generated pet, keeping it healthy, and achieving evolution feel meaningful.
- The experience is fun and low-pressure — caring for the pet should feel rewarding, not stressful.

**For the project:**

- All features from the defined scope are implemented and working end-to-end.
- The codebase demonstrates a clean three-layer architecture (UI / business logic / data).

## Visual style

All graphics and UI must follow a **pixel art** aesthetic. This is a hard constraint, not optional polish:

- Sprites and images are low-resolution (e.g. 16×16 or 32×32 px) and scaled up with no anti-aliasing.
- Fonts are pixel/bitmap style (e.g. *Press Start 2P*).
- UI elements (bars, borders, buttons) respect the pixel grid — no smooth rounded curves unless drawn pixel by pixel.
- Animations use discrete frame steps, not smooth CSS easing.

The pixel art style is intentional: it matches the nostalgic Tamagotchi aesthetic and is immediately recognisable to the target age group.

See [ARCHITECTURE.md — ADR-007](../ARCHITECTURE.md) for the technical implications of this constraint.

## Non-goals

- No backend, server, or authentication.
- No multiplayer or shared state.
- Competitive mechanics or scoring against other players.
- Photo-realistic or vector-smooth visuals — the pixel art constraint must be preserved.
- Complex onboarding — the game must be self-explanatory from the first screen.

## Pet creation

On first launch (no saved game found), the pet is created **entirely and automatically** — the player does not fill in any form.

- **Name:** randomly generated from a predefined list or algorithm.
- **Characteristics (stats):** each of the three stats (Hunger, Happiness, Energy) is independently rolled. There is a **10% chance per stat** that it becomes a *special* stat.

### Special stats

A special stat has **double the maximum value** of a normal one (200 instead of 100). Care actions and decay rates remain the same numerically, so a special stat is naturally harder to deplete and can be sustained at higher levels.

The special nature of a stat must be **visibly communicated** in the UI — e.g. a star icon, a distinct bar color, or a glow effect — so the player knows their pet has something unique. A pet can have 0, 1, 2, or all 3 stats as special; having any special stat should feel like a lucky outcome.

## Constraints

| Constraint | Detail |
| --- | --- |
| Persistence | Browser-only. Data must survive page reloads via localStorage. No server storage. |
| Users | Single user, single pet per browser. |
| Scope | Defined in [README.md](../README.md) — 3 stats, 3 actions, 3 states, 1 evolution. |
| Pet creation | Fully automatic and random on first boot. No player input required. |
| Special stats | Each stat has a 10% independent chance of being special (max 200). Must be visually marked. |
| Accessibility | Text and interactive elements must be large enough for comfortable use on a desktop browser by a young player. |
