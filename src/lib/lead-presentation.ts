/**
 * Ellis Lead Intelligence — the presentation layer.
 *
 * Everything here is display-only. It maps the values the engine already
 * produces onto labels, tones and diagram shapes so both the public surface
 * and the internal console read the same way. It calculates nothing:
 *
 *  - no scores, no thresholds, no qualification decisions
 *  - no pipeline transitions, no persistence, no network
 *
 * The one place display and logic could drift — the qualification bands drawn
 * on the internal score scale — is pinned to `classifyLead` by a test rather
 * than trusted to stay in sync by hand.
 */

import { ELLIS_SYSTEMS, isEllisSystemKey, type EllisSystemKey } from "~/lib/lead-taxonomy";
import type { FlowStep } from "~/types/audit";
import type {
  LeadAnalysisStatus,
  LeadProblemCategory,
  LeadSource,
  LeadUrgency,
  PipelineStatus,
  QualificationClass,
  RecommendedNextAction,
} from "~/types/lead";

/* ---------------------------------------------------------------- wording */

export const URGENCY_LABELS: Record<LeadUrgency, string> = {
  immediate: "Immediate",
  within_30_days: "Within 30 days",
  one_to_three_months: "1–3 months",
  three_to_six_months: "3–6 months",
  exploring: "Exploring",
};

/** The intake radio group: order runs from least to most pressing. */
export const URGENCY_CHOICES: readonly { value: LeadUrgency; label: string; detail: string }[] = [
  { value: "exploring", label: "Exploring", detail: "Understanding what is possible." },
  { value: "three_to_six_months", label: "3–6 months", detail: "On the roadmap, not yet scheduled." },
  { value: "one_to_three_months", label: "1–3 months", detail: "Planning to act this quarter." },
  { value: "within_30_days", label: "Within 30 days", detail: "Ready to move once the plan is clear." },
  { value: "immediate", label: "Immediate", detail: "It is costing the business now." },
];

export const PROBLEM_CATEGORY_LABELS: Record<LeadProblemCategory, string> = {
  acquisition: "Acquisition",
  conversion: "Conversion",
  lead_management: "Lead Management",
  customer_experience: "Customer Experience",
  operations: "Operations",
  growth: "Growth",
  intelligence: "Intelligence",
  other: "Uncategorized",
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  direct_intake: "Direct intake",
  audit_handoff: "Audit handoff",
  business_bottleneck_audit: "Bottleneck Audit",
  contact_page: "Contact page",
  internal_demo: "Internal demo",
};

export const PIPELINE_LABELS: Record<PipelineStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  discovery: "Discovery",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
  nurture: "Nurture",
};

/**
 * Pipeline tone, in the Ellis palette only — no red/amber/green status
 * lights. `open` is the working middle of the pipeline, `live` the stages
 * carrying real momentum, `closed` the settled ones.
 */
export const PIPELINE_TONE: Record<PipelineStatus, "new" | "open" | "live" | "closed" | "quiet"> = {
  new: "new",
  reviewed: "open",
  contacted: "open",
  discovery: "live",
  proposal: "live",
  won: "closed",
  lost: "quiet",
  nurture: "quiet",
};

/** Stages that still represent an opportunity someone should be working. */
export const ACTIVE_PIPELINE_STATUSES: readonly PipelineStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "discovery",
  "proposal",
];

export const ANALYSIS_STATUS_LABELS: Record<LeadAnalysisStatus, string> = {
  pending: "Queued",
  analyzing: "Analyzing",
  complete: "Complete",
  failed: "Needs attention",
};

/* ------------------------------------------------------------ next action */

/**
 * Two vocabularies for one value, on purpose.
 *
 * `INTERNAL_NEXT_ACTION` is Ellis's own instruction and stays behind the
 * dashboard gate. `publicNextStep` is what the prospect is allowed to see: the
 * same routing decision expressed as a next step for them, never as a verdict
 * on them. Nothing here reveals a score, a class or a confidence figure.
 */
export const INTERNAL_NEXT_ACTION: Record<RecommendedNextAction, { label: string; detail: string }> = {
  strategy_call: { label: "Book a strategy call", detail: "Strong enough to open a direct conversation now." },
  process_mapping: { label: "Run process mapping", detail: "The fit looks real; map the workflow before proposing." },
  request_more_information: { label: "Request more information", detail: "Too little confirmed context to qualify confidently." },
  nurture: { label: "Move to nurture", detail: "Genuine problem, no present urgency." },
  decline_or_refer: { label: "Decline or refer", detail: "Outside what Ellis builds — refer rather than pursue." },
  manual_review: { label: "Review manually", detail: "The signals do not resolve to a clear route." },
};

