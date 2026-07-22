# Marketing Content System

This folder keeps social content close to the product work that inspires it. It provides a lightweight, repeatable place to turn meaningful GitHub commits into clear, reusable marketing stories.

## Directory guide

- `shared/` — The single source of truth for brand, messaging, hooks, CTAs, hashtags, frameworks, and reusable assets across every platform.
- `content-library/` — Lifecycle, media, version history, campaign, and launch records for every marketing asset.
- `calendar/` — Weekly, monthly, and launch scheduling plans.
- `campaigns/` — Campaign briefs and active/upcoming/completed execution records.
- `analytics/` — Platform, campaign, engagement, traffic, lead, and conversion reporting.
- `repurpose/` — Verified source-to-multichannel workflows.
- `scheduling/` — Draft, review, approval, and publishing queue records.
- `automation/` — Future trigger, output, and integration design.
- `intelligence/` — Research, performance learning, ideas, experiments, insights, and reporting that inform the operating system.
- `linkedin/` — LinkedIn-specific content and workflow.
  - `templates/` — Reusable writing structures, including the standard LinkedIn post template.
  - `drafts/` — Work-in-progress posts awaiting review or scheduling.
  - `published/` — Final posts that have been published, retained as reference material.
- `instagram/` — Instagram captions, post concepts, and campaign-ready content.
- `changelog/` — Plain-language notes that translate product changes into audience-facing stories.
- `assets/` — Images, videos, screenshots, and other approved campaign assets.

## Workflow after a significant GitHub commit

1. Decide whether the commit represents a meaningful user, product, or business outcome worth sharing.
2. Add a short entry in `changelog/` that explains the change in plain language.
3. Copy `linkedin/templates/linkedin-post-template.md` into `linkedin/drafts/` and tailor it to the change.
4. Draft an Instagram adaptation in `instagram/` when the update fits that audience.
5. Add or link approved visual material in `assets/`.
6. Review messaging, claims, links, and hashtags. After publication, move the final post into `linkedin/published/` and retain any reusable assets here.

Keep filenames descriptive and dated when useful, for example `2026-07-21-better-onboarding.md`. This structure is intentionally simple so future social media automation can discover templates, drafts, published content, changelog context, and assets predictably.
