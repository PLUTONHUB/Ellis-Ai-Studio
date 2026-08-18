/**
 * The results experience.
 *
 * One story in eight movements, not eight unrelated sections:
 *
 *   header   — who this is, the number, what the number means      (5 seconds)
 *   01       — the business we found, and how well we can see it
 *   02       — how a customer appears to move through it
 *   03       — the seven pillars, read across that business
 *   04       — the single opportunity that matters most
 *   [gate]   — everything above was free; the rest asks for two fields
 *   05       — every opportunity, explorable
 *   06       — the roadmap                      (signature moment, on ink)
 *   07       — the architecture                 (signature moment, on canvas)
 *   08       — the bridge to discovery, and what we could not see
 *
 * Tonal rhythm alternates canvas / canvas-alt so sections separate without
 * boxing anything, and the two ink sections are held apart by the light
 * architecture section between them.
 */

import { useState, type ReactNode } from "react";
import { Section, SectionIntro } from "~/components/layout/page";
import { byPriority, highPriorityCount, pillarName } from "~/lib/audit-scoring";
import { studio } from "~/data/links";
import type { AuditReport } from "~/types/audit";
import {
  EvidenceBadge,
  EvidenceKey,
  FindingList,
  MaturityIndicator,
  OpportunityScore,
} from "~/components/audit/primitives";
import { OpportunityCard } from "~/components/audit/opportunity-card";
import { ArchitectureView, AutomationRoadmap } from "~/components/audit/diagrams";
import { RoadmapUnlock, UnlockConfirmation } from "~/components/audit/unlock";
import { auditHandoffHref } from "~/lib/audit-lead-handoff";

/* ---------------------------------------------------------------- header */

