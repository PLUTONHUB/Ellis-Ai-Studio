import type { EvidenceClass, MaturityStage } from "~/types/audit";

export const LEAD_SOURCES = ["direct_intake", "audit_handoff", "contact_page", "internal_demo"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export const PIPELINE_STATUSES = ["new", "reviewed", "contacted", "discovery", "proposal", "won", "lost", "nurture"] as const;
export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];
export const LEAD_ANALYSIS_STATUSES = ["pending", "analyzing", "complete", "failed"] as const;
export type LeadAnalysisStatus = (typeof LEAD_ANALYSIS_STATUSES)[number];
export const URGENCY_OPTIONS = ["immediate", "within_30_days", "one_to_three_months", "three_to_six_months", "exploring"] as const;
export type LeadUrgency = (typeof URGENCY_OPTIONS)[number];
export const PROBLEM_CATEGORIES = ["acquisition", "conversion", "lead_management", "customer_experience", "operations", "growth", "intelligence", "other"] as const;
export type LeadProblemCategory = (typeof PROBLEM_CATEGORIES)[number];
export const NEXT_ACTIONS = ["strategy_call", "process_mapping", "request_more_information", "nurture", "decline_or_refer", "manual_review"] as const;
export type RecommendedNextAction = (typeof NEXT_ACTIONS)[number];
export type QualificationClass = "priority_lead" | "strong_fit" | "qualified" | "nurture" | "poor_fit";

export type AuditLeadContext = {
  auditId: string;
  businessName?: string;
  website?: string;
  industry?: string;
  location?: string;
  automationOpportunityScore?: number;
  systemsMaturity?: MaturityStage;
  topOpportunity?: { id: string; name: string; score: number; evidence: EvidenceClass[]; confidence: "high" | "medium" | "low" };
  evidence: Array<{ statement: string; evidence: EvidenceClass; source?: string }>;
};

export type LeadIntake = {
  requestId: string;
  source: LeadSource;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName: string;
  website?: string;
  industry?: string;
  location?: string;
  businessSize?: string;
  primaryChallenge: string;
  desiredOutcome: string;
  urgency: LeadUrgency;
  additionalContext?: string;
  approximateMonthlyLeadVolume?: string;
  currentTools?: string;
  currentProcess?: string;
  biggestManualBottleneck?: string;
  auditContext?: AuditLeadContext;
};

export type LeadInterpretation = {
  summary: string;
  primaryProblemCategory: LeadProblemCategory;
  secondaryProblemCategories: LeadProblemCategory[];
  identifiedProblems: Array<{ title: string; description: string; evidence: string[]; evidenceType: "user_confirmed" | "audit_observed" | "audit_inferred" }>;
  recommendedSystem: { key: string; name: string; rationale: string };
  intentSignals: string[];
  impactSignals: string[];
  urgencySignals: string[];
  implementationSignals: string[];
  uncertainty: string[];
  discoveryQuestions: string[];
  reasoningSummary: string;
};

export type LeadScores = { problemFit: number; potentialImpact: number; urgency: number; implementationFit: number; intent: number; opportunityScore: number; qualificationConfidence: number; qualificationClass: QualificationClass };
export type LeadPublicResult = { id: string; summary: string; primaryProblemCategory: LeadProblemCategory; recommendedSystem: { key: string; name: string; description: string }; discoveryQuestions: string[]; nextStep: RecommendedNextAction; validationNeeded: string[] };
export type LeadActivity = { id: string; leadId: string; type: string; createdAt: string; metadata?: Record<string, string | number | boolean | null> };
