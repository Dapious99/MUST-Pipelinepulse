# Day 1 — October 14, 2026

## Goal
Define the MVP and produce a working starter implementation for Option C (Stall Alerter).

## AI assistance used
ChatGPT generated an initial requirements document, application structure, CSV validation and stall-analysis logic, a React interface, sample records, and an initial test suite.

## Work produced
- `docs/intent.md` with explicit acceptance criteria and assumptions.
- Browser-based CSV importer, adjustable stall threshold, follow-up queue, filters, and export.
- Rule-based prioritization and recommendations.
- Unit tests covering core analysis and validation.

## Verification performed
To be filled with the actual local test/build results after execution. Do not claim a pass until it has run.

## What broke / corrections
To be filled with observed failures and actual fixes. No failures are invented for the assessment.

## Habit challenged
Instead of starting with visual components alone, defined testable outcomes, edge cases, and business rules before implementation. Assess whether this actually changed the workflow during hands-on review.

## Next step
Run the project locally, inspect its behavior, test the sample import, and log actual findings. Then increase data complexity on Day 2/3.


### User feedback and iteration — October 14
- User reported that the sample imported 8 candidates but the table showed only 5. Investigation: the table displayed **only flagged** candidates. With a 7-day threshold, 5 are stalled, 2 are recent, and 1 is Hired. This was a clarity issue, not missing data.
- User requested proper folder separation rather than a monolithic `main.tsx`. Refactored into page, components, analysis feature, CSV utility and tests, preserving the visual style.
- Added **All candidates** and **Stalled candidates** tabs, clearer count descriptions, and a regression test for the sample data.
- Verification still required on the user's local machine; do not claim build or tests passed until run.
