/**
 * The shapes the lead repository already returns, described for the console.
 *
 * `lead-repository.server.ts` queries Postgres directly and hands back
 * untyped `pg` rows. This file does not change what is stored, queried or
 * returned — it names the columns that already exist so the internal console
 * can read them without an `any` in sight.
 *
 * Timestamps are `string | Date`: `pg` produces a `Date`, and whether it
 * survives the server-function boundary as one is a serializer detail the UI
 * should not care about.
 */

import type { AuditLeadContext, BottleneckAuditContext, LeadAnalysisStatus, LeadInterpretation, LeadSource, LeadUrgency, PipelineStatus, QualificationClass, RecommendedNextAction } from "~/types/lead";

export type Timestamp = string | Date;

/** One row of `listLeads()` — a lead joined to its most recent analysis. */
export type LeadListRow = {
  id: string;
  created_at: Timestamp;
  business_name: string;
  first_name: string;
  last_name: string;
  email: string;
  source: LeadSource;
  pipeline_status: PipelineStatus;
  analysis_status: LeadAnalysisStatus;
  opportunity_score: number | null;
  qualification_confidence: number | null;
  qualification_class: QualificationClass | null;
  recommended_system_key: string | null;
};

/** The operational detail captured behind the first three intake questions. */
export type OperationalContext = {
  businessSize?: string | null;
  approximateMonthlyLeadVolume?: string | null;
  currentTools?: string | null;
  currentProcess?: string | null;
  biggestManualBottleneck?: string | null;
  bottleneckAudit?: BottleneckAuditContext | null;
};

/** A full `public.leads` row. */
export type LeadRow = {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  source: LeadSource;
  pipeline_status: PipelineStatus;
  analysis_status: LeadAnalysisStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  business_name: string;
  website: string | null;
  industry: string | null;
  location: string | null;
  primary_challenge: string;
  desired_outcome: string;
  urgency: LeadUrgency;
  additional_context: string | null;
  operational_context: OperationalContext | null;
  audit_context: AuditLeadContext | null;
};

/** The most recent `public.lead_analyses` row for a lead. */
export type LeadAnalysisRow = {
  id: string;
  lead_id: string;
  created_at: Timestamp;
  interpretation: LeadInterpretation;
  recommended_system_key: string;
  recommended_next_action: RecommendedNextAction;
  problem_fit: number;
  potential_impact: number;
  urgency_score: number;
  implementation_fit: number;
  intent: number;
  opportunity_score: number;
  qualification_confidence: number;
  qualification_class: QualificationClass;
};
