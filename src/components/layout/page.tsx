import type { ReactNode } from "react";
import "~/styles/system/content.css";

/**
 * Inner-page opener. The label sits in the left rail and the title is offset
 * from it, so every page lands the eye in the same column.
 */
export function PageHeader({ label, title, lede }: { label: string; title: ReactNode; lede?: string }) {
  return (
    <header className="page-header">
      <div className="container page-header-inner">
        <span className="rail-line enter-rule" aria-hidden="true" />
        <div className="page-header-body">
          <p className="label enter" style={{ "--i": 0 } as React.CSSProperties}>{label}</p>
          <h1 className="display-l enter" style={{ "--i": 1 } as React.CSSProperties}>{title}</h1>
          {lede && <p className="lede enter" style={{ "--i": 2 } as React.CSSProperties}>{lede}</p>}
        </div>
      </div>
    </header>
  );
}

export function Section({
  children, tone = "base", ruled = false, id,
}: { children: ReactNode; tone?: "base" | "deep" | "cool" | "warm"; ruled?: boolean; id?: string }) {
  const toneClass = tone === "base" ? "" : ` section-${tone}`;
  return (
    <section className={`section${toneClass}${ruled ? " section-ruled" : ""}`} id={id}>
      <div className="container">{children}</div>
    </section>
  );
}

/**
 * Section opener. `index` prints a marginal numeral with a tick rule — the
 * marker is what gives the whitespace a sense of place.
 */
export function SectionIntro({
  index, label, title, copy, statement = false,
}: { index?: string; label: string; title: string; copy?: string; statement?: boolean }) {
  return (
    <div className="section-head">
      <div className="section-marker reveal" aria-hidden="true">
        {index && <span>{index}</span>}
        <span className="tick reveal-rule" />
      </div>
      <div className="section-head-body">
        <p className="label reveal">{label}</p>
        <h2 className={`display-m reveal${statement ? " statement" : ""}`}>{title}</h2>
        {copy && <p className="lede reveal">{copy}</p>}
      </div>
    </div>
  );
}

/** Inline mono metadata. Returns nothing when empty so callers stay terse. */
export function InlineMeta({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return <ul className="inline-meta">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
