# Pluton Research — Sprint 2 handoff

## Scope completed

- Confirmed the bounded Firecrawl crawl request uses v2, a 20-page maximum, main-content cleanup, no external links, and relevant path exclusions.
- Confirmed crawl polling has a 12-attempt stop condition and loops only while the crawl remains incomplete.
- Confirmed five public-signal queries cover reviews/profiles, services, competitors, complaints, and hiring/growth.
- Confirmed evidence packaging removes duplicate URLs and retains a source URL with every usable item.
- Bound the live n8n Firecrawl HTTP credential to the three Firecrawl request nodes. The workflow remains inactive.

## Live service validation

A bounded Firecrawl-only smoke test was run against `https://example.com`:

1. Created a crawl job with a one-page limit.
2. Polled until the job completed.
3. Ran one public web search.
4. Confirmed both the crawl and search returned URL-bearing source data.

No Google Form response was submitted or updated. No AI request, Drive file, Gmail notification, or n8n workflow activation occurred.

## Definition of done for Sprint 2

- `node automations/pluton-research/tests/validate-artifacts.mjs` passes.
- `node automations/pluton-research/tests/validate-firecrawl-pipeline.mjs` passes.
- Live Firecrawl crawl and search credentials have been proven usable without exposing a key.
- The n8n main workflow stays inactive until the controlled end-to-end test is explicitly approved.

## Next scope, intentionally not started

Sprint 3 may validate the OpenAI structured-analysis stage and report creation using one controlled form response. It must verify report JSON, source attribution, and that the originating Sheet row alone is updated.
