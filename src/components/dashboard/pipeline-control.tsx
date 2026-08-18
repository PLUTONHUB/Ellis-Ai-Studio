/**
 * The pipeline control.
 *
 * A controlled select, refined — not a redesign of the state machine. The
 * eight `PIPELINE_STATUSES` keys are used exactly as stored: the control emits
 * the key, the server function validates it against the same list, and the
 * database check constraint remains the final authority. Nothing here adds a
 * stage, renames one, or infers a transition.
 *
 * Deliberately not drag-and-drop. There is no ordering endpoint behind this
 * and a board that silently fails to save is worse than a select that works.
 *
 * The optimistic value is what the operator sees the moment they choose; if
 * the write is rejected it snaps back and says so, rather than leaving the UI
 * asserting something the record does not agree with.
 */

import { useState } from "react";
import { PipelineBadge } from "~/components/lead/primitives";
import { PIPELINE_LABELS } from "~/lib/lead-presentation";
import { PIPELINE_STATUSES, type PipelineStatus } from "~/types/lead";

export function PipelineControl({
  status,
  onChange,
}: {
  status: PipelineStatus;
  onChange: (next: PipelineStatus) => Promise<void>;
}) {
  const [value, setValue] = useState<PipelineStatus>(status);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  const select = (next: PipelineStatus) => {
    const previous = value;
    setValue(next);
    setState("saving");
    void onChange(next)
      .then(() => {
        setState("saved");
        window.setTimeout(() => setState("idle"), 2400);
      })
      .catch(() => {
        setValue(previous);
        setState("failed");
      });
  };

  return (
    <div className="pipeline-control">
      <div className="pipeline-control-head">
        <label className="label label-quiet" htmlFor="pipeline-status">Pipeline stage</label>
        <PipelineBadge status={value} />
      </div>

      <div className="pipeline-select">
        <select
          id="pipeline-status"
          value={value}
          disabled={state === "saving"}
          onChange={(event) => select(event.target.value as PipelineStatus)}
        >
          {PIPELINE_STATUSES.map((option) => (
            <option key={option} value={option}>{PIPELINE_LABELS[option]}</option>
          ))}
        </select>
        <span className="pipeline-select-caret" aria-hidden="true" />
      </div>

      <p className="pipeline-control-state" data-state={state} role="status" aria-live="polite">
        {state === "saving" && "Saving…"}
        {state === "saved" && "Stage updated"}
        {state === "failed" && "That change did not save. The stage is unchanged."}
        {state === "idle" && "Changes save immediately."}
      </p>
    </div>
  );
}
