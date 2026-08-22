/*
 * Zone 8 preview — homepage.
 *
 * Conversion order, deliberately: the first 390px screen carries brand,
 * positioning, the 4.9★ proof, both CTAs and the 24/7 signal — nothing is
 * pushed below the fold to make room for decoration. Emergency intent is caught
 * immediately after, before the visitor has to evaluate anything. Pricing —
 * the differentiator — sits high, above the service grid, because "One Service.
 * One Price." is the reason to choose Zone 8 over the next result on the page.
 */

import { Link } from "@tanstack/react-router";
import {
  business, faqs, reviewThemes, serviceAreas, services,
} from "~/data/zone8";
import { CallButton, Icon, Rating, RequestButton, SectionHead, VerifyBadge } from "~/components/zone8/primitives";
import { PricingExplorer } from "~/components/zone8/pricing-explorer";

/* ------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="z8-hero">
      <div className="z8-container z8-hero-grid">
        <div className="z8-reveal">
          <div className="z8-hero-eyebrow">
            <span className="z8-pill z8-pill-inverse">
              <span className="z8-dot z8-dot-pulse" style={{ color: "#5FCB92" }} />
              {business.hours}
            </span>
            <span className="z8-pill z8-pill-inverse">Seattle &amp; West Seattle</span>
          </div>

          <h1 className="z8-hero-type">Plumbing without the pricing games.</h1>

          <p className="z8-hero-lede">
            Straightforward plumbing and sewer service for Seattle homeowners — with the
            price agreed before the work starts, and someone to call when it can’t wait.
          </p>

          <div className="z8-hero-ctas">
            <CallButton className="z8-btn z8-btn-call" showNumber />
            <RequestButton className="z8-btn z8-btn-ghost-inverse" />
          </div>

          <div className="z8-hero-trust">
            <Rating />
            <Link className="z8-textlink" to="/preview/zone8/pricing">
              See upfront pricing <Icon name="arrow" size={14} />
            </Link>
          </div>

          <div className="z8-hero-foot">
            <span className="z8-hero-locale"><Icon name="pin" size={14} /> Serving Seattle &amp; surrounding communities</span>
          </div>
        </div>

        <HeroPanel />
      </div>
    </section>
  );
}

/*
 * Hero visual. A mock intake panel rather than photography.
 *
 * Reasoning: the brief rules out the smiling-man-with-a-wrench cliché, and no
 * licensed photography of Zone 8's own crew or trucks exists for this build.
 * Generic stock would undercut the "premium local operator" positioning it is
 * meant to support. So the visual does commercial work instead of decorative
 * work — it shows the upfront-pricing promise as an interface.
 * VERIFY WITH CLIENT — replace with commissioned photography at production.
 */
