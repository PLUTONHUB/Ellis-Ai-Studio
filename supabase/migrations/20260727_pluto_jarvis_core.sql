create table if not exists public.pluto_agent_capabilities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  agent text not null,
  capability text not null,
  authority text not null check (authority in ('autonomous','approval_required','disabled')),
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, agent, capability)
);
create table if not exists public.pluto_task_steps (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.pluto_tasks(id) on delete cascade,
  ordinal integer not null,
  title text not null,
  status text not null default 'pending' check(status in ('pending','running','complete','blocked','failed')),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(task_id, ordinal)
);
create table if not exists public.pluto_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  task_id uuid references public.pluto_tasks(id) on delete set null,
  event_type text not null,
  actor text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists pluto_steps_task_status_idx on public.pluto_task_steps(task_id,status,ordinal);
create index if not exists pluto_events_workspace_created_idx on public.pluto_events(workspace_id,created_at desc);
alter table public.pluto_agent_capabilities enable row level security;
alter table public.pluto_task_steps enable row level security;
alter table public.pluto_events enable row level security;
