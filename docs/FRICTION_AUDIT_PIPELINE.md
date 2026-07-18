# Ellis AI Studio Friction Audit Pipeline

Every completed Free Friction Audit booking captures the intake below and generates an internal draft before the client strategy session:

- Company name and website URL
- Contact name and email
- Service area and primary service

The server-only pipeline uses the existing bounded website research engine to collect source-backed observations. It produces an editable `friction_audits` record with:

- research observations for website, business overview, lead generation, customer experience, marketing, technical issues, and revenue friction;
- scores, evidence, impact, and priority for the seven Ellis Friction Framework pillars;
- executive opportunities, quick wins, Ellis systems, and a 30-day roadmap;
- a clean Markdown draft for internal review and edits before client presentation.

## Internal-only boundary

The booking response does not return the audit content or research evidence. Drafts are persisted in `friction_audits`, protected with RLS, and are intentionally not exposed by a public route. Pluto and all research orchestration remain server-only.

## Database deployment

Apply `supabase/migrations/20260717000000_create_friction_audits.sql` before enabling the pipeline in production. The existing Worker secrets `PLUTO_RESEARCH_ENABLED`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` are required for draft generation.

## Review workflow

An Ellis AI Studio operator retrieves the draft from `friction_audits`, edits its structured JSON or Markdown as needed, changes the status from `draft` to `in_review`, and presents only the approved client-facing version. The immutable website research evidence remains linked by `research_run_id`.
