# Pluton Research implementation plan

1. Preserve the existing Google Form and treat its linked Sheet as the intake event source.
2. Normalize volatile Form headings into stable internal fields and validate the minimum research identity.
3. Mark the matching Sheet row `Researching`, then perform a bounded, source-preserving Firecrawl crawl and public search.
4. Remove repeated content, distinguish intake facts from public evidence, and send only the evidence package to analysis.
5. Enforce the report contract before persisting it to Drive, updating the Sheet, and notifying Ellis AI Studio.
6. Route failures through retries, a Sheet error update, and an n8n Error Trigger notification workflow.
