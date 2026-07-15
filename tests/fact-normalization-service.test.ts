import assert from "node:assert/strict";
import test from "node:test";

import { FactNormalizationService } from "~/services/fact-normalization-service";

test("normalizes and deduplicates email facts while preserving provenance", () => {
  const service = new FactNormalizationService();
  const input = {
    factType: "email" as const,
    subject: "  Apex Roofing  ",
    predicate: "Has Email",
    value: " SALES@APEX.EXAMPLE ",
    sourceUrl: "https://APEX.example/contact/?utm_source=test#form",
    pageTitle: "Contact Apex",
    extractedAt: "2026-07-15T00:00:00.000Z",
    confidence: 0.98,
    researchRunId: "run-1",
  };
  const normalized = service.normalize(input);
  const duplicate = service.normalize({ ...input, value: "sales@apex.example" });

  assert.equal(normalized.value, "sales@apex.example");
  assert.equal(normalized.sourceUrl, "https://apex.example/contact");
  assert.equal(normalized.researchRunId, "run-1");
  assert.equal(service.deduplicate([normalized, duplicate]).length, 1);
});

test("rejects confidence values outside the allowed range", () => {
  const service = new FactNormalizationService();
  assert.throws(() => service.normalize({ factType: "metadata", subject: "Apex", predicate: "page_title", value: "Home", sourceUrl: "https://apex.example", pageTitle: "Home", extractedAt: "2026-07-15T00:00:00.000Z", confidence: 1.1, researchRunId: "run-1" }), /confidence/);
});

test("normalizes domestic and international phone values into E.164 form", () => {
  const service = new FactNormalizationService();
  const base = { factType: "phone" as const, subject: "Apex", predicate: "has_phone", sourceUrl: "https://apex.example", pageTitle: "Home", extractedAt: "2026-07-15T00:00:00.000Z", confidence: 0.9, researchRunId: "run-1" };
  assert.equal(service.normalize({ ...base, value: "(415) 555-0123" }).value, "+14155550123");
  assert.equal(service.normalize({ ...base, value: "+44 20 7946 0018" }).value, "+442079460018");
});
