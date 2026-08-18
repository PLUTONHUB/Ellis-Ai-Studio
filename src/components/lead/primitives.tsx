/**
 * Ellis Lead Intelligence — display primitives.
 *
 * These are the instruments the internal console reads by. They deliberately
 * sit alongside the audit's primitives rather than replacing them:
 *
 *  - The audit's headline is a 270° dial reading *Automation Opportunity*.
 *    Lead Intelligence's headline is a numeral on a banded scale reading
 *    *Opportunity Score*. Same family, unmistakably a different instrument,
 *    so nobody confuses one number for the other.
 *  - Sub-scores reuse the audit's `.score-breakdown` bars verbatim. The two
 *    products should feel like one system when opened side by side.
 *  - Qualification and pipeline tone use the audit's `rust / green / quiet /
 *    faint` grammar. Nothing here is a red-amber-green status light.
 *
 * Every component takes typed values and nothing else. None of them compute a
 * score, a class or a threshold — those arrive already decided by the engine.
 */

import type { CSSProperties } from "react";
import { qualificationLabel } from "~/lib/lead-scoring";
import {
  LEAD_EVIDENCE_COPY,
  PIPELINE_LABELS,
  PIPELINE_TONE,
  QUALIFICATION_BANDS,
  QUALIFICATION_DEFINITION,
  QUALIFICATION_TONE,
  type LeadEvidenceType,
} from "~/lib/lead-presentation";
import type { PipelineStatus, QualificationClass } from "~/types/lead";

const cssVar = (name: string, value: number | string) => ({ [name]: value }) as CSSProperties;

/* ------------------------------------------------------- opportunity score
 * The internal headline. Higher means a stronger qualified opportunity for
 * Ellis — the opposite polarity to the audit's score, which is why the two are
 * drawn as different instruments and always carry their own label.
 */

