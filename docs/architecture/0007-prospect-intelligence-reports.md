# ADR-0007: Prospect Intelligence reports from canonical research records

## Status

Accepted

## Context

Ellis needs evidence-based preparation before contacting a prospect, while keeping researched data reusable and governed.

## Decision

Create a Prospect Intelligence adapter that snapshots a public business website, normalizes findings into a canonical prospect report, preserves research history, and emits knowledge-graph-ready evidence. Google Business Profile is optional enrichment and remains a future adapter. Reports are internal review artifacts; no outreach is performed.

## Alternatives Considered

### Research manually in sales notes

- **Pros:** No engineering work.
- **Cons:** Inconsistent, non-reusable, and hard to compare.
- **Why rejected:** It does not compound intelligence.

### Depend on a third-party prospecting database

- **Pros:** Broad data coverage.
- **Cons:** Cost, data-quality, and ownership concerns.
- **Why rejected:** Website evidence provides a governed initial source with optional future enrichment.

## Business Impact

Better preparation improves discovery quality, proposal relevance, conversion, and reusable market intelligence.

## Long-Term Impact

The report contract supports future GBP, search, review, and competitor adapters without replacing ownership.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Website content is incomplete. | Preserve source URL/history and label inferred findings. |
| Business | Recommendations overstate evidence. | Review-ready status and cited source basis. |
| Operational | Sensitive information is mishandled. | Store public-source evidence only; apply knowledge access rules. |

## Success Criteria

One public website produces a saved, review-ready report with required sales preparation sections and research history.

## Future Revisions

Revisit for approved GBP, search, review, social, and technology-detection providers.
