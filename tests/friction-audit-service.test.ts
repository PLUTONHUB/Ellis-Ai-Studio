import assert from "node:assert/strict";
import test from "node:test";

import { FrictionAuditService } from "../src/services/friction-audit-service";
import type { ResearchResult } from "../src/types/research";

test("creates an internal review draft with all seven friction pillars", () => {
  const draft = new FrictionAuditService().createDraft({ companyName: "Apex Roofing", websiteUrl: "https://apex.example", contactName: "Avery", email: "avery@apex.example", serviceArea: "Phoenix Metro", primaryService: "Roof replacement" }, researchResult());
  assert.equal(draft.pillars.length, 7);
  assert.deepEqual(draft.pillars.map((pillar) => pillar.pillar), ["Discovery", "Conversion", "Response", "Operations", "Customer Experience", "Business Intelligence", "Growth Execution"]);
  assert.match(draft.markdown, /Internal draft for Ellis AI Studio review/);
  assert.match(draft.markdown, /30-Day Implementation Roadmap/);
});

function researchResult(): ResearchResult {
  const frictionAnalysis = [["Discovery", 55], ["Conversion", 45], ["Response", 35], ["Operations", 50], ["Customer Experience", 65], ["Intelligence", 38], ["Growth", 42]].map(([pillar, score]) => ({ pillar: pillar as string, score: score as number, evidence: [`${pillar} evidence`], whyItMatters: "It matters", estimatedBusinessImpact: "Revenue impact", recommendedFix: "Fix it" }));
  return { business: { id: "business", name: "Apex Roofing", websiteUrl: "https://apex.example", canonicalWebsiteUrl: "https://apex.example/", businessKey: "apex" }, researchRunId: "run", status: "completed", snapshot: { id: "snapshot", businessId: "business", researchRunId: "run", sourceUrl: "https://apex.example", pageTitle: "Apex", fetchedAt: "2026-01-01T00:00:00.000Z", contentSha256: "hash", contentType: "text/html", httpStatus: 200, bodyText: "", metadata: {} }, snapshots: [], facts: [], findings: [], recommendations: [], intelligence: { executiveSummary: { businessName: "Apex Roofing", industry: "Roofing", description: "Roofing business", confidence: 0.8 }, businessProfile: { services: {}, products: [], serviceAreas: [], locations: [], contacts: { phones: [], emails: [] }, socialLinks: [], operatingHours: [] }, trustSignals: { reviews: [], certifications: [], awards: [], testimonials: [], guarantees: [], yearsInBusiness: [] }, digitalPresence: { websiteQuality: ["Website available"], mobileFriendliness: [], navigation: [], missingPages: [], contactAccessibility: [] }, conversionOpportunities: ["Improve booking"], frictionAnalysis, priorityRecommendations: [{ priority: "High", title: "Improve response", estimatedRevenueImpact: "High", estimatedImplementationEffort: "Low", supportingEvidence: [], action: "Add lead routing" }] } };
}
