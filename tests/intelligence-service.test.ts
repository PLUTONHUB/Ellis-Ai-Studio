import assert from "node:assert/strict";
import test from "node:test";
import { IntelligenceService } from "~/services/intelligence-service";

test("creates source-grounded structured intelligence and flags conversion gaps", () => {
  const report = new IntelligenceService().analyze(
    { id: "business-1", name: "Apex Service Group", websiteUrl: "https://apex.example", canonicalWebsiteUrl: "https://apex.example/", businessKey: "key" },
    [{ factType: "service", subject: "Apex Service Group", predicate: "page_heading", value: "HVAC Service", sourceUrl: "https://apex.example/", pageTitle: "HVAC Service", extractedAt: "2026-07-15T00:00:00.000Z", confidence: 0.8, researchRunId: "run-1", factFingerprint: "fact" }],
    [{ id: "snapshot-1", businessId: "business-1", researchRunId: "run-1", sourceUrl: "https://apex.example/", pageTitle: "Apex Service Group", fetchedAt: "2026-07-15T00:00:00.000Z", contentSha256: "hash", contentType: "text/html", httpStatus: 200, bodyText: "HVAC service serving Portland. Get a quote.", metadata: { description: "Local HVAC service." } }],
  );
  assert.equal(report.executiveSummary.industry, "Home services");
  assert.ok(report.conversionOpportunities.includes("Missing phone number"));
  assert.equal(report.frictionAnalysis.length, 7);
  assert.equal(Math.round(report.frictionAnalysis.reduce((total, pillar) => total + pillar.score, 0) / report.frictionAnalysis.length), 64);
  assert.ok(report.businessProfile.services["Website services"]?.includes("HVAC Service"));
  assert.ok(report.digitalPresence.websiteQuality.length > 0);
  assert.ok(report.priorityRecommendations.some((recommendation) => recommendation.priority === "Critical"));
});
