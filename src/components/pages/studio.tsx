/**
 * Studio pages: Solutions, How We Work, Founding Client Program, About, Apply,
 * Contact. All six stay live — four of them carry historically indexed URLs and
 * /apply is the studio's only conversion form.
 */
import { SiteShell } from "~/components/layout/site-shell";
import { PageHeader, Section, SectionIntro, InlineMeta } from "~/components/layout/page";
import { AuditForm } from "~/components/forms/audit-form";
import { FounderRows } from "~/components/founders/founder-parts";
import { capabilities, method } from "~/data/solutions";
import { auditFaq } from "~/data/audit-form";
import { routes, studio, emails, mailto } from "~/data/links";

export function SolutionsPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Solutions"
        title="We build around the problem."
        lede="Not around a service menu. The right answer might be one system or several connected ones — that is what the diagnosis is for."
      />
      <Section>
        <ul className="rows">
          {capabilities.map((capability, index) => (
            <li className="row reveal" key={capability.name}>
              <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="row-head"><h2 className="display-m">{capability.name}</h2></div>
              <div className="row-body">
                <p>{capability.summary}</p>
                <InlineMeta items={capability.includes} />
                <p className="small">{capability.outcome}</p>
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
        lede="Understanding the business comes first. You don't need to know whether your problem needs automation, AI, a CRM, a website or something custom — determining that is the job."
      />
      <Section>
        <ul className="rows">
          {method.map((step, index) => (
            <li className="row reveal" key={step.phase}>
              <span className="row-index">Phase {String(index + 1).padStart(2, "0")}</span>
              <div className="row-head">
                <h2 className="display-m">{step.phase}</h2>
                <p className="meta">{step.title}</p>
              </div>
              <div className="row-body"><p>{step.detail}</p></div>
            </li>
          ))}
        </ul>
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
        title="Three businesses with a process worth fixing."
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
        title="A studio that builds its own work."
        lede="Ellis AI Studio is a founder-led venture studio. We build systems, products, brands and ventures — for ourselves, and for the businesses we work with."
      />
      <Section>
        <div className="split">
          <div className="prose">
            <p>The studio started with websites — helping businesses get online without enormous development budgets. It became obvious fairly quickly that the website usually wasn't the whole problem. The friction was everything happening around it.</p>
            <p>Information had to be copied by hand. Processes lived across disconnected apps. Things depended on someone remembering the next step. So the work moved from building pages to building systems: automations, connected workflows, structured intake, business intelligence and AI-assisted processes.</p>
            <p>The same instinct now drives the studio's own ventures. Building for clients and building for ourselves inform each other — what we learn shipping a venture makes the client work sharper, and the reverse is just as true.</p>
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
        <SectionIntro index="02" label="Founders" title="Who you actually work with." />
        <FounderRows />
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

export function ContactPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Contact"
        title="Tell us what you're trying to build."
        lede="Studio work and creator work start in different places. Pick the one that matches what you need."
      />
      <Section>
        <div className="contact-paths">
          <div className="contact-path">
            <p className="label">Hire the studio</p>
            <h2 className="display-m">AI systems, automation and business infrastructure.</h2>
            <p>Start with the business problem rather than picking a service. We'll assess the process first and tell you whether we're the right fit.</p>
            <div className="hero-actions">
              <a className="button button-solid" href={routes.apply}>Request an audit</a>
              <a className="link" href={studio.booking} target="_blank" rel="noreferrer">Book 30 minutes</a>
            </div>
            <p className="small">Prefer email?</p>
            <a className="contact-inline" href={mailto(emails.jake)}>{emails.jake}</a>
          </div>
          <div className="contact-path is-secondary">
            <p className="label">Creator &amp; brand partnerships</p>
            <h2 className="display-m">Content and venture collaborations.</h2>
            <p>Creator enquiries go straight to the founder who'd be doing the work — not into a sales pipeline.</p>
            <ul className="contact-list">
              <li>
                <strong>JAK3FFECT</strong>
                <span>Fitness, wellness, tech, travel, lifestyle</span>
                <a href={mailto(emails.jake, "UGC Inquiry — JAK3FFECT")}>{emails.jake}</a>
              </li>
              <li>
                <strong>organicambervibez</strong>
                <span>Lifestyle, motherhood, finance, beauty, wellness</span>
                <a href={mailto(emails.amber, "UGC Inquiry — organicambervibez")}>{emails.amber}</a>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
