/**
 * The analysis state.
 *
 * Not a spinner, and not a fake terminal. It shows the actual sequence of work
 * as a checklist on a rail: the current step is held, completed steps settle
 * into the mono register, and the rail fills behind them. The point is to make
 * the process legible, not to imply something mystical is happening.
 *
 * Right now the sequence is timed, because there is no analysis backend to
 * report from yet. `ANALYSIS_STAGES` is the seam: when the engine exists it
 * emits these same stage ids and `stageIndex` is driven by those events
 * instead of a timer. Nothing else in this component changes.
 */

import { useEffect, useState, type CSSProperties } from "react";

export type AnalysisStage = { id: string; label: string; ms: number };

export const ANALYSIS_STAGES: readonly AnalysisStage[] = [
  { id: "discover", label: "Discovering business", ms: 900 },
  { id: "services", label: "Understanding services", ms: 850 },
  { id: "journey", label: "Mapping customer journey", ms: 1000 },
  { id: "systems", label: "Evaluating digital systems", ms: 950 },
  { id: "detect", label: "Detecting opportunities", ms: 1100 },
  { id: "prioritize", label: "Prioritizing recommendations", ms: 850 },
  { id: "roadmap", label: "Building automation roadmap", ms: 900 },
] as const;

export function AnalysisSequence({ target, onComplete }: { target: string; onComplete: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // One timer at a time, advancing a single index — cheap, and it unwinds
    // cleanly if the visitor navigates away mid-analysis.
    if (stageIndex >= ANALYSIS_STAGES.length) {
      const done = window.setTimeout(onComplete, 420);
      return () => window.clearTimeout(done);
    }
    const stage = ANALYSIS_STAGES[stageIndex];
    const timer = window.setTimeout(() => setStageIndex((i) => i + 1), stage.ms);
    return () => window.clearTimeout(timer);
  }, [stageIndex, onComplete]);

  const progress = stageIndex / ANALYSIS_STAGES.length;
  const active = ANALYSIS_STAGES[stageIndex];

  return (
    <section className="analysis">
      <div className="container-narrow">
        <div className="analysis-head">
          <p className="label">Analysis in progress</p>
          <h1 className="display-m">Reading what your business shows the world.</h1>
          <p className="analysis-target">{target}</p>
        </div>

        <ol className="analysis-stages" style={{ "--progress": progress } as CSSProperties}>
          {ANALYSIS_STAGES.map((stage, i) => {
            const state = i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
            return (
              <li className="analysis-stage" key={stage.id} data-state={state}>
                <span>{stage.label}</span>
                <span className="analysis-stage-tick" aria-hidden="true">
                  {state === "done" ? "Done" : state === "active" ? "···" : ""}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Screen readers get the current stage announced, not the whole list re-read. */}
        <p className="visually-hidden" role="status" aria-live="polite">
          {active ? `${active.label}. Step ${stageIndex + 1} of ${ANALYSIS_STAGES.length}.` : "Analysis complete."}
        </p>

        <p className="analysis-foot">
          This analysis reads publicly observable information only — your website, your public
          profiles and how a customer would experience them. It cannot see inside your business,
          so anything it can only reason about is labelled as inferred rather than stated as fact.
        </p>
      </div>
    </section>
  );
}
