# Day 3 — 2026-10-16: Raising the load

## Intent
Stress the CSV workflow with 500 and 5,000 candidate records, test invalid data, and reduce the number of table rows rendered at once.

## AI-assisted iteration
- Inspected Day 2 source before changing it.
- Identified that the table mapped all visible candidates directly into DOM rows.
- Added client-side pagination (10, 25, 50, 100 rows) while retaining full filtered counts and CSV export behavior.
- Added reproducible synthetic CSV fixtures and tests for 5,000 records, future/impossible dates, duplicate IDs, and invalid emails.
- Improved partial-import feedback so users can distinguish complete imports from imports with rejected rows.

## What was challenging
The table could previously render thousands of rows at once. Pagination addresses DOM rendering load, but CSV parsing and analysis still run on the main thread. We have not measured browser frame rate or real-device responsiveness yet.

## Verification (fill in actual results)
- `npm test`: NOT YET VERIFIED — record actual result.
- `npm run build`: NOT YET VERIFIED — record actual result.
- Upload `stress-500.csv`: NOT YET VERIFIED.
- Upload `stress-5000.csv`: NOT YET VERIFIED.
- Upload `stress-invalid.csv`: NOT YET VERIFIED.
- Check pagination and CSV export: NOT YET VERIFIED.
- Browser performance observation: NOT YET MEASURED.

## Unlearning evidence
Instead of adding new visual features, challenged an assumption in the existing implementation (that rendering every result is acceptable). Added stress fixtures before claiming the performance problem was solved. AI suggestions are not treated as verified until tests and manual checks pass.

## Known limitations
- The current import is a partial-success model: valid rows import while invalid rows are reported.
- The UI currently displays only the first 12 import issues, with a count for the remainder.
- Browser parsing and filtering remain synchronous for very large inputs; web workers or virtualization would be a future improvement.