function HeroPanel() {
  const rows = [
    { label: "Drain / sewer", meta: "Backup — dispatched", active: true },
    { label: "Water heater", meta: "No hot water — scheduled", active: false },
    { label: "Leak", meta: "Under sink — quoted", active: false },
  ];
  return (
    <div className="z8-hero-visual z8-reveal" aria-hidden>
      <div className="z8-panel">
        <div className="z8-panel-head">
          <span className="z8-panel-title">Today’s board</span>
          <span className="z8-pill z8-pill-inverse"><span className="z8-dot" style={{ color: "#5FCB92" }} /> Live</span>
        </div>
        <div className="z8-panel-rows">
          {rows.map((row) => (
            <div key={row.label} className={`z8-panel-row${row.active ? " z8-panel-row-active" : ""}`}>
              <div>
                <div className="z8-panel-row-label">{row.label}</div>
                <div className="z8-panel-row-meta">{row.meta}</div>
              </div>
              <div className="z8-panel-price">
                <span className="z8-price-blur">$000</span>
              </div>
            </div>
          ))}
        </div>
        <div className="z8-panel-foot">
          <span className="z8-panel-title">Price agreed before work begins</span>
          <span className="z8-verify">Illustrative</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- emergency */

function EmergencyStrip() {
  return (
    <section className="z8-emergency">
      <div className="z8-container z8-emergency-inner">
        <div>
          <span className="z8-emergency-badge"><Icon name="alert" size={14} /> Plumbing emergency?</span>
          <h2 style={{ marginTop: 10 }}>Burst pipe, major leak or a backup right now?</h2>
          <p>Zone 8’s public listing shows the business is open 24 hours. For anything actively leaking or backing up, calling is faster than a form.</p>
        </div>
        <CallButton className="z8-btn z8-btn-call z8-btn-block" showNumber />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ trust */

function Trust() {
  return (
    <section className="z8-section z8-section-tight">
      <div className="z8-container">
        <div className="z8-grid" style={{ gridTemplateColumns: "1fr", gap: 20 }}>
          <SectionHead
            label="Reputation"
            title="Seattle homeowners trust Zone 8."
            lede="A 4.9-star average across 62 Google reviews, built on repeat customers rather than advertising."
            action={<Link className="z8-btn z8-btn-outline z8-btn-sm" to="/preview/zone8/reviews">Read reviews</Link>}
          />
          <div className="z8-grid z8-grid-4" style={{ alignItems: "stretch" }}>
            <div className="z8-score">
              <span className="z8-score-num">{business.rating}</span>
              <span className="z8-stars" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={13} />)}</span>
              <span className="z8-score-label">{business.reviewCount} Google reviews</span>
            </div>
            {reviewThemes.slice(0, 3).map((r) => (
              <article key={r.theme} className="z8-review">
                <p className="z8-label">{r.theme}</p>
                <p className="z8-review-quote">{r.summary}</p>
                <p className="z8-review-source">
                  <Icon name="check" size={13} /> Summary of public review themes — not a customer quote
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- services */

function ServiceGrid() {
  return (
    <section className="z8-section z8-section-alt" id="services">
      <div className="z8-container">
        <SectionHead
          label="What we handle"
          title="Plumbing and sewer work for Seattle homes."
          lede="From the drain that keeps backing up to the sewer line nobody wants to think about."
          action={<Link className="z8-btn z8-btn-outline z8-btn-sm" to="/preview/zone8/services">All services <Icon name="arrow" size={15} /></Link>}
        />
        <div className="z8-grid z8-grid-4">
          {services.map((service) => {
            const body = (
              <>
                <span className="z8-card-icon"><Icon name={service.icon} /></span>
                <h3>{service.name}</h3>
                <p>{service.blurb}</p>
                <span className="z8-card-cta">
                  {service.route ? "View service" : "Ask about this"} <Icon name="arrow" size={14} />
                </span>
              </>
            );
            return service.route ? (
              <Link key={service.slug} className="z8-card" to={service.route}>{body}</Link>
            ) : (
              <Link key={service.slug} className="z8-card" to="/preview/zone8/request-service">{body}</Link>
            );
          })}
        </div>
        <p className="z8-xs" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <VerifyBadge /> Service categories are inferred from public information and must be confirmed with Zone 8 before production.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pricing */

function Pricing() {
  return (
    <section className="z8-section" id="pricing">
      <div className="z8-container">
        <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "start" }}>
          <div className="z8-stack z8-g5">
            <div className="z8-stack z8-g3">
              <p className="z8-label">Transparent pricing</p>
              <h2 className="z8-display-l">One Service. One Price.</h2>
              <p className="z8-lede">
                Plumbing problems are stressful enough. Pricing shouldn’t be. Zone 8’s model is
                built around knowing what you’re paying before anyone starts working.
              </p>
            </div>
            <ul className="z8-stack z8-g4">
              {[
                { t: "The price comes first", d: "You hear the number for the agreed scope before the work begins — not after it’s finished." },
                { t: "No hourly clock running", d: "One service, one price, so a slow repair isn’t a bigger bill." },
                { t: "Changes get re-quoted", d: "If the job turns out to be something else, that’s a new conversation, not a surprise line item." },
              ].map((item) => (
                <li key={item.t} className="z8-pillar">
                  <h3>{item.t}</h3>
                  <p>{item.d}</p>
                </li>
              ))}
            </ul>
            <div>
              <Link className="z8-btn z8-btn-primary" to="/preview/zone8/pricing">Explore pricing <Icon name="arrow" size={16} /></Link>
            </div>
          </div>
          <PricingExplorer limit={5} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ how it works */

function HowItWorks() {
  const steps = [
    { n: "01", t: "Tell us what’s happening", d: "Call, or send a quick request describing the problem. A photo helps but isn’t required." },
    { n: "02", t: "Know what to expect", d: "You get the diagnosis, the options and the price for the agreed scope before any work starts." },
    { n: "03", t: "Get it handled", d: "Zone 8 resolves the problem and tells you what failed and what condition the rest of the plumbing is in." },
  ];
  return (
    <section className="z8-section z8-section-alt">
      <div className="z8-container">
        <SectionHead label="How it works" title="Plumbing service without the runaround." />
        <ol className="z8-steps">
          {steps.map((s) => (
            <li key={s.n} className="z8-step">
              <span className="z8-step-num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- why zone 8 */

function WhyZone8() {
  const pillars = [
    { icon: "shield", t: "Upfront pricing", d: "Less uncertainty before the work begins — the price is settled first." },
    { icon: "clock", t: "24/7 availability", d: "Zone 8’s public listing shows the business open 24 hours, for problems that don’t wait." },
    { icon: "star", t: "Local reputation", d: `${business.rating} stars from ${business.reviewCount} Google reviewers in the Seattle area.` },
    { icon: "check", t: "Clear communication", d: "Straightforward recommendations, explained in terms that let you make the decision." },
  ] as const;
  return (
    <section className="z8-section z8-section-dark" id="why">
      <div className="z8-container">
        <SectionHead label="Why Zone 8" title="Four reasons homeowners call back." />
        <div className="z8-grid z8-grid-4">
          {pillars.map((p) => (
            <div key={p.t} className="z8-pillar">
              <span className="z8-pillar-icon"><Icon name={p.icon} size={16} /></span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ service area */

function ServiceArea() {
  return (
    <section className="z8-section">
      <div className="z8-container">
        <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "center" }}>
          <div className="z8-stack z8-g5">
            <SectionHead
              label="Service area"
              title="Rooted in West Seattle."
              lede="Zone 8’s public listing places the business in the Seattle and West Seattle area."
            />
            <div className="z8-areas">
              {serviceAreas.primary.map((a) => <span key={a} className="z8-area z8-area-primary">{a}</span>)}
              {serviceAreas.neighbourhoods.map((a) => <span key={a} className="z8-area">{a}</span>)}
            </div>
            <p className="z8-xs" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <VerifyBadge /> Neighbourhood coverage is a preview placeholder pending confirmation.
            </p>
            <div>
              <Link className="z8-btn z8-btn-outline" to="/preview/zone8/service-area">Check your area <Icon name="arrow" size={15} /></Link>
            </div>
          </div>
          <AreaGraphic />
        </div>
      </div>
    </section>
  );
}

/* An abstract locality impression — water, shoreline and street grid. Explicitly
   not a map, so it cannot be read as a claim about street-level coverage. */
export function AreaGraphic() {
  return (
    <div className="z8-map">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract illustration of the Seattle shoreline and street grid">
        <defs>
          <linearGradient id="z8water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14545F" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0F1B27" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M0 0 H150 C120 60 138 96 108 140 C82 178 96 232 60 300 H0 Z" fill="url(#z8water)" />
        <g stroke="#F3F6F8" strokeOpacity="0.09" strokeWidth="1">
          {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="60" y1={20 + i * 32} x2="400" y2={20 + i * 32} />)}
          {Array.from({ length: 10 }, (_, i) => <line key={`v${i}`} x1={80 + i * 34} y1="0" x2={80 + i * 34} y2="300" />)}
        </g>
        <path d="M150 0 C120 60 138 96 108 140 C82 178 96 232 60 300" fill="none" stroke="#4CA7B6" strokeOpacity="0.5" strokeWidth="1.5" />
        {[
          { x: 196, y: 128, r: 15 },
          { x: 168, y: 186, r: 9 },
          { x: 240, y: 96, r: 9 },
          { x: 226, y: 200, r: 9 },
        ].map((c) => (
          <g key={`${c.x}-${c.y}`}>
            <circle cx={c.x} cy={c.y} r={c.r + 12} fill="#4CA7B6" fillOpacity="0.07" />
            <circle cx={c.x} cy={c.y} r={c.r} fill="#4CA7B6" fillOpacity="0.16" stroke="#4CA7B6" strokeOpacity="0.5" />
          </g>
        ))}
      </svg>
      <p className="z8-map-caption">Illustrative only — not a coverage map. Exact service area to be confirmed with Zone 8.</p>
    </div>
  );
}

/* -------------------------------------------------------------------- faq */

export function FaqList({ items = faqs }: { items?: typeof faqs }) {
  return (
    <div className="z8-faq">
      {items.map((f) => (
        <details key={f.q} className="z8-faq-item">
          <summary>
            {f.q}
            <span className="z8-faq-sign" aria-hidden><Icon name="plus" size={18} /></span>
          </summary>
          <div className="z8-faq-body">
            {f.a.map((para) => <p key={para}>{para}</p>)}
            {f.provenance === "unverified" ? <p><VerifyBadge /></p> : null}
          </div>
        </details>
      ))}
    </div>
  );
}

function Faq() {
  return (
    <section className="z8-section z8-section-alt" id="faq">
      <div className="z8-container">
        <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "start" }}>
          <SectionHead label="FAQ" title="Questions homeowners ask first." />
          <FaqList />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- final cta */

export function FinalCta() {
  return (
    <section className="z8-section z8-section-dark">
      <div className="z8-container z8-stack z8-g5" style={{ justifyItems: "center", textAlign: "center" }}>
        <h2 className="z8-display-l">Need a plumber?</h2>
        <p className="z8-lede" style={{ maxWidth: "44ch" }}>
          Don’t leave it to guesswork. Get the problem looked at and the price agreed before the work starts.
        </p>
        <div className="z8-hero-ctas" style={{ justifyContent: "center" }}>
          <CallButton className="z8-btn z8-btn-call" showNumber />
          <RequestButton className="z8-btn z8-btn-ghost-inverse" />
        </div>
        <div className="z8-stack z8-g3" style={{ justifyItems: "center" }}>
          <Rating />
          <span className="z8-pill z8-pill-inverse"><span className="z8-dot" style={{ color: "#5FCB92" }} /> {business.hours}</span>
        </div>
      </div>
    </section>
  );
}

export function Zone8Home() {
  return (
    <>
      <Hero />
      <EmergencyStrip />
      <Trust />
      <Pricing />
      <ServiceGrid />
      <HowItWorks />
      <WhyZone8 />
      <ServiceArea />
      <Faq />
      <FinalCta />
    </>
  );
}
