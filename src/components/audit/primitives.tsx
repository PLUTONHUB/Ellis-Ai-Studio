/**
 * AI Opportunity Audit — reusable display primitives.
 *
 * These are the pieces that recur across the report, the shareable report URL
 * and (later) proposals and case studies. Each one takes typed audit data and
 * nothing else, so any of them can be lifted into another surface unchanged.
 */

import type { CSSProperties } from "react";
import {
  CONFIDENCE_LABELS,
  CONFIDENCE_STEPS,
  EVIDENCE_COPY,
  MATURITY_COPY,
  MATURITY_STAGES,
  PRIORITY_TIERS,
  PRIORITY_WEIGHTS,
  describeOpportunityScore,
  maturityIndex,
} from "~/lib/audit-scoring";
import type {
  ConfidenceLevel,
  EvidenceClass,
  Finding,
  FlowStep,
  MaturityStage,
  OpportunityScores,
  PriorityTier,
} from "~/types/audit";

const cssVar = (name: string, value: number | string) => ({ [name]: value }) as CSSProperties;

/* ------------------------------------------------------- opportunity score
 * The headline number. It is never rendered without its polarity note: a high
 * score means more room to improve, and on its own the figure reads like a
 * grade, which is the opposite of what it measures.
 */

/** 270° arc, centre (60,60), r=50 — drawn once and filled via pathLength. */
const DIAL_ARC = "M24.645 95.355 A 50 50 0 1 1 95.355 95.355";

