# Content Library

The content library is the operational single source of truth for every marketing asset after it is created. `marketing/shared/` remains the source of truth for brand and message; this folder records the content lifecycle.

## Lifecycle

```text
Draft → Review → Published → Archived
```

- `drafts/` — Work in progress. Use a dated, descriptive filename and cite the source event.
- `published/` — Final copy and asset references exactly as published.
- `archived/` — Retired, superseded, or no-longer-reusable content; retain history rather than overwrite it.
- `media/` — Canonical media or approved links, named by campaign/content ID.
- `campaigns/` — Content grouped by campaign.
- `launches/` — Content grouped by product, demo, client, website, or feature launch.

## Version history

Do not overwrite a published file. Create a new dated revision, include a short change note, and preserve the source event, approval status, platform, campaign ID, and media references in the file front matter or first section.
