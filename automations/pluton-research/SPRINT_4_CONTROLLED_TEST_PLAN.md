# Pluton Research — Sprint 4 controlled delivery test

## Test identifier

Use one unique, non-sensitive business name such as `Pluton Sprint 4 Test <UTC timestamp>` and an `example.com` email. Record the Sheet-generated Submission ID after the Form response appears.

## Preflight

### Fresh Form-row identity

Google Forms inserts a new response immediately above formulas kept beneath the response table, which can shift an array formula out of the new row. Pluton therefore derives `Timestamp|Email|Business Name` when a fresh triggering row has no visible Submission ID, then updates that exact three-column composite row before research. Later state updates still match on the written Submission ID.

1. Confirm the response tab is `Form Responses 1` and the `Pluton Submission ID` array formula fills the new row.
2. Record pre-test counts: matching Sheet rows, Drive files in `Pluton Research Reports`, and Gmail messages with the planned test-business subject.
3. Confirm the main workflow is inactive, its error workflow is assigned, and Sheets, Drive, Gmail, OpenAI, and Firecrawl credentials are selected.
4. Temporarily activate only the main workflow immediately before submitting the test. Deactivate it immediately after its one execution completes.

## Expected delivery sequence

`Researching` → Firecrawl → `Analyzing` → strict report validation → `Delivering` → Drive upload → Gmail notification → `Complete`

`Complete` is terminal and must only occur after Gmail succeeds. An already-Complete submission stops at the duplicate-delivery guard.

## Success verification

- One original Sheet row receives all output fields and no second row is appended.
- The generated report link resolves to one new report whose evidence URLs match the controlled submission.
- One matching Gmail notification exists.
- Replaying the same Complete row produces no new Drive file or Gmail notification.

## Failure recovery

- If Drive or Gmail fails, leave the row out of `Complete`; use the sanitized error workflow result and execution ID.
- For a legitimate retry after a failure, fix the failed credential/service condition and retry the failed execution from the failed node. Do not submit the Form a second time.
- Roll back by deactivating the main workflow. It does not delete the existing source row or report; use the recorded submission ID to review those artifacts manually.
