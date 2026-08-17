/**
 * The opportunity card.
 *
 * Progressive disclosure via native <details>. The summary carries everything
 * a skimmer needs to triage — name, pillar, priority, evidence, one line of
 * what was seen. The panel carries the reasoning, the proposed system and the
 * question that would validate it.
 *
 * <details> rather than React state on purpose: it is keyboard-accessible for
 * free, works before hydration, is find-in-page friendly in modern browsers,
 * and prints expanded via a single CSS rule.
 */

import { pillarName } from "~/lib/audit-scoring";
import type { Opportunity } from "~/types/audit";
import {
  ConfidenceIndicator,
  EvidenceBadges,
  FindingList,
  PriorityIndicator,
  ScoreBreakdown,
  SystemFlow,
} from "~/components/audit/primitives";

export function OpportunityCard({
  opportunity,
  defaultOpen = false,
}: {
  opportunity: Opportunity;
  defaultOpen?: boolean;
}) {
  const lead = opportunity.observed[0]?.statement;
  return (
    <details className="opportunity reveal" open={defaultOpen}>
      <summary>
        <div className="opportunity-heading">
          <p className="opportunity-eyebrow">
            <span>{pillarName(opportunity.pillar)}</span>
            <span>{opportunity.type}</span>
          </p>
          <h3 className="opportunity-name">{opportunity.name}</h3>
          {lead && <p className="opportunity-lead">{lead}</p>}
        </div>
        <div className="opportunity-aside">
          <PriorityIndicator priority={opportunity.priority} tier={opportunity.tier} />
          <EvidenceBadges evidence={opportunity.evidence} />
          <span className="opportunity-toggle">
            <span className="open-copy">Open</span>
            <span className="close-copy">Close</span>
          </span>
        </div>
      </summary>

      <div className="opportunity-panel">
        <div className="opportunity-col">
          <div className="opportunity-block">
            <p className="label">What we observed</p>
            <FindingList findings={opportunity.observed} />
          </div>

          <div className="opportunity-block">
            <p className="label">Potential friction</p>
            <p>{opportunity.friction}</p>
          </div>

          <div className="opportunity-block">
            <p className="label">Why it matters</p>
            <p>{opportunity.whyItMatters}</p>
          </div>
        </div>

        <div className="opportunity-col">
          <div className="opportunity-block">
            <p className="label">What Ellis AI Studio could build</p>
            <SystemFlow steps={opportunity.proposedSystem} />
          </div>

          <div className="opportunity-block">
            <p className="label">Potential benefit</p>
            <ul className="benefit-list">
              {opportunity.benefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>

          <div className="opportunity-block">
            <p className="label">How this was scored</p>
            <ScoreBreakdown scores={opportunity.scores} />
            <ConfidenceIndicator level={opportunity.confidence} />
          </div>

          <div className="discovery-question">
            <p className="label">Discovery question</p>
            <p>{opportunity.discoveryQuestion}</p>
          </div>
        </div>
      </div>
    </details>
  );
}
