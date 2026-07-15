# Pluto Research Engine v1

Pluto Research Engine turns a business website into durable, source-backed intelligence. It extends the existing TanStack Start application without replacing its UI or legacy Pluto command runtime.

## Architecture

- `src/server/pluto-research.ts` is the server-only RPC boundary. It is disabled unless `PLUTO_RESEARCH_ENABLED=true` is set in the server environment.
- `BusinessResearchService` coordinates a run, creates an immutable website snapshot, normalizes facts, and derives evidence-backed findings and recommendations.
- `WebsiteExtractionService` discovers and researches up to 25 same-site HTML pages (three link levels from the supplied URL), with retries, redirect handling, content-type/size checks, and private-target blocking on every request. Non-HTML assets, external links, and malformed links are skipped.
- `FactNormalizationService` canonicalizes URLs and values, calculates stable SHA-256 fingerprints, validates confidence, and removes duplicates before persistence.
- `MemoryService` appends conversation and organization memory through the same repository boundary.
- `SupabaseResearchRepository` is server-only and is the sole persistence adapter. The browser never receives the service-role key.

## Data lifecycle

1. A caller supplies a business name, website URL, and unique idempotency key.
2. The business is upserted by its canonical website key, so spelling changes to the supplied business name do not create duplicates.
3. A research run is created once per business/idempotency key.
4. The supplied page seeds a bounded same-site crawl; every successful page becomes a content-addressed `website_snapshots` record.
5. Every fact written to `extracted_facts` includes its page `source_url`, `page_title`, `extracted_at`, `confidence`, and `research_run_id`.
6. Findings and recommendations store their evidence and run provenance. Memory is inserted, never overwritten.

The historical tables reject updates and deletes at the database layer. `businesses` may be upserted, and `research_runs` only transitions from `running` to a terminal state so failed runs remain auditable.

## Database setup

Apply `supabase/migrations/20260715000000_create_pluto_research_engine.sql` using the Supabase CLI or your deployment migration process. It creates the eight tables (including `businesses` and the seven intelligence stores), RLS, uniqueness constraints, append-only triggers, and indexes.

This migration deliberately defines no `anon` or `authenticated` policies. All research writes occur through a server-only service-role client. If a future authenticated UI needs read access, add ownership-based RLS policies in a follow-up migration; do not grant public access to intelligence data.

## Server environment

Set these variables only in the TanStack Start server environment:

```text
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
PLUTO_RESEARCH_ENABLED=true
```

Do not prefix the service key with `VITE_`, and do not place it in browser code or committed environment files.

## Invoking research

Call the exported TanStack Start server function with a stable idempotency key. A safe integration point is an authenticated internal operator workflow, after the application has an authorization model:

```ts
await runBusinessResearch({
  data: {
    name: "Apex Roofing",
    websiteUrl: "https://apexroofing.example",
    idempotencyKey: crypto.randomUUID(),
  },
});
```

The function is intentionally not wired into the public marketing form: the existing application has no authentication/authorization layer, and enabling public arbitrary URL research would create an abuse path. The server-side feature gate prevents accidental exposure until that operator path exists.

## Verification

Run `npm run typecheck`, `npm run test`, and `npm run build`. The tests cover fact provenance/normalization/deduplication, retry behavior, and private-target blocking. Database migrations should additionally be applied and validated against the target Supabase project before deployment.
