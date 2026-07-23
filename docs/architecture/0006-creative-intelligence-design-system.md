# ADR-0006: Canonical creative package generated from approved campaigns

## Status

Accepted

## Context

Approved campaigns need complete visual direction without duplicated brand guidance or manual prompt writing.

## Decision

Creative Intelligence extends the canonical Campaign record with an approval-gated creative package. A single Brand Design System and parameterized Prompt Library govern concepts for every platform. The dashboard reviews concepts and prompts only; image generation and publishing remain out of scope.

## Alternatives Considered

### Standalone creative brief documents

- **Pros:** Familiar manual workflow.
- **Cons:** Duplicates campaign facts and becomes stale.
- **Why rejected:** Campaign is the authoritative creative input.

### Generate images immediately

- **Pros:** Faster apparent output.
- **Cons:** Cost and brand risk before concept approval.
- **Why rejected:** Sprint scope is image-generation-ready creative direction.

## Business Impact

Reusable direction reduces campaign production time, improves premium consistency, and creates reusable assets for acquisition and delivery.

## Long-Term Impact

The creative package can feed an image provider later without changing campaign ownership. Prompt/template governance adds review work but prevents visual drift.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Incomplete creative output. | Validate required concept keys before review. |
| Business | Generic/off-brand visual language. | Canonical rules and approval gate. |
| Operational | Unreviewed concepts are mistaken for final assets. | Explicit concept-only status and dashboard labels. |

## Success Criteria

An approved campaign produces every requested creative concept and parameterized prompt without manual prompt writing or image publishing.

## Future Revisions

Revisit when an approved image provider, asset store, or design-template renderer is added.
