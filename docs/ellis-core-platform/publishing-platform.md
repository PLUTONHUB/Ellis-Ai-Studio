# Publishing Platform

Publishing Platform is permanent infrastructure for founder-approved campaign delivery. Social networks are adapters. Growth Engine creates campaign content; Publishing Platform validates/adapts it, manages approval and scheduling, records attempts, and stores normalized analytics.

## Canonical ownership

| Record | Owner | Notes |
| --- | --- | --- |
| Connection / account / permissions | Publishing Platform | encrypted credentials, scopes, expiry, health |
| Campaign artifact | Campaign Intelligence / Copy / Creative | immutable source reference |
| Publishing job / attempt / schedule | Publishing Engine | idempotency key, timezone, adapter state |
| Analytics fact / recommendation | Analytics / Learning | normalized facts linked to job and campaign |

## Approval states

`draft → needs_review → approved → scheduled → publishing → published`

`failed` may retry; `cancelled` is terminal. A job cannot enter `scheduled` or `publishing` without recorded founder approval. Every transition records actor, timestamp, correlation ID, and reason.

## Adapter contract

Each adapter exposes `connect`, `refresh`, `health`, `validate`, `adapt`, `publish`, `status`, and `collectAnalytics`. Adaptation returns platform-specific text, media requirements, link/hashtag rules, and warnings without mutating a campaign. Publish is idempotent. Normalized failures are `authorization`, `permission`, `rate_limit`, `validation`, `provider_outage`, or `unknown`.

Registry: Meta (Facebook Pages/Instagram Business, existing), LinkedIn, X, YouTube, TikTok, and Threads. A platform remains unavailable until app credentials, scopes, API approval, and capability testing are recorded. Unsupported delivery is draft/export only.

## Security, operations, and analytics

Credentials are encrypted, environment-scoped, never returned to clients/logs, and rotated/reconnected on expiry. Queue work persists before execution; attempts back off with rate-limit rules. Health shows expiry, permissions, failed/scheduled jobs, recent activity, and recommended actions. Normalize reach, impressions, engagement, clicks, outcome, and timestamp where available; link facts to campaign, job, account, format, and platform. Recommendations explain evidence for publish time, platform, format, CTA, hashtags, and sequence.