function ReportHeader({ report, notice }: { report: AuditReport; notice?: ReactNode }) {
  const ranked = [...report.opportunities].sort(byPriority);
  const generated = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="report-header">
      <div className="container report-header-inner">
        {notice}
        <div className="report-identity">
          <p className="label enter">AI Opportunity Audit</p>
          <h1 className="display-xl enter" style={{ "--i": 1 } as React.CSSProperties}>
            {report.profile.name}
          </h1>
          <ul className="report-identity-meta enter" style={{ "--i": 2 } as React.CSSProperties}>
            <li>{report.profile.location}</li>
            <li>{report.profile.category}</li>
            <li>{report.profile.website}</li>
            <li>Analyzed {generated}</li>
          </ul>
        </div>

        <div className="report-summary">
          <div className="enter" style={{ "--i": 3 } as React.CSSProperties}>
            <OpportunityScore score={report.automationOpportunity} />
          </div>
          <div className="stack stack-6 enter" style={{ "--i": 4 } as React.CSSProperties}>
            <MaturityIndicator stage={report.maturity} />
            <p className="report-headline lede">{report.headline}</p>
          </div>
        </div>

        <div className="report-counts enter" style={{ "--i": 5 } as React.CSSProperties}>
          <div className="report-count">
            <span className="report-count-value">{report.opportunities.length}</span>
            <span className="report-count-label">Opportunities identified</span>
          </div>
          <div className="report-count">
            <span className="report-count-value">{highPriorityCount(report.opportunities)}</span>
            <span className="report-count-label">High priority</span>
          </div>
          <div className="report-count">
            <span className="report-count-value">{ranked[0]?.priority ?? 0}</span>
            <span className="report-count-label">Top priority score</span>
          </div>
          <div className="report-count">
            <span className="report-count-value">{report.unknowns.length}</span>
            <span className="report-count-label">To validate in discovery</span>
          </div>
        </div>

        <div className="evidence-disclosure enter" style={{ "--i": 6 } as React.CSSProperties}>
          <span className="label">How to read this</span>
          <p>
            Everything here is based on publicly observable information — the website, public
            profiles and the experience a customer would have. Nothing internal has been verified.
            Findings are labelled <strong>Observed</strong>, <strong>Inferred</strong> or{" "}
            <strong>Unknown</strong>, and an inference is a starting point for a conversation, not
            a statement of fact about how the business runs.
          </p>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------- business profile */

function ProfileSection({ report }: { report: AuditReport }) {
  const { profile } = report;
  return (
    <Section id="profile">
      <SectionIntro
        index="01"
        label="Business profile"
        title="What we found."
        copy="The picture assembled from what the business publishes. Where the evidence stops, so do we."
      />
      <div className="split">
        <div className="stack stack-6">
          <p className="lede">{profile.summary}</p>
          <div className="stack stack-3">
            <p className="label">Services identified</p>
            <ul className="inline-meta">
              {profile.services.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="stack stack-3">
            <p className="label">Who they appear to serve</p>
            <p className="body">{profile.audience}</p>
          </div>
          <div className="stack stack-3">
            <p className="label">Digital surface</p>
            <FindingList findings={profile.digitalSurface} />
          </div>
        </div>
        <aside className="split-aside">
          <div className="aside-block">
            <p className="label">Evidence classes</p>
          </div>
          <EvidenceKey />
        </aside>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------- customer journey */

function JourneySection({ report }: { report: AuditReport }) {
  return (
    <Section tone="cool" id="journey">
      <SectionIntro
        index="02"
        label="Customer journey"
        title="How someone appears to move through the business."
        copy="Traced from the outside in. The stages carrying a note are the ones that look like they depend on someone being available."
      />
      <ol className="journey">
        {report.profile.customerJourney.map((stage, i) => (
          <li className="journey-stage reveal" key={stage.name}>
            <span className="journey-index">{String(i + 1).padStart(2, "0")}</span>
            <div className="journey-head">
              <h3>{stage.name}</h3>
              <EvidenceBadge evidence={stage.evidence} />
            </div>
            <div className="journey-body">
              <p>{stage.detail}</p>
              {stage.frictionNote && <p className="journey-friction">{stage.frictionNote}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------ the pillars */

function PillarSection({ report }: { report: AuditReport }) {
  return (
    <Section id="pillars">
      <SectionIntro
        index="03"
        label="The seven pillars"
        title="Every business we audit is read the same way."
        copy="The same seven areas, every time — so a finding means something consistent, and a pillar with nothing in it is a real result rather than a gap in the analysis."
      />
      <div className="pillar-grid">
        {report.pillarSignals.map((signal) => (
          <div
            className="pillar-cell reveal"
            key={signal.pillar}
            data-empty={signal.opportunityCount === 0 ? "true" : undefined}
          >
            <div className="pillar-cell-head">
              <h3>{pillarName(signal.pillar)}</h3>
              <span className="pillar-cell-count">
                {signal.opportunityCount === 0 ? "None found" : `${signal.opportunityCount} found`}
              </span>
            </div>
            <span className="pillar-meter" aria-hidden="true">
              <span
                className="pillar-meter-fill"
                style={{ "--value": signal.opportunity } as React.CSSProperties}
              />
            </span>
            <p>{signal.note}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------- report actions */

function ReportActions({ report, tone }: { report: AuditReport; tone?: "deep" }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? "" : window.location.href;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard blocked (insecure context, permissions): the URL is printed
      // below the buttons regardless, so there is always a way to copy it.
      setCopied(false);
    }
  };

  return (
    <div className="stack stack-4">
      <div className="report-actions">
        <button className="report-action" type="button" onClick={share}>
          {copied ? "Link copied" : "Copy report link"}
        </button>
        <button className="report-action" type="button" onClick={() => window.print()}>
          Save as PDF
        </button>
        <a className="report-action" href={studio.booking} target="_blank" rel="noreferrer">
          Book a strategy session
        </a>
      </div>
      <p className="report-url" data-tone={tone}>
        {url || `ellisaistudio.com/audit/${report.id}`}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- the report */

export function AuditResults({
  report,
  /** `shared` is the persistent /audit/[id] view: already open, no gate. */
  variant = "live",
  /** Rendered at the very top of the report — used for the sample-data notice. */
  notice,
}: {
  report: AuditReport;
  variant?: "live" | "shared";
  notice?: ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(variant === "shared");
  const ranked = [...report.opportunities].sort(byPriority);
  const [top, ...rest] = ranked;

  return (
    <>
      <ReportHeader report={report} notice={notice} />
      <ProfileSection report={report} />
      <JourneySection report={report} />
      <PillarSection report={report} />

      {/* 04 — the top opportunity, in full, before anything is asked for. */}
      <Section tone="cool" id="top-opportunity">
        <SectionIntro
          index="04"
          label="Highest priority"
          title="The opportunity we would start with."
          copy="Scored highest on impact, evidence and fit. Every opportunity in this report is structured the same way."
        />
        {top && (
          <div className="opportunities">
            <OpportunityCard opportunity={top} defaultOpen />
          </div>
        )}
      </Section>

      {!unlocked && (
        <Section id="unlock">
          {rest.length > 0 && (
            <div className="locked-preview" aria-hidden="true">
              <div className="opportunities">
                {rest.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
              </div>
            </div>
          )}
          <div style={{ marginTop: rest.length > 0 ? "var(--space-7)" : 0 }}>
            <RoadmapUnlock report={report} remaining={rest.length} onUnlock={() => setUnlocked(true)} />
          </div>
        </Section>
      )}

      {unlocked && (
        <>
          <Section id="opportunities">
            {variant === "live" && (
              <div style={{ marginBottom: "var(--space-7)" }}>
                <UnlockConfirmation />
              </div>
            )}
            <SectionIntro
              index="05"
              label="Full findings"
              title="Every opportunity identified."
              copy="Ordered by priority. Open any one to see the evidence behind it, the system it implies, and the question that would confirm it."
            />
            <div className="opportunities">
              {ranked.map((o, i) => (
                <OpportunityCard key={o.id} opportunity={o} defaultOpen={i === 0} />
              ))}
            </div>
          </Section>

          <Section tone="deep" id="roadmap">
            <SectionIntro
              index="06"
              label="Automation roadmap"
              title="What to build, and in what order."
              copy="Sequenced so each phase makes the next one possible. Nothing in Phase 3 is worth building before Phase 1 is producing clean data."
            />
            <AutomationRoadmap phases={report.roadmap} opportunities={report.opportunities} />
          </Section>

          <Section id="architecture">
            <SectionIntro
              index="07"
              label="Recommended architecture"
              title={report.architecture.title}
              copy={report.architecture.summary}
            />
            <ArchitectureView diagram={report.architecture} />
          </Section>

          <Section tone="deep" id="discovery">
            <div className="section-head">
              <div className="section-marker reveal" aria-hidden="true">
                <span>08</span>
                <span className="tick reveal-rule" />
              </div>
              <div className="section-head-body">
                <p className="label reveal">Next step</p>
                <h2 className="bridge-statement reveal">
                  The audit found the opportunity. Now let's <em>validate</em> it.
                </h2>
              </div>
            </div>

            <div className="split">
              <div className="bridge">
                <p className="lede">
                  Public information can expose where opportunity probably exists. The highest-value
                  automation opportunities almost always live inside the business — in the steps
                  nobody writes down, the exceptions the team works around, and the software that
                  never made it onto the website.
                </p>
                <p className="body">
                  A discovery conversation tests every inference in this report against what
                  actually happens. Some will hold. Some will turn out to be already solved. And
                  usually one or two things surface that no external analysis could have seen.
                </p>
                <div className="hero-actions">
                  <a className="button button-rust" href={auditHandoffHref(report)}>
                    Have Ellis AI Studio validate this opportunity
                  </a>
                  <a className="button button-rust" href={studio.booking} target="_blank" rel="noreferrer">
                    Review my results with Ellis AI Studio
                  </a>
                </div>
                <ReportActions report={report} tone="deep" />
              </div>
              <aside className="split-aside">
                <div className="aside-block">
                  <p className="label">What this audit could not see</p>
                </div>
                <ul className="unknowns">
                  {report.unknowns.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </aside>
            </div>
          </Section>
        </>
      )}
    </>
  );
}
