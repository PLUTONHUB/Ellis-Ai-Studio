create table if not exists public.pluto_autonomy_policies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  policy_key text not null,
  category text not null,
  label text not null,
  description text not null,
  mode text not null default 'approval_required' check (mode in ('autonomous','approval_required','disabled')),
  daily_limit integer,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  unique(workspace_id,policy_key)
);
alter table public.pluto_autonomy_policies enable row level security;
create index if not exists pluto_autonomy_policies_workspace_idx on public.pluto_autonomy_policies(workspace_id,category,enabled);
