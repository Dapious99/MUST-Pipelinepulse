# Final Directive — PipelinePulse (Day 5)

## Role and objective
Act as an AI coding collaborator and skeptical reviewer. Build and maintain a browser-only hiring stall alerter that reads a hiring-board CSV, identifies candidates stuck in an active stage, ranks follow-ups, and explains the next action. Optimize for correctness, accessible UX, transparent limitations, and reproducible tests—not feature count.

## Product contract
- Stack: React 19, TypeScript, Vite, Tailwind CSS. Keep the existing approved dashboard appearance.
- CSV schema: `id,name,email,role,stage,lastMovedAt,owner`; required, case-sensitive headers. Dates are ISO `YYYY-MM-DD`. Allowed stages: Applied, Screening, Interview, Assessment, Offer, Hired, Rejected, Withdrawn.
- Reject invalid rows with row-specific explanations, including missing fields, invalid email, unsupported stage, duplicate accepted IDs, invalid/impossible/future dates. Valid rows may still import when others fail; disclose the count of rejected rows.
- Calculate days in stage using UTC calendar dates. Stalled when `daysInStage >= threshold` (integer 1–365; default 7). Exclude Hired, Rejected, Withdrawn and locally revoked records.
- Priority uses overdue days (`daysInStage - threshold`): High >=14, Medium >=5, otherwise Low. Sort by overdue days descending and name for ties. Recommendations are deterministic and advisory; no email or message is sent.
- Provide All Candidates and Stalled Candidates views, stage/owner/priority filtering, candidate counts, export, and pagination at 10/25/50/100 rows.
- Upload UX: visible loading, success, partial-import and error states; drag/drop; preserve previous data on completely failed import. Do not invent percentage progress.
- Candidate action menu: ellipsis opens a visible floating menu. Active candidates show Edit and Revoke; revoked candidates show Restore only. Revoke is reversible and local-only. Changes recalculate analysis; no backend or persistence is claimed.
- Keep main.tsx minimal. Separate page orchestration, reusable components, CSV utilities, pure analysis logic, and tests. Avoid unnecessary new dependencies or sweeping UI rewrites.

## AI-first workflow
1. State assumptions and acceptance tests before coding.
2. Propose the smallest implementation and identify edge cases.
3. Implement in small increments; preserve existing behavior.
4. Run typecheck/build and tests, inspect results, and perform manual UX checks.
5. Challenge generated code with malformed CSVs and 500/5,000-record samples.
6. Record prompts, corrections, failures, and unverified claims in the appropriate dated daily log. Never report a test as passing without running it.

## Verification checklist
- `npm install`, `npm test`, `npm run build`, `npm run dev` succeed on the reviewer's machine.
- Sample imports 20 candidates; all/stalled counts reflect the selected threshold and date.
- Empty file leaves previous records intact and shows feedback; mixed-invalid data shows row errors.
- 500 and 5,000 record files can be loaded and paginated; exporting is not limited to the visible page.
- Edit changes analysis, Revoke excludes from flags, Restore reactivates, and revoked rows have no Edit/Revoke option.
- Keyboard focus, Escape/outside-click menu closing, and narrow-screen table actions are manually checked.

## Out of scope / honesty
No login, database, live ATS, email sending, durable audit history, or model-generated hiring decisions. Session changes are lost on refresh or re-import. Local install/build/browser checks must be reported with actual evidence. If dependency installation cannot finish in the execution environment, say so rather than marking tests as passed.

## Evolution from initial intent
The Day 1 brief described a small stall detector. User review exposed a misleading 8-imported/5-shown distinction; a full-candidate view was added. Day 2 introduced filters, 20-row data and import feedback. Day 3 introduced 500/5,000-row stress fixtures and pagination. Day 4 added local candidate actions, then revised their discoverability and state-dependent permissions after feedback. This directive consolidates those requirements; it is not a claim that all checks passed.
