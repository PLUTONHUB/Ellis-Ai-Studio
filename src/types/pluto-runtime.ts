export type PlutoResearchSummary = {
  businessName: string;
  websiteUrl: string;
  researchRunId: string;
  pageTitle: string | null;
  sourceUrl: string;
  fetchedAt: string;
  factCount: number;
  findings: Array<{ title: string; summary: string; confidence: number }>;
  recommendations: Array<{ priority: number; title: string; action: string }>;
};

export type PlutoRuntimeResponse =
  | { kind: "message"; message: string }
  | { kind: "research"; message: string; research: PlutoResearchSummary };
