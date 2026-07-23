# Ellis Core Platform

Ellis Core Platform is the permanent engineering foundation for Ellis AI Studio. Future sprints extend its contracts, packages, and domains; they do not replace them.

## Principles

1. **Single source of truth:** every business concept has one owning domain and authoritative record. Consumers use contracts and projections; they never recreate definitions, business logic, brand information, or client data.
2. **Single responsibility:** each domain, service, worker, and package has one purpose.
3. **Platform first:** a capability should be reusable by another internal system, client, or worker. Exceptions require an ADR.
4. **Contracts over implementations:** domains and workers communicate through versioned APIs/events, never internal imports or direct cross-domain database access.
5. **Business validation first:** major work passes the documented gates before implementation.

## Target monorepo

- `apps/`: deployable studio, worker, and admin applications.
- `packages/`: contracts, domain, data-access, ui, config, observability, and ai-runtime.
- `infra/`: deployment, database, queues, monitoring, and runbooks.
- `docs/`: architecture, ADRs, and operating system.

The current TanStack Start/React Cloudflare Worker remains the initial web edge. Migration to packages is incremental and preserves existing behavior. Apps may depend on packages; packages must not depend on app internals.

- [Engineering foundation](engineering-foundation.md)
- [Domain architecture](domain-architecture.md)
- [Data architecture](data-architecture.md)
- [AI architecture](ai-architecture.md)
- [Business operating system](business-operating-system.md)
