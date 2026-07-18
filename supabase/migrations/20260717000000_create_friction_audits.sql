create table public.friction_audits (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  research_run_id uuid not null unique references public.research_runs(id) on delete restrict,
  intake jsonb not null,
  draft jsonb not null,
  markdown text not null,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'presented')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index friction_audits_business_created_at_idx on public.friction_audits (business_id, created_at desc);
create trigger friction_audits_set_updated_at before update on public.friction_audits for each row execute function public.set_business_updated_at();
alter table public.friction_audits enable row level security;
comment on table public.friction_audits is 'Mutable internal review drafts. Do not expose this table or its contents to client-facing routes.';
