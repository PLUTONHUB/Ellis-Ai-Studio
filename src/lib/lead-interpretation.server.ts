import { parseLeadInterpretation } from "~/lib/lead-interpretation";
import { ELLIS_SYSTEMS } from "~/lib/lead-taxonomy";
import type { LeadIntake, LeadInterpretation } from "~/types/lead";

export type LeadInterpretationFailureCategory =
  | "openai_http_error" | "openai_network_error" | "openai_timeout"
  | "openai_empty_output" | "openai_json_parse_error" | "openai_validation_error" | "openai_unknown_error";

export type LeadInterpretationDiagnostic = {
  category: LeadInterpretationFailureCategory;
  model: string;
  httpStatus?: number;
  providerErrorType?: string;
  providerErrorCode?: string;
  providerRequestId?: string;
  validationFields?: string[];
};

export class LeadInterpretationError extends Error {
  constructor(readonly diagnostic: LeadInterpretationDiagnostic) { super(diagnostic.category); }
}

function required(name: string) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured.`); return value; }
function modelName() { return process.env.OPENAI_MODEL ?? "gpt-4.1-mini"; }
function safeProviderString(value: unknown) { return typeof value === "string" && /^[a-zA-Z0-9_.-]{1,100}$/.test(value) ? value : undefined; }
function validationFields(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("problem category")) return ["primaryProblemCategory"];
  if (message.includes("system recommendation")) return ["recommendedSystem"];
  if (message.includes("invalid evidence")) return ["identifiedProblems"];
  if (message.includes("incomplete")) return ["summary", "reasoningSummary"];
  return undefined;
}

export function interpretationDiagnostic(error: unknown): LeadInterpretationDiagnostic | undefined {
  return error instanceof LeadInterpretationError ? error.diagnostic : undefined;
}

export async function interpretLead(lead: LeadIntake): Promise<LeadInterpretation> {
  const model = modelName();
  let apiKey: string;
  try { apiKey = required("OPENAI_API_KEY"); }
  catch { throw new LeadInterpretationError({ category: "openai_unknown_error", model }); }
  const systemKeys = Object.keys(ELLIS_SYSTEMS).join(", ");
  const analysisContext = { businessName: lead.businessName, website: lead.website, industry: lead.industry, primaryChallenge: lead.primaryChallenge, desiredOutcome: lead.desiredOutcome, urgency: lead.urgency, additionalContext: lead.additionalContext, approximateMonthlyLeadVolume: lead.approximateMonthlyLeadVolume, currentTools: lead.currentTools, currentProcess: lead.currentProcess, biggestManualBottleneck: lead.biggestManualBottleneck, auditContext: lead.auditContext };
  const prompt = `You are an Ellis AI Studio business-process analyst. Return JSON only. Interpret supplied information; never invent facts, tools, budget, employee counts, ROI, or internal workflow. Audit evidence is public and must remain audit_observed or audit_inferred; submitted information is user_confirmed. Select recommendedSystem.key only from: ${systemKeys}. Do not calculate scores or qualification. JSON shape: {summary,primaryProblemCategory,secondaryProblemCategories,identifiedProblems:[{title,description,evidence,evidenceType}],recommendedSystem:{key,name,rationale},intentSignals,impactSignals,urgencySignals,implementationSignals,uncertainty,discoveryQuestions,reasoningSummary}. Problem category is one of acquisition, conversion, lead_management, customer_experience, operations, growth, intelligence, other. Discovery questions must validate unknown workflow details. Analysis context: ${JSON.stringify(analysisContext)}`;
  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model, input: prompt, text: { format: { type: "json_object" } } }) });
  } catch (error) {
    throw new LeadInterpretationError({ category: error instanceof Error && error.name === "AbortError" ? "openai_timeout" : "openai_network_error", model });
  }
  const providerRequestId = response.headers.get("x-request-id") ?? undefined;
  const body = await response.json().catch(() => null) as { output_text?: unknown; error?: { type?: unknown; code?: unknown } } | null;
  if (!response.ok) throw new LeadInterpretationError({ category: "openai_http_error", model, httpStatus: response.status, providerRequestId, providerErrorType: safeProviderString(body?.error?.type), providerErrorCode: safeProviderString(body?.error?.code) });
  if (typeof body?.output_text !== "string" || !body.output_text.trim()) throw new LeadInterpretationError({ category: "openai_empty_output", model, httpStatus: response.status, providerRequestId });
  let parsed: unknown;
  try { parsed = JSON.parse(body.output_text); }
  catch { throw new LeadInterpretationError({ category: "openai_json_parse_error", model, httpStatus: response.status, providerRequestId }); }
  try { return parseLeadInterpretation(parsed); }
  catch (error) { throw new LeadInterpretationError({ category: "openai_validation_error", model, httpStatus: response.status, providerRequestId, validationFields: validationFields(error) }); }
}
