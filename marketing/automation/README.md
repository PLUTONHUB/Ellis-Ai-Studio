# Marketing Automation v1

Automation v1 connects development events to marketing drafts. It is deliberately **draft-only**: no integration in this folder may publish content automatically.

## Architecture

1. Detect a verified event in `event-detection/`.
2. Classify it in `classification/`.
3. Load voice, messaging, hooks, storytelling, CTAs, hashtags, and positioning from `marketing/shared/`.
4. Generate source-linked platform drafts in `draft-generation/` and record them in `outputs/` and the content library.
5. Route every draft through `approval-queue/` and `marketing/scheduling/`.
6. A human may move an approved item to Ready to Publish; official publishing integrations remain disabled.

See `workflows/event-to-draft.md`, `triggers/trigger-output-matrix.md`, and `future-integrations/integration-status.md`.
