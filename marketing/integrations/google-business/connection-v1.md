# Connection v1 Setup and Validation

## Required deployment secrets

Configure these outside Git using the existing Google Cloud OAuth client and a secure deployment secret manager:

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI` — must be `https://<host>/dashboard/google-business-callback`
- `GBP_OAUTH_STATE_SECRET` — high-entropy secret used to sign expiring OAuth state
- `GBP_TOKEN_ENCRYPTION_KEY` — high-entropy secret used to derive the AES-GCM token-store key
- `GBP_DASHBOARD_ACCESS_TOKEN` — access gate for the internal dashboard
- `GBP_TOKEN_STORE_PATH` — optional secure-volume path; defaults to `.data/google-business-tokens.json`

The token store is encrypted, written atomically with owner-only permissions, and excluded through `.gitignore`. Back up the encrypted store and its encryption secret together; rotating the encryption secret without migration makes existing tokens unreadable.

## Connection flow

1. Visit `/dashboard/google-business` and unlock it with the server-configured dashboard access token.
2. Select **Connect Google Business Profile** and grant the existing Google Cloud OAuth client access.
3. Google redirects to `/dashboard/google-business-callback`; signed state and the authorization code are validated server-side.
4. The server stores the refresh token encrypted, refreshes access tokens automatically, retrieves authorized accounts and all accessible locations, then displays business information and verification status.

## Validation checklist

- OAuth redirect URI exactly matches the Google Cloud client configuration.
- Account and location discovery returns only authorized profiles.
- Dashboard displays name, address, phone, categories, hours, and verification status.
- Let the access token near expiry or revoke/reconnect in a test account to confirm refresh/recovery behavior.
- Confirm that no route performs Local Posts, review replies, profile edits, or automatic publishing.
