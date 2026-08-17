/**
 * AI Opportunity Audit — the page-level flow.
 *
 * Three states behind one URL: entry, analysis, results. They are one product
 * story, so they share a page rather than bouncing the visitor between routes,
 * and the results deliberately do not push a scroll position — the score is
 * already at the top of the viewport when the analysis resolves.
 *
 * On sample data: there is no analysis engine yet, so every audit returns the
 * Evergreen Roofing fixture. That is stated on the entry form and marked again
 * at the top of the report. An audit product whose entire argument is
 * "evidence over hype" cannot open by implying it analysed a site it did not
 * look at, and the notice costs the demo nothing.
 */

import { useCallback, useState, type CSSProperties, type FormEvent } from "react";
import { SiteShell } from "~/components/layout/site-shell";
import { Section, SectionIntro } from "~/components/layout/page";
import { AnalysisSequence } from "~/components/audit/analysis";
import { AuditResults } from "~/components/audit/report";
import { EvidenceKey } from "~/components/audit/primitives";
import { auditFixture } from "~/data/audit-fixture";
import { runOpportunityAudit } from "~/lib/audit-engine";
import { PILLARS } from "~/lib/audit-scoring";
import { normalizeWebsite } from "~/lib/audit-url";
import { routes, studio } from "~/data/links";
import type { AuditReport } from "~/types/audit";
import "~/styles/system/content.css";
import "~/styles/system/audit.css";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/* ------------------------------------------------------------------ entry */

