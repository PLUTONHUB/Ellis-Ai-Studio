# Phase B — Domain Architecture

Every domain owns records and policies, exposes versioned command/query contracts, and emits immutable outbox events. A domain reads another only through its contract or an explicitly owned projection. Contract commands are idempotent and include actor/correlation IDs; events include `eventId`, `eventType`, `occurredAt`, `schemaVersion`, `aggregateId`, and `correlationId`.

| Domain | Purpose / ownership | Key output event | Expansion |
| --- | --- | --- | --- |
| Business Intelligence | Research evidence and market/competitor insight | `intelligence.created` | vertical benchmarks |
| Website Intelligence | Websites, snapshots, and audits | `website.snapshot.created` | change alerts |
| Content Intelligence | Content taxonomy, hooks, and insights | `content.insight.created` | content graph |
| Campaign Intelligence | Strategy and campaign plans | `campaign.planned` | optimization |
| Creative Studio | Media assets | `media.created` | template rendering |
| Copy Studio | Generated textual content | `copy.generated` | localization |
| Publishing Engine | Publishing jobs and channel delivery | `publishing.completed` | new channels |
| Analytics Engine | Normalized performance facts | `analytics.ingested` | attribution |
| Learning Engine | Recommendations and learning state | `recommendation.created` | experiment selection |
| Sales CRM | Prospects, clients, contacts, conversations | `prospect.qualified` | CRM sync |
| Outreach | Sequences and execution records | `outreach.sent` | consent orchestration |
| Client Delivery | Projects, tasks, approvals | `project.completed` | client portal |
| Operations | Services, packages, pricing, capacity | `service.updated` | margins/utilization |
| Automation | Jobs, schedules, workflow runs | `automation.completed` | visual workflows |
| Knowledge | Versioned governed knowledge | `knowledge.published` | retrieval controls |

Inputs and outputs are the versioned contracts/events above. Dependencies are limited to contract APIs: Copy consumes Brand Profile/Knowledge references, Publishing consumes approved content/media, and Learning consumes Analytics facts. No domain owns another domain's database tables.
