create table if not exists public.pluto_learning_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  event_key text not null unique,
  agent text not null,
  event_type text not null,
  subject_type text not null,
  subject_id text,
  outcome text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists pluto_learning_events_workspace_agent_idx on public.pluto_learning_events(workspace_id, agent, occurred_at desc);
alter table public.pluto_learning_events enable row level security;

create table if not exists public.pluto_learning_signals (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.pluto_workspaces(id) on delete cascade,
  signal text not null,
  value numeric not null,
  evidence_count integer not null default 0,
  context jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (workspace_id, signal)
);
alter table public.pluto_learning_signals enable row level security;
