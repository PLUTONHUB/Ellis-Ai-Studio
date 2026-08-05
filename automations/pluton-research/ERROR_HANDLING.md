# Pluton Research error handling

## Retry policy

Google Sheets, Firecrawl crawl/search, OpenAI analysis, Google Drive, and Gmail nodes retry three times. Firecrawl and OpenAI wait five seconds between attempts; Google services wait two seconds.

## Failure paths

| Failure | Expected behavior | Operator action |
| --- | --- | --- |
| Invalid Business Name / URL | Sheet row becomes `Invalid` with an explanatory message | Correct the source row and create a new test response. |
| Firecrawl 429/5xx | node retries; execution eventually fails to error workflow | Check quota / service status, then retry the execution. |
| Crawl does not finish | polling remains in the wait/status loop | Stop only after confirming the Firecrawl job is unavailable; inspect its job ID. |
| OpenAI malformed JSON or schema failure | report validator loops to the AI stage for up to three total model attempts, then throws a controlled failure | Inspect the safe validation error, evidence size, and model output before retrying the execution. No Drive, Sheet-complete, or Gmail step runs from an invalid report. |
| Google Drive / Sheets / Gmail failure | retries, then error workflow email | Reconnect the relevant credential and retry the execution. |

The error workflow extracts the normalized intake item from n8n execution data, marks the matching original Sheet row `Error`, writes a safe error message, and emails the operational failure context. If an error happens before normalization, there is intentionally no row identifier to update; inspect the execution instead of guessing a row.
