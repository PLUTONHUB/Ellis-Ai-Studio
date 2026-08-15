import type { CSSProperties } from "react";
import { SiteShell } from "~/components/layout/site-shell";
import { Section, SectionIntro } from "~/components/layout/page";
import { problems, systemGroups, method, operatingFlow, proof, principles } from "~/data/solutions";
import { routes, studio } from "~/data/links";
import "~/styles/system/content.css";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Five satellite systems converging on one connected operating system — the
 * hero's visual argument, built as plain SVG so it stays legible, fast and
 * meaningful rather than decorative.
 */
function ConnectedSystemsDiagram() {
  const hub = { x: 300, y: 180 };
  const satellites = [
    { x: 70, y: 60 },
    { x: 40, y: 190 },
    { x: 90, y: 310 },
    { x: 230, y: 330 },
    { x: 210, y: 40 },
  ];
  return (
    <div className="hero-diagram diagram" aria-hidden="true">
      <svg viewBox="0 0 380 360" role="img" aria-label="Business systems connecting into one operating system">
        {satellites.map((s, i) => (
          <path
            key={`line-${i}`}
            className="diagram-line"
            style={step(i)}
            d={`M${hub.x},${hub.y} L${s.x},${s.y}`}
            pathLength={1}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={1.25}
          />
        ))}
        {satellites.map((s, i) => (
          <circle key={`node-${i}`} className="diagram-node" style={step(i)} cx={s.x} cy={s.y} r={5} fill="var(--green-700)" />
        ))}
        <circle className="diagram-node" style={step(satellites.length)} cx={hub.x} cy={hub.y} r={7} fill="var(--rust-500)" />
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-label label enter" style={step(0)}>
              AI systems & business operations
              <span className="rule enter-rule" style={step(1)} aria-hidden="true" />
            </p>
            <h1 className="hero-type enter-mask">
              <span className="line" style={step(1)}>Your business doesn't</span>
              <span className="line" style={step(2)}>need more tools.</span>
              <span className="line" style={step(3)}>It needs a better <em>system</em>.</span>
            </h1>
            <p className="lede enter" style={step(4)}>
              Ellis AI Studio identifies the operational bottlenecks slowing a business down, then
              designs and builds the AI-powered systems that remove them — less repetitive work,
              faster follow-up, and room to grow.
            </p>
            <div className="hero-actions enter" style={step(5)}>
              <a className="button button-solid" href={routes.apply}>Apply for a Free Business Bottleneck Audit</a>
              <a className="link" href={routes.howItWorks}>See how it works</a>
            </div>
            <div className="hero-meta enter" style={step(6)}>
              <span>Diagnose</span><span>Build</span><span>Integrate</span><span>Scale</span>
            </div>
          </div>
          <ConnectedSystemsDiagram />
        </div>
      </div>
    </section>
  );
}

/** The problem, then the reframe — one section, two moves. */
function ProblemAndReframe() {
  return (
    <Section id="problem">
      <SectionIntro
        index="01"
        label="The problem"
        title="Most growing businesses don't have a tool problem."
        copy="They have a systems problem. Here's what that usually looks like from the inside."
      />
      <ul className="friction-grid">
        {problems.map((problem) => (
          <li className="friction-item reveal" key={problem.title}>
            <p><strong>{problem.title}.</strong> {problem.detail}</p>
          </li>
        ))}
      </ul>
      <div className="pullquote reveal" style={{ marginTop: "var(--space-9)" }}>
        <p>Tools are implementation components. <em>The product is a better business system.</em></p>
      </div>
    </Section>
  );
}

