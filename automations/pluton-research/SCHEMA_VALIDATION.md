# Pluton Research report validation

Validation is performed before report-file preparation. It checks required top-level fields, string/object/array shapes, enum values, opportunity and discovery-question limits, valid HTTP(S) URLs, and source attribution.

Verified findings and opportunity evidence URLs must exist in the evidence package `sourceUrls`. Reports with malformed JSON, unsupported enum values, absent fields, extra top-level fields, or unsupported source URLs are rejected. The retry coordinator permits three model attempts in total; then it throws a controlled validation failure. Downstream Drive, Sheet completion, and Gmail nodes are connected only to a validated report.
