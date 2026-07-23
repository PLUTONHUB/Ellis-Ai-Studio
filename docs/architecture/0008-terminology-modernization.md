# ADR-0008: Ellis AI Studio terminology modernization

## Status

Accepted

## Context

Ellis has evolved into an AI-powered Growth Systems company. Legacy friction-centered language no longer reflects its product, positioning, or methodology.

## Decision

The canonical positioning is: Ellis designs and builds AI-powered growth systems that help businesses acquire more customers, convert more leads, and operate more efficiently. Active materials use Business Intelligence, Growth Opportunities, Opportunity Score, Growth Recommendations, Estimated Business Impact, and Recommended Growth Roadmap. Retired terminology is preserved only in `docs/archive/ELLIS_FRAMEWORK_V1.md`.

## Alternatives Considered

### Retain legacy wording alongside new wording

- **Pros:** Less editing.
- **Cons:** Ambiguous positioning and inconsistent worker guidance.
- **Why rejected:** A permanent vocabulary requires one active meaning.

### Rename only sales materials

- **Pros:** Smaller migration.
- **Cons:** Prompts, dashboards, and architecture would remain inconsistent.
- **Why rejected:** The terminology is a system-wide contract.

## Business Impact

Outcome-centered language improves client acquisition, proposal relevance, reusable marketing assets, and commercial clarity.

## Long-Term Impact

Future workers, contracts, dashboards, and documentation share stable vocabulary; migration maintenance is reduced through repository validation.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Legacy terms reappear. | Search validation in review and CI. |
| Business | Historical references are misunderstood. | Keep them only in the labeled archive. |
| Operational | Teams use stale materials. | Foundation documentation is authoritative. |

## Success Criteria

No active repository material references retired terminology; dashboards, worker guidance, knowledge graph, sales documents, and prompts use current vocabulary.

## Future Revisions

Revisit only through a superseding ADR if positioning or methodology changes.
