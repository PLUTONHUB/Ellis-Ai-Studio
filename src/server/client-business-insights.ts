import { createServerFn } from "@tanstack/react-start";

import { clientPlatform } from "~/lib/client-platform";
import type { FrictionAuditDraft } from "~/types/friction-audit";

export type ClientBusinessInsights = {
  businessName: string;
  summary: string;
  overview: string[];
  websiteSummary: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  marketPosition: string;
  competitiveInsights: string[];
  latestResearch: string[];
  confidence: number;
  recommendations: Array<{ title: string; action: string; priority: "Critical" | "High" | "Medium" | "Low"; impact: string; effort: string; revenue: string; difficulty: string; timeToImplement: string; roi: string; status: string }>;
  pillars: Array<{ name: string; score: number; priority: "Critical" | "High" | "Medium" | "Low"; impact: string; difficulty: string; recommendation: string; progress: string }>;
  metrics: { businessHealth: number; overallFriction: number; leadResponse: number; websitePerformance: number; growthOpportunity: string; revenueOpportunities: string; revenueAtRisk: string; revenueRecovered: string; monthlyOpportunity: string; researchFreshness: string; automationStatus: string };
  updatedAt: string;
};

type ClientInsightInput = { companyName: string; websiteUrl: string; contactName: string; email: string; serviceArea: string; primaryService: string };

export const getClientBusinessInsights = createServerFn({ method: "POST" }).validator(validateInput).handler(async ({ data }) => {
  const { SupabaseResearchRepository } = await import("~/lib/supabase/research-repository.server");
  const saved = await SupabaseResearchRepository.fromEnvironment().getLatestFrictionAudit(data.websiteUrl);
  return saved ? toClientInsights(saved.draft, saved.updatedAt) : null;
});

export const refreshClientBusinessInsights = createServerFn({ method: "POST" }).validator(validateInput).handler(async ({ data }) => {
  if (process.env.PLUTO_RESEARCH_ENABLED !== "true") throw new Error("Business insights are not available at this time.");
  const [{ BusinessResearchService }, { FrictionAuditService }, { SupabaseResearchRepository }] = await Promise.all([import("~/services/business-research-service"), import("~/services/friction-audit-service"), import("~/lib/supabase/research-repository.server")]);
  const repository = SupabaseResearchRepository.fromEnvironment();
  const research = await new BusinessResearchService(repository).research({ name: data.companyName, websiteUrl: data.websiteUrl, idempotencyKey: crypto.randomUUID() });
  const draft = new FrictionAuditService().createDraft(data, research);
  await repository.upsertFrictionAudit({ businessId: research.business.id, researchRunId: research.researchRunId, intake: data, draft });
  return toClientInsights(draft, new Date().toISOString());
});

function validateInput(data: ClientInsightInput): ClientInsightInput {
  if (!data || ![data.companyName, data.websiteUrl, data.contactName, data.email, data.serviceArea, data.primaryService].every((value) => typeof value === "string" && value.trim())) throw new Error("A complete business profile is required.");
  try { new URL(data.websiteUrl); } catch { throw new Error("A valid website URL is required."); }
  return data;
}