export function publicNextStep(action: RecommendedNextAction): { title: string; detail: string } {
  switch (action) {
    case "strategy_call":
      return {
        title: "Review this with Ellis AI Studio",
        detail: "There is enough here to walk through the workflow together and scope what a system would need to do.",
      };
    case "process_mapping":
      return {
        title: "Map the current workflow together",
        detail: "The next step is a working session that traces what actually happens today, end to end, before anything is designed.",
      };
    case "request_more_information":
      return {
        title: "A short conversation to fill in the gaps",
        detail: "A few operational details would sharpen this considerably — they are the questions listed above.",
      };
    case "nurture":
      return {
        title: "Stay in touch as this becomes a priority",
        detail: "The problem is real and worth solving. We will keep this on file and pick it up whenever the timing is right.",
      };
    case "decline_or_refer":
      return {
        title: "A conversation to point you in the right direction",
        detail: "This may sit outside the systems Ellis builds. A short conversation is still the fastest way to find the right answer.",
      };
    case "manual_review":
      return {
        title: "Ellis will read this personally",
        detail: "This one deserves a human read before anything is recommended. Expect a considered reply rather than an automatic one.",
      };
  }
}

/* ------------------------------------------------------- qualification */

/**
 * The display bands for the internal score scale.
 *
 * These mirror `classifyLead` and are asserted against it in the test suite,
 * so the scale can never drift from the scoring engine that owns the numbers.
 */
export const QUALIFICATION_BANDS: readonly {
  key: QualificationClass;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: "poor_fit", label: "Poor Fit", min: 0, max: 34 },
  { key: "nurture", label: "Nurture", min: 35, max: 54 },
  { key: "qualified", label: "Qualified", min: 55, max: 69 },
  { key: "strong_fit", label: "Strong Fit", min: 70, max: 84 },
  { key: "priority_lead", label: "Priority Lead", min: 85, max: 100 },
];

/**
 * Tone follows the audit's priority grammar exactly: rust is the reserved
 * high-stakes accent and marks the top class only, green carries the next,
 * and the lower classes step down into the neutral register. Nothing is red,
 * amber or green-as-good.
 */
export const QUALIFICATION_TONE: Record<QualificationClass, "rust" | "green" | "quiet" | "faint"> = {
  priority_lead: "rust",
  strong_fit: "green",
  qualified: "green",
  nurture: "quiet",
  poor_fit: "faint",
};

export const QUALIFICATION_DEFINITION: Record<QualificationClass, string> = {
  priority_lead: "A clearly described problem Ellis builds for, with urgency and enough confirmed context to act on.",
  strong_fit: "The problem maps to an Ellis system and the context supports it. Worth scoping.",
  qualified: "A real operational problem, with detail still to confirm before scoping.",
  nurture: "Genuine, but early — either exploratory or thin on confirmed operational context.",
  poor_fit: "Outside the systems Ellis builds, or too little signal to place at all.",
};

export function confidenceReading(confidence: number): string {
  if (confidence >= 75) return "The submission confirmed enough about the workflow to assess it directly.";
  if (confidence >= 55) return "Enough context to place the problem, with operational detail still unconfirmed.";
  return "Thin context. Treat the assessment as provisional until more of the workflow is confirmed.";
}

/* -------------------------------------------------------- evidence class */

export type LeadEvidenceType = "user_confirmed" | "audit_observed" | "audit_inferred";

/**
 * The trust model, made visible.
 *
 * Confirmed is what the prospect told us. Observed is what the audit could
 * see from outside. Inferred is reasoning from public signals and is drawn
 * dashed and hollow everywhere, so it can never read as established fact.
 */
export const LEAD_EVIDENCE_COPY: Record<LeadEvidenceType, { label: string; definition: string }> = {
  user_confirmed: {
    label: "User confirmed",
    definition: "Stated directly in the submission by someone inside the business.",
  },
  audit_observed: {
    label: "Audit observed",
    definition: "Seen in public information during the AI Opportunity Audit.",
  },
  audit_inferred: {
    label: "Audit inferred",
    definition: "Reasoned from public signals during the audit. Not a confirmed fact about the business.",
  },
};

/* ------------------------------------------------------------- activity */

