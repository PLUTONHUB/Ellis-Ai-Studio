# Meta OAuth preflight diagnostics

`/dashboard/meta/diagnostics` is a proposed internal preflight page. It runs before **Connect Meta** and separates repository-verifiable failures from Meta-console-only prerequisites.

## UI

The page shows a timestamped readiness table with `Pass`, `Fail`, `Warning`, or `Manual verification required`, an evidence field, and a next action. It never displays an app secret, dashboard token, authorization code, access token, or raw signed state.

| Check | Method | Result class | Evidence / action |
| --- | --- | --- | --- |
| Required server secrets | Presence-only check for `META_APP_ID`, `META_APP_SECRET`, `META_OAUTH_REDIRECT_URI`, state secret, encryption key, and dashboard token | Automatic | Missing variable name only |
| Callback format | Parse URL; require HTTPS, `127.0.0.1:3000`, and `/dashboard/meta-callback` | Automatic | Exact sanitized callback |
| Local TLS listener | Server-side loopback HTTPS request with certificate metadata and callback status | Automatic | TLS protocol, certificate subject/expiry, HTTP status |
| Authorization URL | Build canonical URL; assert exactly one each of `client_id`, `redirect_uri`, `state`, `response_type`, and `scope` | Automatic | Sanitized URL plus parameter list |
| Meta authorization endpoint | Unauthenticated `GET` without following redirects | Automatic | Status, `Location` host, `X-FB-Debug` when supplied; no cookies retained |
| App credentials | `GET /{app-id}?fields=id,name` with server-only app access token | Automatic | Returned app ID/name or normalized Graph error / `fbtrace_id` |
| Graph reachability | DNS/TLS/fetch timing to Graph API | Automatic | Status and latency only |
| Callback route behavior | Simulated success and Meta-error query shapes; require no redirect | Automatic | Status and final route |
| Development-mode app role | Meta does not expose a safe general role-membership check to this browserless application | Manual | Verify signing-in identity has accepted Admin/Developer/Tester role |
| App mode | Meta app dashboard state is not returned by the available app-credential preflight endpoint | Manual | Record Development or Live from Meta dashboard |
| Facebook Login product and Web/Client OAuth switches | Console-only Facebook Login configuration | Manual | Confirm product and both switches enabled |
| Valid OAuth Redirect URI registration | Console-only allowlist; runtime can only prove the generated URI | Manual | Compare exact URI with canonical displayed value |
| App Domains and Site URL | Console-only application settings | Manual | Compare canonical host and site URL |
| Data Use Checkup | Console-only compliance state | Manual | Record completion state/date |
| Business Verification / Business Manager linkage | Console-only business ownership and verification state | Manual | Record verified business and linked portfolio |
| Advanced Access / App Review | Console-only permission-review state | Manual | Record Standard/Advanced access per requested permission |
| Facebook Page authority | Requires a successful user token | Conditional | After callback, `me/accounts` result and Page access errors |
| Instagram Business linkage | Requires Page discovery | Conditional | Linked Instagram ID/username or absence |
| Page publishing authorization | Account/Page policy state outside app credentials | Conditional / Manual | Surface Graph error and Meta Page authorization status |
| Browser cookie/consent session | Browser-private Facebook session; cannot be read by Ellis | External | Show captured Facebook redirect boundary and no callback received |

## Service contract

`getMetaOAuthPreflight(): Promise<MetaOAuthPreflightReport>` is a server-only service owned by the Meta publishing adapter. It returns only normalized diagnostics:

```ts
type CheckStatus = "pass" | "fail" | "warning" | "manual" | "conditional";
type MetaOAuthPreflightCheck = {
  id: string;
  title: string;
  status: CheckStatus;
  evidence: string;
  nextAction?: string;
  observedAt: number;
};
type MetaOAuthPreflightReport = {
  callbackUri: string;
  authorizationUrl: string; // state redacted to fingerprint
  checks: MetaOAuthPreflightCheck[];
};
```

The dashboard may display the report but cannot call Graph directly, read environment values, persist credentials, or infer Meta-console-only values. Reports are operational telemetry, not canonical connection data; the encrypted Meta connection store remains the single source of truth.

## Failure classification

An authorization endpoint response returning an explicit OAuth error is classified as `Meta rejected request`. A `302` to `login.php` proves request acceptance. A subsequent loop wholly on `facebook.com/privacy/consent` with no callback request is classified as `Facebook session/consent boundary`; no application-side diagnosis may claim an app-role, App Review, or permission cause without a Meta error payload.

## Rollout and success criteria

The page is read-only, founder-only, and does not start OAuth or publish content. Success is a precise preflight result before Connect Meta, no secret exposure, and actionable Graph errors with `fbtrace_id` where Meta supplies one. Manual rows remain explicit rather than being guessed.
