import type { ReactNode } from "react";
import "~/styles/system/content.css";

/** Inner-page opener. Same rhythm on every page so the site reads as one system. */
export function PageHeader({ label, title, lede }: { label: string; title: ReactNode; lede?: string }) {
  return (
    <header className="page-header">
      <div className="container">
        <p className="label">{label}</p>
        <h1 className="display-l" style={{ marginTop: "var(--space-5)" }}>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </header>
  );
}

export function Section({
  children, tone = "base", ruled = false, id,
}: { children: ReactNode; tone?: "base" | "sunken" | "veil"; ruled?: boolean; id?: string }) {
  const toneClass = tone === "sunken" ? " section-sunken" : tone === "veil" ? " section-veil" : "";
  return (
    <section className={`section${toneClass}${ruled ? " section-ruled" : ""}`} id={id}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionIntro({ label, title, copy }: { label: string; title: string; copy?: string }) {
  return (
    <div className="section-intro reveal">
      <p className="label">{label}</p>
      <h2 className="display-m">{title}</h2>
      {copy && <p className="lede">{copy}</p>}
    </div>
  );
}

/** Inline mono metadata. Returns nothing when empty so callers stay terse. */
export function InlineMeta({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return <ul className="inline-meta">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
