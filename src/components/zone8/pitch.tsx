/*
 * /preview/zone8/pitch — the Ellis AI Studio presentation view.
 *
 * Audience: the Zone 8 owner, over a screen share. Its whole job is to make one
 * contrast legible in about thirty seconds — a 4.9-star business is buying
 * Google's traffic with its reputation and then dropping it on an expired page.
 *
 * Discipline: every claim on this page is either a public fact about Zone 8's
 * listing, or a description of work Ellis would do. There are no invented
 * revenue figures, no fabricated conversion-rate promises and no "you're losing
 * $X a month" arithmetic — that number is unknowable from outside the business,
 * and inventing it is how a credible pitch becomes a dishonest one.
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { business, expiredSiteScreenshot, expiredSiteUrl, verificationItems } from "~/data/zone8";
import { Icon } from "~/components/zone8/primitives";

function Flow({ nodes }: { nodes: { label: string; tone?: "fail" | "win" }[] }) {
  return (
    <div className="z8-flow">
      {nodes.map((node, i) => (
        <div key={node.label}>
          <div className={`z8-flow-node${node.tone === "fail" ? " z8-flow-node-fail" : node.tone === "win" ? " z8-flow-node-win" : ""}`}>
            <span className="z8-flow-index">{String(i + 1).padStart(2, "0")}</span>
            {node.label}
          </div>
          {i < nodes.length - 1 ? <div className="z8-flow-arrow" aria-hidden /> : null}
        </div>
      ))}
    </div>
  );
}

/*
 * Proof of the broken customer journey: Zone 8's current website as a customer
 * finds it.
 *
 * Renders the real captured screenshot when one is supplied
 * (`expiredSiteScreenshot` in ~/data/zone8 — drop the file at
 * public/preview/zone8-expired-site.png and point the constant at it). The
 * capture is shown unmodified inside browser chrome: framed, never retouched,
 * because its entire value is being exactly what the customer sees.
 *
 * With no capture supplied this falls back to a clearly-labelled reconstruction
 * so the pitch still reads — and says so, rather than passing a drawing off as
 * evidence. The <img> also falls back on load error, so a missing or misnamed
 * file degrades instead of showing a broken image mid-presentation.
 *
 * Appears ONLY on this route — never on the consumer-facing preview.
 */
