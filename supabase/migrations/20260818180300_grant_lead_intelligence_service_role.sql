-- Lead Intelligence is accessed only by the server-side Worker through the
-- Supabase Data API. RLS remains enabled and no browser-facing role is granted
-- access to these sensitive lead records.
grant select, insert, update on table public.leads to service_role;
grant select, insert on table public.lead_analyses to service_role;
grant select, insert on table public.lead_activities to service_role;
