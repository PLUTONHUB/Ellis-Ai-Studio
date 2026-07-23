# Meta Publishing Operations

Meta publishing uses the existing OAuth connection, encrypted token store, selected Page/Instagram Business account, and founder-controlled dashboard.

## Retry policy

Only a failed post can be manually retried. The system records retry count, timestamp, and reason, and allows at most three retries. A retry preserves the original draft and publish history; reconnect or correct the post when the limit is reached.

## Analytics

After a successful post, collect analytics through `collectAnalytics(postId)`. Normalized records are linked to the Publishing Job (`postId`) and optional originating `campaignId`. Available metrics can include reach, impressions, engagement, reactions, comments, shares, clicks, and video views. Meta may withhold metrics because of permissions, media type, account type, or Graph API limitations; those conditions are retained as `unavailable` evidence rather than treated as publishing failure.

## Validation

Live validation requires an authenticated Meta administrator, a selected Page with a linked Instagram Business account, public HTTPS media for Instagram, and app permissions approved by Meta. Do not use production posts solely as tests; use an approved test Page/account and retain the resulting job/audit evidence.
