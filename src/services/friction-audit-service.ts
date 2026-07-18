import type { ResearchResult } from "~/types/research";
import type { FrictionAuditDraft, FrictionAuditIntake, FrictionAuditPillar } from "~/types/friction-audit";

const pillarDefinitions: Array<{ pillar: FrictionAuditPillar["pillar"]; source: string; impact: string }> = [
  { pillar: "Discovery", source: "Discovery", impact: "Weak discovery creates low-fit demand and wastes acquisition spend before sales conversations begin." },
  { pillar: "Conversion", source: "Conversion", impact: "Conversion friction lowers the share of interested visitors who become qualified conversations." },
  { pillar: "Response", source: "Response", impact: "Slow or inconsistent responses let high-intent prospects choose a competitor first." },
  { pillar: "Operations", source: "Operations", impact: "Manual handoffs and unclear workflows reduce throughput and create missed follow-up." },
  { pillar: "Customer Experience", source: "Customer Experience", impact: "Inconsistent expectations and updates erode trust, reviews, referrals, and lifetime value." },
  { pillar: "Business Intelligence", source: "Intelligence", impact: "Without reliable measurement, teams cannot confidently invest in the channels and fixes that drive growth." },
  { pillar: "Growth Execution", source: "Growth", impact: "Without a sequenced execution plan, growth work becomes reactive and difficult to scale." },
];

export class FrictionAuditService {
  createDraft(intake: FrictionAuditIntake, research: ResearchResult): FrictionAuditDraft {
    const intelligence = research.intelligence;
    const pillars = pillarDefinitions.map(({ pillar, source, impact }) => {
      const analysis = intelligence.frictionAnalysis.find((item) => item.pillar === source);
      const score = analysis?.score ?? 50;
      return { pillar, score, evidence: analysis?.evidence.length ? analysis.evidence : ["No direct evidence was extracted for this pillar; validate during the strategy session."], businessImpact: analysis?.estimatedBusinessImpact ?? impact, priority: priorityFromScore(score) };
    });
    const recommendations = intelligence.priorityRecommendations;
    const topOpportunities = recommendations.slice(0, 3).map((item) => item.title);
    const quickWins = recommendations.filter((item) => item.estimatedImplementationEffort.toLowerCase().includes("low") || item.priority === "Critical").slice(0, 3).map((item) => item.action);
    const recommendedSystems = systemsFor(pillars);
    const draft: FrictionAuditDraft = {
      intake,
      research: {
        website: intelligence.digitalPresence.websiteQuality,
        businessOverview: [intelligence.executiveSummary.description, ...Object.entries(intelligence.businessProfile.services).flatMap(([service, values]) => values.length ? [`${service}: ${values.join(", ")}`] : [])],
        leadGeneration: intelligence.conversionOpportunities,
        customerExperience: intelligence.digitalPresence.contactAccessibility,
        marketing: [...intelligence.trustSignals.reviews, ...intelligence.trustSignals.testimonials, ...intelligence.businessProfile.socialLinks],
        technicalIssues: [...intelligence.digitalPresence.mobileFriendliness, ...intelligence.digitalPresence.navigation, ...intelligence.digitalPresence.missingPages],
        revenueFriction: recommendations.slice(0, 5).map((item) => `${item.title}: ${item.action}`),
      },
      pillars,
      executiveSummary: {
        topOpportunities,
        quickWins,
        recommendedSystems,
        roadmap30Days: [
          { week: "Week 1", actions: ["Validate audit evidence with the client.", "Establish baseline conversion, response, and pipeline metrics."] },
          { week: "Week 2", actions: quickWins.slice(0, 2).length ? quickWins.slice(0, 2) : ["Implement the highest-confidence conversion and contact-path improvements."] },
          { week: "Week 3", actions: recommendedSystems.slice(0, 2).map((system) => `Design ${system}.`) },
          { week: "Week 4", actions: ["Launch the first system changes.", "Review results and sequence the next 30-day sprint."] },
        ],
      },
      markdown: "",
      metadata: { researchRunId: research.researchRunId, generatedAt: new Date().toISOString(), sourceCount: research.snapshots.length },
    };
    draft.markdown = renderMarkdown(draft);
    return draft;
  }
}

function priorityFromScore(score: number): FrictionAuditPillar["priority"] { return score < 40 ? "Critical" : score < 55 ? "High" : score < 70 ? "Medium" : "Low"; }
function systemsFor(pillars: FrictionAuditPillar[]): string[] {
  const lowest = [...pillars].sort((a, b) => a.score - b.score).slice(0, 3).map((pillar) => pillar.pillar);
  const systems = new Map<string, string>([["Discovery", "Demand Intelligence System"], ["Conversion", "Conversion Path System"], ["Response", "Lead Response System"], ["Operations", "Client Operations System"], ["Customer Experience", "Customer Experience System"], ["Business Intelligence", "Growth Intelligence System"], ["Growth Execution", "Growth Execution System"]]);
  return lowest.map((pillar) => systems.get(pillar) ?? `${pillar} System`);
}
function renderMarkdown(draft: FrictionAuditDraft): string {
  const list = (items: string[]) => items.length ? items.map((item) => `- ${item}`).join("\n") : "- Validate during the strategy session.";
  return [
    `# ${draft.intake.companyName} — Ellis AI Studio Friction Audit`,
    "", "## Intake", `- Contact: ${draft.intake.contactName} (${draft.intake.email})`, `- Website: ${draft.intake.websiteUrl}`, `- Service area: ${draft.intake.serviceArea}`, `- Primary service: ${draft.intake.primaryService}`,
    "", "## Executive Summary", "### Top opportunities", list(draft.executiveSummary.topOpportunities), "### Highest-impact quick wins", list(draft.executiveSummary.quickWins), "### Recommended Ellis AI Studio systems", list(draft.executiveSummary.recommendedSystems),
    "", "## Research Observations", ...Object.entries(draft.research).flatMap(([section, observations]) => [`### ${section.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}`, list(observations)]),
    "", "## Ellis Friction Framework", ...draft.pillars.flatMap((pillar) => [`### ${pillar.pillar} — ${pillar.score}/100 (${pillar.priority})`, "Evidence:", list(pillar.evidence), `Business impact: ${pillar.businessImpact}`]),
    "", "## 30-Day Implementation Roadmap", ...draft.executiveSummary.roadmap30Days.flatMap((week) => [`### ${week.week}`, list(week.actions)]),
    "", "---", "Internal draft for Ellis AI Studio review. Validate evidence and edit recommendations before client presentation.",
  ].join("\n");
}
