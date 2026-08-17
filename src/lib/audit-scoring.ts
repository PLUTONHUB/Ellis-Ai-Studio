/**
 * The AI Opportunity Audit scoring model.
 *
 * Pure functions, no framework imports — the fixture, the future analysis
 * backend and the UI all derive priority the same way, so a displayed tier can
 * never drift from the numbers printed beside it.
 */

import type {
  ConfidenceLevel,
  MaturityStage,
  Opportunity,
  OpportunityScores,
  Pillar,
  PillarId,
  PriorityTier,
} from "~/types/audit";

/* ---------------------------------------------------------------- priority */

/** The published weighting. Impact dominates; ease is a tiebreaker, not a driver. */
export const PRIORITY_WEIGHTS = {
  impact: 0.4,
  confidence: 0.25,
  fit: 0.25,
  implementationEase: 0.1,
} as const;

/** Impact x0.40 + Confidence x0.25 + Fit x0.25 + Implementation Ease x0.10. */
export function calculatePriority(scores: OpportunityScores): number {
  const weighted =
    scores.impact * PRIORITY_WEIGHTS.impact +
    scores.confidence * PRIORITY_WEIGHTS.confidence +
    scores.fit * PRIORITY_WEIGHTS.fit +
    scores.implementationEase * PRIORITY_WEIGHTS.implementationEase;
  return Math.round(weighted);
}

export function classifyPriority(priority: number): PriorityTier {
  if (priority >= 85) return "critical";
  if (priority >= 70) return "high";
  if (priority >= 50) return "optimization";
  return "future";
}

/**
 * Display copy for each tier.
 *
 * `tone` drives the visual weight, deliberately not a traffic-light palette:
 * rust is the reserved high-stakes accent and marks Critical only, green
 * carries High, and the lower two tiers step down into the neutral register.
 */
export const PRIORITY_TIERS: Record<
  PriorityTier,
  { label: string; tone: "rust" | "green" | "quiet" | "faint"; range: string }
> = {
  critical: { label: "Critical Opportunity", tone: "rust", range: "85–100" },
  high: { label: "High Opportunity", tone: "green", range: "70–84" },
  optimization: { label: "Optimization", tone: "quiet", range: "50–69" },
  future: { label: "Future Opportunity", tone: "faint", range: "Below 50" },
};

/** Sorted highest-priority first. Stable for equal scores. */
export function byPriority(a: Opportunity, b: Opportunity) {
  return b.priority - a.priority;
}

export function countByTier(opportunities: readonly Opportunity[], tier: PriorityTier) {
  return opportunities.filter((o) => o.tier === tier).length;
}

/** Critical + High — the number a business owner actually reads as "urgent". */
export function highPriorityCount(opportunities: readonly Opportunity[]) {
  return countByTier(opportunities, "critical") + countByTier(opportunities, "high");
}

/* -------------------------------------------------------------- confidence */

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

/** Segments filled in the three-step confidence meter. */
export const CONFIDENCE_STEPS: Record<ConfidenceLevel, number> = { low: 1, medium: 2, high: 3 };

/* ---------------------------------------------------------------- evidence */

export const EVIDENCE_COPY = {
  observed: {
    label: "Observed",
    definition: "Directly supported by available evidence.",
  },
  inferred: {
    label: "Inferred",
    definition: "Reasonably suggested by observable evidence, but not confirmed.",
  },
  unknown: {
    label: "Unknown",
    definition: "Cannot be established using public information.",
  },
} as const;

/* ------------------------------------------------------- opportunity score */

/**
 * How the headline number should be read. The band names describe the size of
 * the opportunity, never the quality of the business — a low score means
 * little apparent room to add systems, which is a good position to be in.
 */
export function describeOpportunityScore(score: number): { band: string; reading: string } {
  if (score >= 80) {
    return {
      band: "High potential",
      reading: "Several substantial systems could be introduced before anything advanced is needed.",
    };
  }
  if (score >= 60) {
    return {
      band: "Moderate potential",
      reading: "Clear room to improve in specific areas rather than across the whole business.",
    };
  }
  if (score >= 40) {
    return {
      band: "Focused potential",
      reading: "Foundations look reasonable; the openings are targeted rather than structural.",
    };
  }
  return {
    band: "Limited potential",
    reading: "Little apparent room to add systems from what is publicly observable.",
  };
}

/* --------------------------------------------------------------- maturity */

/** Ordered low to high — the ladder the maturity indicator renders. */
export const MATURITY_STAGES: readonly MaturityStage[] = [
  "foundational",
  "developing",
  "connected",
  "automated",
  "intelligent",
] as const;

export const MATURITY_COPY: Record<MaturityStage, { label: string; definition: string }> = {
  foundational: {
    label: "Foundational",
    definition: "A digital presence exists. Work is coordinated manually.",
  },
  developing: {
    label: "Developing",
    definition: "Individual tools are in place, but they operate largely independently.",
  },
  connected: {
    label: "Connected",
    definition: "Core tools share information; handoffs are mostly reliable.",
  },
  automated: {
    label: "Automated",
    definition: "Routine work runs without prompting, with people handling exceptions.",
  },
  intelligent: {
    label: "Intelligent",
    definition: "Systems interpret, decide and report — the business learns from its own data.",
  },
};

export function maturityIndex(stage: MaturityStage) {
  return MATURITY_STAGES.indexOf(stage);
}

/* ----------------------------------------------------------------- pillars */

/** The seven permanent pillars, in the order they appear across the product. */
export const PILLARS: readonly Pillar[] = [
  { id: "acquisition", name: "Acquisition", summary: "How the business becomes visible and gets found." },
  { id: "conversion", name: "Conversion", summary: "How interest turns into an enquiry." },
  { id: "lead-management", name: "Lead Management", summary: "What happens to an enquiry once it arrives." },
  { id: "customer-experience", name: "Customer Experience", summary: "What the customer experiences before, during and after the job." },
  { id: "operations", name: "Operations", summary: "The internal work required to deliver." },
  { id: "growth", name: "Growth", summary: "Repeat work, referrals and reputation." },
  { id: "intelligence", name: "Intelligence", summary: "What the business can see about itself." },
] as const;

const PILLAR_BY_ID = new Map(PILLARS.map((p) => [p.id, p]));

export function pillarName(id: PillarId) {
  return PILLAR_BY_ID.get(id)?.name ?? id;
}

export function pillar(id: PillarId) {
  return PILLAR_BY_ID.get(id);
}