export const ACTIVITY_LABELS: Record<string, string> = {
  lead_created: "Lead created",
  audit_attached: "Audit context attached",
  analysis_started: "Analysis started",
  analysis_failed: "Analysis failed",
  qualification_completed: "Qualification completed",
  status_changed: "Pipeline status changed",
  business_bottleneck_audit_submitted: "Business Bottleneck Audit submitted",
};

export function activityLabel(type: string): string {
  return ACTIVITY_LABELS[type] ?? type.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/* ---------------------------------------------------------- system flows */

/**
 * The customer-facing shape of each Ellis system.
 *
 * This is a diagram, not a specification — it exists so the prospect can see
 * what is being described rather than read the name of a product. The flows
 * use the same `FlowStep` contract as the audit's proposed systems, so the
 * same `SystemFlow` component draws both and the two surfaces stay visually
 * identical. `emphasis` marks the step where AI judgement happens.
 */
const SYSTEM_FLOWS: Record<EllisSystemKey, readonly FlowStep[]> = {
  lead_intake: [
    { label: "Inquiry arrives" },
    { label: "Captured and standardized", emphasis: true },
    { label: "Complete record" },
    { label: "Routed to the team" },
  ],
  lead_qualification: [
    { label: "New inquiry" },
    { label: "Qualified against your rules", emphasis: true },
    { label: "Prioritized" },
    { label: "Routed to the right person" },
  ],
  lead_response: [
    { label: "Website inquiry" },
    { label: "AI qualification", emphasis: true },
    { label: "Routing" },
    { label: "Immediate response" },
    { label: "Follow-up" },
  ],
  lead_follow_up: [
    { label: "Qualified lead" },
    { label: "Follow-up scheduled", emphasis: true },
    { label: "Sequenced touchpoints" },
    { label: "Handoff when they re-engage" },
  ],
  crm_integration: [
    { label: "Lead and customer activity" },
    { label: "Mapped between systems", emphasis: true },
    { label: "Single record of truth" },
    { label: "Every tool stays current" },
  ],
  scheduling: [
    { label: "Customer requests time" },
    { label: "Availability and routing rules", emphasis: true },
    { label: "Booked appointment" },
    { label: "Reminders and updates" },
  ],
  review_generation: [
    { label: "Job completed" },
    { label: "Timing and eligibility check", emphasis: true },
    { label: "Review request" },
    { label: "Response handled" },
  ],
  customer_support: [
    { label: "Customer question" },
    { label: "Answered or triaged", emphasis: true },
    { label: "Escalation to the right person" },
    { label: "Resolution recorded" },
  ],
  estimate_intake: [
    { label: "Estimate request" },
    { label: "Structured and checked", emphasis: true },
    { label: "Complete brief for the team" },
    { label: "Quote returned" },
  ],
  content_operations: [
    { label: "Content request" },
    { label: "Drafted and routed", emphasis: true },
    { label: "Approval" },
    { label: "Published on schedule" },
  ],
  reporting: [
    { label: "Business activity" },
    { label: "Collected and reconciled", emphasis: true },
    { label: "Reporting layer" },
    { label: "Recurring visibility" },
  ],
  executive_intelligence: [
    { label: "Operational data" },
    { label: "Interpreted for decisions", emphasis: true },
    { label: "Decision-ready summary" },
    { label: "Delivered on a rhythm" },
  ],
  retention: [
    { label: "Customer activity" },
    { label: "Retention signals read", emphasis: true },
    { label: "Follow-up action" },
    { label: "Relationship maintained" },
  ],
  workflow_automation: [
    { label: "Work arrives" },
    { label: "Steps executed automatically", emphasis: true },
    { label: "Exceptions raised to a person" },
    { label: "Completed and logged" },
  ],
  system_integration: [
    { label: "Fragmented systems" },
    { label: "Connected and mapped", emphasis: true },
    { label: "Information moves reliably" },
    { label: "One consistent picture" },
  ],
  custom_system: [
    { label: "Your current process" },
    { label: "Discovery and mapping", emphasis: true },
    { label: "System design" },
    { label: "Build and hand over" },
  ],
};

export function systemFlow(key: string): readonly FlowStep[] {
  return SYSTEM_FLOWS[isEllisSystemKey(key) ? key : "custom_system"];
}

export function systemName(key: string): string {
  return ELLIS_SYSTEMS[isEllisSystemKey(key) ? key : "custom_system"].name;
}

export function systemDescription(key: string): string {
  return ELLIS_SYSTEMS[isEllisSystemKey(key) ? key : "custom_system"].description;
}

/* ---------------------------------------------------------------- format */

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
