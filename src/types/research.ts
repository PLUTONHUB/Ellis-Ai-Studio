export type ResearchRunStatus = "running" | "completed" | "failed";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export type BusinessIdentity = {
  name: string;
  websiteUrl: string;
};

export type Business = BusinessIdentity & {
  id: string;
  businessKey: string;
  canonicalWebsiteUrl: string;
};

export type WebsiteSnapshot = {
  id: string;
  businessId: string;
  researchRunId: string;
  sourceUrl: string;
  pageTitle: string | null;
  fetchedAt: string;
  contentSha256: string;
  contentType: string;
  httpStatus: number;
  bodyText: string;
  metadata: JsonObject;
};

export type ExtractedFact = {
  factType: "business_name" | "email" | "phone" | "address" | "social_profile" | "service" | "metadata";
  subject: string;
  predicate: string;
  value: JsonValue;
  sourceUrl: string;
  pageTitle: string | null;
  extractedAt: string;
  confidence: number;
  researchRunId: string;
  websiteSnapshotId?: string;
  factFingerprint: string;
};

export type Finding = {
  findingType: string;
  title: string;
  summary: string;
  evidence: string[];
  confidence: number;
  findingFingerprint: string;
};

export type Recommendation = {
  findingFingerprint?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  title: string;
  rationale: string;
  action: string;
  recommendationFingerprint: string;
};

export type ResearchResult = {
  business: Business;
  researchRunId: string;
  status: Exclude<ResearchRunStatus, "running">;
  snapshot: WebsiteSnapshot;
  snapshots: WebsiteSnapshot[];
  facts: ExtractedFact[];
  findings: Finding[];
  recommendations: Recommendation[];
  intelligence: IntelligenceReport;
};

export type IntelligencePriority = "Critical" | "High" | "Medium" | "Low";
export type IntelligenceRecommendation = { priority: IntelligencePriority; title: string; estimatedRevenueImpact: string; estimatedImplementationEffort: string; supportingEvidence: string[]; action: string };
export type FrictionAnalysis = { pillar: string; score: number; evidence: string[]; whyItMatters: string; estimatedBusinessImpact: string; recommendedFix: string };
export type IntelligenceReport = {
  executiveSummary: { businessName: string; industry: string; description: string; confidence: number };
  businessProfile: { services: Record<string, string[]>; products: string[]; serviceAreas: string[]; locations: string[]; contacts: { phones: string[]; emails: string[] }; socialLinks: string[]; operatingHours: string[] };
  trustSignals: { reviews: string[]; certifications: string[]; awards: string[]; testimonials: string[]; guarantees: string[]; yearsInBusiness: string[] };
  digitalPresence: { websiteQuality: string[]; mobileFriendliness: string[]; navigation: string[]; missingPages: string[]; contactAccessibility: string[] };
  conversionOpportunities: string[];
  frictionAnalysis: FrictionAnalysis[];
  priorityRecommendations: IntelligenceRecommendation[];
};

export type RunResearchInput = BusinessIdentity & {
  idempotencyKey: string;
};

export type MemoryInput = {
  businessId: string;
  memoryKey: string;
  value: JsonValue;
  source: string;
  confidence: number;
  recordedAt?: string;
};
