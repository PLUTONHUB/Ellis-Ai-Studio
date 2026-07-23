# ADR-0004: Canonical foundation library and governed knowledge graph

## Status

Accepted

## Context

Ellis needs permanent business-operating documentation and a design for company intelligence without duplicating client, brand, service, or worker knowledge across documents and systems.

## Decision

Use `docs/foundation` as the canonical business-operating library. Each concept has one authoritative document; related documents link to it. Design a governed knowledge graph over canonical domain records, with provenance, ownership, access classification, and contract-based AI retrieval. Business documents, the graph, worker contracts, flywheels, and service blueprints are documentation-only until a later approved implementation ADR.

## Alternatives Considered

### Independent playbooks maintained by each team

- **Pros:** Fast local authoring.
- **Cons:** Conflicting offers, processes, and brand claims.
- **Why rejected:** It violates single-source-of-truth governance.

### Implement a knowledge database before defining governance

- **Pros:** Produces an immediate technical artifact.
- **Cons:** Encodes assumptions before entity ownership, permissions, and retrieval contracts are settled.
- **Why rejected:** The approved sprint explicitly requires design before implementation.

## Business Impact

One operating library speeds onboarding, improves consistent client delivery, preserves reusable learning, and makes future automation safer. This supports acquisition, delivery, reusable assets, and revenue.

## Long-Term Impact

The decision establishes stable vocabulary and governed context for scalable AI capabilities. It adds documentation stewardship but prevents expensive duplication and future migration ambiguity.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Documentation drifts from eventual contracts. | Require ADR review and contract links for implementation. |
| Business | Overly generic playbooks weaken market focus. | Anchor decisions to ICP and measurable outcomes. |
| Operational | Sensitive client knowledge is reused improperly. | Provenance, access classification, consent, and QA gates. |

## Success Criteria

Required foundation documents exist, each uses references instead of duplicated definitions, worker inputs/outputs are contract-defined, and no platform implementation begins without a subsequent approved ADR.

## Future Revisions

Revisit when company operating practice, market focus, data governance requirements, or approved knowledge-graph implementation choices materially change.
