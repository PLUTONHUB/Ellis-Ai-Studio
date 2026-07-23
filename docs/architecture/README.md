# Architecture Governance

Ellis AI Studio records significant technical decisions in Architecture Decision Records (ADRs). This creates an auditable explanation of what was built, why it was selected, and how it advances the studio's commercial mission.

## When an ADR is required

Create an ADR before implementing a new epic or making a significant decision about any of the following:

- application or service boundaries;
- data storage, ownership, retention, or access control;
- third-party integrations or AI-model providers;
- authentication, authorization, security, or compliance controls;
- shared platform capabilities intended for more than one client;
- material deployment, hosting, observability, or automation architecture; or
- a decision that would be costly to reverse.

Minor, local implementation details do not require an ADR. When in doubt, create one.

Sprint 0 is complete only when its significant decisions have accepted ADRs.

## Workflow

1. Evaluate the proposed epic with the [business validation gates](business-validation-gates.md).
2. Create an ADR from [the template](adr-template.md) in this directory, named `NNNN-short-decision-name.md`.
3. Start its status as `Proposed`; change it to `Accepted` when the decision is approved.
4. Link the ADR from the epic, pull request, or implementation documentation.
5. Never rewrite an accepted decision's history. If a decision changes, create a new ADR and mark the old one `Superseded` with a link to the replacement.

## ADR index

Add accepted and proposed ADRs here as they are created.

| ADR | Status | Summary |
| --- | --- | --- |
| [0001](0001-core-platform-modular-monorepo.md) | Accepted | Modular monorepo and contract boundaries |
| [0002](0002-system-of-record-and-integration-boundaries.md) | Accepted | Canonical data and integration ownership |
| [0003](0003-contract-driven-ai-workers.md) | Accepted | Specialized AI workers communicating through contracts |
| [0004](0004-foundation-knowledge-and-operating-system.md) | Accepted | Canonical business foundation and governed knowledge graph |
| [0005](0005-growth-engine-mvp-approval-workflow.md) | Accepted | Website change to approval-ready campaign workflow |
| [0006](0006-creative-intelligence-design-system.md) | Accepted | Approval-gated creative packages and design-system prompts |
| [0007](0007-prospect-intelligence-reports.md) | Accepted | Canonical prospect research reports |
| [0008](0008-terminology-modernization.md) | Accepted | Canonical Growth Systems vocabulary |
| [0009](0009-revenue-engine-acquisition-package.md) | Accepted | Prospect-to-proposal review workflow |
| [0010](0010-validation-mode-review-layer.md) | Accepted | Validation review layer over acquisition packages |
| [0011](0011-publishing-platform-adapter-contract.md) | Accepted | Modular social publishing adapters |
