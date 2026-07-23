# ADR-0012: Facebook content generation stored as Meta drafts

## Status

Accepted

## Context

Ellis needs reusable, brand-aligned Facebook content that can enter the existing approval and publishing workflow without duplicate draft storage.

## Decision

Generate structured Facebook post content through the existing server-side AI configuration and persist the resulting caption as a Facebook-only Meta draft. Generation is separate from approval and publishing; image ideas remain direction only.

## Alternatives Considered

### Separate content-draft store

- **Pros:** Content-specific schema.
- **Cons:** Duplicate draft ownership and a second approval path.
- **Why rejected:** Meta Publishing already owns publishable drafts.

### Publish generated content immediately

- **Pros:** Faster workflow.
- **Cons:** Public brand risk.
- **Why rejected:** Founder approval is mandatory.

## Business Impact

Reduces content-production time while creating reusable acquisition assets.

## Long-Term Impact

The structured output can later feed campaign and creative packages without changing publishing ownership.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Invalid model JSON. | Validate fields and display errors before saving. |
| Business | Off-brand content. | Canonical voice prompt and draft-only status. |
| Operational | Draft lacks media. | Store image direction; require media before Facebook publish. |

## Success Criteria

An operator selects category/tone/topic, reviews hook/body/CTA/hashtags/image idea/time recommendations, and saves one Facebook draft.

## Future Revisions

Revisit for campaign linkage and visual-generation integration.
