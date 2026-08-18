/**
 * The intelligence brief.
 *
 * This is the screen Ellis reads before picking up the phone, so it is
 * sequenced the way that conversation goes: what this opportunity is worth,
 * why, what the business actually said, what the analysis made of it, what the
 * audit already knew, what we would build, what we still need to ask, and what
 * has happened to the record so far.
 *
 * Everything on it is already stored. Nothing here re-scores, re-classifies or
 * re-derives — the numbers arrive decided and are only drawn.
 *
 * The one piece of local state is the discovery checklist. It is call-prep,
 * explicitly labelled as lasting for the session only, because there is no
 * persistence behind it and pretending otherwise would be worse than useless
 * on a follow-up call.
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { EvidenceBadges, SystemFlow } from "~/components/audit/primitives";
import {
  ConfidenceMeter,
  EvidenceStatement,
  LeadEvidenceKey,
  LeadScoreBreakdown,
  OpportunityIndex,
} from "~/components/lead/primitives";
import { PipelineControl } from "~/components/dashboard/pipeline-control";
import {
  ANALYSIS_STATUS_LABELS,
  INTERNAL_NEXT_ACTION,
  PROBLEM_CATEGORY_LABELS,
  SOURCE_LABELS,
  URGENCY_LABELS,
  activityLabel,
  confidenceReading,
  formatDate,
  formatDateTime,
  systemDescription,
  systemFlow,
  systemName,
} from "~/lib/lead-presentation";
import { ConsoleNotice } from "~/components/dashboard/console";
import type { LeadActivity, PipelineStatus } from "~/types/lead";
import type { LeadAnalysisRow, LeadRow } from "~/types/lead-record";

/* --------------------------------------------------------------- section */

function Brief({
  index,
  label,
  title,
  children,
  aside,
}: {
  index: string;
  label: string;
  title?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="brief">
      <div className="brief-marker" aria-hidden="true">
        <span>{index}</span>
        <span className="tick" />
      </div>
      <div className="brief-body">
        <div className="brief-head">
          <p className="label">{label}</p>
          {title && <h2 className="brief-title">{title}</h2>}
        </div>
        {children}
      </div>
      {aside && <div className="brief-aside">{aside}</div>}
    </section>
  );
}

/* ---------------------------------------------------------- discovery */