function ExpiredShot() {
  const [failed, setFailed] = useState(false);
  const showReal = Boolean(expiredSiteScreenshot) && !failed;

  return (
    <figure className="z8-expired" style={{ margin: 0 }}>
      <div className="z8-expired-chrome">
        <span className="z8-expired-dot" /><span className="z8-expired-dot" /><span className="z8-expired-dot" />
        <span className="z8-expired-url">{expiredSiteUrl}</span>
      </div>

      {showReal ? (
        <img
          src={expiredSiteScreenshot as string}
          alt="Screenshot of Zone 8 Plumbing & Sewer's current website showing an expired-website notice"
          style={{ width: "100%", display: "block" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="z8-expired-body">
          <h4>Website Expired</h4>
          <p>This website has expired. If you are the site owner, please renew.</p>
        </div>
      )}

      <figcaption className="z8-xs" style={{ padding: "10px 12px", borderTop: "1px solid #E4E4E4", color: "#6B6B6B" }}>
        {showReal
          ? "Zone 8's live website, captured from the link on its Google Business Profile."
          : "Reconstruction — no capture supplied with this build. Drop the real screenshot in before presenting."}
      </figcaption>
    </figure>
  );
}

/* The verification register, always visible on the internal route. The inline
   badges are hidden from the prospect view, so this is what stops an unverified
   claim reaching production unnoticed. */
function VerificationRegister() {
  return (
    <div className="z8-compare-col" style={{ padding: "clamp(20px,3vw,32px)" }}>
      <div className="z8-stack z8-g3">
        <p className="z8-label">Before anything ships</p>
        <h2 className="z8-display-m">Verify with Zone 8</h2>
        <p className="z8-small" style={{ maxWidth: "62ch" }}>
          The prospect-facing pages read as a finished website by design. Everything below is unconfirmed and must be
          checked with the business before launch. Append <code>?internal=1</code> to any preview URL to see these
          flags inline on the pages themselves.
        </p>
      </div>
      <ul className="z8-stack z8-g4" style={{ marginTop: 20 }}>
        {verificationItems.map((item) => (
          <li key={item.area} style={{ display: "grid", gap: 4, paddingBottom: 14, borderBottom: "1px solid var(--z8-line-inverse)" }}>
            <span className="z8-heading" style={{ color: "#fff" }}>{item.area}</span>
            <span className="z8-small">{item.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PitchPage() {
  const improvements = [
    "Restore a working website behind the Google listing",
    "Build the transparent-pricing positioning into the brand",
    "Rebuild the mobile experience around calling and requesting",
    "Add service landing pages for the searches that already convert",
    "Establish a local SEO architecture that can rank",
    "Capture structured leads instead of a phone number alone",
    "Prepare missed-call recovery so a busy line isn't a lost job",
    "Automate follow-up on requests that don't book immediately",
    "Build review-growth infrastructure on the 4.9 you already have",
    "Add analytics so the next decision is made on data",
  ];

  return (
    <div className="z8 z8-pitch">
      <section className="z8-section z8-pitch-hero">
        <div className="z8-container z8-stack z8-g5">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="z8-pill z8-pill-inverse">Ellis AI Studio</span>
            <span className="z8-pill z8-pill-inverse">Prospect brief · Zone 8 Plumbing &amp; Sewer</span>
          </div>
          <h1 className="z8-hero-type" style={{ maxWidth: "18ch" }}>
            You already earned the traffic. It’s landing on a dead page.
          </h1>
          <p className="z8-lede" style={{ maxWidth: "56ch" }}>
            Zone 8 has a {business.rating}-star rating across {business.reviewCount} Google reviews and a listing
            that says open 24 hours. Every customer who taps <em>Website</em> on that listing lands on an expired
            Squarespace page — and goes back to Google.
          </p>
          <div className="z8-grid z8-grid-4" style={{ marginTop: 8 }}>
            {[
              { n: `${business.rating}★`, l: "Google rating" },
              { n: String(business.reviewCount), l: "Reviews earned" },
              { n: "24/7", l: "Listed availability" },
              { n: "0", l: "Working website" },
            ].map((m) => (
              <div key={m.l} className="z8-metric">
                <span className="z8-metric-num">{m.n}</span>
                <span className="z8-metric-label">{m.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="z8-section z8-section-tight">
        <div className="z8-container z8-stack z8-g6">
          <div className="z8-stack z8-g3">
            <p className="z8-label">The gap</p>
            <h2 className="z8-display-l">Same search. Two different outcomes.</h2>
          </div>
          <div className="z8-compare">
            <div className="z8-compare-col z8-compare-now">
              <div className="z8-compare-title"><Icon name="alert" size={17} /> Current customer experience</div>
              <Flow nodes={[
                { label: "Homeowner searches “plumber near me”" },
                { label: "Finds the Zone 8 listing — 4.9★, open 24 hours" },
                { label: "Taps Website" },
                { label: "“Website Expired”", tone: "fail" },
                { label: "Back to Google — competitor gets the call", tone: "fail" },
              ]} />
              <ExpiredShot />
            </div>

            <div className="z8-compare-col z8-compare-next">
              <div className="z8-compare-title"><Icon name="check" size={17} /> Proposed customer experience</div>
              <Flow nodes={[
                { label: "Homeowner searches “plumber near me”" },
                { label: "Finds the Zone 8 listing — 4.9★, open 24 hours" },
                { label: "Taps Website" },
                { label: "Zone 8 site: services, upfront pricing, 24/7" },
                { label: "Calls, or requests service in under a minute", tone: "win" },
                { label: "Structured lead — category, urgency, contact", tone: "win" },
                { label: "Follow-up runs whether or not the phone was free", tone: "win" },
              ]} />
              <Link className="z8-btn z8-btn-primary z8-btn-block" to="/preview/zone8">Open the concept site <Icon name="arrow" size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="z8-section">
        <div className="z8-container z8-stack z8-g6">
          <div className="z8-stack z8-g3">
            <p className="z8-label">The strategic asset</p>
            <h2 className="z8-display-l">“One Service. One Price.” is worth rebuilding around.</h2>
            <p className="z8-lede" style={{ maxWidth: "60ch" }}>
              It was the strongest idea on the old site and it is still the sharpest differentiator in Seattle
              residential plumbing. Almost every competitor competes on speed or availability. Pricing anxiety is
              what actually makes a homeowner hesitate before calling — and Zone 8 already has the answer to it.
            </p>
          </div>
          <div className="z8-grid z8-grid-3">
            {[
              { t: "It matches the reviews", d: "Public feedback already mentions reasonable pricing and clear explanations. The positioning isn't a claim — it's a description." },
              { t: "It survives a price comparison", d: "A homeowner checking three plumbers remembers the one that told them the number first." },
              { t: "It gives the site a spine", d: "Pricing transparency organises the whole experience: the hero, the service pages, the request form, the follow-up." },
            ].map((c) => (
              <div key={c.t} className="z8-compare-col" style={{ padding: 20 }}>
                <h3 className="z8-heading">{c.t}</h3>
                <p className="z8-small">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="z8-section z8-section-tight">
        <div className="z8-container z8-stack z8-g6">
          <div className="z8-stack z8-g3">
            <p className="z8-label">Scope</p>
            <h2 className="z8-display-l">What Ellis AI Studio would improve.</h2>
          </div>
          <ul className="z8-improve">
            {improvements.map((item) => (
              <li key={item}><Icon name="check" size={15} />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="z8-section">
        <div className="z8-container z8-stack z8-g6">
          <div className="z8-stack z8-g3">
            <p className="z8-label">Built into the concept</p>
            <h2 className="z8-display-l">The lead arrives already triaged.</h2>
            <p className="z8-lede" style={{ maxWidth: "58ch" }}>
              On the request form, type <em>“basement drain backing up and water coming through”</em>. The site
              reads it and proposes a category, an urgency and the right next action before anyone at Zone 8 has
              looked at it. The homeowner never sees a word about AI — they just see a form that understood them.
            </p>
          </div>
          <div className="z8-grid z8-grid-3">
            {[
              { t: "Fewer wasted callbacks", d: "An emergency and a quote request stop looking identical in the inbox." },
              { t: "Faster response where it counts", d: "Active-escape language routes to a call, not to a scheduling email." },
              { t: "A record of every request", d: "Structured fields instead of a voicemail nobody wrote down." },
            ].map((c) => (
              <div key={c.t} className="z8-compare-col" style={{ padding: 20 }}>
                <h3 className="z8-heading">{c.t}</h3>
                <p className="z8-small">{c.d}</p>
              </div>
            ))}
          </div>
          <div>
            <Link className="z8-btn z8-btn-primary" to="/preview/zone8/request-service">Try the intake demo <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="z8-section z8-section-tight">
        <div className="z8-container z8-stack z8-g5">
          <div className="z8-compare-col" style={{ padding: "clamp(20px,3vw,32px)" }}>
            <h2 className="z8-heading">What this preview deliberately does not do</h2>
            <p className="z8-small" style={{ maxWidth: "62ch" }}>
              No prices are invented. No customer quotes or names are fabricated. No licences, certifications,
              guarantees, warranties, response times or years in business are claimed. Nothing on this build has
              touched Zone 8's domain, Google Business Profile, phone system or any other live system — and Ellis
              AI Studio has not contacted the business.
            </p>
          </div>
          <VerificationRegister />
        </div>
      </section>

      <section className="z8-section">
        <div className="z8-container z8-stack z8-g5" style={{ justifyItems: "center", textAlign: "center" }}>
          <h2 className="z8-display-l" style={{ maxWidth: "20ch" }}>Restore the traffic you already earned.</h2>
          <p className="z8-lede" style={{ maxWidth: "48ch" }}>
            The reputation is built. The searches are happening. The only broken piece is the page they land on.
          </p>
          <div className="z8-hero-ctas" style={{ justifyContent: "center" }}>
            <Link className="z8-btn z8-btn-primary" to="/preview/zone8">View the concept site</Link>
            <a className="z8-btn z8-btn-ghost-inverse" href="mailto:jake@ellisaistudio.com">Talk to Ellis AI Studio</a>
          </div>
          <p className="z8-xs" style={{ maxWidth: "60ch" }}>
            Prepared by Ellis AI Studio as an unsolicited concept. Zone 8 Plumbing &amp; Sewer has not commissioned
            or reviewed it, and no affiliation is claimed.
          </p>
        </div>
      </section>
    </div>
  );
}
