# ADR-0001: Modular monorepo for Ellis Core Platform

## Status

Accepted

## Context

Ellis needs reusable web, automation, and AI capabilities without future sprints replacing the foundation.

## Decision

Adopt a workspace monorepo with deployable apps and shared contracts, domain, data-access, UI, config, observability, and AI-runtime packages. TanStack Start/React and Cloudflare Workers remain the initial web edge. Apps depend on packages; cross-domain work uses versioned contracts/events.

## Alternatives Considered

### Single application structure

- **Pros:** Lowest immediate migration effort.
- **Cons:** Ownership and shared-code boundaries degrade as products grow.
- **Why rejected:** It does not create a durable platform boundary.

### Separate repository per service

- **Pros:** Strong isolation.
- **Cons:** High operational and versioning overhead.
- **Why rejected:** The modular monorepo provides needed discipline earlier and cheaper.

## Business Impact

Reusable packages reduce client-delivery time, enable automation, and create compounding assets that support acquisition, revenue, and competitive advantage.

## Long-Term Impact

Supports incremental scaling and later independent deployment while avoiding premature distributed-system complexity.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Boundary violations create a modular monolith. | Enforce public exports and dependency checks in CI. |
| Business | Migration slows delivery. | Migrate only when touching a capability. |
| Operational | More build configuration. | Start with one pipeline and documented ownership. |

## Success Criteria

Shared capabilities have one package, apps do not import other app internals, and another app can reuse contracts/UI without copying code.

## Future Revisions

Revisit when team structure, deployment frequency, or isolation needs justify separate services/repositories.
