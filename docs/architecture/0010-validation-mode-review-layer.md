# ADR-0010: Validation Mode as a review layer over Revenue Engine

## Status

Accepted

## Context

Ellis needs to validate real acquisition packages for usability, quality, and founder leverage without redesigning the approved platform.

## Decision

Validation sessions reference canonical Revenue Engine package IDs and add only review state, quality scores, notes, version history, metrics, and export representations. Founder approval remains required; no outreach or proposal delivery occurs.

## Alternatives Considered

### Copy packages into a validation store

- **Pros:** Self-contained sessions.
- **Cons:** Duplicated knowledge and stale artifacts.
- **Why rejected:** Violates single-source-of-truth.

### Review in external documents

- **Pros:** Familiar collaboration.
- **Cons:** No structured scores, history, or platform learning.
- **Why rejected:** Cannot compound validation evidence.

## Business Impact

Structured review improves acquisition-package quality while reducing founder preparation time and producing reusable lessons.

## Long-Term Impact

The review contract can later support authenticated collaborators and durable exports without changing Revenue Engine ownership.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Review state drifts from source package. | Store package ID and generate exports from current package. |
| Business | Scores become subjective. | Require notes and explicit score dimensions. |
| Operational | Approval is misunderstood as outreach authorization. | Dashboard labels review-only status. |

## Success Criteria

A real intake produces a reviewable, scored, exportable acquisition package with history and no automated communication.

## Future Revisions

Revisit for durable database storage, authenticated reviewers, PDF rendering, and presentation export.
