/*
 * Zone 8 preview — secondary pages.
 *
 * These exist so the preview demonstrates a real information architecture rather
 * than a single scrolling page: the service landing pages are the ones that would
 * carry local search intent in production, so they are built as a reusable
 * template rather than as one-off layouts.
 */

import { Link } from "@tanstack/react-router";
import {
  business, faqs, landingServices, reviewThemes, serviceAreas, services, type Service,
} from "~/data/zone8";
import { CallButton, Icon, Rating, RequestButton, SectionHead, VerifyBadge } from "~/components/zone8/primitives";
import { PricingExplorer } from "~/components/zone8/pricing-explorer";
import { RequestForm } from "~/components/zone8/request-form";
import { AreaGraphic, FaqList, FinalCta } from "~/components/zone8/home";

/** Shared page opener for the interior routes. */
function PageHero({ label, title, lede, children }: { label: string; title: string; lede: string; children?: React.ReactNode }) {
  return (
    <section className="z8-hero" style={{ paddingBlock: "clamp(30px,4.5vw,60px)" }}>
      <div className="z8-container z8-stack z8-g4">
        <p className="z8-label">{label}</p>
        <h1 className="z8-display-l" style={{ color: "#fff" }}>{title}</h1>
        <p className="z8-hero-lede" style={{ marginTop: 0 }}>{lede}</p>
        {children}
      </div>
    </section>
  );
}

