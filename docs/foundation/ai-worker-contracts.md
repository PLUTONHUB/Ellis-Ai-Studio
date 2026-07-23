# AI Worker Contracts

All workers follow the shared contract: **input** `{jobId, objective, tenantId, actor, correlationId, schemaVersion, authorizedContextRefs}`, **output** `{status, artifactRefs, findings, provenance, metrics}`, and **events** `worker.started`, `worker.completed`, `worker.failed`, `worker.escalated`. Prompts are versioned canonical templates resolved by `@ellis/ai-runtime`; worker memory is scoped, cited, expiring, and written only through Memory. Failures are classified retryable/non-retryable, produce audit evidence, and escalate unsafe/uncertain work to QA or a human.

| Worker | Purpose / responsibility | Inputs → outputs | Dependencies / memory | Success metric |
| --- | --- | --- | --- | --- |
| Coordinator | route and track jobs | objective → lifecycle | contract registry; no durable memory | on-time routed jobs |
| Research | collect cited evidence | request → dossier | Knowledge/retrieval; source citations | source coverage/quality |
| Business Intelligence | interpret evidence | dossier → brief | Research, Website; evidence links | actionable insight rate |
| Strategy | create measurable plan | brief/goals → plan | Intelligence, Analytics; prior plans | plan acceptance/outcome |
| Copy | draft channel copy | brief/brand → copy | Brand/Knowledge; no hidden memory | QA pass and conversion |
| Creative | draft visual proposal | brief/brand → media proposal | Brand/assets; provenance | approval and asset reuse |
| Campaign | assemble execution plan | strategy/assets → campaign | Copy/Creative contracts | campaign launch readiness |
| Publishing | prepare approved delivery | approved artifact → publish request | Publishing adapter; job state | successful compliant delivery |
| Analytics | interpret facts | analytics query → insight | Analytics facts only | insight accuracy/timeliness |
| Learning | recommend improvement | insights → recommendation | experiment history; cited memory | adopted recommendation lift |
| Memory | curate durable memory | candidate → decision | Knowledge Graph; expiry/access | useful-memory precision |
| QA | validate safety, facts, policy | artifact → pass/findings | policies/evidence | escaped-defect rate |
| Planning | decompose objective | objective → execution plan | strategy/constraints | plan completion rate |

Workers communicate only through the shared job/event contract and domain artifact references. No worker imports another worker's implementation. This expands the architecture in [Phase D](../ellis-core-platform/ai-architecture.md).
