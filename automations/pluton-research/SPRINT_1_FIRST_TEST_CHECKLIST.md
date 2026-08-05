# Pluton Research — Sprint 1 first-test checklist

Use this checklist for the first live submission only. Keep the workflow inactive until every preflight item is complete. This does not change or replace the existing Google Form.

## 1. Manual configuration

- [ ] Open the Google Sheet linked to the existing intake Form and confirm the response tab name. Enter that exact tab name in the Google Sheets Trigger and all four Google Sheets update nodes.
- [ ] Copy the Google Sheet document ID from its URL. Enter it in the trigger and all four update nodes.
- [ ] Add the eight output headers from `GOOGLE_SHEETS_MAPPING.md` to the right of the Form-owned columns, exactly as written.
- [ ] Put the required `ARRAYFORMULA` from the mapping guide in the first data cell of `Pluton Submission ID`. Confirm it fills the test row as `Timestamp|Email|Business Name`.
- [ ] Create or select the Drive folder for completed reports. Enter its folder ID in `Google Drive - Save Full Report`.
- [ ] Set the destination address in both Gmail nodes to the Ellis AI Studio operations inbox that should receive completion and failure notifications.
- [ ] Save the error workflow first. Copy its n8n workflow ID into the main workflow’s `settings.errorWorkflow` field, replacing `REPLACE_WITH_PLUTON_RESEARCH_ERROR_HANDLER_ID`.
- [ ] Keep the main workflow inactive while manually executing its nodes; activate it only after the successful end-to-end test described below.

## 2. Credentials and variables

Select credentials in n8n; never paste secrets into a Code node, workflow JSON, browser-side code, or Git-tracked file.

| Location | Select/configure | Expected scope |
| --- | --- | --- |
| Google Sheets Trigger and all Sheet update nodes | Google Sheets OAuth2 credential | Read and update the linked response Sheet only |
| Google Drive report node | Google Drive OAuth2 credential | Create a file in the selected report folder |
| Gmail notification nodes | Gmail OAuth2 credential | Send to the Ellis operations inbox |
| Firecrawl HTTP Request nodes | n8n variable `FIRECRAWL_API_KEY` | Server-side Firecrawl API access |
| OpenAI analysis node | n8n OpenAI credential | Responses API access for the approved model |

Also set these n8n workflow values before testing:

- Google Sheet document ID
- Form response tab name
- Drive report-folder ID
- Completion and failure notification recipient
- Error-workflow ID on the main workflow
- `FIRECRAWL_API_KEY` as an n8n variable or server-side credential source

## 3. Safe test submission

Submit one new response through the existing Form. Use a test business URL you own or are authorized to analyze; do not start with a real prospect. A practical test payload is:

| Form field | Test value |
| --- | --- |
| Full Name | Pluton Test |
| Business Name | Ellis AI Studio Test |
| Job Title | Owner |
| Email | a monitored Ellis test mailbox |
| Business Profile URL | a publicly reachable URL you own or have permission to crawl |
| Main challenge | Test intake: improve lead follow-up visibility. |
| Investment range | $5,000–$10,000 |
| Timeline | Within 30 Days |

After submitting, open the response Sheet and wait for `Pluton Submission ID` to appear. It must equal the new row’s timestamp, email, and business name separated by vertical bars before the workflow proceeds.

## 4. Expected node-by-node results

| Node | Expected result |
| --- | --- |
| Google Sheets Trigger - New Form Response | One item with the exact new Form response row and all Form headings. |
| Normalize Form Response | One normalized item; execution log contains only a fingerprint, `hasWebsite`, profile count, and `rowIdentityValid: true`. |
| Validate Required Business Data | `valid: true`; the test business name and a valid website/profile URL are present. |
| Exact Triggering Row Identified? | True branch only. A false branch means the Sheet formula is missing, delayed, or mapped to the wrong columns. |
| Submission Valid? | True branch only. Invalid input goes to `Sheet - Mark Invalid` and does not call Firecrawl. |
| Sheet - Mark Researching | The *same triggering row* receives `Pluton Status=Researching` and `Research Started`; no new row is appended. |
| Firecrawl Request Diagnostic | Log shows only a submission fingerprint, page limit `20`, and whether a primary URL exists. |
| Firecrawl - Start Website Crawl (20 pages) | Response contains a crawl ID; request has a maximum page limit of 20. |
| Wait for Crawl / Get Crawl Status / Evaluate Crawl State | Status advances to complete. The workflow stops with an error after 12 polls instead of looping forever. |
| Build Public Research Queries | Five focused public research queries are generated from the intake. |
| Firecrawl - Search Public Signals | Public result objects contain source URLs; errors retry according to node configuration. |
| Clean and Package Evidence | Evidence has deduplicated content and preserves every public source URL. |
| OpenAI - Analyze Evidence | Returns an object that follows `report-schema.json`; no unsupported internal facts are introduced. |
| Validate Report and Create File | Valid structured report JSON plus a Markdown report file name. |
| Google Drive - Save Full Report | Report file is created in the configured folder and returns a link. |
| Sheet - Mark Complete | The original test row receives `Complete`, completion time, opportunity, demo, and report URL. |
| Gmail - Notify Ellis | One completion email arrives with the report link and summary. |

## 5. Error-path test

- [ ] Manually execute the validation path with a row that has no `Pluton Submission ID`. Expected: `Stop Unsafe Sheet Update` raises an error, no Sheet row is appended or updated, and the error workflow sends its notification without attempting a Sheet update.
- [ ] Submit a row with a business name but no valid URL. Expected: the exact row becomes `Invalid` with a safe validation message; Firecrawl is not called.
- [ ] Temporarily use an unreachable approved test URL. Expected: Firecrawl retries, then the error workflow marks the identified source row as `Error` and sends a sanitized failure email.

## Sprint 1 pass criteria

The first live test passes only when exactly one triggering row is updated through `Researching` to `Complete`, one Drive report is created, one Ellis notification is sent, all report claims are traceable to URLs or labeled as inference/unknown, and no additional Sheet row is appended.
