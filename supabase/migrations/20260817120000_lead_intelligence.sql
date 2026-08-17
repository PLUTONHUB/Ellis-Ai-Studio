create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  source text not null check (source in ('direct_intake','audit_handoff','contact_page','internal_demo')),
  pipeline_status text not null default 'new' check (pipeline_status in ('new','reviewed','contacted','discovery','proposal','won','lost','nurture')),
  analysis_status text not null default 'pending' check (analysis_status in ('pending','analyzing','complete','failed')),
  first_name text not null, last_name text not null, email text not null, phone text, business_name text not null, website text, industry text, location text,
  primary_challenge text not null, desired_outcome text not null, urgency text not null, additional_context text, operational_context jsonb not null default '{}'::jsonb,
  audit_context jsonb, idempotency_key text not null unique
);
create table if not exists public.lead_analyses (
  id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade, created_at timestamptz not null default now(),
  interpretation jsonb not null, recommended_system_key text not null, recommended_next_action text not null,
  problem_fit smallint not null check (problem_fit between 0 and 100), potential_impact smallint not null check (potential_impact between 0 and 100), urgency_score smallint not null check (urgency_score between 0 and 100), implementation_fit smallint not null check (implementation_fit between 0 and 100), intent smallint not null check (intent between 0 and 100), opportunity_score smallint not null check (opportunity_score between 0 and 100), qualification_confidence smallint not null check (qualification_confidence between 0 and 100), qualification_class text not null
);
create table if not exists public.lead_activities (id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade, type text not null, created_at timestamptz not null default now(), metadata jsonb);
create table if not exists public.lead_notes (id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade, body text not null, created_at timestamptz not null default now());
create index if not exists leads_created_at_idx on public.leads(created_at desc); create index if not exists leads_pipeline_status_idx on public.leads(pipeline_status); create index if not exists leads_email_idx on public.leads(email); create index if not exists leads_audit_id_idx on public.leads ((audit_context->>'auditId')) where audit_context is not null; create index if not exists lead_activities_lead_id_idx on public.lead_activities(lead_id, created_at desc); create index if not exists lead_notes_lead_id_idx on public.lead_notes(lead_id, created_at desc);
alter table public.leads enable row level security; alter table public.lead_analyses enable row level security; alter table public.lead_activities enable row level security; alter table public.lead_notes enable row level security;
