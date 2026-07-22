# Scheduling System

Scheduling moves reviewed content from the library to publication. It uses `marketing/shared/` messaging and platform drafts but does not create new brand guidance.

```text
Draft → Review → Approval → Ready to Publish → Published
```

- `drafts/` — Candidate schedule entries linked to content-library records.
- `approvals/` — Reviewer decisions, requested changes, and approval evidence.
- `queue/` — Approved items ordered by channel and publish window.

Every queue entry should include content ID, platform, campaign/launch ID, owner, reviewer, publish date and time, CTA/link, media reference, and final status. After publishing, update the content-library record and analytics source list.
