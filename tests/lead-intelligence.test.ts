import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { parseLeadInterpretation } from "~/lib/lead-interpretation";
import { interpretationDiagnostic, interpretLead, LeadInterpretationError } from "~/lib/lead-interpretation.server";
import { bottleneckAuditToLead } from "~/lib/bottleneck-audit-lead-adapter";
import { LEAD_ANALYSIS_FAILURE_MESSAGE, publicLeadResult, submitLead, submitLeadForConfirmation } from "~/lib/lead-service.server";
import { LEAD_ANALYSIS_FAILURE_CODE, LEAD_DUPLICATE_RECEIVED_CODE, LEAD_SUBMISSION_FAILURE_MESSAGE, publicLeadSubmissionMessage } from "~/lib/lead-public-errors";
import { classifyLead, recommendNextAction, scoreLead } from "~/lib/lead-scoring";
import { validateLeadIntake } from "~/lib/lead-validation";
import { addActivity, createLead, listLeads } from "~/lib/lead-repository.server";
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
test("lead interpretation diagnostics classify provider and parser failures without PII", async () => {
  const originalFetch = globalThis.fetch; const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-openai-key";
  const privateLead = { ...base, firstName: "PrivateFirst", lastName: "PrivateLast", email: "private.person@example.com", phone: "555-0100", primaryChallenge: "Private challenge that must never be logged." };
  const responses = [
    new Response(JSON.stringify({ error: { type: "invalid_request_error", code: "unsupported_parameter" } }), { status: 400, headers: { "x-request-id": "req_safe_123" } }),
    new Response(JSON.stringify({ output_text: "not-json" }), { status: 200, headers: { "x-request-id": "req_safe_456" } }),
    new Response(JSON.stringify({ output_text: "{}" }), { status: 200, headers: { "x-request-id": "req_safe_789" } }),
    new Response(JSON.stringify({ output_text: JSON.stringify(interpretation) }), { status: 200 }),
  ];
  let requestBody = "";
  globalThis.fetch = (async (_url: URL | RequestInfo, init?: RequestInit) => { requestBody = String(init?.body ?? ""); return responses.shift()!; }) as typeof fetch;
  try {
    for (const expected of ["openai_http_error", "openai_json_parse_error", "openai_validation_error"] as const) {
      await assert.rejects(() => interpretLead(privateLead), (error: unknown) => {
        assert.ok(error instanceof LeadInterpretationError); const diagnostic = interpretationDiagnostic(error);
        assert.equal(diagnostic?.category, expected); assert.doesNotMatch(JSON.stringify(diagnostic), /PrivateFirst|private\.person@example\.com|555-0100|Private challenge/);
        return true;
      });
    }
    const valid = await interpretLead(privateLead); assert.equal(valid.summary, interpretation.summary);
    assert.doesNotMatch(requestBody, /PrivateFirst|PrivateLast|private\.person@example\.com|555-0100/);
    assert.equal(LEAD_ANALYSIS_FAILURE_MESSAGE, "We received your inquiry, but could not complete the analysis right now. Please try again shortly.");
  } finally { globalThis.fetch = originalFetch; if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey; }
});
test("lead list uses the server-only Supabase Data API and preserves null analysis fields", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  const calls: string[] = [];
  globalThis.fetch = (async (input: URL | RequestInfo) => { const url = String(input); calls.push(url); const body = url.includes("lead_analyses") ? [] : [{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", business_name: "Example", first_name: "A", last_name: "B", email: "a@example.com", pipeline_status: "new", analysis_status: "pending" }]; return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } }); }) as typeof fetch;
  try { const leads = await listLeads(); assert.equal(leads.length, 1); assert.equal(leads[0].opportunity_score, null); assert.equal(leads[0].qualification_class, null); assert.equal(calls.length, 2); assert.ok(calls.every((url) => url.startsWith("https://project.supabase.co/rest/v1/"))); }
  finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});
test("minimal Supabase write responses do not require a JSON body", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  globalThis.fetch = (async () => new Response(null, { status: 201 })) as typeof fetch;
  try { await addActivity("lead-1", "lead_created"); }
  finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});
test("lead intelligence service role migration grants only the runtime Data API operations", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260818180300_grant_lead_intelligence_service_role.sql"), "utf8").toLowerCase();
  assert.match(migration, /grant select, insert, update on table public\.leads to service_role/);
  assert.match(migration, /grant select, insert on table public\.lead_analyses to service_role/);
  assert.match(migration, /grant select, insert on table public\.lead_activities to service_role/);
  assert.doesNotMatch(migration, /to (anon|authenticated|public)/);
  assert.doesNotMatch(migration, /grant delete/);
});

test("Business Bottleneck Audit maps first-party operations into the canonical lead intake", () => {
  const lead = bottleneckAuditToLead({
    requestId: "bottleneck_1234567890abcdef",
    name: "Avery Stone", businessName: "Northwest Roofing", email: "avery@example.com",
    challenge: "Estimate requests wait in a shared inbox.", affectedArea: "Lead follow-up",
    currentProcess: "Someone reads every new message and assigns it by hand.", manualWork: "Manual review and assignment",
    failureImpact: "Interested customers wait too long.", tools: "Gmail, HubSpot", frequency: "Daily",
    desiredOutcome: "Every inquiry gets a timely response.", priority: "Respond faster", readiness: "Yes", foundingInterest: "No",
  });
  assert.equal(lead.source, "business_bottleneck_audit");
  assert.equal(lead.currentProcess, "Someone reads every new message and assigns it by hand.");
  assert.equal(lead.biggestManualBottleneck, "Manual review and assignment");
  assert.equal(lead.urgency, "within_30_days");
  assert.equal(lead.bottleneckAudit?.failureImpact, "Interested customers wait too long.");
  assert.match(lead.additionalContext ?? "", /Affected area: Lead follow-up/);
});

test("Bottleneck Audit retries retain one idempotency key and resolve to one lead", async () => {
  const application = {
    requestId: "bottleneck_1234567890abcdef", name: "Avery Stone", businessName: "Northwest Roofing", email: "avery@example.com",
    challenge: "Estimate requests wait in a shared inbox.", affectedArea: "Lead follow-up",
    currentProcess: "Someone reads every new message and assigns it by hand.", manualWork: "Manual review and assignment",
    failureImpact: "Interested customers wait too long.", frequency: "Daily", desiredOutcome: "Every inquiry gets a timely response.",
    priority: "Respond faster", readiness: "Yes", foundingInterest: "No",
  };
  const firstInput = bottleneckAuditToLead(application);
  const retryInput = bottleneckAuditToLead(application);
  assert.equal(firstInput.requestId, retryInput.requestId);

  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  let posts = 0;
  globalThis.fetch = (async (_url: URL | RequestInfo, init?: RequestInit) => {
    if (init?.method === "POST") { posts += 1; return new Response(JSON.stringify(posts === 1 ? [{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", updated_at: "2026-08-18T00:00:00.000Z", pipeline_status: "new", analysis_status: "pending" }] : []), { status: 201, headers: { "Content-Type": "application/json" } }); }
    return new Response(JSON.stringify([{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", updated_at: "2026-08-18T00:00:00.000Z", pipeline_status: "new", analysis_status: "pending" }]), { status: 200, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;
  try {
    const first = await createLead(firstInput); const retry = await createLead(retryInput);
    assert.equal(first.duplicate, false); assert.equal(retry.duplicate, true); assert.equal(first.lead.id, retry.lead.id);
  } finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});

test("idempotency-key conflict resolves the original lead without duplicate activities", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  const calls: Array<{ url: string; method?: string }> = [];
  globalThis.fetch = (async (url: URL | RequestInfo, init?: RequestInit) => {
    const path = String(url); calls.push({ url: path, method: init?.method });
    if (init?.method === "POST" && path.includes("/rest/v1/leads?")) {
      return new Response(JSON.stringify({ code: "23505", message: "duplicate key value violates unique constraint \\\"leads_idempotency_key_key\\\"" }), { status: 409, headers: { "Content-Type": "application/json" } });
    }
    if (!init?.method && path.includes("idempotency_key=eq.")) {
      return new Response(JSON.stringify([{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", updated_at: "2026-08-18T00:00:00.000Z", pipeline_status: "new", analysis_status: "failed" }]), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    throw new Error(`Unexpected request ${init?.method ?? "GET"} ${path}`);
  }) as typeof fetch;
  try {
    const duplicate = await createLead(base);
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.lead.id, "lead-1");
    assert.equal(calls.filter((call) => call.url.includes("lead_activities")).length, 0);
    assert.match(calls[0].url, /on_conflict=idempotency_key/);
  } finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});

test("only the canonical idempotency conflict becomes a duplicate", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  globalThis.fetch = (async () => new Response(JSON.stringify({ code: "23505", message: "duplicate key value violates unique constraint \\\"leads_email_key\\\"" }), { status: 409, headers: { "Content-Type": "application/json" } })) as typeof fetch;
  try { await assert.rejects(() => createLead(base), /Supabase lead request failed/); }
  finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});

test("duplicate submission does not restart analysis or write duplicate activities", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  const calls: string[] = [];
  globalThis.fetch = (async (url: URL | RequestInfo, init?: RequestInit) => {
    const path = String(url); calls.push(path);
    if (init?.method === "POST" && path.includes("/rest/v1/leads?")) return new Response(JSON.stringify({ code: "23505", message: "duplicate key value violates unique constraint \\\"leads_idempotency_key_key\\\"" }), { status: 409, headers: { "Content-Type": "application/json" } });
    if (path.includes("idempotency_key=eq.")) return new Response(JSON.stringify([{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", updated_at: "2026-08-18T00:00:00.000Z", pipeline_status: "new", analysis_status: "analyzing" }]), { status: 200, headers: { "Content-Type": "application/json" } });
    throw new Error(`Unexpected request ${path}`);
  }) as typeof fetch;
  try {
    await assert.rejects(() => submitLead(base), (error: unknown) => error instanceof Error && error.message === LEAD_DUPLICATE_RECEIVED_CODE);
    assert.equal(calls.filter((path) => path.includes("lead_activities")).length, 0);
    assert.equal(calls.filter((path) => path.includes("api.openai.com")).length, 0);
  } finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});

test("a captured lead still resolves to confirmation when analysis fails", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY; const originalOpenAIKey = process.env.OPENAI_API_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key"; process.env.OPENAI_API_KEY = "test-openai-key";
  const calls: Array<{ url: string; method?: string; body?: string }> = [];
  globalThis.fetch = (async (url: URL | RequestInfo, init?: RequestInit) => {
    const path = String(url); calls.push({ url: path, method: init?.method, body: String(init?.body ?? "") });
    if (path.includes("/rest/v1/leads?") && init?.method === "POST") return new Response(JSON.stringify([{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", updated_at: "2026-08-18T00:00:00.000Z", pipeline_status: "new", analysis_status: "pending" }]), { status: 201, headers: { "Content-Type": "application/json" } });
    if (path.includes("api.openai.com")) return new Response(JSON.stringify({ error: { type: "invalid_request_error", code: "unsupported_parameter" } }), { status: 400, headers: { "Content-Type": "application/json" } });
    if (path.includes("/rest/v1/lead_activities") || path.includes("/rest/v1/leads?")) return new Response(null, { status: 204 });
    throw new Error(`Unexpected request ${path}`);
  }) as typeof fetch;
  try {
    assert.deepEqual(await submitLeadForConfirmation(base), { received: true });
    assert.equal(calls.filter((call) => call.url.includes("/rest/v1/leads?") && call.method === "POST").length, 1);
    assert.equal(calls.filter((call) => call.url.includes("api.openai.com")).length, 1);
    const activityTypes = calls.filter((call) => call.url.includes("lead_activities")).map((call) => JSON.parse(call.body ?? "{}").type);
    assert.deepEqual(activityTypes, ["lead_created", "analysis_started", "analysis_failed"]);
  } finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; if (originalOpenAIKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalOpenAIKey; }
});

test("a duplicate Bottleneck Audit resolves to confirmation without new work", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  const calls: string[] = [];
  globalThis.fetch = (async (url: URL | RequestInfo, init?: RequestInit) => {
    const path = String(url); calls.push(path);
    if (path.includes("/rest/v1/leads?") && init?.method === "POST") return new Response(JSON.stringify({ code: "23505", message: "duplicate key value violates unique constraint \\\"leads_idempotency_key_key\\\"" }), { status: 409, headers: { "Content-Type": "application/json" } });
    if (path.includes("idempotency_key=eq.")) return new Response(JSON.stringify([{ id: "lead-1", created_at: "2026-08-18T00:00:00.000Z", updated_at: "2026-08-18T00:00:00.000Z", pipeline_status: "new", analysis_status: "complete" }]), { status: 200, headers: { "Content-Type": "application/json" } });
    throw new Error(`Unexpected request ${path}`);
  }) as typeof fetch;
  try {
    assert.deepEqual(await submitLeadForConfirmation(base), { received: true });
    assert.equal(calls.filter((path) => path.includes("lead_activities")).length, 0);
    assert.equal(calls.filter((path) => path.includes("api.openai.com")).length, 0);
  } finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});

test("a pre-persistence failure remains a safe public form error", async () => {
  const originalFetch = globalThis.fetch; const originalUrl = process.env.SUPABASE_URL; const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  globalThis.fetch = (async () => new Response(JSON.stringify({ code: "XX000" }), { status: 500, headers: { "Content-Type": "application/json" } })) as typeof fetch;
  try {
    await assert.rejects(() => submitLeadForConfirmation(base), /Supabase lead request failed/);
    assert.equal(publicLeadSubmissionMessage(new Error("Supabase lead request failed.")), LEAD_SUBMISSION_FAILURE_MESSAGE);
  } finally { globalThis.fetch = originalFetch; if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl; if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey; }
});

test("public lead submission errors are an explicit allowlist", () => {
  assert.equal(publicLeadSubmissionMessage(new Error(LEAD_ANALYSIS_FAILURE_CODE)), LEAD_ANALYSIS_FAILURE_MESSAGE);
  assert.match(publicLeadSubmissionMessage(new Error(LEAD_DUPLICATE_RECEIVED_CODE)), /already received/i);
  for (const internal of ["Supabase lead request failed.", "23505", "leads_idempotency_key_key", "OpenAI provider unavailable"]) {
    assert.equal(publicLeadSubmissionMessage(new Error(internal)), LEAD_SUBMISSION_FAILURE_MESSAGE);
  }
  const bottleneckForm = readFileSync(resolve(process.cwd(), "src/components/forms/audit-form.tsx"), "utf8");
  const directIntake = readFileSync(resolve(process.cwd(), "src/components/pages/lead-intelligence.tsx"), "utf8");
  assert.match(bottleneckForm, /setStatus\(publicLeadSubmissionMessage\(error\)\)/);
  assert.match(directIntake, /return publicLeadSubmissionMessage\(reason\)/);
  assert.doesNotMatch(bottleneckForm, /error\.message/);
});

test("Bottleneck Audit preserves user-confirmed source context and removes mail-client handoff", () => {
  const form = readFileSync(resolve(process.cwd(), "src/components/forms/audit-form.tsx"), "utf8");
  const adapter = readFileSync(resolve(process.cwd(), "src/lib/bottleneck-audit-lead-adapter.ts"), "utf8");
  const legacySubmission = readFileSync(resolve(process.cwd(), "src/lib/audit-intake.server.ts"), "utf8");
  assert.doesNotMatch(form, /mailto:/i);
  assert.doesNotMatch(legacySubmission, /AUDIT_FORM_WEBHOOK_URL/);
  assert.match(form, /window\.location\.assign\(routes\.auditReceived\)/);
  assert.match(form, /const \[requestId\] = useState\(newSubmissionId\)/);
  assert.match(form, /requestId,/);
  assert.match(adapter, /source: "business_bottleneck_audit"/);
  assert.match(adapter, /bottleneckAudit:/);
});

test("Bottleneck Audit confirmation route is static, safe to refresh, and uses approved copy", () => {
  const route = readFileSync(resolve(process.cwd(), "src/routes/audit/received.tsx"), "utf8");
  const page = readFileSync(resolve(process.cwd(), "src/components/pages/audit-received.tsx"), "utf8");
  const submit = readFileSync(resolve(process.cwd(), "src/lib/audit-submit.ts"), "utf8");
  assert.match(route, /createFileRoute\("\/audit\/received"\)/);
  assert.match(page, /Inquiry received/);
  assert.match(page, /There’s no need to submit the form again\./);
  assert.match(page, /What happens next/);
  assert.match(submit, /submitLeadForConfirmation/);
  assert.doesNotMatch(page, /Supabase|OpenAI|retry|idempotency|duplicate/i);
});

test("Bottleneck Audit source migration adds only the canonical source key", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260818182546_add_bottleneck_audit_lead_source.sql"), "utf8");
  assert.match(migration, /business_bottleneck_audit/);
  assert.doesNotMatch(migration, /grant\s+/i);
  assert.doesNotMatch(migration, /disable row level security/i);
});
