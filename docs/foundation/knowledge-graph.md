# Ellis Knowledge Graph — Design Only

The Knowledge Graph is the governed relationship layer over the canonical entities in [Data Architecture](../ellis-core-platform/data-architecture.md). It does not replace domain ownership or duplicate source records. Nodes retain canonical ID, owner, provenance, access classification, version, confidence, and validity period.

## Core relationships and ownership

| Source node | Relationship | Target node | Owner |
| --- | --- | --- | --- |
| Business | has | Brand Profile, Website, Prospect/Client, Campaign | Sales CRM / Operations |
| Client | purchases | Service, Project | Sales CRM / Client Delivery |
| Project | produces | Deliverable, Case Study, Reusable Asset | Client Delivery |
| Website Snapshot | supports | Audit Report, Recommendation | Website Intelligence |
| Content Asset | informs | Generated Content, Campaign | Content Intelligence |
| Campaign | publishes via | Publishing Job | Campaign Intelligence / Publishing |
| Publishing Job | produces | Analytics Fact | Analytics Engine |
| Analytics Fact | supports | Insight, Recommendation, Memory | Analytics / Learning |
| Knowledge Item | grounds | Worker Run, Decision, Generated Content | Knowledge |
| Conversation | reveals | Pain Point, Objection, Outcome | Sales CRM |

## Event and intelligence flows

Domain events enter the graph through the outbox with entity ID and provenance; an ingestion service resolves references, validates access/classification, and records only links or derived knowledge with a source citation. Retrieval accepts an actor/worker scope, objective, tenant, and freshness/confidence constraints, then returns authorized canonical references and cited fragments—not an unbounded data dump.

Every client interaction adds structured evidence: discovery reveals pain/intent, delivery captures constraints and implementation patterns, approval captures preferences, analytics captures outcomes, and conversations capture objections. Each project creates reusable lessons only after QA, consent/access review, and abstraction away from client-confidential details. Learning converts aggregate analytics into a traceable recommendation linked to its evidence; it never overwrites source facts.

Prospect research adds a public-source Business Intelligence evidence node, linked to the Prospect, Website Snapshot, Digital Presence Assessment, Growth Recommendation, and proposed Service references. Research history is immutable evidence; later reports may improve recommendations but do not overwrite prior findings.

Revenue Engine links the canonical report to acquisition-package versions, discovery notes/outcomes, objections, recommendations, proposal revisions, client decisions, and won/lost reasons. These are append-only references with provenance; later recommendations read the history rather than copying it.

Validation sessions link the acquisition package to section decisions, review notes, quality scores, exports, edit counts, and lessons learned. They are evidence about package quality, not duplicate package content.

Publishing Platform adds connected accounts, permission and health evidence, approved jobs, delivery attempts, platform analytics, scheduling preferences, performance trends, and failure lessons. Every record links to campaign and adapter provenance; analytics facts drive future recommendations without overwriting source history.

## Future AI usage

Workers retrieve least-privilege, cited context through contracts, write candidate memories through the Memory Worker, and preserve model/prompt/source provenance. The graph enables cross-client pattern learning only from authorized, appropriately anonymized knowledge. See [AI Worker Contracts](ai-worker-contracts.md).
