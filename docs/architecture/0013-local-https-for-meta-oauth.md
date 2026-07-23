# ADR-0013 — Local HTTPS for Meta OAuth

## Status

Accepted

## Context

Meta requires an HTTPS redirect URI for the local Facebook Login workflow. Ellis previously used an HTTP loopback callback, preventing the approved Meta application from accepting the authorization request. The platform needs a repeatable secure local OAuth boundary without committing private certificates.

## Decision

Vite serves local development at `https://127.0.0.1:3000` using a workstation-local PFX certificate. `META_OAUTH_REDIRECT_URI` is `https://127.0.0.1:3000/dashboard/meta-callback`. `npm run setup:https` creates the certificate and a local `.env.local` passphrase; `.certs/` and `.env.local` remain untracked. Vite fails closed if the certificate configuration is absent. The Meta authorization service continues to be the single owner of OAuth URL generation and token exchange.

## Alternatives Considered

1. Keep HTTP loopback. It is simple and needs no certificate, but Meta rejects it for this application; rejected.
2. Use a shared checked-in certificate. It makes setup automatic, but exposes reusable private key material and is unsuitable for production-like development; rejected.
3. Use a public tunnel. It provides publicly trusted HTTPS, but adds an external dependency and variable callback host for everyday local development; deferred for remote-device testing.

## Business Impact

This enables the Publishing Platform to connect Facebook Pages and Instagram Business accounts, directly supporting campaign delivery, reusable publishing capability, and client acquisition operations.

## Long-Term Impact

The setup is repeatable, isolates machine-specific secrets, prevents accidental HTTP regressions, and can coexist with a separate production public HTTPS callback. It adds a one-time certificate-trust task but no client-facing technical debt.

## Risks

Self-signed certificates may be untrusted by a browser, Meta may require a different public callback for hosted deployments, and a workstation certificate can expire. Mitigations: document trust/setup steps, fail Vite startup when absent, use environment-specific callback configuration, and regenerate locally when needed.

## Success Criteria

Vite serves the dashboard through HTTPS, the generated Meta authorization URL contains the exact HTTPS callback, Meta accepts that registered callback, and the callback can receive an authorization code without falling back to HTTP.

## Future Revisions

Revisit if Meta accepts a secure loopback exception, Ellis standardizes on a managed local certificate authority, or production OAuth moves to a public hosted callback.
