import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  jake, heroLines, heroLede, primaryNiches, secondaryNiches, services,
  deliverablesTop, deliverablesBottom, process, principles, faqs,
  experience, aboutParagraphs, socials,
} from "~/data/jake";
import "~/styles/system/jake.css";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

const NAV = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Process", "#process"],
  ["FAQ", "#faq"],
] as const;

/* -------------------------------------------------------------- primitives */

/**
 * Marquee row. The list is rendered twice and the track slides exactly -50%,
 * so the loop is seamless whatever the items measure. The duplicate is hidden
 * from assistive tech, which reads the row once.
 */
function Ticker({
  items, direction = "left", speed = 46,
}: { items: readonly string[]; direction?: "left" | "right"; speed?: number }) {
  return (
    <div className="jake-ticker" data-direction={direction}>
      <div className="jake-ticker-track" style={{ "--jk-speed": `${speed}s` } as CSSProperties}>
        <ul className="jake-ticker-group" style={{ display: "flex", gap: "var(--space-5)", listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => <li key={item} className="jake-chip">{item}</li>)}
        </ul>
        <ul aria-hidden="true" style={{ display: "flex", gap: "var(--space-5)", listStyle: "none", margin: 0, padding: "0 0 0 var(--space-5)" }}>
          {items.map((item) => <li key={item} className="jake-chip">{item}</li>)}
        </ul>
      </div>
    </div>
  );
}

function Panel({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section className="jake-panel" id={id}>
      <div className="jake-panel-inner">{children}</div>
    </section>
  );
}

function SectionHead({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <header>
      <p className="jake-eyebrow reveal">{eyebrow}</p>
      <h2 className="jake-h2 reveal">{title}</h2>
      {lede && <p className="jake-lede reveal">{lede}</p>}
    </header>
  );
}

