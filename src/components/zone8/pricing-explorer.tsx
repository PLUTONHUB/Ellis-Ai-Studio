/*
 * "One Service. One Price." — the concept pricing interface.
 *
 * SAFETY CONSTRAINT, load-bearing: Zone 8's actual prices are not public and are
 * NOT invented here. Every figure renders as a CSS-blurred "$000" placeholder —
 * there is no real number hiding behind the blur, and each row is labelled
 * "Preview pricing placeholder". The interface demonstrates the *mechanic* the
 * positioning promises (pick your problem, see your price) without asserting a
 * single price on Zone 8's behalf.
 */

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { priceRows } from "~/data/zone8";
import { CallButton, Icon } from "~/components/zone8/primitives";

export function PricingExplorer({
  heading = "What do you need help with?",
  /** Caps the visible rows so the panel can be height-matched to the column
   *  beside it. The homepage shows a subset and links to the full list; the
   *  pricing page shows everything. A search always looks at every row. */
  limit,
}: { heading?: string; limit?: number }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return limit ? priceRows.slice(0, limit) : priceRows;
    return priceRows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.desc.toLowerCase().includes(q) ||
        row.keywords.some((k) => k.includes(q) || q.includes(k)),
    );
  }, [query, limit]);

  const hidden = limit && !query.trim() ? priceRows.length - matches.length : 0;

  const active = priceRows.find((r) => r.id === selected) ?? null;

  return (
    <div className="z8-price-shell">
      <div className="z8-panel-head">
        <span className="z8-panel-title">Upfront pricing</span>
        <span className="z8-verify">Preview pricing placeholder</span>
      </div>

      <div className="z8-price-search">
        <Icon name="search" size={17} />
        <label htmlFor="z8-price-q" className="z8-sr-only">{heading}</label>
        <input
          id="z8-price-q"
          type="search"
          value={query}
          placeholder={heading}
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="z8-price-list">
        {matches.length === 0 ? (
          <p className="z8-price-empty">
            No match for “{query}”. Zone 8 handles more than the categories listed here — describe it on a{" "}
            <Link className="z8-textlink" to="/preview/zone8/request-service">service request</Link>.
          </p>
        ) : (
          matches.map((row) => (
            <button
              key={row.id}
              type="button"
              className="z8-price-row"
              aria-pressed={selected === row.id}
              onClick={() => setSelected(selected === row.id ? null : row.id)}
            >
              <span>
                <span className="z8-price-name">{row.name}</span>
                <span className="z8-price-desc">{row.desc}</span>
              </span>
              <span className="z8-price-value">
                {/* Deliberately unreadable: there is no real figure behind this. */}
                <span className="z8-price-blur" aria-hidden>$000</span>
                <span className="z8-price-note">Placeholder</span>
              </span>
            </button>
          ))
        )}
      </div>

      {hidden > 0 ? (
        <p className="z8-xs" style={{ marginTop: 10, color: "var(--z8-inverse-muted)" }}>
          +{hidden} more service {hidden === 1 ? "category" : "categories"} —{" "}
          <Link className="z8-textlink" to="/preview/zone8/pricing">see all pricing</Link>
        </p>
      ) : null}

      {active ? (
        <div className="z8-price-detail z8-reveal">
          <div className="z8-stack z8-g2">
            <p className="z8-panel-title">{active.name}</p>
            <p className="z8-small" style={{ color: "var(--z8-inverse-muted)" }}>
              In production this shows Zone 8’s upfront price for this service. For the preview it stays
              blank on purpose — no price is published without the business confirming it.
            </p>
          </div>
          <div className="z8-hero-ctas" style={{ marginTop: 0 }}>
            <CallButton className="z8-btn z8-btn-call z8-btn-sm" label="Get your price" />
            <Link className="z8-btn z8-btn-ghost-inverse z8-btn-sm" to="/preview/zone8/request-service">Request service</Link>
          </div>
        </div>
      ) : (
        <p className="z8-xs" style={{ marginTop: 14, color: "var(--z8-inverse-muted)" }}>
          Select a service to see how the upfront price is presented. Transparent pricing — confirm with Zone 8.
        </p>
      )}
    </div>
  );
}
