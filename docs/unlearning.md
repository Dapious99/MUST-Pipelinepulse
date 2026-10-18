# What I Unlearned — Five Days with PipelinePulse

**1. A feature isn't finished just because it exists in the code.** I used to equate implementation with completion. On Day 4, Edit and Revoke existed but were hard to discover at the far right of a scrollable table. User feedback exposed the gap. We first tried a sticky action column, then changed to an ellipsis menu. That shifted my focus from “is it implemented?” to “can someone actually use it?”

**2. More output doesn't mean better evidence.** On Day 1 the dashboard reported eight uploaded records but only five in the follow-up table. The distinction was logical—only stalled candidates appeared—but not clear enough. Adding All Candidates and Stalled Candidates views was more useful than adding another chart. I learned to ask AI to explain the user's mental model, not just generate UI.

**3. The happy path is a weak test.** Day 2 added empty, valid, and incorrect CSV examples, including row-level validation and feedback. Day 3 expanded the workload to 500 and 5,000 records and introduced pagination. Instead of assuming the initial 20-record demonstration represented real usage, we deliberately expanded the inputs and added test cases.

**4. AI is a fast collaborator, not a source of verified truth.** AI helped propose architecture, generate components, fixtures, tests, and documentation. I still need to inspect behavior and execute the tests myself. Dependency installation timed out in the preparation environment; that is not a passing test. The logs distinguish generated work from verified results.

**5. Small reversible changes beat one big rewrite.** We preserved the approved UI while separating logic from `main.tsx`, adding filters and status feedback, and evolving candidate actions. The project became easier to review because each day's commit has a distinct purpose.

**What I will keep:** define acceptance criteria early; ask AI for failure cases; verify output before trusting it; collect real feedback; preserve limitations and unresolved checks in the record. I did not unlearn the need to understand code—I unlearned the habit of treating writing code as the whole job.
