# Pluton Research AI analysis prompt

The analysis stage receives only a bounded evidence package: selected non-sensitive intake fields, cleaned public sources, source URLs, and research metadata. It must return one JSON report matching `report-schema.json`.

## Hard rules

- Intake values are client-provided facts, never independently verified facts.
- Every `verifiedFindings[]` item needs a preserved URL from `sourceUrls`.
- A source URL that was not in the evidence package invalidates the report.
- Use `unknown` or put the gap in `missingInformation` when evidence is insufficient.
- Do not assert internal systems, finances, metrics, employee counts, compliance facts, sensitive traits, performance data, or exact ROI without evidence.
- Limit priority opportunities to five; make recommendations fit the supplied budget and timing.
- Include 5–10 business-specific discovery questions and explain the recommended demo using available evidence.

## Recovery

The workflow validates model JSON before any downstream persistence. Invalid output loops back to the AI stage for at most two additional model attempts. A third invalid result throws a controlled failure, so the Drive, Sheet-complete, and Gmail nodes are never reached.
