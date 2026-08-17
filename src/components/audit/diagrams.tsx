/**
 * The two signature diagrams: the automation roadmap and the recommended
 * architecture.
 *
 * Both are built to be screenshotted — into a proposal, a case study, a post.
 * That is why they are CSS grid with drawn hairline connectors rather than a
 * scaled SVG: a grid re-flows into a legible single column on a phone, keeps
 * real selectable text, and survives a print stylesheet. An SVG viewBox just
 * shrinks until the labels are gone.
 */

import type { CSSProperties } from "react";
import type { ArchitectureDiagram, Opportunity, RoadmapPhase } from "~/types/audit";
import { Fragment } from "react";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/* ---------------------------------------------------------------- roadmap */

export function AutomationRoadmap({
  phases,
  opportunities,
}: {
  phases: readonly RoadmapPhase[];
  opportunities: readonly Opportunity[];
}) {
  const byId = new Map(opportunities.map((o) => [o.id, o]));
  return (
    <ol className="roadmap">
      {phases.map((phase, i) => (
        <li
          className="roadmap-phase reveal"
          key={phase.number}
          style={step(i)}
          /* Phase 1 is the one being recommended to start now. */
          data-active={phase.number === 1 ? "true" : undefined}
        >
          <div className="roadmap-phase-head">
            <p className="roadmap-phase-number">
              Phase {phase.number} <span aria-hidden="true">·</span> {phase.horizon}
            </p>
            <h3 className="roadmap-phase-name">{phase.name}</h3>
            <p className="roadmap-phase-intent">{phase.intent}</p>
          </div>
          <div className="roadmap-phase-body">
            <ul className="roadmap-items">
              {phase.items.map((item) => <li className="roadmap-item" key={item}>{item}</li>)}
            </ul>
            <ul className="roadmap-phase-links">
              {phase.opportunityIds.map((id) => {
                const o = byId.get(id);
                return o ? <li key={id}>{o.name} — priority {o.priority}</li> : null;
              })}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ----------------------------------------------------------- architecture */

const LEGEND = [
  { kind: "source", label: "Where work arrives" },
  { kind: "system", label: "System we'd build" },
  { kind: "ai", label: "AI judgement" },
  { kind: "store", label: "System of record" },
  { kind: "output", label: "What happens next" },
] as const;

export function ArchitectureView({ diagram }: { diagram: ArchitectureDiagram }) {
  return (
    <div>
      <div className="architecture">
        {diagram.layers.map((layer, i) => (
          <Fragment key={layer.name}>
            {i > 0 && (
              <div className="architecture-join" aria-hidden="true">
                <span className="architecture-join-line" />
              </div>
            )}
            <div className="architecture-layer reveal" style={step(i)}>
              <p className="architecture-layer-name">{layer.name}</p>
              <div className="architecture-nodes">
                {layer.nodes.map((node) => (
                  <div className="architecture-node" key={node.id} data-kind={node.kind}>
                    <span className="architecture-node-label">{node.label}</span>
                    {node.detail && <span className="architecture-node-detail">{node.detail}</span>}
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="architecture-caption">
        {LEGEND.map((l) => (
          <span className="architecture-legend" key={l.kind} data-kind={l.kind}>{l.label}</span>
        ))}
      </div>
    </div>
  );
}
