# PipelinePulse — Initial Intent (Day 1)

## Problem
Recruiters can lose track of candidates who remain in one hiring stage too long. A CSV-based tool should highlight stalled candidates, rank follow-ups, and recommend a next action.

## Audience
A recruiter or hiring coordinator reviewing a hiring-board CSV. No live ATS integration is required.

## Minimum acceptable outcome
1. Load a CSV with `id,name,email,role,stage,lastMovedAt,owner` columns.
2. Reject or clearly report malformed records and never silently interpret impossible dates.
3. Compare each candidate's last stage movement against an adjustable threshold in days.
4. Exclude terminal stages: Hired, Rejected, Withdrawn.
5. Sort flagged candidates by overdue days and show a one-sentence reason plus a suggested next step.
6. Support filtering and exporting the flagged list.
7. Provide sample data, automated tests, and instructions to run locally.

## Working assumptions
- Dates use ISO `YYYY-MM-DD` format; calculations are based on calendar days in UTC.
- A candidate is stalled when days since movement >= threshold.
- Urgency is initially determined by overdue days: High >=14, Medium >=5, otherwise Low.
- Recommendations are rule-based, not AI-generated; AI is used in the development workflow.
- CSVs are processed in the browser, not uploaded to a server.
- Users review follow-up suggestions before acting.

## Constraints and non-goals
Five-day assessment; avoid authentication, databases, sending emails, external ATS integrations, and paid APIs. Avoid implying recommendations are factual judgments about candidates.

## AI-first working method
Ask an AI coding assistant to propose implementations and edge cases. Run tests, inspect generated code, challenge assumptions, and record corrections in daily logs. Maintain honest evidence of what was actually tested.

## Planned stress tests
Empty CSV, missing headers, duplicate IDs, impossible and future dates, terminal stages, quoted commas, boundary thresholds, 500/5,000 rows, and accessibility/keyboard checks.

## Definition of done
A new reviewer can install dependencies, run the app, load the sample file, see correctly ranked flags, export the results, and run the automated test suite. Known limitations and actual test outcomes must be documented.
