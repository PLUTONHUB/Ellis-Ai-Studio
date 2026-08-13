import { founders, type Founder } from "~/data/founders";
import { findVenture } from "~/data/ventures";
import { InlineMeta } from "~/components/layout/page";

/**
 * Founders render as editorial rows, never as staff cards, and both entries use
 * the identical template — neither founder is presented as the principal.
 * No portraits this phase: hierarchy is carried by type and space.
 */
export function FounderRow({ founder, index }: { founder: Founder; index: number }) {
  const href = `/founders/${founder.slug}`;
  const venture = founder.venture ? findVenture(founder.venture) : undefined;
  return (
    <li className="row row-link reveal">
      <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="row-head">
        <span className="row-rule reveal-rule" aria-hidden="true" />
        <p className="label">{founder.role}</p>
        <h3 className="display-m"><a href={href}>{founder.name}</a></h3>
        {venture && <p className="meta">{venture.name}</p>}
      </div>
      <div className="row-body">
        <p>{founder.positioning}</p>
        <InlineMeta items={founder.focus} />
        <a className="link" href={href}>Read more</a>
      </div>
    </li>
  );
}

export function FounderRows() {
  return <ul className="rows">{founders.map((founder, i) => <FounderRow key={founder.slug} founder={founder} index={i} />)}</ul>;
}
