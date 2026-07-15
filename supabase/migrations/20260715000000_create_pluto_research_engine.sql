create extension if not exists pgcrypto;

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  business_key text not null unique,
  name text not null,
  normalized_name text not null,
  website_url text,
  canonical_website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_canonical_website_url_key unique (canonical_website_url)
);

create table public.research_runs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  idempotency_key text not null,
  status text not null check (status in ('running', 'completed', 'failed')),
  requested_url text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  constraint research_runs_business_idempotency_key_key unique (business_id, idempotency_key),
  constraint research_runs_completion_check check (
    (status = 'running' and completed_at is null)
    or (status in ('completed', 'failed') and completed_at is not null)
  )
);

create table public.website_snapshots (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  research_run_id uuid not null references public.research_runs(id) on delete restrict,
  source_url text not null,
  page_title text,
  fetched_at timestamptz not null,
  content_sha256 text not null,
  content_type text not null,
  http_status integer not null,
  body_text text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint website_snapshots_run_source_content_key unique (research_run_id, source_url, content_sha256)
);

create table public.extracted_facts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  research_run_id uuid not null references public.research_runs(id) on delete restrict,
  website_snapshot_id uuid references public.website_snapshots(id) on delete restrict,
  fact_type text not null,
  subject text not null,
  predicate text not null,
  value jsonb not null,
  normalized_value text not null,
  source_url text not null,
  page_title text,
  extracted_at timestamptz not null,
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  fact_fingerprint text not null,
  created_at timestamptz not null default now(),
  constraint extracted_facts_run_fingerprint_key unique (research_run_id, fact_fingerprint)
);

create table public.ai_findings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  research_run_id uuid not null references public.research_runs(id) on delete restrict,
  finding_type text not null,
  title text not null,
  summary text not null,
  evidence jsonb not null default '[]'::jsonb,
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  finding_fingerprint text not null,
  created_at timestamptz not null default now(),
  constraint ai_findings_run_fingerprint_key unique (research_run_id, finding_fingerprint)
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  research_run_id uuid not null references public.research_runs(id) on delete restrict,
  ai_finding_id uuid references public.ai_findings(id) on delete restrict,
  priority smallint not null check (priority between 1 and 5),
  title text not null,
  rationale text not null,
  action text not null,
  recommendation_fingerprint text not null,
  created_at timestamptz not null default now(),
  constraint recommendations_run_fingerprint_key unique (research_run_id, recommendation_fingerprint)
);

create table public.conversation_memory (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  conversation_id text not null,
  memory_key text not null,
  value jsonb not null,
  source text not null,
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  memory_fingerprint text not null,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint conversation_memory_conversation_fingerprint_key unique (conversation_id, memory_fingerprint)
);

create table public.organization_memory (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  memory_key text not null,
  value jsonb not null,
  source text not null,
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  memory_fingerprint text not null,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint organization_memory_business_fingerprint_key unique (business_id, memory_fingerprint)
);

create index research_runs_business_started_at_idx on public.research_runs (business_id, started_at desc);
create index website_snapshots_business_fetched_at_idx on public.website_snapshots (business_id, fetched_at desc);
create index extracted_facts_business_type_extracted_at_idx on public.extracted_facts (business_id, fact_type, extracted_at desc);
create index extracted_facts_source_url_idx on public.extracted_facts (source_url);
create index ai_findings_business_created_at_idx on public.ai_findings (business_id, created_at desc);
create index recommendations_business_priority_created_at_idx on public.recommendations (business_id, priority, created_at desc);
create index conversation_memory_business_key_recorded_at_idx on public.conversation_memory (business_id, memory_key, recorded_at desc);
create index organization_memory_business_key_recorded_at_idx on public.organization_memory (business_id, memory_key, recorded_at desc);

create or replace function public.set_business_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_business_updated_at();

create or replace function public.reject_intelligence_history_mutation()
returns trigger language plpgsql set search_path = public as $$
begin
  raise exception 'Pluto intelligence history is append-only; % is not allowed on %', tg_op, tg_table_name;
end;
$$;

create trigger website_snapshots_append_only before update or delete on public.website_snapshots
for each row execute function public.reject_intelligence_history_mutation();
create trigger extracted_facts_append_only before update or delete on public.extracted_facts
for each row execute function public.reject_intelligence_history_mutation();
create trigger ai_findings_append_only before update or delete on public.ai_findings
for each row execute function public.reject_intelligence_history_mutation();
create trigger recommendations_append_only before update or delete on public.recommendations
for each row execute function public.reject_intelligence_history_mutation();
create trigger conversation_memory_append_only before update or delete on public.conversation_memory
for each row execute function public.reject_intelligence_history_mutation();
create trigger organization_memory_append_only before update or delete on public.organization_memory
for each row execute function public.reject_intelligence_history_mutation();

alter table public.businesses enable row level security;
alter table public.research_runs enable row level security;
alter table public.website_snapshots enable row level security;
alter table public.extracted_facts enable row level security;
alter table public.ai_findings enable row level security;
alter table public.recommendations enable row level security;
alter table public.conversation_memory enable row level security;
alter table public.organization_memory enable row level security;

comment on table public.extracted_facts is 'Append-only normalized facts. Every record retains source URL, page title, extraction time, confidence, and research run provenance.';
comment on table public.research_runs is 'Research run status may transition from running to a terminal state; intelligence output tables remain immutable.';
