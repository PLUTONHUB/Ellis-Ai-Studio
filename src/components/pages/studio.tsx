/**
 * Studio pages: Systems, How It Works, Founding Client Program, About, Apply.
 * /apply is the site's only conversion form; the rest support the diagnosis
 * before it.
 */
import { SiteShell } from "~/components/layout/site-shell";
import { PageHeader, Section, SectionIntro, InlineMeta } from "~/components/layout/page";
import { AuditForm } from "~/components/forms/audit-form";
import { systemGroups, method } from "~/data/solutions";
import { founders } from "~/data/founders";
import { auditFaq } from "~/data/audit-form";
import { routes, mailto } from "~/data/links";

export function SystemsPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Systems"
        title="We build around the problem."
        lede="Not around a service menu. The right answer might be one system or several connected ones — that's what the diagnosis is for. Everything we build falls into one of four outcomes."
      />
      <Section>
        <ul className="rows">
          {systemGroups.map((group, index) => (
            <li className="row reveal" key={group.key}>
              <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="row-head"><h2 className="display-m">{group.name}</h2></div>
              <div className="row-body">
                <p>{group.summary}</p>
                <InlineMeta items={group.items} />
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="cool">
        <SectionIntro index="02" label="Start with context" title="Not sure which one you need?" copy="You shouldn't have to diagnose your own infrastructure before getting in touch." />
        <div className="hero-actions">
          <a className="button button-solid" href={routes.apply}>Request an audit</a>
          <a className="link" href={routes.howItWorks}>How we work</a>
        </div>
      </Section>
    </SiteShell>
  );
}

export function HowItWorksPage() {
  return (
    <SiteShell>
      <PageHeader
        label="How we work"
        title={<>Technology comes <em>second</em>.</>}
        lede="Understanding the business comes first. You don't need to know whether your problem needs automation, AI, a CRM, a website or something custom — determining that is the job. Ten steps, three stages."
      />
      <Section>
        <div className="method">
          {method.map((stage) => (
            <div className="method-stage" key={stage.stage}>
              <p className="method-stage-label label">{stage.stage} <span className="n">— {stage.description}</span></p>
              <div className="method-steps">
                {stage.steps.map((s) => (
                  <div className="method-step reveal" key={s.n}>
                    <span className="method-step-dot" aria-hidden="true" />
                    <p className="meta">{s.n}</p>
                    <h3>{s.title}</h3>
                    <p>{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="cool">
        <div className="hero-actions"><a className="button button-solid" href={routes.apply}>Request an audit</a></div>
      </Section>
    </SiteShell>
  );
}

export function FoundingPage() {
  const forYou = ["Repetitive admin exists", "Lead follow-up depends on memory", "Tools do not communicate", "Customers wait on manual handoffs", "Growth is exposing process problems", "You want diagnosis before technology"];
  const notForYou = ["You only want the cheapest website", "You want AI added everywhere", "You will not explain the current process", "You are not ready to implement changes", "You expect guaranteed revenue results from automation"];
  return (
    <SiteShell>
      <PageHeader
        label="Founding client program"
        title="A small number of businesses with a process worth fixing."
        lede="Selected businesses get hands-on systems design and implementation at preferred founding-client pricing, in exchange for structured feedback and permission to document what changed."
      />
      <Section>
        <div className="split">
          <div className="prose">
            <p>Ellis AI Studio is in its early growth stage. Instead of presenting results we don't have yet, we're choosing a small group of real businesses and earning that proof by solving real operational problems.</p>
            <div className="pullquote"><p>Earned proof, not manufactured portfolio pieces.</p></div>
          </div>
          <aside className="split-aside">
            <div className="aside-block">
              <p className="label">This is for you if</p>
              <ul>{forYou.map((x) => <li key={x}><span>{x}</span></li>)}</ul>
            </div>
            <div className="aside-block">
              <p className="label">This is probably not</p>
              <ul>{notForYou.map((x) => <li key={x}><span>{x}</span></li>)}</ul>
            </div>
          </aside>
        </div>
      </Section>
      <Section tone="cool">
        <SectionIntro index="02" label="What happens" title="From problem to proof." />
        <InlineMeta items={["Apply", "Audit", "Diagnosis", "Recommendation", "Scope", "Build", "Validate", "Document"]} />
        <div className="hero-actions" style={{ marginTop: "var(--space-7)" }}>
          <a className="button button-solid" href={routes.apply}>Apply for the program</a>
        </div>
      </Section>
    </SiteShell>
  );
}

export function AboutPage() {
  return (
    <SiteShell>
      <PageHeader
        label="About"
        title="An AI systems and business-operations company."
        lede="Ellis AI Studio identifies friction inside a business and builds the systems — AI, automation, websites, integrations — that remove it. Tools are implementation components; the product is a better business system."
      />
      <Section>
        <div className="split">
          <div className="prose">
            <p>The studio started with websites — helping businesses get online without enormous development budgets. It became obvious fairly quickly that the website usually wasn't the whole problem. The friction was everything happening around it.</p>
            <p>Information had to be copied by hand. Processes lived across disconnected apps. Things depended on someone remembering the next step. So the work moved from building pages to building systems: automations, connected workflows, structured intake, business intelligence and AI-assisted processes.</p>
            <p>That's still the instinct today: diagnose what's actually happening before recommending anything, and measure the result in time saved, cost reduced, and room to grow — not in software installed.</p>
          </div>
          <aside className="split-aside">
            <div className="aside-block">
              <p className="label">What we believe</p>
              <ul>
                {["AI isn't the strategy. Understanding the business is.", "A bad process automated faster is still a bad process.", "Not every task should be automated.", "Human review matters.", "Simple usually beats impressive."].map((x) => <li key={x}><span>{x}</span></li>)}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
      <Section tone="cool">
        <SectionIntro index="02" label="Founders" title="Who you actually work with." copy="There is no account layer between you and the people doing the work." />
        <ul className="rows">
          {founders.map((founder, index) => (
            <li className="row" id={founder.slug} key={founder.slug}>
              <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="row-head">
                <p className="label">{founder.role}</p>
                <h3 className="display-m">{founder.name}</h3>
              </div>
              <div className="row-body">
                <p>{founder.positioning}</p>
                {founder.focus.length > 0 && <InlineMeta items={founder.focus} />}
                <a className="link" href={mailto(founder.email)}>{founder.email}</a>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </SiteShell>
  );
}

export function ApplyPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Business bottleneck audit"
        title="What's the biggest challenge in your business right now?"
        lede="Don't worry about choosing a service. Tell us what's happening and we'll determine whether Ellis AI Studio can help — including if the answer is no."
      />
      <Section>
        <div className="split">
          <AuditForm />
          <aside className="split-aside">
            <div className="aside-block">
              <p className="label">Before you apply</p>
            </div>
            <div className="faq">
              {auditFaq.map(([question, answer]) => (
                <details key={question}><summary>{question}</summary><p>{answer}</p></details>
              ))}
            </div>
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
