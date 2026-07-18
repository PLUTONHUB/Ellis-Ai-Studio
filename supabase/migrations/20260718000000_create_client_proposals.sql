create table if not exists public.client_proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_key text not null unique,
  client_name text not null,
  client_email text not null,
  business_name text not null,
  project_name text not null,
  project_total integer not null check (project_total >= 0),
  deposit_amount integer not null check (deposit_amount >= 0),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  stripe_checkout_session text unique,
  stripe_payment_intent text,
  paid_at timestamptz,
  workspace_activated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_proposals enable row level security;

-- The Worker uses SUPABASE_SERVICE_ROLE_KEY. No browser role receives proposal or payment data.
grant all on table public.client_proposals to service_role;
