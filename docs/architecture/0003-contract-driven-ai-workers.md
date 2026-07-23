# ADR-0003: Contract-driven specialized AI workers

## Status

Accepted

## Context

Growth Engine needs AI across research, strategy, creative work, publishing, analytics, and learning without an opaque general agent.

## Decision

Use a Coordinator to route scoped versioned jobs to specialized workers. Workers call domain/tool contracts, resolve canonical brand and prompt versions through shared runtime, validate structured outputs, and emit result events. External actions require policy checks and approval.

## Alternatives Considered

### One general-purpose agent

- **Pros:** Fast prototype.
- **Cons:** Weak auditability, unclear responsibility, poor reuse.
- **Why rejected:** Conflicts with single responsibility and platform reuse.

### Direct worker-to-worker calls

- **Pros:** Lower apparent latency.
- **Cons:** Tight coupling and fragile orchestration.
- **Why rejected:** Events/contracts allow independent replacement and testing.

## Business Impact

Specialization makes campaign generation repeatable, automates work, and yields reusable capabilities for future clients/products.

## Long-Term Impact

Workers can evolve independently with traceable cost and quality; contracts contain provider-change risk.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Invalid or unsafe model output. | Schema validation, QA, retries, approval gates. |
| Business | Off-brand content. | Canonical versioned Brand Profiles and human review. |
| Operational | Provider cost/outage. | Budgets, observability, queues, abstraction. |

## Success Criteria

Each worker has one contract, none imports another implementation, output retains provenance, and publishing requires validated approval state.

## Future Revisions

Revisit orchestration, models, and approval policy as volume, regulation, and quality evidence change.
