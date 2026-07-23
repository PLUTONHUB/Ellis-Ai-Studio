# ADR-0014 — Meta OAuth preflight diagnostics

## Status

Proposed

## Context

Meta OAuth spans Ellis configuration, browser-owned Facebook consent, and Meta-console-only application settings. Generic connection failures waste founder time and conceal which boundary failed. Ellis needs a review-only diagnostic capability that proves repository-owned checks without recreating Meta configuration data.

## Decision

Add a server-owned, read-only `/dashboard/meta/diagnostics` preflight page backed by the Meta publishing adapter. It validates local secrets by presence, HTTPS callback structure and reachability, authorization URL structure, Meta authorization endpoint handoff, app credential validity, Graph reachability, and callback routing. It classifies Meta-console and browser-session prerequisites as manual or external rather than guessing. The encrypted connection store remains authoritative for connections and tokens.

## Alternatives Considered

1. Continue generic OAuth error messages. It has no implementation cost but gives no actionable boundary evidence; rejected.
2. Attempt to scrape or mirror the Meta Developer console. It would duplicate Meta-owned configuration, require unsafe credentials, and be brittle; rejected.
3. Add a public monitoring endpoint. It could expose integration posture and invite abuse; rejected in favor of the protected dashboard.

## Business Impact

Precise diagnostics reduce founder preparation time, accelerate publishing capability activation, make the integration reusable for future clients, and prevent client-acquisition operations from stalling on ambiguous OAuth failures.

## Long-Term Impact

The pattern can be reused for other publishing adapters. It improves supportability and security by redacting secrets, but adds maintenance whenever Meta changes its public endpoints or error formats.

## Risks

Meta may limit app-credential inspection, network probes may transiently fail, and users may mistake manual rows for validated configuration. Mitigate with normalized evidence, timestamps, clear status classifications, bounded requests, and no claims about console state without a Meta response.

## Success Criteria

Before OAuth starts, the dashboard identifies malformed local configuration, unreachable TLS callbacks, invalid app credentials, authorization endpoint rejection, and the exact boundary where an external browser-session failure begins.

## Future Revisions

Revisit when Meta exposes a supported API for Login configuration, roles, review status, or business verification; when Supabase becomes the connection store; or when the platform adds additional provider adapters.
