# Definition of Done

A run may stop as `complete` only when all of the following are true:

- Copilot reports `status=done`
- score is at least the configured `targetScore`
- no blocker remains at a severity listed in `failOnBlockers`
- every required operator-side validation has `status=pass`
- the stop reason is understandable by a human reading `state.json`

Add repo-specific rules below.
