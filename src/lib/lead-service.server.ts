import { ELLIS_SYSTEMS, isEllisSystemKey } from "~/lib/lead-taxonomy";
import { interpretLead } from "~/lib/lead-interpretation.server";
import { addActivity, createLead, saveAnalysis, updateAnalysisStatus } from "~/lib/lead-repository.server";
import { recommendNextAction, scoreLead } from "~/lib/lead-scoring";
import { validateLeadIntake } from "~/lib/lead-validation";
import type { LeadIntake, LeadPublicResult } from "~/types/lead";

export function publicLeadResult(id: string, _input: LeadIntake, interpretation: Awaited<ReturnType<typeof interpretLead>>, action: ReturnType<typeof recommendNextAction>): LeadPublicResult {
  void _input; const system = isEllisSystemKey(interpretation.recommendedSystem.key) ? interpretation.recommendedSystem.key : "custom_system";
  return { id, summary: interpretation.summary, primaryProblemCategory: interpretation.primaryProblemCategory, recommendedSystem: { key: system, name: ELLIS_SYSTEMS[system].name, description: ELLIS_SYSTEMS[system].description }, discoveryQuestions: interpretation.discoveryQuestions, nextStep: action, validationNeeded: interpretation.uncertainty };
}
export async function submitLead(raw: LeadIntake): Promise<LeadPublicResult> {
  const input = validateLeadIntake(raw); const created = await createLead(input); if (created.duplicate) throw new Error("This submission has already been received.");
  await addActivity(created.lead.id, "lead_created", { source: input.source }); if (input.auditContext) await addActivity(created.lead.id, "audit_attached", { auditId: input.auditContext.auditId });
  try { await updateAnalysisStatus(created.lead.id, "analyzing"); await addActivity(created.lead.id, "analysis_started"); const interpretation = await interpretLead(input); const scores = scoreLead(input, interpretation); const action = recommendNextAction(scores); await saveAnalysis(created.lead.id, interpretation, scores, action); await addActivity(created.lead.id, "qualification_completed", { recommendedNextAction: action }); return publicLeadResult(created.lead.id, input, interpretation, action); }
  catch (error) { await updateAnalysisStatus(created.lead.id, "failed"); await addActivity(created.lead.id, "analysis_failed"); throw new Error("We received your inquiry, but could not complete the analysis right now. Please try again shortly."); }
}