// This is the only payload that crosses the client boundary. It deliberately excludes
// source pages, extracted facts, evidence, research IDs, diagnostics, and internal notes.
function toClientInsights(draft: FrictionAuditDraft, updatedAt: string): ClientBusinessInsights {
  const pillars = draft.pillars.map((pillar, index) => ({ name: pillar.pillar === "Response" ? clientPlatform.pillars[2] : pillar.pillar === "Growth Execution" ? clientPlatform.pillars[6] : pillar.pillar, score: pillar.score, priority: pillar.priority, impact: pillar.businessImpact, difficulty: effortForPriority(pillar.priority), recommendation: draft.executiveSummary.quickWins[index] ?? `Review the ${pillar.pillar.toLowerCase()} opportunity with your Ellis AI Studio team.`, progress: pillar.score < 55 ? "Priority review" : "Monitoring" }));
  const average = Math.round(pillars.reduce((total, pillar) => total + pillar.score, 0) / Math.max(pillars.length, 1));
  const titles = draft.executiveSummary.topOpportunities.length ? draft.executiveSummary.topOpportunities : draft.executiveSummary.quickWins;
  const opportunityCount = Math.max(titles.length, draft.executiveSummary.quickWins.length);
  const lowestPillars = [...pillars].sort((a, b) => a.score - b.score).slice(0, 2);
  const executiveOverview = buildExecutiveOverview(draft);
  const strengths = supportedStrengths(draft);
  const competitiveInsights = supportedCompetitiveInsights(draft);
  return { businessName: draft.intake.companyName, summary: executiveOverview.summary, overview: executiveOverview.points, websiteSummary: websiteSummary(draft), strengths, weaknesses: lowestPillars.map((pillar) => `${pillar.name} requires focused attention to reduce avoidable friction.`), opportunities: draft.executiveSummary.topOpportunities.slice(0, 3), threats: lowestPillars.map((pillar) => `Unaddressed ${pillar.name.toLowerCase()} friction may reduce future growth efficiency.`), marketPosition: average >= 70 ? "Strong foundation" : average >= 50 ? "Building momentum" : "Focused improvement needed", competitiveInsights, latestResearch: ["Executive business review refreshed.", `${pillars.length} growth systems assessed.`, `${opportunityCount} priority opportunities identified.`], confidence: 82, recommendations: titles.slice(0, 4).map((title, index) => ({ title, action: draft.executiveSummary.quickWins[index] ?? "Review this opportunity with your Ellis AI Studio team.", priority: index === 0 ? "High" : "Medium", impact: index === 0 ? "High potential impact" : "Meaningful improvement", effort: index === 0 ? "Focused sprint" : "Planned implementation", revenue: index === 0 ? "Modeled during implementation" : "Opportunity under review", difficulty: index === 0 ? "Moderate" : "Focused", timeToImplement: index === 0 ? "2–4 weeks" : "Planned sprint", roi: index === 0 ? "High potential" : "To be validated", status: index === 0 ? "In review" : "Planned" })), pillars, metrics: { businessHealth: average, overallFriction: 100 - average, leadResponse: pillarScore(pillars, "Response Speed"), websitePerformance: pillarScore(pillars, "Conversion"), growthOpportunity: draft.executiveSummary.recommendedSystems[0] ?? "Growth systems", revenueOpportunities: `${opportunityCount} identified`, revenueAtRisk: lowestPillars.length ? "Under review" : "No material risk identified", revenueRecovered: "Baseline in progress", monthlyOpportunity: "Modeled during implementation", researchFreshness: "Current", automationStatus: "Implementation monitoring" }, updatedAt };
}

function pillarScore(pillars: ClientBusinessInsights["pillars"], name: string): number { return pillars.find((pillar) => pillar.name === name)?.score ?? 0; }
function effortForPriority(priority: "Critical" | "High" | "Medium" | "Low"): string { return priority === "Critical" ? "Focused implementation" : priority === "High" ? "Moderate" : "Planned"; }
function buildExecutiveOverview(draft: FrictionAuditDraft): { summary: string; points: string[] } {
  const serviceSignals = draft.research.businessOverview.filter((item) => /^Website services:/i.test(item)).map((item) => item.replace(/^Website services:\s*/i, "").trim()).filter(Boolean);
  const serviceStatement = serviceSignals.length ? "Public-facing service information is present and provides a foundation for clear positioning." : "Primary services are pending further validation.";
  return { summary: `${draft.intake.companyName} is being assessed as a service business with an executive focus on revenue growth, customer acquisition, operating efficiency, and conversion performance.`, points: [serviceStatement, "The current assessment reviews the business’s customer-facing positioning, lead paths, and growth systems.", "Recommendations are prioritized for practical implementation and measurable business impact."] };
}
function supportedStrengths(draft: FrictionAuditDraft): string[] {
  const strengths: string[] = [];
  if (draft.research.website.length) strengths.push("An active website provides a foundation for digital customer acquisition.");
  if (draft.research.businessOverview.length) strengths.push("Public business information is available for executive review.");
  if (draft.research.marketing.length) strengths.push("Public-facing trust or brand signals are present.");
  if (draft.research.customerExperience.length) strengths.push("Customer contact pathways are available for assessment.");
  return strengths.length ? strengths : ["Pending Analysis"];
}
function supportedCompetitiveInsights(draft: FrictionAuditDraft): string[] {
  if (!draft.research.marketing.length) return ["Pending Analysis"];
  return ["Strengthen visible differentiation through consistent service positioning and proof points.", "Maintain a clear customer journey from initial discovery through conversion."];
}
function websiteSummary(draft: FrictionAuditDraft): string[] {
  if (!draft.research.website.length) return ["Pending Analysis"];
  return ["Messaging and service positioning have been reviewed for customer clarity.", "Calls-to-action and conversion paths have been assessed for lead-generation readiness.", "Brand consistency and overall website quality are reflected in the executive health assessment."];
}
