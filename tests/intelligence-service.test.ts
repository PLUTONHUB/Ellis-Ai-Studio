import assert from "node:assert/strict";
import test from "node:test";
import { IntelligenceService } from "~/services/intelligence-service";

test("creates source-grounded structured intelligence and flags conversion gaps", () => {
  const report = new IntelligenceService().analyze(
    { id: "business-1", name: "Apex Roofing", websiteUrl: "https://apex.example", canonicalWebsiteUrl: "https://apex.example/", businessKey: "key" },
    [{ factType: "service", subject: "Apex Roofing", predicate: "page_heading", value: "Roof Repair", sourceUrl: "https://apex.example/", pageTitle: "Roof Repair", extractedAt: "2026-07-15T00:00:00.000Z", confidence: 0.8, researchRunId: "run-1", factFingerprint: "fact" }],
    [{ id: "snapshot-1", businessId: "business-1", researchRunId: "run-1", sourceUrl: "https://apex.example/", pageTitle: "Apex Roofing", fetchedAt: "2026-07-15T00:00:00.000Z", contentSha256: "hash", contentType: "text/html", httpStatus: 200, bodyText: "Roof repair serving Portland. Get a quote.", metadata: { description: "Local roof repair." } }],
  );
  assert.equal(report.executiveSummary.industry, "Home services");
  assert.ok(report.conversionOpportunities.includes("Missing phone number"));
  assert.equal(report.frictionAnalysis.length, 7);
  assert.ok(report.priorityRecommendations.some((recommendation) => recommendation.priority === "Critical"));
});
