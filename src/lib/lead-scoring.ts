import { ELLIS_SYSTEMS, isEllisSystemKey } from "~/lib/lead-taxonomy";
import type { LeadIntake, LeadInterpretation, LeadScores, QualificationClass, RecommendedNextAction } from "~/types/lead";

const urgencyBase = { immediate: 95, within_30_days: 85, one_to_three_months: 70, three_to_six_months: 50, exploring: 30 } as const;
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const details = (lead: LeadIntake) => [lead.additionalContext, lead.approximateMonthlyLeadVolume, lead.currentTools, lead.currentProcess, lead.biggestManualBottleneck].filter(Boolean).length;
export function classifyLead(score: number): QualificationClass { if (score >= 85) return "priority_lead"; if (score >= 70) return "strong_fit"; if (score >= 55) return "qualified"; if (score >= 35) return "nurture"; return "poor_fit"; }
export function qualificationLabel(value: QualificationClass) { return ({ priority_lead: "Priority Lead", strong_fit: "Strong Fit", qualified: "Qualified", nurture: "Nurture", poor_fit: "Poor Fit" })[value]; }
export function recommendNextAction(scores: Pick<LeadScores, "opportunityScore" | "qualificationConfidence" | "qualificationClass">): RecommendedNextAction {
  if (scores.qualificationClass === "poor_fit") return "decline_or_refer";
  if (scores.qualificationConfidence < 55) return "request_more_information";
  if (scores.qualificationClass === "priority_lead") return "strategy_call";
  if (scores.qualificationClass === "strong_fit") return "process_mapping";
  if (scores.qualificationClass === "nurture") return "nurture";
  return "manual_review";
}

export function scoreLead(lead: LeadIntake, interpretation: LeadInterpretation): LeadScores {
  const signalText = [lead.primaryChallenge, lead.desiredOutcome, lead.additionalContext, lead.currentProcess, lead.biggestManualBottleneck, ...interpretation.intentSignals, ...interpretation.impactSignals].filter(Boolean).join(" ").toLowerCase();
  const recommended = isEllisSystemKey(interpretation.recommendedSystem.key) ? interpretation.recommendedSystem.key : "custom_system";
  const categoryMatch = ELLIS_SYSTEMS[recommended].categories.includes(interpretation.primaryProblemCategory as never);
  const implementationLanguage = /implement|build|automate|integrat|route|follow.?up|respond|workflow|system/.test(signalText);
  const manualWork = /manual|shared inbox|spreadsheet|copy.?paste|review|assign|handoff/.test(signalText);
  const revenueCritical = /lead|inquir|estimate|quote|customer|sale|book|appoint/.test(signalText);
  const unsupported = /logo|branding only|graphic design|illustration/.test(signalText);
  const volume = Number((lead.approximateMonthlyLeadVolume ?? "").match(/\d+/)?.[0] ?? 0);
  const contextCount = details(lead);
  const problemFit = clamp(unsupported ? 15 : 35 + (categoryMatch ? 24 : 8) + (implementationLanguage ? 18 : 0) + (manualWork ? 12 : 0) + (interpretation.identifiedProblems.length >= 2 ? 8 : 0));
  const potentialImpact = clamp(20 + (revenueCritical ? 24 : 0) + (manualWork ? 15 : 0) + (volume >= 50 ? 22 : volume >= 15 ? 14 : volume > 0 ? 7 : 0) + (interpretation.impactSignals.length >= 2 ? 10 : 0));
  const urgency = clamp(urgencyBase[lead.urgency] + (/(losing|hours|urgent|immediately)/.test(signalText) ? 5 : 0));
  const implementationFit = clamp(unsupported ? 15 : 42 + (categoryMatch ? 18 : 0) + (implementationLanguage ? 13 : 0) + (contextCount >= 2 ? 10 : 0) + (interpretation.uncertainty.length > 3 ? -12 : 0));
  const intent = clamp(12 + (implementationLanguage ? 25 : 0) + (lead.urgency !== "exploring" ? 16 : 0) + Math.min(contextCount * 8, 24) + (lead.desiredOutcome.length > 35 ? 10 : 0));
  const opportunityScore = clamp(problemFit * .30 + potentialImpact * .25 + implementationFit * .20 + intent * .15 + urgency * .10);
  const userConfirmed = [lead.currentProcess, lead.biggestManualBottleneck, lead.approximateMonthlyLeadVolume].filter(Boolean).length;
  const qualificationConfidence = clamp(25 + Math.min(contextCount * 10, 35) + Math.min(userConfirmed * 8, 16) + (lead.auditContext ? 10 : 0) - Math.min(interpretation.uncertainty.length * 4, 20));
  const cappedOpportunity = qualificationConfidence < 45 ? Math.min(opportunityScore, 74) : opportunityScore;
  return { problemFit, potentialImpact, urgency, implementationFit, intent, opportunityScore: cappedOpportunity, qualificationConfidence, qualificationClass: classifyLead(cappedOpportunity) };
}
