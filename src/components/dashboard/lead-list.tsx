/**
 * The Opportunity Intelligence list.
 *
 * The question this screen answers is "which business opportunities deserve
 * attention right now?" — so it is organised around that decision rather than
 * around the columns that happen to exist in the table.
 *
 * The five tiles across the top are the filters. Reading and filtering are the
 * same gesture, which keeps the chrome down to one row of controls and makes
 * the counts meaningful rather than decorative. Every figure is derived from
 * the rows already loaded — no extra query, no extra endpoint.
 *
 * Rows, not a table. A table forces a horizontal scroll on a phone and turns
 * hierarchy into column order; a row grid re-flows into a readable card and
 * lets the opportunity score lead the eye where it should.
 *
 * The repository returns leads newest-first. That answers "what came in?" and
 * this screen asks "what deserves attention?", so the default order here is by
 * opportunity — sorted in the client, over rows already loaded, leaving the
 * query untouched. Newest-first stays one click away.
 */

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { OpportunityIndex, PipelineBadge, QualificationBadge, StatTile } from "~/components/lead/primitives";
import {
  ACTIVE_PIPELINE_STATUSES,
  ANALYSIS_STATUS_LABELS,
  PIPELINE_LABELS,
  formatDate,
  systemName,
} from "~/lib/lead-presentation";
import { ConsoleEmpty } from "~/components/dashboard/console";
import { PIPELINE_STATUSES } from "~/types/lead";
import type { LeadListRow } from "~/types/lead-record";

type Focus = "all" | "priority" | "strong" | "active" | "nurture" | "attention";
type Order = "opportunity" | "newest";

const FOCUS_EMPTY: Record<Focus, string> = {
  all: "No leads have been submitted yet.",
  priority: "No leads are currently classified as Priority.",
  strong: "No leads are currently classified as Strong Fit.",
  active: "Nothing is open in the pipeline right now.",
  nurture: "Nothing is sitting in nurture.",
  attention: "Every submission analyzed cleanly.",
};

function matches(row: LeadListRow, focus: Focus): boolean {
  switch (focus) {
    case "all":
      return true;
    case "priority":
      return row.qualification_class === "priority_lead";
    case "strong":
      return row.qualification_class === "strong_fit";
    case "active":
      return ACTIVE_PIPELINE_STATUSES.includes(row.pipeline_status);
    case "nurture":
      return row.pipeline_status === "nurture" || row.qualification_class === "nurture";
    case "attention":
      return row.analysis_status === "failed" || row.analysis_status === "pending";
  }
}

