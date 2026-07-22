# Google Business Profile Content Workflow

This folder turns product and service progress into accurate, reusable Google Business Profile content. Keep public post copy, review communication, service information, and generated drafts organized here for review before publishing.

## Shared foundation

Before drafting, use `../shared/` for Ellis AI Studio brand voice, messaging, storytelling, calls to action, hashtags, and approved assets. This module adapts that source of truth for Google Business Profile content rather than duplicating it.

## Integration boundary

The draft-only official API integration contract lives at `../integrations/google-business/`. It retrieves authorized business, review, and performance data but routes all copy through this module, the shared engine, content library, approval queue, and scheduling system. It does not publish posts or reply to reviews automatically.

## Folder guide

- `templates/` — Reusable structures for posts, reviews, services, and FAQs.
- `prompts/` — Copy-and-use prompts that turn commits, completed projects, and service launches into drafts.
- `drafts/` — Generated or hand-written copy awaiting approval.
- `published/` — Final published copy retained as a reference.
- `examples/` — Approved examples and performance notes.

## Workflow

```text
GitHub Commit → Google Business Draft → Review → Publish
```

1. Select a meaningful commit, completed project, or new service launch with a clear local customer benefit.
2. Choose the closest template and generation prompt. Save the result in `drafts/` with a descriptive, dated filename.
3. Review business facts, availability, pricing, links, offers, location details, and customer privacy before publishing.
4. Publish through the approved Google Business Profile process, then move final copy to `published/` and preserve useful examples.

Never publish confidential implementation details, unapproved discounts, unverified claims, private customer information, or incentive-based review requests.
