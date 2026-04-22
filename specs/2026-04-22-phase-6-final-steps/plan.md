# Plan — Phase 6 Final Steps

## Task Group 1 — Domain and Store State Logic

1. Add state transition evaluator in store logic.
2. Implement sustained evolution counter with 3 consecutive tick condition.
3. Apply evaluation after tick and after feed/play/rest actions.
4. Ensure recovery from sick to normal when stats are above 0.

## Task Group 2 — Persistence Integration

1. Extend persistence update query to include state.
2. Save state together with stats on every tick and care action.
3. Confirm boot hydration uses stored state consistently.

## Task Group 3 — UI State Feedback

1. Add visual state classes or indicators in PetDisplay.
2. Add distinct visual treatment for normal, sick, evolved.
3. Keep styling compatible with pixel-art constraints.

## Task Group 4 — Reactions and Easter Egg

1. Add care-action reaction message system.
2. Define and implement one deterministic hidden action sequence.
3. Show unique easter egg reaction when sequence is matched.
4. Reset sequence tracking safely when mismatch occurs.

## Task Group 5 — CSS Polish and Responsiveness

1. Add smooth stat bar transition without breaking pixel style.
2. Polish spacing/readability of pet panel and reactions.
3. Verify 360 px viewport usability and tap comfort.

## Task Group 6 — Tests

1. Store tests for sick/evolved/normal transitions.
2. Store tests for 3 consecutive tick evolution gating.
3. Store tests for recovery and counter reset behavior.
4. Store tests to confirm persisted state update calls.
5. Component tests for visual state indicators and reaction messages.
6. Component tests for easter egg trigger behavior.

## Task Group 7 — Verification and Merge Readiness

1. Run npm test and ensure all tests pass.
2. Run npm run build and ensure zero TypeScript errors.
3. Manual smoke check of state changes and reactions in UI.
4. Confirm roadmap checkboxes can be updated for all remaining Phase 6 tasks.
