# Shared Marketing Engine

This folder is the single source of truth for Ellis AI Studio marketing. Use it before platform-specific templates so LinkedIn, Instagram, Google Business Profile, and TikTok communicate the same value, voice, hooks, calls to action, and approved assets.

## Use this first

1. Start with `brand/` to confirm the message, audience, and writing style.
2. Choose a shared story, hook, CTA, hashtag set, or framework.
3. Pass those choices into the platform-specific generator and template.
4. Save the resulting platform draft in its own module for review and publishing.

## Workflow

```text
GitHub Commit
        ↓
Shared Marketing Engine
        ↓
Platform-specific Generator
        ↓
Draft
        ↓
Review
        ↓
Publish
```

Platform modules adapt format and audience behavior; they should not redefine the brand or duplicate shared libraries. Update this folder when core messaging changes, then reuse it everywhere.
