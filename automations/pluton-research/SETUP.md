# Pluton Research setup

## 1. Configure server-side variables

Copy `pluton-research.env.example` into n8n's server-side environment. Set values in n8n Cloud variables or your deployment secret manager; do not place them in the workflow JSON, browser JavaScript, or committed files.

`FIRECRAWL_API_KEY` must be a Firecrawl API key, not the Codex MCP OAuth token. `OPENAI_API_KEY` stays server-side in n8n.

## 2. Create n8n credentials

Create these credential records with the exact names used by the import:

1. `Google Sheets - Ellis AI Studio` — Sheets access to the response spreadsheet.
2. `Google Drive - Ellis AI Studio` — create/upload access to the report folder.
3. `Gmail - Ellis AI Studio` — send-only mailbox used for completion and failure notices.

## 3. Prepare the response sheet

Use the linked Form response tab, add the eight Pluton columns in `GOOGLE_SHEETS_MAPPING.md`, then note the Sheet document ID and tab name. The Google Sheets trigger monitors newly added rows only.

## 4. Import and configure the workflows

1. Import `pluton-research-error-handler.workflow.json` and leave it inactive.
2. Import `pluton-research-main.workflow.json` and leave it inactive.
3. In the main workflow Settings, select the imported error-handler workflow as **Error workflow**.
4. Open the trigger, each Sheets node, Drive node, and Gmail node. Select the named credentials and verify the Sheet tab / report folder.
5. In the main workflow, test manually using the fixture. Activate only after the test checklist passes.

## 5. Research behavior

Firecrawl starts one crawl with `limit: 20`, depth two, no external links or subdomains, and only cleaned main content. Five public searches cover reviews/profiles, services, competitors, complaints, and hiring/growth. Every retained public finding must include a source URL.

## 6. Data boundaries

Form content is client-provided, not externally verified. Public evidence is retained with source URLs. The AI report validator rejects malformed JSON, reports missing required keys, more than five opportunities, discovery question counts outside 5-10, and verified findings without URLs.
