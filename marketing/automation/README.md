# Automation Framework

Automation is a future layer that accelerates routing and draft generation; it must always consume `marketing/shared/` and require human review before publishing. Do not automate unsupported claims, private customer data, or final publication without explicit approval.

## Trigger events

- GitHub Commit
- Pull Request Merged
- Website Launch
- Portfolio Update
- Client Launch
- Service Launch
- Case Study Complete

## Flow

1. Detect an approved trigger.
2. Gather verified source context and shared message inputs.
3. Generate platform-specific drafts and operational records.
4. Route drafts to content library, scheduling, and approvals.
5. Publish only through an approved, human-reviewed step.

See `triggers/trigger-output-matrix.md` for required future outputs and `future-integrations/` for implementation notes.
