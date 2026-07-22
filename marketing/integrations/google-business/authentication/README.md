# Authentication and Credential Handling

## OAuth flow

1. A business owner or authorized manager starts OAuth consent from a future secured application.
2. The application requests only the required Google Business Profile scope, currently documented as `https://www.googleapis.com/auth/business.manage` for applicable operations.
3. The callback validates `state`, exchanges the authorization code server-side, and associates the authorized account and location IDs with the tenant.
4. The user selects the permitted Business Profile location; access is verified before data retrieval.

## Secure storage

- Keep client secrets and refresh tokens in a managed secret store or encrypted server-side database, never in Git, Markdown, browser storage, logs, or draft files.
- Encrypt tokens at rest; limit decryption to the integration service identity.
- Record token owner, scopes, created/updated timestamps, location access, and revocation state without exposing token values.
- Use least-privilege access, rotation procedures, audit logs, and revocation handling.

## Token refresh

Refresh access tokens server-side using the stored refresh token before expiry or after an authorized-token failure. Persist the replacement token metadata atomically, retry only bounded transient failures, and mark the integration as reauthorization-required when refresh is revoked or invalid. Token refresh never authorizes publishing by itself.

Reference: [Implement OAuth with Business Profile APIs](https://developers.google.com/my-business/content/implement-oauth).
