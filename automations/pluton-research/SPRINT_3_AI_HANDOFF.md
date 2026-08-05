# Pluton Research — Sprint 3 handoff

## Scope completed

- Added bounded evidence packaging: 25 sources maximum, 3,500 characters per source, and 45,000 characters total.
- Removed repeated lines and duplicate URLs while preserving source type and URL.
- Removed unnecessary personal intake fields from the AI package.
- Configured OpenAI Responses for strict JSON-schema output using the Pluton report contract.
- Added report validation for shape, required fields, enum values, limits, valid URLs, and evidence URL membership.
- Added a validation gate and a bounded retry path: three model attempts total. Invalid reports cannot reach Drive, Sheet completion, or Gmail.
- Confirmed the live n8n main workflow remains inactive and uses the encrypted OpenAI credential.

## Controlled live validation

One controlled, non-personal fixture was sent to OpenAI with strict JSON schema. The response passed the contract with URL-backed verified findings, 10 discovery questions, two priority opportunities, and a justified recommended demo.

No Google Form response, Google Sheet row, Drive file, Gmail message, or n8n workflow execution was created.

## Definition of done

- All report fields are required and strict output is requested from OpenAI.
- Verified findings and opportunity evidence URLs are rejected unless they occur in the preserved evidence package.
- Invalid JSON, unsupported enums, missing fields, oversized evidence, missing optional intake, sparse evidence, contradictory evidence, and unsupported source claims are covered by controlled tests.
- The only route to Drive begins at `Prepare Validated Report File`, after `Report Valid?` passes.

## Manual configuration still required

None for Sprint 3. The existing encrypted OpenAI credential is already bound to the inactive workflow. Keep the workflow inactive until the controlled full end-to-end test is approved.

## Known limitations

- Schema validation can confirm structure and source attribution, but it cannot independently prove that a model paraphrase precisely reflects a source; a human should review early live reports.
- Public sources can be incomplete, stale, or contradictory. The prompt and report require uncertainty to be explicit.
- The strict schema is embedded in the n8n request node and must be updated if `report-schema.json` changes.

## Recommendation for Sprint 4

Run one controlled end-to-end test using a deliberately submitted test Form response. Verify that exactly its Sheet row changes, one Drive report is created, and one completion email is sent. Keep production activation disabled until that test passes.
