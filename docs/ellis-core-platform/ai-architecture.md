# Phase D — AI Architecture

AI workers are independently deployable consumers of versioned job contracts. The Coordinator routes work but does not embed specialist logic. A worker fetches only authorized context through domain APIs, emits validated output, and never accesses another worker's implementation.

| Worker | Single responsibility | Output |
| --- | --- | --- |
| Research | Collect cited source material | research dossier |
| Business Intelligence | Interpret business evidence | intelligence brief |
| Strategy | Form measurable strategy | strategy plan |
| Copy | Draft textual content | generated copy |
| Creative | Draft visual creative | media proposal |
| Campaign | Assemble execution plan | campaign plan |
| Publishing | Prepare approved work for delivery | publishing request |
| Analytics | Interpret normalized performance | performance insight |
| Learning | Recommend improvement | recommendation |
| QA | Validate policy, facts, and contracts | decision/findings |
| Memory | Curate durable scoped memory | memory decision |
| Planning | Break an objective into work | execution plan |
| Coordinator | Route and track jobs | job lifecycle |

Workers use tool interfaces for retrieval, generation, and actions. Prompt templates are versioned canonical records resolved only through `@ellis/ai-runtime`. Action-capable workers require policy checks and approval; publishing is never triggered solely by generated text.
