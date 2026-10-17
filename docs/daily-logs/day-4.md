# Day 4 — Candidate actions and review

## Goal
Add practical table actions while preserving the Day 3 dashboard and tests.

## AI-assisted changes
- Added an edit dialog for candidate details, stage, and movement date.
- Added a reversible **Revoke** action (with confirmation) and **Restore** action. Revoked candidates remain visible in All Candidates but are excluded from active analysis.
- Kept all edits local to the current browser session; CSV re-import replaces the local state.
- Added an accessible status notice after actions.

## Verification to complete locally
Run `npm test` and `npm run build`; test edit, revoke, restore, filters, and export with 20 and 5,000 records. Record actual outcomes and any defects.

## Honesty / limitations
No backend, persistence, audit trail, or real recruiting-system revoke API. This is a local workflow action, not a deletion or notification. No claim of local tests passing until run.

## Reflection (fill in after verification)
What failed: TBD. What I changed after testing: TBD. Habit I challenged: TBD.
