alter table public.leads
  drop constraint if exists leads_source_check,
  add constraint leads_source_check check (source in (
    'direct_intake', 'audit_handoff', 'business_bottleneck_audit', 'contact_page', 'internal_demo'
  ));
