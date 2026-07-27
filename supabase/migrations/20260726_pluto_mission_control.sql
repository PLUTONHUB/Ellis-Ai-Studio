create extension if not exists pgcrypto;

create table if not exists public.pluto_workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  mission text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pluto_memory (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  category text not null,
  title text not null,
  content jsonb not null,
  confidence numeric(4,3) not null default 1 check (confidence between 0 and 1),
  source text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pluto_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  agent text not null,
  title text not null,
  objective text,
  status text not null default 'queued' check (status in ('queued','running','awaiting_approval','blocked','complete','failed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  scheduled_for timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pluto_approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  task_id uuid references public.pluto_tasks(id) on delete set null,
  action_type text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by text
);

create table if not exists public.pluto_activity (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  task_id uuid references public.pluto_tasks(id) on delete set null,
  type text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.pluto_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  provider text not null,
  status text not null default 'disconnected' check (status in ('connected','disconnected','error')),
  metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider)
);

create table if not exists public.pluto_metric_snapshots (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  metric text not null,
  value numeric not null,
  dimensions jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now()
);

create index if not exists pluto_memory_workspace_category_idx on public.pluto_memory(workspace_id, category, active);
create index if not exists pluto_tasks_workspace_status_idx on public.pluto_tasks(workspace_id, status, priority, created_at desc);
create index if not exists pluto_activity_workspace_created_idx on public.pluto_activity(workspace_id, created_at desc);
create index if not exists pluto_metrics_workspace_metric_idx on public.pluto_metric_snapshots(workspace_id, metric, captured_at desc);

alter table public.pluto_workspaces enable row level security;
alter table public.pluto_memory enable row level security;
alter table public.pluto_tasks enable row level security;
alter table public.pluto_approvals enable row level security;
alter table public.pluto_activity enable row level security;
alter table public.pluto_connections enable row level security;
alter table public.pluto_metric_snapshots enable row level security;
