import { parseLeadInterpretation } from "~/lib/lead-interpretation";
import { ELLIS_SYSTEMS } from "~/lib/lead-taxonomy";
import type { LeadIntake, LeadInterpretation } from "~/types/lead";

function required(name: string) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured.`); return value; }
export async function interpretLead(lead: LeadIntake): Promise<LeadInterpretation> {
  const systemKeys = Object.keys(ELLIS_SYSTEMS).join(", ");
  const analysisContext = { businessName: lead.businessName, website: lead.website, industry: lead.industry, primaryChallenge: lead.primaryChallenge, desiredOutcome: lead.desiredOutcome, urgency: lead.urgency, additionalContext: lead.additionalContext, approximateMonthlyLeadVolume: lead.approximateMonthlyLeadVolume, currentTools: lead.currentTools, currentProcess: lead.currentProcess, biggestManualBottleneck: lead.biggestManualBottleneck, auditContext: lead.auditContext };
  const prompt = `You are an Ellis AI Studio business-process analyst. Return JSON only. Interpret supplied information; never invent facts, tools, budget, employee counts, ROI, or internal workflow. Audit evidence is public and must remain audit_observed or audit_inferred; submitted information is user_confirmed. Select recommendedSystem.key only from: ${systemKeys}. Do not calculate scores or qualification. JSON shape: {summary,primaryProblemCategory,secondaryProblemCategories,identifiedProblems:[{title,description,evidence,evidenceType}],recommendedSystem:{key,name,rationale},intentSignals,impactSignals,urgencySignals,implementationSignals,uncertainty,discoveryQuestions,reasoningSummary}. Problem category is one of acquisition, conversion, lead_management, customer_experience, operations, growth, intelligence, other. Discovery questions must validate unknown workflow details. Analysis context: ${JSON.stringify(analysisContext)}`;
  const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${required("OPENAI_API_KEY")}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini", input: prompt, text: { format: { type: "json_object" } } }) });
  const body = await response.json() as { output_text?: string; error?: { message?: string } };
  if (!response.ok || !body.output_text) throw new Error(body.error?.message ?? "Lead interpretation was unavailable.");
  try { return parseLeadInterpretation(JSON.parse(body.output_text)); } catch { throw new Error("Lead interpretation could not be validated."); }
}
