# Phase A — Engineering Foundation

## Standards and shared capabilities

TypeScript is the default. CI must run formatting/linting, tests, build, type checking, contract compatibility, and dependency/security checks. Route handlers authenticate, validate a contract, invoke a domain use case, and serialize a contract result. Every major implementation links an ADR and business-gate record.

| Capability | Authority | Consumers |
| --- | --- | --- |
| Contracts and shared types | `@ellis/contracts` | apps, workers, adapters |
| Domain policies/use cases | `@ellis/domain-*` | APIs and workers |
| Data access interfaces/adapters | `@ellis/data-access` | owning domains |
| Design tokens and shared UI | `@ellis/ui` | all web apps |
| Validated configuration | `@ellis/config` | apps and infrastructure |
| Logging/errors/audit | `@ellis/observability` | every runtime |
| Prompt resolution/worker runtime | `@ellis/ai-runtime` | all AI workers |

## Environment, secrets, observability

Environments are `local`, `preview`, `staging`, and `production`. Non-secret configuration is versioned and validated at startup. Secrets come only from CI/runtime secret stores, use a credential per environment, follow least privilege, and are never committed, logged, or sent to clients. Logs are structured with request/job/correlation IDs, tenant/business ID, actor ID, domain, and event type; they exclude tokens and unapproved PII. Stable error contracts include safe code/message, request ID, and retryability. Metrics cover failure rate, queue latency, job/publishing success, model cost, and funnel conversion.

## Delivery and infrastructure

Current CI builds/typechecks and deploys the Worker from `main`. The target pipeline adds test, contract, migration, security, preview, and production-approval stages. Cloudflare Workers serve public edges; queues/workflows handle asynchronous work; a managed relational database is the system of record. Declarative infrastructure and rollback runbooks live in `infra/`.
