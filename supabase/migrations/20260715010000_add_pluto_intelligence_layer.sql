create table public.research_intelligence (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  research_run_id uuid not null references public.research_runs(id) on delete restrict,
  report jsonb not null,
  report_fingerprint text not null,
  created_at timestamptz not null default now(),
  constraint research_intelligence_run_fingerprint_key unique (research_run_id, report_fingerprint)
);
create index research_intelligence_business_created_at_idx on public.research_intelligence (business_id, created_at desc);
create trigger research_intelligence_append_only before update or delete on public.research_intelligence for each row execute function public.reject_intelligence_history_mutation();
alter table public.research_intelligence enable row level security;
comment on table public.research_intelligence is 'Append-only structured business intelligence generated from a completed research run.';
