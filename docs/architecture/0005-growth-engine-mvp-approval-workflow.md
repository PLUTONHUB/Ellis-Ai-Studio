# ADR-0005: Approval-only Growth Engine campaign workflow

## Status

Accepted

## Context

Ellis needs an end-to-end workflow that turns a website change into multi-platform campaign material without automated publishing.

## Decision

The Website Intelligence, Campaign Intelligence, Copy Studio, Creative Studio, and QA boundaries are orchestrated through one Growth Engine server adapter. It snapshots an approved public page, hashes normalized content, creates a campaign only for a changed snapshot, generates structured approval-ready output through the configured OpenAI Responses API, and stores it in an encrypted local runtime store. The dashboard supports review only; no publishing adapter is called.

## Alternatives Considered

### Generate directly from route components at build time

- **Pros:** No website fetch or snapshot store.
- **Cons:** Misses deployed content and couples Campaign Intelligence to the web application.
- **Why rejected:** It bypasses Website Intelligence and cannot detect deployed changes.

### Publish generated content automatically

- **Pros:** Maximum automation.
- **Cons:** Brand, factual, and platform risk.
- **Why rejected:** Sprint 1 success is approval-ready output, not publishing.

## Business Impact

This reduces marketing production work, converts website investment into campaigns, and creates reusable content/creative assets that support acquisition and revenue.

## Long-Term Impact

The contract can later be moved to durable storage/queues and feed channel adapters without changing campaign ownership. It requires configured model access and operational monitoring.

## Risks

| Risk type | Risk | Mitigation |
| --- | --- | --- |
| Technical | Page or model request fails. | Validate URLs, preserve snapshots, return actionable failures. |
| Business | Off-brand or inaccurate copy. | Strict system prompt, structured output, explicit approval status. |
| Operational | File storage is not durable on Worker runtime. | Treat local store as MVP; ADR required before production durable-store migration. |

## Success Criteria

A changed page produces one deduplicated campaign containing every required platform output, prompts, schedule, summary, and approval status; no output is published.

## Future Revisions

Revisit when a durable database/queue, CMS webhook, additional source types, or automated QA is approved.
