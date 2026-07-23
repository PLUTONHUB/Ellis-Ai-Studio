# ADR-0009: Revenue Engine orchestration over canonical prospect intelligence

## Status

Accepted

## Context

Founder preparation time limits client acquisition. Ellis needs one reviewable prospect-to-proposal workflow without duplicating research or automating outreach.

## Decision

Revenue Engine accepts prospect intake, calls the existing Prospect Intelligence contract, and stores an acquisition package that references the canonical report ID. The package contains discovery preparation, proposal draft, channel drafts, follow-up plan, and explainable recommendations. It is review-only; no outreach, CRM decision, or proposal delivery occurs automatically.

## Alternatives Considered

### Add artifacts directly to Prospect Intelligence

- **Pros:** Fewer records.
- **Cons:** Mixes research ownership with sales orchestration.
- **Why rejected:** Revenue workflow is a distinct Sales CRM/Client Acquisition boundary.

### Generate each sales artifact ad hoc

- **Pros:** Low initial storage.
- **Cons:** Repeated work and no history.
- **Why rejected:** A saved package compounds founder preparation and knowledge.

## Business Impact

The package converts one intake into discovery-ready material, freeing founder time for conversations and closing.

## Long-Term Impact

The contract can later integrate CRM stages and approved communication adapters without changing report ownership.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Research is incomplete. | Preserve report references and evidence limits. |
| Business | Drafts are used without judgment. | Review-only status and clear placeholders. |
| Operational | Duplicate prospect records. | Revenue package references one canonical report ID. |

## Success Criteria

One name, URL, and optional note produce a saved, reviewable acquisition package with every requested artifact and no sent communication.

## Future Revisions

Revisit for approved CRM integration, durable data storage, and authenticated collaboration.
