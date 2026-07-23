# ADR-0002: Canonical system of record and integration boundaries

## Status

Accepted

## Context

Ellis needs one authoritative model for clients, services, brand, campaigns, and delivery work; publishing platforms are channels, not sources of truth.

## Decision

Design a normalized relational system of record with domain ownership, versioned definitions, explicit foreign keys, tenant ownership, and append-only event/outbox records. Provider identifiers map separately; adapters use contracts and cannot redefine canonical records.

## Alternatives Considered

### Provider-shaped data as primary model

- **Pros:** Fast initial integration.
- **Cons:** Vendor coupling, duplicate client data, inconsistent reporting.
- **Why rejected:** Violates single-source-of-truth requirements.

### Independent database per domain now

- **Pros:** Maximum physical isolation.
- **Cons:** Costly synchronization and operations.
- **Why rejected:** Logical ownership is sufficient until scale requires separation.

## Business Impact

Canonical records reduce reconciliation and let brand, service, and campaign assets power multiple channels and clients.

## Long-Term Impact

Supports reporting and integrations, while requiring disciplined migrations, retention, and access controls.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Over-normalization slows reads. | Use owned projections and measured indexes. |
| Business | Model misses workflow. | Version contracts; revisit before implementation. |
| Operational | Provider outages cause drift. | Idempotency, events, reconciliation jobs. |

## Success Criteria

Every listed entity has one owner; provider records map to canonical IDs; no consumer duplicates brand, client, service, or template definitions.

## Future Revisions

Revisit physical storage/tenancy for regulatory needs, volume, or client-isolation requirements.
