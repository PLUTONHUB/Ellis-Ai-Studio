/*
 * Zone 8 preview — site shell.
 *
 * Three jobs:
 *   1. A compact header. 62px on mobile: tall enough to carry the wordmark and a
 *      call affordance, short enough that the hero headline and both CTAs are
 *      on the first 390px screen without scrolling.
 *   2. A fixed bottom action bar under 860px. Call is the left, green, primary
 *      action because a plumbing search is a phone-intent search; Request Service
 *      is the considered alternative. It is always reachable, at any scroll depth.
 *   3. An honest provenance ribbon on every route. This build must never be
 *      mistakable for a live Zone 8 property.
 */

import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { business, disclaimer, nav } from "~/data/zone8";
import { CallButton, Icon, RequestButton } from "~/components/zone8/primitives";

function Wordmark() {
  return (
    <Link className="z8-wordmark" to="/preview/zone8" aria-label={`${business.name} — preview home`}>
      <span className="z8-mark" aria-hidden>Z8</span>
      <span className="z8-wordmark-text">
        <span className="z8-wordmark-name">Zone 8</span>
        <span className="z8-wordmark-sub">Plumbing &amp; Sewer</span>
      </span>
    </Link>
  );
}

function PreviewRibbon() {
  return (
    <div className="z8-ribbon">
      <div className="z8-container z8-ribbon-inner">
        <p>
          <strong>Concept preview</strong> · Built by Ellis AI Studio · Not affiliated with Zone 8 ·{" "}
          <Link to="/preview/zone8/pitch">Pitch view</Link>
        </p>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="z8-header">
      <div className="z8-container z8-header-inner">
        <Wordmark />
        <nav className="z8-nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.label} to={item.to} hash={item.hash} activeOptions={{ includeHash: true }}>{item.label}</Link>
          ))}
        </nav>
        <div className="z8-header-actions">
          <a className="z8-header-call" href={business.phoneHref}>
            <Icon name="phone" size={15} />
            {business.phone}
          </a>
          <RequestButton className="z8-btn z8-btn-primary z8-btn-sm z8-header-cta" />
          <button
            type="button"
            className="z8-menu-btn"
            aria-expanded={open}
            aria-controls="z8-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="z8-menu-icon" aria-hidden><span /><span /><span /></span>
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="z8-drawer" id="z8-drawer">
          <div className="z8-container">
            <nav className="z8-drawer-nav" aria-label="Mobile">
              {nav.map((item) => (
                <Link key={item.label} to={item.to} hash={item.hash} activeOptions={{ includeHash: true }} onClick={() => setOpen(false)}>{item.label}</Link>
              ))}
            </nav>
            <div className="z8-drawer-actions">
              <CallButton className="z8-btn z8-btn-call z8-btn-block" showNumber />
              <RequestButton className="z8-btn z8-btn-primary z8-btn-block" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  const cols = [
    { title: "Services", links: [
      { label: "Emergency Plumbing", to: "/preview/zone8/emergency-plumber-seattle" },
      { label: "Drain Cleaning", to: "/preview/zone8/drain-cleaning" },
      { label: "Sewer Repair", to: "/preview/zone8/sewer-repair" },
      { label: "Water Heaters", to: "/preview/zone8/water-heaters" },
      { label: "All services", to: "/preview/zone8/services" },
    ] },
    { title: "Company", links: [
      { label: "Pricing", to: "/preview/zone8/pricing" },
      { label: "Service Area", to: "/preview/zone8/service-area" },
      { label: "Reviews", to: "/preview/zone8/reviews" },
      { label: "Request Service", to: "/preview/zone8/request-service" },
    ] },
  ];
  return (
    <footer className="z8-footer">
      <div className="z8-container">
        <div className="z8-footer-grid">
          <div className="z8-stack z8-g4">
            <Wordmark />
            <p className="z8-small" style={{ maxWidth: "34ch" }}>
              Straightforward plumbing and sewer service for Seattle homeowners.
            </p>
            <div className="z8-stack z8-g2">
              <a className="z8-display-m" href={business.phoneHref} style={{ color: "#fff" }}>{business.phone}</a>
              <p className="z8-xs">{business.city}, {business.region} · {business.hours}</p>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              <ul className="z8-footer-links">
                {col.links.map((l) => <li key={l.label}><Link to={l.to}>{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="z8-footer-bottom">
          <p className="z8-disclaimer">{disclaimer}</p>
          <p className="z8-disclaimer">
            © {new Date().getFullYear()} Zone 8 Plumbing &amp; Sewer trade name used for demonstration only ·{" "}
            <Link to="/preview/zone8/pitch" style={{ borderBottom: "1px solid currentColor" }}>Ellis AI Studio pitch view</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Fixed bottom bar. Hidden ≥861px, where the header CTAs are always in view. */
function ActionBar() {
  return (
    <div className="z8-actionbar">
      <CallButton className="z8-btn z8-btn-call" />
      <RequestButton className="z8-btn z8-btn-primary" />
    </div>
  );
}

export function Zone8Layout({ children }: { children: ReactNode }) {
  return (
    <div className="z8 z8-pagefoot">
      <a className="z8-skip" href="#main">Skip to content</a>
      <PreviewRibbon />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ActionBar />
    </div>
  );
}
