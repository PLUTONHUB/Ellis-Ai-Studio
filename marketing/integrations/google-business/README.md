# Google Business Profile Integration v1

This is a disabled-by-default integration contract for the official Google Business Profile APIs. It retrieves business and performance data and can generate internal drafts; it does **not** publish Local Posts or reply to reviews automatically.

## Architecture

- `marketing/shared/` supplies voice, messaging, positioning, hooks, storytelling, CTAs, and hashtags.
- `marketing/google-business/` remains the canonical content-template module.
- `marketing/automation/` detects source events and creates draft candidates.
- `marketing/content-library/`, `marketing/scheduling/`, and `marketing/automation/approval-queue/` own the review and publishing lifecycle.
- `marketing/intelligence/` receives performance and review-derived, permission-safe insights.

## Enabled behavior in v1

The Bun server implementation at `src/lib/google-business.server.ts` provides OAuth authorization, encrypted refresh-token persistence, automatic access-token refresh, account/location discovery, verification-state lookup, and a protected dashboard at `/dashboard/google-business`. Runtime access requires the deployment secrets listed in `.env.example`, approved Business Profile API access, and the configured Google OAuth redirect URI.

## Prohibited behavior

- No automatic post publication
- No automatic review replies
- No storage of credentials or refresh tokens in this repository
- No unreviewed customer data or claims in marketing drafts

See `connection-v1.md` for setup and validation. The official [Business Profile APIs overview](https://developers.google.com/my-business/content/overview), [OAuth guide](https://developers.google.com/my-business/content/implement-oauth), and [Performance API reference overview](https://developers.google.com/my-business/ref_overview) remain the API authority.