export function OpportunityIndex({
  score,
  qualification,
  compact = false,
}: {
  score: number;
  qualification: QualificationClass;
  compact?: boolean;
}) {
  return (
    <div className="opportunity-index" data-compact={compact ? "true" : undefined}>
      <div className="opportunity-index-head">
        {/* In a list the heading is stated once, above the rows — repeating it
            on every row is noise, but the number still needs naming for a
            screen reader. */}
        <p className={compact ? "visually-hidden" : "label"}>Opportunity score</p>
        <p className="opportunity-index-value">
          <span className="opportunity-index-number">{score}</span>
          <span className="opportunity-index-denominator">/ 100</span>
        </p>
      </div>

      <div className="qual-scale">
        <div className="qual-scale-bands" aria-hidden="true">
          {QUALIFICATION_BANDS.map((band) => (
            <span
              className="qual-scale-band"
              key={band.key}
              data-tone={QUALIFICATION_TONE[band.key]}
              data-current={band.key === qualification ? "true" : undefined}
              style={cssVar("--span", band.max - band.min + 1)}
            />
          ))}
        </div>
        <span className="qual-scale-marker" style={cssVar("--at", score / 100)} aria-hidden="true" />
      </div>

      {!compact && (
        <div className="opportunity-index-foot">
          <QualificationBadge qualification={qualification} />
          <p className="small">{QUALIFICATION_DEFINITION[qualification]}</p>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- qualification */

export function QualificationBadge({
  qualification,
  size = "default",
}: {
  qualification: QualificationClass;
  size?: "default" | "small";
}) {
  return (
    <span className="qual-badge" data-tone={QUALIFICATION_TONE[qualification]} data-size={size}>
      {qualificationLabel(qualification)}
    </span>
  );
}

/* ------------------------------------------------------------- confidence */

/**
 * Qualification confidence: how much the assessment can be trusted, not how
 * good the lead is. Drawn as a segmented meter so it never reads as a second
 * score competing with the first.
 */
export function ConfidenceMeter({
  confidence,
  reading,
}: {
  confidence: number;
  reading?: string;
}) {
  const filled = Math.round((confidence / 100) * 5);
  return (
    <div className="confidence-block">
      <div className="confidence-block-head">
        <p className="label">Qualification confidence</p>
        <p className="confidence-block-value">{confidence}<span>/ 100</span></p>
      </div>
      <span className="confidence-meter confidence-meter-wide" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span className="confidence-seg" key={i} data-on={i <= filled} />
        ))}
      </span>
      {reading && <p className="small">{reading}</p>}
    </div>
  );
}

/* --------------------------------------------------------- score breakdown
 * The audit's bar rows, reused class-for-class. The weights are Ellis's
 * published deterministic formula and are printed so the number is never a
 * black box — the values themselves arrive already calculated.
 */

export function LeadScoreBreakdown({
  scores,
}: {
  scores: {
    problemFit: number;
    potentialImpact: number;
    urgency: number;
    implementationFit: number;
    intent: number;
  };
}) {
  const rows = [
    ["Problem fit", scores.problemFit, 30],
    ["Potential impact", scores.potentialImpact, 25],
    ["Implementation fit", scores.implementationFit, 20],
    ["Intent", scores.intent, 15],
    ["Urgency", scores.urgency, 10],
  ] as const;

  return (
    <div className="score-breakdown">
      {rows.map(([label, value, weight]) => (
        <div className="score-breakdown-row score-breakdown-row-weighted" key={label}>
          <span className="score-breakdown-label">{label}</span>
          <span className="score-breakdown-track" aria-hidden="true">
            <span className="score-breakdown-fill" style={cssVar("--value", value)} />
          </span>
          <span className="score-breakdown-value">{value}</span>
          <span className="score-breakdown-weight">×{weight}%</span>
        </div>
      ))}
      <p className="score-formula">
        Opportunity score = Problem fit×30% + Potential impact×25% + Implementation fit×20% +
        Intent×15% + Urgency×10%
      </p>
    </div>
  );
}

/* ---------------------------------------------------------- evidence class
 * Confirmed is solid. Observed is solid but hollow-dotted. Inferred is always
 * dashed and hollow — the same rule the audit applies, so an inference can
 * never be mistaken for something the business confirmed.
 */

export function LeadEvidenceBadge({ evidence }: { evidence: LeadEvidenceType }) {
  const copy = LEAD_EVIDENCE_COPY[evidence];
  return (
    <span className="lead-evidence" data-evidence={evidence} title={copy.definition}>
      {copy.label}
    </span>
  );
}

/** One interpreted problem, with its evidence class attached to the claim. */
export function EvidenceStatement({
  evidence,
  title,
  description,
  support = [],
}: {
  evidence: LeadEvidenceType;
  title: string;
  description: string;
  support?: readonly string[];
}) {
  return (
    <li className="lead-finding" data-evidence={evidence}>
      <div className="lead-finding-head">
        <h4 className="lead-finding-title">{title}</h4>
        <LeadEvidenceBadge evidence={evidence} />
      </div>
      <p className="lead-finding-text">{description}</p>
      {support.length > 0 && (
        <ul className="lead-finding-support">
          {support.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
    </li>
  );
}

/** The three-class key, printed once wherever evidence badges appear. */
export function LeadEvidenceKey() {
  return (
    <div className="evidence-key">
      {(["user_confirmed", "audit_observed", "audit_inferred"] as const).map((e) => (
        <div className="evidence-key-row" key={e}>
          <LeadEvidenceBadge evidence={e} />
          <p>{LEAD_EVIDENCE_COPY[e].definition}</p>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- pipeline */

export function PipelineBadge({ status }: { status: PipelineStatus }) {
  return (
    <span className="pipeline-badge" data-tone={PIPELINE_TONE[status]}>
      {PIPELINE_LABELS[status]}
    </span>
  );
}

/* --------------------------------------------------------------- stat tile */

export function StatTile({
  value,
  label,
  detail,
  tone,
}: {
  value: number | string;
  label: string;
  detail?: string;
  tone?: "rust" | "green" | "quiet";
}) {
  return (
    <div className="stat-tile" data-tone={tone}>
      <span className="stat-tile-value">{value}</span>
      <span className="stat-tile-label">{label}</span>
      {detail && <span className="stat-tile-detail">{detail}</span>}
    </div>
  );
}