function EntryForm({ onStart }: { onStart: (website: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const website = normalizeWebsite(value);
    if (!website) {
      setError("That doesn't look like a website address. Try something like evergreenroofing.com");
      return;
    }
    setError("");
    onStart(website);
  };

  return (
    <form className="url-form enter" style={step(4)} onSubmit={onSubmit}>
      <div className="url-field">
        <span className="url-field-prefix" aria-hidden="true">https://</span>
        <label className="visually-hidden" htmlFor="audit-url">Your business website</label>
        <input
          id="audit-url"
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="yourbusiness.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "audit-url-error" : undefined}
        />
        <button className="button button-rust" type="submit">Run my AI Opportunity Audit</button>
      </div>
      {error && <p className="url-error" id="audit-url-error" role="alert">{error}</p>}
      <p className="url-note">
        No account, no credit card. The audit reads only publicly observable information — your
        website and public profiles — and labels anything it cannot confirm.
      </p>
    </form>
  );
}

function EntryState({ onStart }: { onStart: (website: string) => void }) {
  return (
    <>
      <section className="audit-entry">
        <div className="container audit-entry-inner">
          <p className="label enter" style={step(0)}>AI Opportunity Audit</p>
          <h1 className="hero-type enter" style={step(1)}>
            Find opportunities hidden in your <em>business</em>.
          </h1>
          <p className="lede enter" style={step(2)}>
            Enter your website and discover where AI, automation and better systems could save
            time, improve customer experience, or support revenue growth.
          </p>

          <EntryForm onStart={onStart} />

          <ul className="pillar-strip enter" style={step(5)}>
            {PILLARS.map((p) => <li key={p.id}>{p.name}</li>)}
          </ul>
        </div>
      </section>

      <Section tone="cool" id="what-you-get">
        <SectionIntro
          index="01"
          label="What comes back"
          title="A prioritized automation roadmap, not a list of tips."
          copy="The audit builds a business profile, traces the customer journey, reads seven permanent pillars, then scores every opportunity it finds on impact, evidence, fit and how straightforward it would be to build."
        />
        <ul className="rows">
          {[
            ["Automation Opportunity Score", "A single 0–100 read on how much apparent room there is to improve — plus what that number does and does not mean."],
            ["Business profile & customer journey", "What your business appears to do, who it serves, and how someone moves from finding you to becoming a customer."],
            ["Scored opportunities", "Each one with the evidence behind it, the friction it may be creating, and the system we would build to remove it."],
            ["Automation roadmap & architecture", "Three phases in build order, and a diagram of the system it adds up to."],
          ].map(([name, detail], i) => (
            <li className="row reveal" key={name}>
              <span className="row-index">{String(i + 1).padStart(2, "0")}</span>
              <div className="row-head"><h3 className="display-m">{name}</h3></div>
              <div className="row-body"><p>{detail}</p></div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="evidence">
        <div className="split">
          <div className="stack stack-5">
            <p className="label">Evidence, not assertion</p>
            <h2 className="display-m">We tell you how well we can see something.</h2>
            <p className="lede">
              An audit built on public information can identify where opportunity probably exists.
              It cannot see inside your operations. So every material finding carries its evidence
              class, and an inference is never dressed up as a confirmed fact about your business.
            </p>
            <p className="body">
              What the audit cannot establish is listed explicitly at the end of the report — those
              become the questions worth asking in a discovery conversation.
            </p>
          </div>
          <aside className="split-aside">
            <EvidenceKey />
          </aside>
        </div>
      </Section>

      <Section tone="deep">
        <div className="section-head">
          <div className="section-marker reveal" aria-hidden="true">
            <span>02</span><span className="tick reveal-rule" />
          </div>
          <div className="section-head-body">
            <p className="label reveal">Prefer to talk first?</p>
            <h2 className="display-l statement reveal">Some problems are faster to describe than to detect.</h2>
            <p className="lede reveal">
              If you already know what is slowing the business down, skip the audit and tell us
              directly — or book a conversation and we will work through it together.
            </p>
            <div className="hero-actions reveal">
              <a className="button button-quiet" href={routes.apply}>Describe the problem instead</a>
              <a className="link" href={studio.booking} target="_blank" rel="noreferrer">Book a conversation</a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------- the flow */

type Phase = { name: "entry" } | { name: "analyzing"; website: string } | { name: "results"; website: string; report: AuditReport; sample: boolean } | { name: "error"; message: string };

/** Marks the report as sample data. Shown for as long as that is true. */
function SampleNotice({ website }: { website: string }) {
  return (
    <div className="evidence-disclosure enter">
      <span className="label">Sample report</span>
      <p>
        The analysis engine is still in development, so <strong>{website}</strong> has not been
        analyzed. What follows is a complete worked example for a real-world business type, showing
        exactly what your report will contain.
      </p>
    </div>
  );
}

export function AuditPage() {
  const [phase, setPhase] = useState<Phase>({ name: "entry" });

  const start = useCallback((website: string) => {
    setPhase({ name: "analyzing", website });
    // The analysis view replaces the viewport contents; without this the
    // visitor can land mid-page having scrolled the entry page first.
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const finish = useCallback(async () => {
    if (phase.name !== "analyzing") return;
    try { const report = await runOpportunityAudit({ data: { website: phase.website } }); setPhase({ name: "results", website: phase.website, report, sample: false }); }
    catch (error) { setPhase({ name: "error", message: error instanceof Error ? error.message : "We couldn't complete this audit right now." }); }
  }, [phase]);

  return (
    <SiteShell>
      {phase.name === "entry" && <EntryState onStart={start} />}
      {phase.name === "analyzing" && <AnalysisSequence target={phase.website} onComplete={finish} />}
      {phase.name === "results" && <AuditResults report={phase.report} notice={phase.sample ? <SampleNotice website={phase.website} /> : undefined} />}
      {phase.name === "error" && <Section><div className="container-narrow stack stack-5"><p className="label">Audit unavailable</p><h1 className="display-l">We couldn't complete that audit.</h1><p className="lede">{phase.message}</p><button className="button button-solid" onClick={() => setPhase({ name: "entry" })}>Try another website</button></div></Section>}
    </SiteShell>
  );
}

/* --------------------------------------------------- persistent report URL */

/**
 * /audit/[report-id]. Built now so the report is a real, linkable artifact
 * rather than something that only exists inside one browser tab. There is no
 * report store yet, so an unknown id says so plainly instead of inventing a
 * result for it.
 */
export function AuditReportPage({ reportId }: { reportId: string }) {
  if (reportId !== auditFixture.id) {
    return (
      <SiteShell>
        <Section>
          <div className="stack stack-5" style={{ paddingBlock: "clamp(60px,10vw,120px)", maxWidth: "58ch" }}>
            <p className="label">Report not found</p>
            <h1 className="display-l">We can't find that report.</h1>
            <p className="lede">
              Saved reports are not available yet, so this link may be from a report that only
              existed in the browser it was created in. Running the audit again takes a moment.
            </p>
            <div className="hero-actions">
              <a className="button button-solid" href={routes.audit}>Run a new audit</a>
              <a className="link" href={studio.booking} target="_blank" rel="noreferrer">Book a conversation</a>
            </div>
          </div>
        </Section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <AuditResults report={auditFixture} variant="shared" />
    </SiteShell>
  );
}
