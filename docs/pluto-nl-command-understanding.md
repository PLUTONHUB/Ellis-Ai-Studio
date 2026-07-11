# Pluto Natural Language Command Understanding v1

## Purpose

Natural language command understanding v1 gives Pluto a small, deterministic intent-routing layer for business users. It lets a visitor type plain-English commands such as “calculate opportunity from missed leads” or “show me a sample audit” and maps the request to the correct existing Ellis route or section.

This is intentionally narrow: it does **not** add persistent memory, conversation history, context awareness, automated actions, storage, or any LLM dependency.

## Why this feature is high-impact now

The current app already has useful business surfaces:

- Friction Audit intake on `/` at `#contact`
- Sample audit preview on `/` at `#audit-preview`
- Seven Friction Pillars on `/` at `#pillars`
- Demo portfolio on `/` at `#portfolio`
- Opportunity calculator on `/proposal`
- Implementation tracker on `/onboarding`

Before this feature, users had to understand the navigation model themselves. Command understanding makes Pluto smarter by translating user intent into existing business actions without changing or rewriting those pages.

## Architecture

Core files:

- `src/lib/pluto/nl-command.ts` — pure typed parser module.
- `src/components/pluto-command-console.tsx` — homepage UI for command input and interpreted output.
- `scripts/check-nl-command.ts` — feature-specific parser validation.

Homepage integration:

- `src/routes/index.tsx` mounts `PlutoCommandConsole` near the hero after the “Meet Pluto” line.

## Supported intents

| Intent | Example command | Route/action |
|---|---|---|
| `request_friction_audit` | “Find where my revenue is leaking” | `/#contact` |
| `view_sample_audit` | “Show me a sample audit” | `/#audit-preview` |
| `calculate_opportunity` | “Calculate opportunity from missed leads” | `/proposal` |
| `start_onboarding` | “Start onboarding for my project” | `/onboarding` |
| `explain_friction_pillars` | “Explain the seven friction pillars” | `/#pillars` |
| `view_portfolio` | “Show portfolio examples” | `/#portfolio` |
| `unknown` | Unsupported command | Fallback clarification |

## Parser strategy

The parser is deterministic and transparent:

1. Normalize user input to lowercase alphanumeric terms.
2. Evaluate ordered business-intent rules.
3. Score phrase matches and keyword matches.
4. Return a typed `ParsedPlutoCommand` with:
   - `intent`
   - `confidence`
   - `summary`
   - `actionLabel`
   - `href`
   - `matchedTerms`

## Extending v1 safely

To add a new command intent:

1. Add the intent to `PlutoCommandIntent` in `src/lib/pluto/nl-command.ts`.
2. Add a new rule to `commandRules` with:
   - business-safe summary
   - action label
   - existing route/anchor href
   - phrase patterns
   - keywords
3. Add at least one case to `scripts/check-nl-command.ts`.
4. Run:

```bash
bun run check:nl-command
bun run typecheck
bun run build
```

## Guardrails

- Keep v1 route-only: do not submit forms or mutate data from command parsing.
- Do not add memory/history/context in this module.
- Prefer existing routes/anchors before adding new surfaces.
- Keep parser behavior deterministic until a later owner-approved intelligence phase.
