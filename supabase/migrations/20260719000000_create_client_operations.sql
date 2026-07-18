create table if not exists public.client_intakes (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  owner_name text not null,
  email text not null,
  phone text,
  address text,
  website_url text,
  google_business_profile_url text,
  service_areas text[] not null default '{}',
  services_offered text[] not null default '{}',
  goals text[] not null default '{}',
  current_software text[] not null default '{}',
  onboarding_status text not null default 'submitted' check (onboarding_status in ('submitted', 'preparing', 'ready', 'failed')),
  research_run_id uuid references public.research_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists client_intakes_email_company_idx on public.client_intakes (email, company_name);
alter table public.client_intakes enable row level security;
grant all on table public.client_intakes to service_role;

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  industry text,
  website_url text,
  phone text,
  email text,
  service_area text,
  lead_source text,
  pipeline_stage text not null default 'lead_found' check (pipeline_stage in ('lead_found', 'research_started', 'audit_prepared', 'discovery_call_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost')),
  owner_name text,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  notes text,
  opportunity_value integer not null default 0 check (opportunity_value >= 0),
  client_proposal_key text references public.client_proposals(proposal_key) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prospect_timeline_events (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  event_type text not null,
  summary text not null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists prospects_pipeline_stage_idx on public.prospects (pipeline_stage, next_follow_up_at);
create index if not exists prospect_timeline_events_prospect_idx on public.prospect_timeline_events (prospect_id, occurred_at desc);
alter table public.prospects enable row level security;
alter table public.prospect_timeline_events enable row level security;
grant all on table public.prospects, public.prospect_timeline_events to service_role;

comment on table public.client_intakes is 'Client-provided onboarding data. Server access only.';
comment on table public.prospects is 'Internal Ellis AI Studio sales operations data. Never expose to client routes.';
