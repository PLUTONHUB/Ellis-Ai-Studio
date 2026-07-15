import type { JsonValue } from "~/types/research";

export type PlutoResearchFact = {
  factType: string;
  predicate: string;
  value: JsonValue;
  sourceUrl: string;
  confidence: number;
};

export type PlutoResearchSummary = {
  businessName: string;
  websiteUrl: string;
  researchRunId: string;
  status: "completed" | "failed";
  pageTitle: string | null;
  sourceUrl: string;
  pageDescription: string | null;
  fetchedAt: string;
  factCount: number;
  facts: PlutoResearchFact[];
  sources: string[];
  findings: Array<{ title: string; summary: string; confidence: number }>;
  recommendations: Array<{ priority: number; title: string; rationale: string; action: string }>;
};

export type PlutoRuntimeResponse =
  | { kind: "message"; message: string }
  | { kind: "research"; message: string; research: PlutoResearchSummary };