/** Breadcrumb trail. Also the shape the breadcrumb schema would use at launch. */
function Crumbs({ trail }: { trail: { name: string; to: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 14 }}>
      <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        {trail.map((c, i) => (
          <li key={c.to} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i < trail.length - 1 ? (
              <>
                <Link className="z8-xs" to={c.to} style={{ color: "var(--z8-inverse-muted)" }}>{c.name}</Link>
                <span className="z8-xs" aria-hidden style={{ color: "var(--z8-inverse-muted)" }}>/</span>
              </>
            ) : (
              <span className="z8-xs" aria-current="page" style={{ color: "var(--z8-inverse)" }}>{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------ /services */

export function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        title="Plumbing and sewer work, handled straight."
        lede="Every job priced up front for the agreed scope, whether it's a dripping tap or a failed side sewer."
      >
        <div className="z8-hero-ctas">
          <CallButton className="z8-btn z8-btn-call" showNumber />
          <RequestButton className="z8-btn z8-btn-ghost-inverse" />
        </div>
      </PageHero>

      <section className="z8-section">
        <div className="z8-container">
          <div className="z8-grid z8-grid-3">
            {services.map((s) => {
              const body = (
                <>
                  <span className="z8-card-icon"><Icon name={s.icon} /></span>
                  <h2 className="z8-heading">{s.name}</h2>
                  <p>{s.blurb}</p>
                  <span className="z8-card-cta">{s.route ? "View service" : "Ask about this"} <Icon name="arrow" size={14} /></span>
                </>
              );
              return s.route ? (
                <Link key={s.slug} className="z8-card" to={s.route}>{body}</Link>
              ) : (
                <Link key={s.slug} className="z8-card" to="/preview/zone8/request-service">{body}</Link>
              );
            })}
          </div>
          <p className="z8-xs" style={{ marginTop: 18, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <VerifyBadge /> This catalogue is inferred from Zone 8's public listing and trade name. Confirm the real service list before production.
          </p>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* -------------------------------------------------- service detail template */

export function ServiceDetailPage({ service }: { service: Service }) {
  const detail = service.detail;
  if (!detail) return null;
  const others = landingServices.filter((s) => s.slug !== service.slug);

  return (
    <>
      <section className="z8-hero" style={{ paddingBlock: "clamp(28px,4vw,56px) clamp(34px,4.5vw,64px)" }}>
        <div className="z8-container">
          <Crumbs trail={[
            { name: "Home", to: "/preview/zone8" },
            { name: "Services", to: "/preview/zone8/services" },
            { name: service.name, to: `/preview/zone8/${service.slug}` },
          ]} />
          <div className="z8-hero-grid">
            <div>
              <p className="z8-label">{service.name}</p>
              <h1 className="z8-display-l" style={{ color: "#fff", marginTop: 10 }}>{detail.title}</h1>
              <p className="z8-hero-lede">{detail.intro}</p>
              <div className="z8-hero-ctas">
                <CallButton className="z8-btn z8-btn-call" showNumber />
                <RequestButton className="z8-btn z8-btn-ghost-inverse" />
              </div>
              <div className="z8-hero-trust"><Rating /></div>
            </div>
            <div className="z8-panel">
              <div className="z8-panel-head">
                <span className="z8-panel-title">Call us if you're seeing</span>
                <span className="z8-pill z8-pill-inverse"><span className="z8-dot z8-dot-pulse" style={{ color: "#5FCB92" }} /> {business.hours}</span>
              </div>
              <ul className="z8-stack z8-g3">
                {detail.signals.map((s) => (
                  <li key={s} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.875rem", color: "var(--z8-inverse)" }}>
                    <span style={{ color: "var(--z8-steel-400)", marginTop: 2, flex: "none" }}><Icon name="check" size={15} /></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="z8-section">
        <div className="z8-container">
          <SectionHead label="How Zone 8 approaches it" title="One service. One price. No surprise line items." />
          <div className="z8-grid z8-grid-3">
            {detail.approach.map((step, i) => (
              <div key={step.heading} className="z8-step">
                <span className="z8-step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{step.heading}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
          <p className="z8-xs" style={{ marginTop: 18, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <VerifyBadge /> Service scope and process described here are preview concepts, not statements confirmed by the business.
          </p>
        </div>
      </section>

      <section className="z8-section z8-section-alt">
        <div className="z8-container">
          <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "start" }}>
            <div className="z8-stack z8-g5">
              <SectionHead label="Other services" title="Related work Zone 8 handles." />
              <div className="z8-grid" style={{ gap: 12 }}>
                {others.map((s) => (
                  <Link key={s.slug} className="z8-card" to={s.route} style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                    <span className="z8-card-icon"><Icon name={s.icon} /></span>
                    <span style={{ flex: 1 }}>
                      <span className="z8-heading" style={{ display: "block" }}>{s.name}</span>
                      <span className="z8-xs">{s.blurb}</span>
                    </span>
                    <span className="z8-arrow" style={{ color: "var(--z8-steel-600)" }}><Icon name="arrow" size={16} /></span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="z8-stack z8-g4">
              <SectionHead label="Questions" title="Before you call." />
              <FaqList items={faqs.slice(0, 4)} />
            </div>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------- /pricing */

export function PricingPage() {
  return (
    <>
      <PageHero
        label="Transparent pricing"
        title="One Service. One Price."
        lede="Plumbing problems are stressful enough. Pricing shouldn't be — you should know what you're paying before the work starts."
      />
      <section className="z8-section">
        <div className="z8-container">
          <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "start" }}>
            <div className="z8-stack z8-g6">
              <div className="z8-stack z8-g5">
                {[
                  { t: "You get the price before the work", d: "The number is agreed for a defined scope up front. No hourly clock, no estimate that drifts once someone is under the sink." },
                  { t: "A changed job is a new conversation", d: "If the problem turns out to be something else, you hear that and re-decide — it doesn't quietly become a bigger invoice." },
                  { t: "The stressful part stays the plumbing", d: "Most of the anxiety in a plumbing call is financial. Removing that is most of the service." },
                ].map((item) => (
                  <div key={item.t} className="z8-pillar">
                    <span className="z8-pillar-icon"><Icon name="shield" size={16} /></span>
                    <h2 className="z8-heading">{item.t}</h2>
                    <p>{item.d}</p>
                  </div>
                ))}
              </div>
              <div className="z8-card" style={{ background: "var(--z8-canvas-alt)" }}>
                <p className="z8-label">A note on this page</p>
                <p className="z8-small">
                  Zone 8's real prices are not published publicly, so this preview shows none. Every figure in the
                  panel is a blurred placeholder with no value behind it. At production these become Zone 8's own
                  confirmed prices — or the panel becomes a "call for your price" flow, whichever the business prefers.
                </p>
                <p><VerifyBadge>Pricing model to confirm</VerifyBadge></p>
              </div>
            </div>
            <PricingExplorer />
          </div>
        </div>
      </section>
      <section className="z8-section z8-section-alt">
        <div className="z8-container">
          <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "start" }}>
            <SectionHead label="FAQ" title="Pricing questions." />
            <FaqList items={faqs.filter((f) => /pricing|upfront|call or submit|after I call/i.test(f.q + f.a.join(" ")))} />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* --------------------------------------------------------- /service-area */

export function ServiceAreaPage() {
  return (
    <>
      <PageHero
        label="Service area"
        title="Seattle and the west side."
        lede="Zone 8's public listing places the business in the Seattle and West Seattle area, open 24 hours."
      />
      <section className="z8-section">
        <div className="z8-container">
          <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "center" }}>
            <div className="z8-stack z8-g5">
              <SectionHead label="Where we work" title="Neighbourhoods in the preview." lede="Listed for the concept only — the confirmed coverage list comes from the business." />
              <div className="z8-areas">
                {serviceAreas.primary.map((a) => <span key={a} className="z8-area z8-area-primary">{a}</span>)}
                {serviceAreas.neighbourhoods.map((a) => <span key={a} className="z8-area">{a}</span>)}
              </div>
              <p className="z8-xs" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <VerifyBadge /> Neighbourhood list is an unconfirmed preview placeholder. No street-level coverage or response time is claimed.
              </p>
              <div className="z8-hero-ctas" style={{ marginTop: 0 }}>
                <CallButton className="z8-btn z8-btn-call" label="Ask if we cover you" />
                <RequestButton className="z8-btn z8-btn-outline" />
              </div>
            </div>
            <AreaGraphic />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* -------------------------------------------------------------- /reviews */

export function ReviewsPage() {
  return (
    <>
      <PageHero
        label="Reviews"
        title="Built on repeat customers and referrals."
        lede="Zone 8's existing reputation is one of its biggest assets — a 4.9-star average across 62 Google reviews."
      >
        <div className="z8-hero-trust"><Rating /></div>
      </PageHero>
      <section className="z8-section">
        <div className="z8-container">
          <div className="z8-grid z8-grid-4" style={{ marginBottom: 28 }}>
            <div className="z8-score">
              <span className="z8-score-num">{business.rating}</span>
              <span className="z8-stars" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={13} />)}</span>
              <span className="z8-score-label">Average rating</span>
            </div>
            <div className="z8-score">
              <span className="z8-score-num">{business.reviewCount}</span>
              <span className="z8-score-label">Google reviews</span>
            </div>
            <div className="z8-score">
              <span className="z8-score-num">24/7</span>
              <span className="z8-score-label">Listed availability</span>
            </div>
            <div className="z8-score">
              <span className="z8-score-num">WA</span>
              <span className="z8-score-label">Seattle area</span>
            </div>
          </div>

          <SectionHead
            label="What reviewers mention"
            title="Themes from public feedback."
            lede="Summarised in Ellis AI Studio's words — these are not customer quotes, and no reviewer is named or invented."
            action={<a className="z8-btn z8-btn-outline z8-btn-sm" href={business.reviewsUrl} target="_blank" rel="noreferrer noopener">Read Google reviews <Icon name="arrow" size={15} /></a>}
          />
          <div className="z8-grid z8-grid-3">
            {reviewThemes.map((r) => (
              <article key={r.theme} className="z8-review">
                <span className="z8-stars" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={13} />)}</span>
                <p className="z8-label">{r.theme}</p>
                <p className="z8-review-quote">{r.summary}</p>
                <p className="z8-review-source"><Icon name="check" size={13} /> Theme summary — not a verbatim review</p>
              </article>
            ))}
          </div>
          <div className="z8-card" style={{ marginTop: 22, background: "var(--z8-canvas-alt)" }}>
            <p className="z8-label">Production note</p>
            <p className="z8-small">
              At launch this page pulls real, attributed Google reviews through the Business Profile API so the
              rating and the newest reviews stay current. Nothing here is fabricated in the meantime: no names, no
              quotes, no invented star counts.
            </p>
            <p><VerifyBadge>Review import pending</VerifyBadge></p>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------ /request-service */

export function RequestServicePage() {
  return (
    <>
      <PageHero
        label="Request service"
        title="Tell us what's happening."
        lede="A few details now means the callback starts with the context already in hand — not at the beginning."
      >
        <div className="z8-hero-foot">
          <span className="z8-hero-locale"><Icon name="clock" size={14} /> Urgent? Calling is faster.</span>
          <CallButton className="z8-btn z8-btn-call z8-btn-sm" showNumber />
        </div>
      </PageHero>
      <section className="z8-section">
        <div className="z8-container">
          <div className="z8-grid z8-grid-2" style={{ gap: 32, alignItems: "start" }}>
            {/* Form first in source order: on a 390px screen the visitor came to
                submit, not to read the process column. */}
            <div className="z8-card" style={{ padding: "clamp(18px,2.5vw,28px)" }}>
              <RequestForm />
            </div>
            <aside className="z8-stack z8-g5">
              <div className="z8-stack z8-g4">
                <SectionHead label="What happens next" title="Three steps, no runaround." />
                <ol className="z8-stack z8-g4">
                  {[
                    { t: "We read the details", d: "Your description sets the category and urgency before anyone picks up the phone." },
                    { t: "We confirm the price", d: "You hear what the work involves and what it costs for the agreed scope." },
                    { t: "We schedule it", d: "Emergency work gets a call back first; everything else gets a time that suits you." },
                  ].map((s, i) => (
                    <li key={s.t} className="z8-pillar">
                      <span className="z8-step-num">{String(i + 1).padStart(2, "0")}</span>
                      <h3>{s.t}</h3>
                      <p>{s.d}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="z8-card" style={{ background: "var(--z8-canvas-alt)" }}>
                <p className="z8-label">Preview notice</p>
                <p className="z8-small">
                  This concept form does not transmit or store anything. No submission reaches Zone 8, Ellis AI
                  Studio or any third party. For a real plumbing problem, call{" "}
                  <a className="z8-textlink" href={business.phoneHref}>{business.phone}</a>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