/** How we work, then what that produces — one section, two moves. */
function MethodAndSystems() {
  return (
    <Section tone="cool" id="method">
      <SectionIntro
        index="02"
        label="How we work"
        title="We understand before we automate."
        copy="Technology comes second. Understanding the business — and proving the diagnosis is right — comes first."
      />
      <div className="method">
        {method.map((stage) => (
          <div className="method-stage" key={stage.stage}>
            <p className="method-stage-label label">{stage.stage} <span className="n">— {stage.description}</span></p>
            <div className="method-steps">
              {stage.steps.map((s) => (
                <div className="method-step reveal" key={s.n}>
                  <span className="method-step-dot" aria-hidden="true" />
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "var(--space-10)" }}>
        <p className="label">What we build</p>
        <h3 className="display-m" style={{ marginTop: "var(--space-3)", maxWidth: "24ch" }}>Systems, grouped by outcome.</h3>
      </div>
      <ul className="system-groups" style={{ marginTop: "var(--space-6)" }}>
        {systemGroups.map((group) => (
          <li className="system-group reveal" key={group.key}>
            <div className="system-group-head">
              <h4 className="heading">{group.name}</h4>
              <p className="small">{group.summary}</p>
            </div>
            <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "var(--space-8)" }}>
        <a className="link" href={routes.systems}>See the full systems page</a>
      </div>
    </Section>
  );
}

function OperatingSystemFlow() {
  return (
    <Section tone="deep" id="flow">
      <SectionIntro
        index="03"
        label="The operating system"
        title="How information moves through an Ellis system."
        copy="The same six-stage flow, whether it's a lead, a document or a support request."
      />
      <ul className="flow">
        {operatingFlow.map((f, i) => (
          <li className="flow-node reveal" style={step(i)} key={f.title}>
            <span className="flow-node-dot" aria-hidden="true" />
            <h3>{f.title}</h3>
            <p>{f.detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Proof() {
  return (
    <Section id="proof">
      <SectionIntro
        index="04"
        label="Proof"
        title="What's actually been built."
        copy="No client logos, results or testimonials yet — this is early. What's real is disclosed plainly, labeled by its actual status."
      />
      <ul className="rows">
        {proof.map((entry, i) => (
          <li className="row reveal" key={entry.name}>
            <span className="row-index">{String(i + 1).padStart(2, "0")}</span>
            <div className="row-head">
              <div className="row-head-line">
                <h3 className="display-m">{entry.name}</h3>
                <span className={`status${entry.pending ? " status-pending" : ""}`}>{entry.tag}</span>
              </div>
            </div>
            <div className="row-body"><p>{entry.description}</p></div>
          </li>
        ))}
      </ul>
      <p className="note">Client case studies will appear here as engagements are completed and results are verified.</p>
    </Section>
  );
}

/** Founding Client Program teaser (deliberately secondary) + Why Ellis. */
function FoundingAndPrinciples() {
  return (
    <Section tone="cool" id="founding-and-why">
      <div className="teaser-band reveal">
        <div className="teaser-band-copy">
          <p className="label">Founding client program</p>
          <p className="lede">A small number of service businesses get hands-on systems work at preferred founding-client pricing, in exchange for structured feedback.</p>
        </div>
        <a className="link" href={routes.founding}>About the program</a>
      </div>

      <SectionIntro index="05" label="Why Ellis" title="The principles behind how we work." />
      <ul className="principles">
        {principles.map((p) => (
          <li className="principle reveal" key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section tone="deep">
      <div className="section-head">
        <div className="section-marker reveal" aria-hidden="true">
          <span>06</span><span className="tick reveal-rule" />
        </div>
        <div className="section-head-body">
          <p className="label reveal">Get started</p>
          <h2 className="display-l statement reveal">Find the bottleneck before buying another tool.</h2>
          <p className="lede reveal">
            Tell us what's slowing the business down. Ellis AI Studio will assess the problem and
            identify where a better system could create the most leverage.
          </p>
          <div className="hero-actions reveal">
            <a className="button button-rust" href={routes.apply}>Apply for a Free Business Bottleneck Audit</a>
            <a className="link" href={studio.booking} target="_blank" rel="noreferrer">Book a conversation</a>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <ProblemAndReframe />
      <MethodAndSystems />
      <OperatingSystemFlow />
      <Proof />
      <FoundingAndPrinciples />
      <FinalCta />
    </SiteShell>
  );
}
