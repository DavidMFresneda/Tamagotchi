# Validation — Phase 6 Final Steps

All checks below must pass before merge.

## State transitions

- [ ] State is evaluated after every tick.
- [ ] State is evaluated after every care action.
- [ ] Any stat at 0 sets state to sick.
- [ ] If all stats are above 0 while sick, state returns to normal.
- [ ] Evolution requires 3 consecutive ticks with all stats >= 80% of each stat max.
- [ ] Breaking threshold before 3 ticks resets progress toward evolved.

## Persistence

- [ ] Database updates include pet state along with hunger, happiness, energy.
- [ ] saveDb runs after each tick and care action with updated state.
- [ ] Reloading the app restores state correctly from database.

## Visual states

- [ ] UI visibly distinguishes normal, sick, evolved in PetDisplay.
- [ ] Visual indicators remain readable at 360 px viewport.
- [ ] Pixel-art style remains consistent with project constraints.

## Reactions and easter egg

- [ ] Feed/play/rest each produce an action reaction message.
- [ ] At least one hidden action sequence triggers a unique easter egg message.
- [ ] Sequence matching is deterministic and does not trigger accidentally.

## Quality gates

- [ ] npm test exits with code 0.
- [ ] npm run build exits with code 0 and no TypeScript errors.
- [ ] Added/updated tests cover transitions, persistence updates, reactions, and easter egg.

## Merge readiness

- [ ] Specs for this feature exist under specs/2026-04-22-phase-6-final-steps.
- [ ] Branch name is phase-6-final-steps.
- [ ] Roadmap Phase 6 remaining items can be marked complete after implementation.
