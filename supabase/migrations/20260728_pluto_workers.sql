create table if not exists public.pluto_workers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  worker_key text not null,
  agent text not null,
  label text not null,
  queue text not null,
  capabilities jsonb not null default '[]'::jsonb,
  status text not null default 'offline' check(status in ('online','busy','offline','error')),
  current_task_id uuid references public.pluto_tasks(id) on delete set null,
  last_heartbeat_at timestamptz,
  last_error text,
  runs integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id,worker_key)
);
create index if not exists pluto_workers_workspace_status_idx on public.pluto_workers(workspace_id,status,last_heartbeat_at desc);
alter table public.pluto_workers enable row level security;
