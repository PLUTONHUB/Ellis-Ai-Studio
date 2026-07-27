create table if not exists public.pluto_automations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  name text not null,
  agent text not null,
  trigger text not null,
  approval_mode text not null check (approval_mode in ('autonomous','approval_required')),
  status text not null default 'enabled' check (status in ('enabled','paused')),
  configuration jsonb not null default '{}'::jsonb,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, name)
);
alter table public.pluto_automations enable row level security;
create index if not exists pluto_automations_workspace_status_idx on public.pluto_automations(workspace_id, status);
