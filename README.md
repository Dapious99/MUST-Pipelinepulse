# PipelinePulse — Hiring Stall Alerter

A lightweight React + TypeScript tool that reads a hiring-board CSV, flags candidates who have remained in an active stage beyond a configurable threshold, ranks the results, and suggests a human-reviewed follow-up action.

## Requirements
Node.js 20+ and npm.

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually `http://localhost:5173`). Click **Try with sample data**, or upload your own CSV.

## Test and build
```bash
npm test
npm run build
```

## CSV format
Required columns (case-sensitive): `id,name,email,role,stage,lastMovedAt,owner`.

Allowed stages: `Applied`, `Screening`, `Interview`, `Assessment`, `Offer`, `Hired`, `Rejected`, `Withdrawn`.

Dates must be `YYYY-MM-DD`. Sample: [`public/sample-candidates.csv`](public/sample-candidates.csv). Use a unique candidate ID per row. Invalid rows are skipped with visible errors; valid rows are analyzed.

## Rules
- A candidate is flagged when calendar days since `lastMovedAt` **>=** threshold (default 7).
- Hired, Rejected, and Withdrawn are excluded.
- Priority: High if overdue >=14 days; Medium if >=5 days; Low otherwise.
- Results sort by overdue days descending, then candidate name.
- Actions are deterministic suggestions keyed to hiring stage; **nothing is sent automatically**.
- Processing occurs locally in the browser. Export contains the currently filtered flags.

## AI-first development evidence
See [`docs/intent.md`](docs/intent.md) and [`docs/daily-logs/`](docs/daily-logs/). The final directive and one-page unlearning reflection will be completed as work progresses; no retrospective outcomes are fabricated.

## Known limitations
- Browser-local state is not persisted across refreshes.
- Strict case-sensitive CSV column names and stage names.
- Rows with duplicate IDs or malformed dates are skipped rather than automatically repaired.
- No ATS sync, automated messaging, authentication, or model-powered recommendations.
- For a large file, synchronous browser processing can briefly block the UI; performance should be measured during the stress-testing phase.

## Views and counts
**Candidates loaded** includes all valid CSV records. **Stalled candidates** counts only active-stage records at or above the configured threshold. The table now has **Stalled candidates** and **All candidates** tabs. With the included 20-row sample and an analysis date of 2026-10-15, twelve are stalled; five are below the threshold and three are in closed stages. The priority filter applies to both views (choose **All** to see all records). Export flags downloads the filtered stalled queue.

## Source layout
- `src/main.tsx`: React entry point only
- `src/pages/DashboardPage.tsx`: page-level state and orchestration
- `src/components/`: reusable UI sections
- `src/features/stall-analysis/analysis.ts`: pure validation and stall rules
- `src/lib/csv.ts`: CSV parsing and downloading
- `src/tests/`: automated tests

## Refactor evidence
The original implementation placed nearly all UI in `main.tsx`. The revised implementation splits concerns into separate modules and adds a full-candidate view to explain the difference between imported and flagged counts. Run `npm test` and `npm run build` to verify locally.

## Day 2 additions (2026-10-15)
- Filter either table view by hiring stage and assigned owner.
- Show days in stage for every valid candidate in the All Candidates tab.
- Reject malformed email addresses with row-level errors.
- Added regression tests for the new behavior.
- See `docs/daily-logs/day-2.md` for the work log and verification checklist.

## Day 2 — Import experience

CSV import now has visible loading, success, and error states (announced to assistive technology), drag-and-drop support, disabled controls while processing, and row-level validation messages. A failed replacement import keeps the previously loaded dataset. The loading indicator reflects processing, not a fabricated percentage.

Manual QA: import the 20-row sample, then import an empty CSV and confirm the original 20 records remain visible. Test dragging a valid CSV and importing a CSV with partially invalid rows.

## Day 2 manual QA files
Files under `public/test-data/` can be selected with the CSV uploader:

| File | Purpose | Expected behavior |
|---|---|---|
| `valid-candidates.csv` | 20 valid records | Import 20 candidates and show a success status |
| `empty-candidates.csv` | Headers but no data | Show an error/empty-data message; retain any prior dataset |
| `incorrect-candidates.csv` | Malformed rows | Show row-level validation issues; valid rows may import |

To verify, run `npm install && npm test && npm run build`, then `npm run dev`. Upload the three files in sequence and record the actual results in `docs/daily-logs/day-2.md`. Note that the current implementation supports partial imports and does not promise rejection of an entire mixed-validity CSV.

## Day 2 commit
Suggested commit: `feat(day-2): improve candidate review and CSV upload validation`