function DiscoveryQuestions({ questions }: { questions: readonly string[] }) {
  const [discussed, setDiscussed] = useState<readonly string[]>([]);
  const [copied, setCopied] = useState("");

  const toggle = (question: string) =>
    setDiscussed((current) =>
      current.includes(question) ? current.filter((item) => item !== question) : [...current, question],
    );

  const copy = async (question: string) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(question);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      // Clipboard blocked. The question is selectable text on screen either way.
      setCopied("");
    }
  };

  return (
    <>
      <ol className="discovery-list">
        {questions.map((question, i) => (
          <li className="discovery-item" key={question} data-discussed={discussed.includes(question)}>
            <label className="discovery-check">
              <input
                type="checkbox"
                checked={discussed.includes(question)}
                onChange={() => toggle(question)}
              />
              <span className="discovery-check-box" aria-hidden="true" />
              <span className="visually-hidden">Mark question {i + 1} as discussed</span>
            </label>
            <p className="discovery-text">{question}</p>
            <button className="discovery-copy" type="button" onClick={() => void copy(question)}>
              {copied === question ? "Copied" : "Copy"}
            </button>
          </li>
        ))}
      </ol>
      <p className="brief-note">
        Ticks are call-prep for this session only — they are not saved to the record.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ page */

export function LeadDetail({
  lead,
  analysis,
  activities,
  onPipelineChange,
}: {
  lead: LeadRow;
  analysis: LeadAnalysisRow | null;
  activities: readonly LeadActivity[];
  onPipelineChange: (status: PipelineStatus) => Promise<void>;
}) {
  const interpretation = analysis?.interpretation;
  const systemKey = analysis?.recommended_system_key;
  const operational = lead.operational_context ?? {};
  const audit = lead.audit_context;
  const bottleneck = operational.bottleneckAudit;

  const identity = [
    lead.website,
    lead.industry,
    lead.location,
    SOURCE_LABELS[lead.source],
    `Received ${formatDate(lead.created_at)}`,
  ].filter(Boolean) as string[];

  const operationalRows = [
    ["Inquiries per month", operational.approximateMonthlyLeadVolume],
    ["Biggest manual step", operational.biggestManualBottleneck],
    ["Tools in use", operational.currentTools],
    ["Business size", operational.businessSize],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <div className="console-page brief-page">
      <header className="brief-header">
        <Link className="console-back" to="/dashboard/leads">All opportunities</Link>

        <div className="brief-identity">
          <h1 className="display-l">{lead.business_name}</h1>
          <ul className="inline-meta">
            {identity.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="brief-contact">
            {lead.first_name} {lead.last_name} ·{" "}
            <a className="lead-inline-link" href={`mailto:${lead.email}`}>{lead.email}</a>
            {lead.phone && <> · <a className="lead-inline-link" href={`tel:${lead.phone}`}>{lead.phone}</a></>}
          </p>
        </div>

        <PipelineControl status={lead.pipeline_status} onChange={onPipelineChange} />
      </header>

      {!analysis || !interpretation ? (
        <ConsoleNotice
          title={`Analysis ${ANALYSIS_STATUS_LABELS[lead.analysis_status].toLowerCase()}`}
          copy={
            lead.analysis_status === "failed"
              ? "The interpretation did not complete for this submission, so there is no score or qualification on the record. Everything the business told us is below, unchanged."
              : "This submission has not been interpreted yet. Everything the business told us is below, unchanged."
          }
        />
      ) : (
        <>
          <Brief index="01" label="Opportunity intelligence">
            <div className="intelligence-grid">
              <OpportunityIndex
                score={analysis.opportunity_score}
                qualification={analysis.qualification_class}
              />
              <ConfidenceMeter
                confidence={analysis.qualification_confidence}
                reading={confidenceReading(analysis.qualification_confidence)}
              />
            </div>

            <div className="intelligence-actions">
              <div className="intelligence-action">
                <p className="label label-quiet">Recommended system</p>
                <p className="intelligence-action-value">{systemName(analysis.recommended_system_key)}</p>
                <p className="small">{systemDescription(analysis.recommended_system_key)}</p>
              </div>
              <div className="intelligence-action" data-emphasis="true">
                <p className="label label-quiet">Recommended next action</p>
                <p className="intelligence-action-value">
                  {INTERNAL_NEXT_ACTION[analysis.recommended_next_action].label}
                </p>
                <p className="small">{INTERNAL_NEXT_ACTION[analysis.recommended_next_action].detail}</p>
              </div>
            </div>
          </Brief>

          <Brief index="02" label="Score breakdown" title="How the number was reached.">
            <LeadScoreBreakdown
              scores={{
                problemFit: analysis.problem_fit,
                potentialImpact: analysis.potential_impact,
                urgency: analysis.urgency_score,
                implementationFit: analysis.implementation_fit,
                intent: analysis.intent,
              }}
            />
          </Brief>
        </>
      )}

      <Brief index="03" label="Business problem" title="In their own words.">
        <blockquote className="brief-quote">{lead.primary_challenge}</blockquote>
        <div className="brief-block">
          <p className="label label-quiet">Desired outcome</p>
          <p className="brief-text">{lead.desired_outcome}</p>
        </div>
        {operational.currentProcess && (
          <div className="brief-block">
            <p className="label label-quiet">Process today</p>
            <p className="brief-text">{operational.currentProcess}</p>
          </div>
        )}
        {lead.additional_context && (
          <div className="brief-block">
            <p className="label label-quiet">Additional context</p>
            <p className="brief-text">{lead.additional_context}</p>
          </div>
        )}
        <dl className="brief-facts">
          <div>
            <dt>Urgency</dt>
            <dd>{URGENCY_LABELS[lead.urgency]}</dd>
          </div>
          {operationalRows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </Brief>

      {interpretation && (
        <Brief
          index="04"
          label="AI interpretation"
          title="What the analysis made of it."
          aside={<LeadEvidenceKey />}
        >
          <p className="lede">{interpretation.summary}</p>

          <ul className="inline-meta">
            <li>{PROBLEM_CATEGORY_LABELS[interpretation.primaryProblemCategory]}</li>
            {interpretation.secondaryProblemCategories.map((category) => (
              <li key={category}>{PROBLEM_CATEGORY_LABELS[category]}</li>
            ))}
          </ul>

          {interpretation.identifiedProblems.length > 0 && (
            <ul className="lead-findings">
              {interpretation.identifiedProblems.map((problem) => (
                <EvidenceStatement
                  key={problem.title}
                  evidence={problem.evidenceType}
                  title={problem.title}
                  description={problem.description}
                  support={problem.evidence}
                />
              ))}
            </ul>
          )}

          {interpretation.uncertainty.length > 0 && (
            <div className="brief-block">
              <p className="label label-quiet">Still unknown</p>
              <ul className="brief-unknowns">
                {interpretation.uncertainty.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}

          <details className="brief-reasoning">
            <summary>Reasoning summary</summary>
            <p>{interpretation.reasoningSummary}</p>
          </details>
        </Brief>
      )}

      {audit && (
        <Brief index="05" label="Audit context" title="What the audit already knew.">
          <div className="audit-link">
            <div className="audit-link-rail" aria-hidden="true">
              <span className="handoff-rail-node" data-state="done" />
              <span className="handoff-rail-line" />
              <span className="handoff-rail-node" data-state="current" />
            </div>
            <div className="audit-link-body">
              <p className="label label-quiet">AI Opportunity Audit</p>
              <p className="audit-link-id">{audit.auditId}</p>
              <dl className="brief-facts brief-facts-inline">
                {audit.automationOpportunityScore !== undefined && (
                  <div>
                    <dt>Automation opportunity</dt>
                    <dd>{audit.automationOpportunityScore}/100</dd>
                  </div>
                )}
                {audit.systemsMaturity && (
                  <div>
                    <dt>Systems maturity</dt>
                    <dd>{audit.systemsMaturity.replace(/-/g, " ")}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {audit.topOpportunity && (
            <div className="audit-opportunity">
              <div>
                <p className="label label-quiet">Top audit opportunity</p>
                <p className="audit-opportunity-name">{audit.topOpportunity.name}</p>
                <EvidenceBadges evidence={audit.topOpportunity.evidence} />
              </div>
              <span className="audit-opportunity-score">{audit.topOpportunity.score}</span>
            </div>
          )}

          {audit.evidence.length > 0 && (
            <div className="brief-block">
              <p className="label label-quiet">Audit evidence</p>
              <ul className="audit-evidence">
                {audit.evidence.map((finding) => (
                  <li key={finding.statement} data-evidence={finding.evidence}>
                    <span className="audit-evidence-class">{finding.evidence}</span>
                    <span>
                      {finding.statement}
                      {finding.source && <span className="audit-evidence-source">Source — {finding.source}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="brief-note">
                Audit evidence stays audit evidence. Nothing here has been confirmed by the
                business — only what the submission stated directly is user confirmed.
              </p>
            </div>
          )}
        </Brief>
      )}

      {bottleneck && (
        <Brief index="05" label="Business Bottleneck Context" title="What the business submitted directly.">
          <p className="brief-note">These are user-confirmed statements from the Business Bottleneck Audit.</p>
          <dl className="brief-facts">
            {[
              ["Affected area", bottleneck.affectedArea],
              ["Manual work", bottleneck.manualWork],
              ["Failure impact", bottleneck.failureImpact],
              ["Frequency", bottleneck.frequency],
              ["Priority", bottleneck.priority],
              ["Readiness", bottleneck.readiness],
              ["Founding program interest", bottleneck.foundingInterest],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Brief>
      )}

      {systemKey && (
        <Brief index="06" label="Recommended system" title={systemName(systemKey)}>
          <p className="lede">{systemDescription(systemKey)}</p>
          <div className="brief-flow">
            <SystemFlow steps={systemFlow(systemKey)} />
          </div>
          {interpretation && (
            <div className="brief-block">
              <p className="label label-quiet">Why this system</p>
              <p className="brief-text">{interpretation.recommendedSystem.rationale}</p>
            </div>
          )}
        </Brief>
      )}

      {interpretation && interpretation.discoveryQuestions.length > 0 && (
        <Brief index="07" label="Discovery questions" title="Take these into the call.">
          <DiscoveryQuestions questions={interpretation.discoveryQuestions} />
        </Brief>
      )}

      <Brief index="08" label="Activity">
        <ol className="timeline">
          {activities.map((activity) => (
            <li className="timeline-entry" key={activity.id}>
              <span className="timeline-dot" aria-hidden="true" />
              <span className="timeline-label">{activityLabel(activity.type)}</span>
              <span className="timeline-time">{formatDateTime(activity.createdAt)}</span>
            </li>
          ))}
        </ol>
      </Brief>
    </div>
  );
}
