import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { parseLeadInterpretation } from "~/lib/lead-interpretation";
import { publicLeadResult } from "~/lib/lead-service.server";
import { classifyLead, recommendNextAction, scoreLead } from "~/lib/lead-scoring";
import { validateLeadIntake } from "~/lib/lead-validation";
import { listLeads } from "~/lib/lead-repository.server";
import type { LeadIntake, LeadInterpretation } from "~/types/lead";
const base: LeadIntake = { requestId: "request_123456789", source: "direct_intake", firstName: "Avery", lastName: "Stone", email: "avery@example.com", businessName: "Northwest Roofing", website: "northwestroofing.example", primaryChallenge: "We manually review 60 estimate requests per month and customers can wait hours for a response.", desiredOutcome: "Automatically qualify and route leads within 30 days.", urgency: "within_30_days", approximateMonthlyLeadVolume: "60", currentProcess: "Every inquiry goes to a shared inbox and someone manually assigns it.", biggestManualBottleneck: "Manual review and routing" };
const interpretation: LeadInterpretation = { summary: "New website inquiries are manually reviewed and routed.", primaryProblemCategory: "lead_management", secondaryProblemCategories: ["conversion"], identifiedProblems: [{ title: "Manual routing", description: "The team assigns inquiries manually.", evidence: ["shared inbox"], evidenceType: "user_confirmed" }], recommendedSystem: { key: "lead_response", name: "Lead Response + Qualification System", rationale: "The process needs qualification and immediate routing." }, intentSignals: ["within 30 days", "automatically"], impactSignals: ["60 estimate requests", "response delay"], urgencySignals: ["within 30 days"], implementationSignals: ["shared inbox"], uncertainty: ["Current CRM is unknown"], discoveryQuestions: ["What happens immediately after a form is submitted?"], reasoningSummary: "The user confirmed a lead-management workflow with delays." };
test("lead scoring uses the published weights and strong context", () => { const score = scoreLead(base, interpretation); assert.equal(score.opportunityScore, Math.round(score.problemFit * .30 + score.potentialImpact * .25 + score.implementationFit * .20 + score.intent * .15 + score.urgency * .10)); assert.ok(score.opportunityScore >= 70); assert.ok(score.qualificationConfidence >= 55); });
test("qualification boundaries are deterministic", () => { assert.equal(classifyLead(85), "priority_lead"); assert.equal(classifyLead(84), "strong_fit"); assert.equal(classifyLead(70), "strong_fit"); assert.equal(classifyLead(69), "qualified"); assert.equal(classifyLead(55), "qualified"); assert.equal(classifyLead(35), "nurture"); assert.equal(classifyLead(34), "poor_fit"); });
test("vague inquiry cannot receive an extreme score", () => { const vague = { ...base, requestId: "request_987654321", primaryChallenge: "I want AI for my business.", desiredOutcome: "Use AI.", urgency: "exploring" as const, approximateMonthlyLeadVolume: undefined, currentProcess: undefined, biggestManualBottleneck: undefined }; const score = scoreLead(vague, { ...interpretation, intentSignals: [], impactSignals: [], uncertainty: ["workflow unknown", "volume unknown", "tools unknown", "outcome unclear"] }); assert.ok(score.opportunityScore < 85); assert.ok(score.qualificationConfidence < 55); assert.equal(recommendNextAction(score), "request_more_information"); });
test("validation normalizes URLs and rejects invalid email", () => { assert.equal(validateLeadIntake(base).website, "https://northwestroofing.example"); assert.throws(() => validateLeadIntake({ ...base, email: "invalid" })); });
test("malformed AI output is rejected", () => { assert.throws(() => parseLeadInterpretation({ primaryProblemCategory: "lead_management" })); });
test("public response omits internal scores and reasoning", () => { const result = publicLeadResult("lead-id", base, interpretation, "strategy_call"); assert.equal("opportunityScore" in result, false); assert.equal("qualificationClass" in result, false); assert.equal("reasoningSummary" in result, false); });
test("audit inference remains audit inference", () => { const parsed = parseLeadInterpretation({ ...interpretation, identifiedProblems: [{ ...interpretation.identifiedProblems[0], evidenceType: "audit_inferred" }] }); assert.equal(parsed.identifiedProblems[0].evidenceType, "audit_inferred"); });
test("lead list uses the server-only Supabase Data API and preserves null analysis fields", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  const calls: string[] = [];
  globalThis.fetch = (async (input: URL | RequestInfo) => { const url = String(input); calls.push(url); const body = url.includes("lead_analyses") ? [] : [{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", business_name: "Example", first_name: "A", last_name: "B", email: "a@example.com", pipeline_status: "new", analysis_status: "pending" }]; return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } }); }) as typeof fetch;
  try { const leads = await listLeads(); assert.equal(leads.length, 1); assert.equal(leads[0].opportunity_score, null); assert.equal(leads[0].qualification_class, null); assert.equal(calls.length, 2); assert.ok(calls.every((url) => url.startsWith("https://project.supabase.co/rest/v1/"))); }
  finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});
test("lead intelligence service role migration grants only the runtime Data API operations", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260818180141_grant_lead_intelligence_service_role.sql"), "utf8").toLowerCase();
  assert.match(migration, /grant select, insert, update on table public\.leads to service_role/);
  assert.match(migration, /grant select, insert on table public\.lead_analyses to service_role/);
  assert.match(migration, /grant select, insert on table public\.lead_activities to service_role/);
  assert.doesNotMatch(migration, /to (anon|authenticated|public)/);
  assert.doesNotMatch(migration, /grant delete/);
});
