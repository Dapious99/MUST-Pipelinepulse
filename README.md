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
**Candidates loaded** includes all valid CSV records. **Stalled candidates** counts only active-stage records at or above the configured threshold. The table now has **Stalled candidates** and **All candidates** tabs. With the included eight-row sample and an analysis date of 2026-10-14, five are stalled; two are below the threshold and one is Hired. The priority filter applies to both views (choose **All** to see all records). Export flags downloads the filtered stalled queue.

## Source layout
- `src/main.tsx`: React entry point only
- `src/pages/DashboardPage.tsx`: page-level state and orchestration
- `src/components/`: reusable UI sections
- `src/features/stall-analysis/analysis.ts`: pure validation and stall rules
- `src/lib/csv.ts`: CSV parsing and downloading
- `src/tests/`: automated tests

## Refactor evidence
The original implementation placed nearly all UI in `main.tsx`. The revised implementation splits concerns into separate modules and adds a full-candidate view to explain the difference between imported and flagged counts. Run `npm test` and `npm run build` to verify locally.
