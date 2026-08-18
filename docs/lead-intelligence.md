# Ellis Lead Intelligence

Lead Intelligence accepts a business inquiry, preserves any AI Opportunity Audit context, asks OpenAI for a validated interpretation, then applies deterministic Ellis scoring and routing rules. It is intentionally separate from the approved Audit presentation.

## Boundaries

- OpenAI receives only problem and operational business context plus optional public Audit context; contact name, email, and phone are not sent. It returns categorization, evidence labels, a canonical system recommendation, uncertainty, and discovery questions. It never returns qualification scores or classes.
- Application code validates intake, persists records, calculates scores, classifies qualification, controls pipeline status, and serializes the limited customer response.
- The public response excludes contact details, internal dimension scores, qualification class, internal reasoning, and notes.

## Storage and security

The committed migration in `supabase/migrations/20260817120000_lead_intelligence.sql` creates `leads`, `lead_analyses`, `lead_activities`, and `lead_notes`. All have RLS enabled with no public policies. The Worker uses direct, server-only parameterized `pg` queries against the Supabase shared transaction pooler; this is appropriate for short-lived Worker traffic. Queries do not use named prepared statements.

Required Worker secrets: `SUPABASE_DATABASE_URL`, `OPENAI_API_KEY`, and `ELLIS_LEAD_DASHBOARD_ACCESS_TOKEN`. The dashboard token follows the site’s existing server-side, HttpOnly operator-gate pattern. Replace it with the site’s authenticated internal-role model when one is introduced.

## Known V1 limits

Audit reports are not yet durably persisted, so the typed audit adapter is ready for handoff but the live Audit CTA still needs report persistence/navigation-state wiring. There are no CRM, email, SMS, or scheduling integrations in V1.
