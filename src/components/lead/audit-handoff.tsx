/**
 * The Audit → Lead Intelligence handoff.
 *
 * When someone arrives from a finished AI Opportunity Audit they are not
 * starting a new product; they are continuing one they already began. This
 * band is what makes that continuity visible: it carries their business, the
 * opportunity the audit prioritised, its priority number and its evidence
 * classes straight across, using the audit's own primitives so the treatment
 * is literally the same one they were just looking at.
 *
 * Deliberately not a dashboard. It is a band, not a second report — the point
 * is to hand over context and then get out of the way of the intake.
 */

import { ConfidenceIndicator, EvidenceBadges } from "~/components/audit/primitives";
import type { AuditLeadContext } from "~/types/lead";

export function AuditHandoff({ context }: { context: AuditLeadContext }) {
  const top = context.topOpportunity;
  const meta = [context.website, context.industry, context.location].filter(Boolean) as string[];

  return (
    <aside className="handoff enter" aria-labelledby="handoff-title">
      <div className="handoff-rail" aria-hidden="true">
        <span className="handoff-rail-node" data-state="done" />
        <span className="handoff-rail-line" />
        <span className="handoff-rail-node" data-state="current" />
      </div>

      <div className="handoff-body">
        <p className="label">Continued from your AI Opportunity Audit</p>

        <div className="handoff-identity">
          <h2 className="handoff-business" id="handoff-title">{context.businessName ?? "Your business"}</h2>
          {meta.length > 0 && (
            <ul className="inline-meta">
              {meta.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </div>

        {top && (
          <div className="handoff-opportunity">
            <div className="handoff-opportunity-main">
              <p className="label label-quiet">Opportunity identified</p>
              <p className="handoff-opportunity-name">{top.name}</p>
              <div className="handoff-opportunity-meta">
                <EvidenceBadges evidence={top.evidence} />
                <ConfidenceIndicator level={top.confidence} />
              </div>
            </div>
            <div className="handoff-priority">
              <span className="handoff-priority-value">{top.score}</span>
              <span className="handoff-priority-label">Audit priority</span>
            </div>
          </div>
        )}

        <p className="handoff-note">
          The audit read what your business shows the world and scored this as the highest-priority
          opportunity. What it could not see is how the process actually runs inside the business —
          that is what the next few questions are for.
        </p>

        {context.evidence.length > 0 && (
          <details className="handoff-evidence">
            <summary>
              <span>What the audit based this on</span>
              <span className="handoff-evidence-toggle" aria-hidden="true" />
            </summary>
            <ul className="handoff-evidence-list">
              {context.evidence.map((finding) => (
                <li key={finding.statement} data-evidence={finding.evidence}>
                  <span className="handoff-evidence-class">{finding.evidence}</span>
                  <span>{finding.statement}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </aside>
  );
}
