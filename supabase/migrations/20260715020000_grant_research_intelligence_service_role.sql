-- The Intelligence Layer is written exclusively by the server-side service-role client.
-- This augments the incremental table migration; it does not modify existing data.
grant select, insert on table public.research_intelligence to service_role;
