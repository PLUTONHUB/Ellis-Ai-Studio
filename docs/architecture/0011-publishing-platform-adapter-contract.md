# ADR-0011: Publishing Platform with adapter contracts

## Status

Accepted

## Context

Ellis needs founder-approved campaigns to be scheduled, published, and measured across social networks without embedding platform-specific behavior in Growth Engine.

## Decision

Publishing Platform owns encrypted connections, approval-state transitions, publishing jobs, schedules, attempts, analytics facts, and platform health. Each social network is an adapter with connection, validation, adaptation, publish, status, and analytics contracts. Growth Engine provides approved campaign artifacts only. Meta remains the initial concrete adapter.

## Alternatives Considered

### Platform APIs directly in Growth Engine

- **Pros:** Fewer initial modules.
- **Cons:** Coupled campaigns, credentials, and external failures.
- **Why rejected:** It violates service boundaries and prevents extensible adapters.

### One generic API request abstraction

- **Pros:** Fast initial connector code.
- **Cons:** Hides different authorization, media, rate-limit, and analytics rules.
- **Why rejected:** Adapters require explicit capability contracts.

## Business Impact

Reduces manual marketing work while preserving approval, improving acquisition and reusable automation.

## Long-Term Impact

New platforms integrate through stable contracts; security and jobs are centralized.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Provider API changes or rate limits. | Versioned adapters, retries, health monitoring. |
| Business | Unapproved public communication. | Enforced approval before scheduling/publishing. |
| Operational | Token expiry or revoked permissions. | Encrypted storage and reconnect actions. |

## Success Criteria

Approved campaign artifacts create tracked adapter jobs; credentials never reach clients; failures retain queued work.

## Future Revisions

Revisit for durable queues/databases, recurring schedules, and approved platform APIs.