/* ------------------------------------------------------------------ shell */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="jake-header" data-scrolled={scrolled}>
      <div className="container jake-header-inner">
        <a className="jake-wordmark" href="#top" aria-label={`${jake.brand} — top of page`}>
          JAK<span>3</span>FFECT
        </a>
        <nav className="jake-nav" aria-label="Sections">
          {NAV.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="jake-btn jake-btn-solid" href={`mailto:${jake.email}?subject=${encodeURIComponent("UGC enquiry")}`}>
          Work with Jake
        </a>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- blocks */

function Hero() {
  return (
    <section className="jake-hero" id="top">
      <span className="jake-hero-ghost parallax-soft" aria-hidden="true">JAK3</span>
      <div className="container jake-hero-inner">
        <p className="jake-hero-label enter" style={step(0)}>
          {jake.role}
          <span className="rule enter-rule" style={step(1)} aria-hidden="true" />
        </p>
        <h1 className="jake-hero-type enter-mask">
          {heroLines.map((line, i) => (
            <span className="line" key={line} style={step(i + 1)}>{line}</span>
          ))}
        </h1>
        <p className="jake-hero-lede enter" style={step(3)}>{heroLede}</p>
        <div className="jake-actions enter" style={step(4)}>
          <a className="jake-btn jake-btn-solid" href={`mailto:${jake.email}?subject=${encodeURIComponent("UGC enquiry")}`}>
            Start a project
          </a>
          <a className="jake-btn" href="#work">See the work</a>
        </div>
        <div className="jake-scrollcue enter" style={step(5)}>
          <span>Scroll</span>
          <span className="rule" aria-hidden="true" />
          <span>Categories Jake shoots</span>
        </div>
      </div>
      <div className="jake-hero-ticker">
        <Ticker items={primaryNiches.map((n) => n.name)} speed={52} />
      </div>
    </section>
  );
}

/**
 * The template's three-column masonry. The centre column is wider and sits
 * flush to the top while the outer two drop — that offset is the effect, so
 * the six categories are dealt across columns rather than listed in order.
 */
function Work() {
  const columns = [
    [primaryNiches[0], primaryNiches[3]],
    [primaryNiches[1], primaryNiches[4]],
    [primaryNiches[2], primaryNiches[5]],
  ];
  return (
    <Panel id="work">
      <SectionHead
        eyebrow="01 — Work"
        title="The categories the work lives in."
        lede="Selected projects publish here as they ship. Until then, this is what Jake shoots and why each category earns its place."
      />
      <div className="jake-work">
        {columns.map((column, ci) => (
          <div className="jake-work-col" key={ci}>
            {column.map((niche) => {
              const index = primaryNiches.indexOf(niche);
              return (
                <article className="jake-card reveal" key={niche.name}>
                  <span className="jake-card-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{niche.name}</h3>
                  <p>{niche.note}</p>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function About() {
  return (
    <Panel id="about">
      <div className="jake-split jake-split-wide">
        <div>
          <SectionHead eyebrow="02 — About" title={`Meet ${jake.short}.`} />
          <div className="jake-prose reveal" style={{ marginTop: "var(--space-6)" }}>
            {aboutParagraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </div>

          <div className="jake-rule" />

          <p className="jake-eyebrow reveal">Focus</p>
          <ul className="jake-pills reveal" style={{ listStyle: "none", margin: "var(--space-5) 0 0", padding: 0 }}>
            {[...primaryNiches.map((n) => n.name), ...secondaryNiches].map((item) => (
              <li className="jake-pill" key={item}>{item}</li>
            ))}
          </ul>

          <div className="jake-rule" />

          <p className="jake-eyebrow reveal">Currently</p>
          <ul className="jake-exp reveal" style={{ listStyle: "none", margin: "var(--space-5) 0 0", padding: 0 }}>
            {experience.map((row) => (
              <li key={row.role}>
                <span className="role">{row.role}</span>
                <span className="period">{row.period}</span>
                <span className="org">{row.org}</span>
              </li>
            ))}
          </ul>
        </div>

        {/*
          Portrait slot. Left deliberately empty — Jake supplies real imagery
          after design approval, and nothing generated or stock stands in.
        */}
        <div className="jake-slot reveal" role="img" aria-label="Reserved for a photograph of Jacob Ellis">
          <span>Portrait — to be supplied</span>
        </div>
      </div>

      <div className="jake-rule" />

      <p className="jake-eyebrow reveal">Also shoots</p>
      <div className="jake-reel">
        {secondaryNiches.map((name) => (
          <article className="jake-card" key={name}>
            <h3>{name}</h3>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function Services() {
  return (
    <Panel id="services">
      <SectionHead
        eyebrow="03 — Services"
        title="What gets delivered."
        lede="Formats that read as native to the feed while still being built around a job the content has to do."
      />
      <div className="jake-bento">
        {services.map((service, i) => (
          <article className="jake-service reveal" key={service.title}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{service.title}</h3>
            <p>{service.copy}</p>
          </article>
        ))}
      </div>

      <div style={{ display: "grid", gap: "var(--space-4)", marginTop: "clamp(32px, 4vw, 56px)" }}>
        <Ticker items={deliverablesTop} speed={54} />
        <Ticker items={deliverablesBottom} direction="right" speed={54} />
      </div>
    </Panel>
  );
}

function Process() {
  return (
    <Panel id="process">
      <SectionHead
        eyebrow="04 — Process"
        title="How a project runs."
        lede="Three stages. Nothing is filmed before it is clear what the content has to achieve."
      />
      <div className="jake-steps">
        {process.map((stage) => (
          <article className="jake-step reveal" key={stage.step}>
            <span className="n" aria-hidden="true">{stage.step}</span>
            <h3>{stage.title}</h3>
            <p>{stage.copy}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

/**
 * Replaces the template's testimonial wall. There are no clients to quote yet,
 * so the slot carries commitments about how the work runs instead of invented
 * praise or fabricated statistics.
 */
function Principles() {
  return (
    <Panel>
      <SectionHead
        eyebrow="05 — How it works"
        title="What you can hold the work to."
        lede="No client testimonials are published here yet. These are the terms the work runs on in the meantime."
      />
      <div className="jake-trio">
        {principles.map((item) => (
          <article className="jake-principle reveal" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function Faq() {
  return (
    <Panel id="faq">
      <div className="jake-split">
        <div>
          <SectionHead eyebrow="06 — FAQ" title="Answers." />
          <div className="jake-actions">
            <a className="jake-btn" href={jake.booking} target="_blank" rel="noreferrer">Book a call</a>
          </div>
        </div>
        <div className="jake-faq">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p className="answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function Contact() {
  return (
    <Panel id="contact">
      <div className="jake-contact">
        <SectionHead eyebrow="07 — Contact" title="Send the product and the problem." />
        <p className="jake-lede reveal">
          The categories it sits in, and what the content needs to do. That’s enough to come back with an approach.
        </p>
        <a className="jake-mail reveal" href={`mailto:${jake.email}?subject=${encodeURIComponent("UGC enquiry")}`}>
          {jake.email}
        </a>
        <ul className="jake-socials reveal" style={{ listStyle: "none", margin: "var(--space-7) 0 0", padding: 0 }}>
          {socials.map((social) => (
            <li key={social.label}>
              <a className="jake-pill" href={social.href} target="_blank" rel="noreferrer">{social.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

export function JakePortfolioPage() {
  return (
    <div className="jake jake-shell">
      <a className="skip-link" href="#work">Skip to content</a>
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Services />
        <Process />
        <Principles />
        <Faq />
        <Contact />
      </main>
      <footer className="jake-footer">
        <div className="jake-footer-inner">
          <p>© 2026 {jake.brand}</p>
          <p>{jake.name}</p>
          <p><a href={`mailto:${jake.email}`}>{jake.email}</a></p>
        </div>
      </footer>
    </div>
  );
}
