import type { IntelligencePriority, JsonObject } from "~/types/research";

export type FrictionAuditIntake = {
  companyName: string;
  websiteUrl: string;
  contactName: string;
  email: string;
  serviceArea: string;
  primaryService: string;
};

export type FrictionAuditPillar = {
  pillar: "Discovery" | "Conversion" | "Response" | "Operations" | "Customer Experience" | "Business Intelligence" | "Growth Execution";
  score: number;
  evidence: string[];
  businessImpact: string;
  priority: IntelligencePriority;
};

export type FrictionAuditDraft = {
  intake: FrictionAuditIntake;
  research: { website: string[]; businessOverview: string[]; leadGeneration: string[]; customerExperience: string[]; marketing: string[]; technicalIssues: string[]; revenueFriction: string[] };
  pillars: FrictionAuditPillar[];
  executiveSummary: { topOpportunities: string[]; quickWins: string[]; recommendedSystems: string[]; roadmap30Days: { week: string; actions: string[] }[] };
  markdown: string;
  metadata: JsonObject;
};