export function LeadList({ leads }: { leads: readonly LeadListRow[] }) {
  const [focus, setFocus] = useState<Focus>("all");
  const [order, setOrder] = useState<Order>("opportunity");

  const counts = useMemo(
    () => ({
      all: leads.length,
      priority: leads.filter((row) => matches(row, "priority")).length,
      strong: leads.filter((row) => matches(row, "strong")).length,
      active: leads.filter((row) => matches(row, "active")).length,
      nurture: leads.filter((row) => matches(row, "nurture")).length,
      attention: leads.filter((row) => matches(row, "attention")).length,
    }),
    [leads],
  );

  /** Pipeline health: every stage that actually holds something, in order. */
  const pipeline = useMemo(
    () =>
      PIPELINE_STATUSES.map((status) => ({
        status,
        count: leads.filter((row) => row.pipeline_status === status).length,
      })).filter((entry) => entry.count > 0),
    [leads],
  );

  const visible = useMemo(() => {
    const filtered = leads.filter((row) => matches(row, focus));
    if (order === "newest") return filtered;
    // A lead with no score has not been read yet, so it outranks everything —
    // an unqualified opportunity is the one most likely to be missed.
    return [...filtered].sort((a, b) => {
      if (a.opportunity_score === null && b.opportunity_score === null) return 0;
      if (a.opportunity_score === null) return -1;
      if (b.opportunity_score === null) return 1;
      return b.opportunity_score - a.opportunity_score;
    });
  }, [leads, focus, order]);

  const tiles = [
    { key: "active", value: counts.active, label: "Active opportunities", detail: "Open in the pipeline" },
    { key: "priority", value: counts.priority, label: "Priority leads", detail: "Score 85 and above", tone: "rust" as const },
    { key: "strong", value: counts.strong, label: "Strong fits", detail: "Score 70–84", tone: "green" as const },
    { key: "nurture", value: counts.nurture, label: "Nurture", detail: "Real, but early", tone: "quiet" as const },
    { key: "attention", value: counts.attention, label: "Needs attention", detail: "Analysis incomplete", tone: "quiet" as const },
  ] as const;

  return (
    <div className="console-page">
      <header className="console-head">
        <div className="console-head-copy">
          <p className="label">Opportunity intelligence</p>
          <h1 className="display-l">Which opportunities deserve attention.</h1>
          <p className="lede">
            Every submission, read and qualified. The score is Ellis's own read on the opportunity —
            higher means a stronger qualified opportunity, and it is not the audit's Automation
            Opportunity Score.
          </p>
        </div>
        <div className="console-head-controls">
          <p className="console-head-meta">
            {counts.all} {counts.all === 1 ? "lead" : "leads"} on file
          </p>
          <div className="console-order" role="group" aria-label="Sort order">
            {([["opportunity", "By opportunity"], ["newest", "Newest first"]] as const).map(([value, label]) => (
              <button
                className="console-order-option"
                type="button"
                key={value}
                aria-pressed={order === value}
                onClick={() => setOrder(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="console-tiles" role="group" aria-label="Filter by focus">
        {tiles.map((tile) => (
          <button
            className="console-tile"
            type="button"
            key={tile.key}
            aria-pressed={focus === tile.key}
            onClick={() => setFocus((current) => (current === tile.key ? "all" : tile.key))}
          >
            <StatTile
              value={tile.value}
              label={tile.label}
              detail={tile.detail}
              tone={"tone" in tile ? tile.tone : undefined}
            />
          </button>
        ))}
      </div>

      {pipeline.length > 0 && (
        <section className="pipeline-health" aria-label="Pipeline health">
          <p className="label label-quiet">Pipeline</p>
          <div className="pipeline-bar">
            {pipeline.map((entry) => (
              <span
                className="pipeline-bar-segment"
                key={entry.status}
                data-status={entry.status}
                style={{ "--span": entry.count } as React.CSSProperties}
                title={`${PIPELINE_LABELS[entry.status]} — ${entry.count}`}
              />
            ))}
          </div>
          <ul className="pipeline-legend">
            {pipeline.map((entry) => (
              <li key={entry.status} data-status={entry.status}>
                <span className="pipeline-legend-label">{PIPELINE_LABELS[entry.status]}</span>
                <span className="pipeline-legend-count">{entry.count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {focus !== "all" && (
        <div className="console-filter-state">
          <p>
            Showing <strong>{visible.length}</strong> of {counts.all} —{" "}
            {tiles.find((tile) => tile.key === focus)?.label.toLowerCase()}
          </p>
          <button className="console-filter-clear" type="button" onClick={() => setFocus("all")}>
            Clear filter
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <ConsoleEmpty
          title={counts.all === 0 ? "Your first qualified opportunity will appear here." : FOCUS_EMPTY[focus]}
          copy={
            counts.all === 0
              ? "Leads arrive already read, scored and qualified, with the discovery questions that would validate them."
              : "Nothing matches this filter yet. Clear it to see everything on file."
          }
          sources={
            counts.all === 0
              ? [
                  { label: "Audit handoff", detail: "A finished AI Opportunity Audit, continued into validation." },
                  { label: "Direct intake", detail: "Someone describing the problem at /lead-intelligence." },
                  { label: "Contact page", detail: "An inquiry routed in from the site." },
                ]
              : undefined
          }
        />
      ) : (
        <ol className="lead-rows">
          {visible.map((row) => (
            <li className="lead-row" key={row.id}>
              <Link
                className="lead-row-link"
                to="/dashboard/leads/$leadId"
                params={{ leadId: row.id }}
              >
                <div className="lead-row-score">
                  {row.opportunity_score === null || row.qualification_class === null ? (
                    <span className="lead-row-pending">{ANALYSIS_STATUS_LABELS[row.analysis_status]}</span>
                  ) : (
                    <OpportunityIndex
                      score={row.opportunity_score}
                      qualification={row.qualification_class}
                      compact
                    />
                  )}
                </div>

                <div className="lead-row-identity">
                  <h2 className="lead-row-business">{row.business_name}</h2>
                  <p className="lead-row-contact">
                    {row.first_name} {row.last_name} · {row.email}
                  </p>
                  {row.recommended_system_key && (
                    <p className="lead-row-system">{systemName(row.recommended_system_key)}</p>
                  )}
                </div>

                <div className="lead-row-status">
                  {row.qualification_class && <QualificationBadge qualification={row.qualification_class} size="small" />}
                  <PipelineBadge status={row.pipeline_status} />
                </div>

                <div className="lead-row-meta">
                  {row.qualification_confidence !== null && (
                    <span className="lead-row-confidence">Confidence {row.qualification_confidence}</span>
                  )}
                  <span className="lead-row-date">{formatDate(row.created_at)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