export function OpportunityScore({
  score,
  showPolarity = true,
}: {
  score: number;
  showPolarity?: boolean;
}) {
  const { band, reading } = describeOpportunityScore(score);
  return (
    <div className="score">
      <div className="score-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <path className="score-dial-track" d={DIAL_ARC} pathLength={1} />
          <path className="score-dial-value" d={DIAL_ARC} pathLength={1} style={cssVar("--fill", score / 100)} />
        </svg>
        <div className="score-dial-readout">
          <span className="score-number">{score}</span>
          <span className="score-denominator">/ 100</span>
        </div>
      </div>
      <div className="score-body">
        <p className="label">Automation opportunity</p>
        <p className="score-band">{band}</p>
        {showPolarity && (
          <>
            <div className="score-polarity">
              <p>
                <strong>A higher score means more opportunity</strong> — more places where AI,
                automation or better systems could help. It is not a grade, and it does not mean
                the business is performing badly.
              </p>
              <p className="score-scale">
                <span>Less to add</span>
                <span className="score-scale-rule" aria-hidden="true" />
                <span>More to add</span>
              </p>
            </div>
            <p className="small">{reading}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------- maturity indicator */

export function MaturityIndicator({ stage }: { stage: MaturityStage }) {
  const current = maturityIndex(stage);
  return (
    <div className="maturity">
      <p className="label">Digital systems maturity</p>
      <ol className="maturity-ladder">
        {MATURITY_STAGES.map((s, i) => {
          const state = i < current ? "reached" : i === current ? "current" : "ahead";
          return (
            <li className="maturity-step" key={s} data-state={state}>
              <span className="maturity-step-bar" aria-hidden="true" />
              <span className="maturity-step-label">
                {MATURITY_COPY[s].label}
                {state === "current" && <span className="visually-hidden"> — current stage</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="maturity-definition">{MATURITY_COPY[stage].definition}</p>
    </div>
  );
}

/* ---------------------------------------------------------- evidence badge */

export function EvidenceBadge({ evidence }: { evidence: EvidenceClass }) {
  return (
    <span className="evidence-badge" data-evidence={evidence} title={EVIDENCE_COPY[evidence].definition}>
      {EVIDENCE_COPY[evidence].label}
    </span>
  );
}

export function EvidenceBadges({ evidence }: { evidence: readonly EvidenceClass[] }) {
  return (
    <span className="evidence-badges">
      {evidence.map((e) => <EvidenceBadge key={e} evidence={e} />)}
    </span>
  );
}

/** One finding, with its evidence class attached to the statement itself. */
export function FindingRow({ finding }: { finding: Finding }) {
  return (
    <li className="finding" data-evidence={finding.evidence}>
      <EvidenceBadge evidence={finding.evidence} />
      <p className="finding-text">
        {finding.statement}
        {finding.source && <span className="finding-source">Source — {finding.source}</span>}
      </p>
    </li>
  );
}

export function FindingList({ findings }: { findings: readonly Finding[] }) {
  return <ul>{findings.map((f) => <FindingRow key={f.statement} finding={f} />)}</ul>;
}

/** The three-class key, printed once per report so the badges self-explain. */
export function EvidenceKey() {
  return (
    <div className="evidence-key">
      {(["observed", "inferred", "unknown"] as const).map((e) => (
        <div className="evidence-key-row" key={e}>
          <EvidenceBadge evidence={e} />
          <p>{EVIDENCE_COPY[e].definition}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- confidence */

export function ConfidenceIndicator({ level }: { level: ConfidenceLevel }) {
  const filled = CONFIDENCE_STEPS[level];
  return (
    <span className="confidence" data-level={level}>
      <span className="confidence-meter" aria-hidden="true">
        {[1, 2, 3].map((i) => <span className="confidence-seg" key={i} data-on={i <= filled} />)}
      </span>
      <span className="confidence-label">Confidence: {CONFIDENCE_LABELS[level]}</span>
    </span>
  );
}

/* --------------------------------------------------------------- priority */

export function PriorityIndicator({ priority, tier }: { priority: number; tier: PriorityTier }) {
  const { label, tone } = PRIORITY_TIERS[tier];
  return (
    <span className="priority">
      <span className="priority-score">
        {priority}
        <span className="visually-hidden"> out of 100 priority</span>
      </span>
      <span className="priority-tier" data-tone={tone}>{label}</span>
    </span>
  );
}

/** The four sub-scores and the weighting that produced the priority number. */
export function ScoreBreakdown({ scores }: { scores: OpportunityScores }) {
  const rows = [
    ["Impact", scores.impact, PRIORITY_WEIGHTS.impact],
    ["Confidence", scores.confidence, PRIORITY_WEIGHTS.confidence],
    ["Fit", scores.fit, PRIORITY_WEIGHTS.fit],
    ["Implementation ease", scores.implementationEase, PRIORITY_WEIGHTS.implementationEase],
  ] as const;
  return (
    <div className="score-breakdown">
      {rows.map(([label, value]) => (
        <div className="score-breakdown-row" key={label}>
          <span className="score-breakdown-label">{label}</span>
          <span className="score-breakdown-track" aria-hidden="true">
            <span className="score-breakdown-fill" style={cssVar("--value", value)} />
          </span>
          <span className="score-breakdown-value">{value}</span>
        </div>
      ))}
      <p className="score-formula">
        Priority = Impact×{PRIORITY_WEIGHTS.impact} + Confidence×{PRIORITY_WEIGHTS.confidence} + Fit×
        {PRIORITY_WEIGHTS.fit} + Ease×{PRIORITY_WEIGHTS.implementationEase}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ system flow */

/**
 * An ordered chain of steps. Horizontal where there's room, vertical on a phone.
 *
 * The connector is rendered *before* its node rather than after the previous
 * one: when the chain wraps, a leading arrow reads as a continuation onto the
 * next line, where a trailing arrow would be left dangling at the line end.
 */
export function SystemFlow({ steps }: { steps: readonly FlowStep[] }) {
  return (
    <div className="system-flow">
      {steps.map((step, i) => (
        <span className="system-flow-step" key={step.label}>
          {i > 0 && <span className="system-flow-arrow" aria-hidden="true">→</span>}
          <span className="system-flow-node" data-emphasis={step.emphasis ? "true" : undefined}>
            {step.label}
          </span>
        </span>
      ))}
    </div>
  );
}
