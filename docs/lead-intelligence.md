# Ellis Lead Intelligence

Lead Intelligence accepts a business inquiry, preserves any AI Opportunity Audit context, asks OpenAI for a validated interpretation, then applies deterministic Ellis scoring and routing rules. It is intentionally separate from the approved Audit presentation.

The Business Bottleneck Audit is a second upstream source. Its operational answers are first-party, user-confirmed context: the adapter stores the original structured answers in the lead's operational context, marks the lead source as `business_bottleneck_audit`, and sends it through the same server-only interpretation, scoring, persistence, and public-result path. It does not use a webhook or a mail-client fallback.

## Boundaries

- OpenAI receives only problem and operational business context plus optional public Audit context; contact name, email, and phone are not sent. It returns categorization, evidence labels, a canonical system recommendation, uncertainty, and discovery questions. It never returns qualification scores or classes.
- Application code validates intake, persists records, calculates scores, classifies qualification, controls pipeline status, and serializes the limited customer response.
- The public response excludes contact details, internal dimension scores, qualification class, internal reasoning, and notes.

## Storage and security

The committed migration in `supabase/migrations/20260817120000_lead_intelligence.sql` creates `leads`, `lead_analyses`, `lead_activities`, and `lead_notes`. All have RLS enabled with no public policies. The Worker uses the server-only Supabase Data API with its service-role secret; browser code never receives that secret or direct database access. This avoids raw Postgres TCP connections from the Worker while retaining the existing Supabase schema and server-side access boundary. The forward grant migration gives `service_role` only the runtime operations it needs: read/create/update leads, and read/create analyses and activities. It does not grant access to `anon` or `authenticated`, and RLS remains enabled.

Required Worker secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and `ELLIS_LEAD_DASHBOARD_ACCESS_TOKEN`. `SUPABASE_DATABASE_URL` remains available for migration tooling but is not used by the Worker at runtime. The dashboard token follows the site’s existing server-side, HttpOnly operator-gate pattern. Replace it with the site’s authenticated internal-role model when one is introduced.

## Known V1 limits

Audit reports are not yet durably persisted, so the typed audit adapter is ready for handoff but the live Audit CTA still needs report persistence/navigation-state wiring. There are no CRM, email, SMS, or scheduling integrations in V1.
