# Event to Draft Workflow

```text
Verified event → Classification → Shared engine → Platform draft schemas → Content library → Approval queue → Scheduling
```

1. Detect and validate the event.
2. Apply a primary content classification.
3. Load approved shared inputs from `marketing/shared/`.
4. Generate applicable drafts only; do not generate unsupported channels or claims.
5. Save records in `outputs/` and `marketing/content-library/drafts/`.
6. Route the draft through review and approval. No step in this workflow publishes automatically.
