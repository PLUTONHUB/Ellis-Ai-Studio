import { ventures, statusOrder, type Venture } from "~/data/ventures";
import { foundersOf } from "~/data/founders";
import { InlineMeta } from "~/components/layout/page";

/** Ventures are ordered so the ones a visitor can actually look at come first. */
export const orderedVentures = [...ventures].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

const accentClass: Record<Venture["accent"], string> = {
  cinematic: "accent-cinematic",
  warm: "accent-warm",
  product: "accent-product",
};

export function ventureClass(venture: Venture) {
  return accentClass[venture.accent];
}

export function VentureStatus({ venture }: { venture: Venture }) {
  const pending = venture.status === "In Development";
  return <span className={`status${pending ? " status-pending" : ""}`}>{venture.status}</span>;
}

/** One editorial row. Used on /ventures and on the homepage. */
export function VentureRow({ venture, index }: { venture: Venture; index: number }) {
  const href = `/ventures/${venture.slug}`;
  const names = foundersOf(venture.founders).map((f) => f.name);
  return (
    <li className={`row row-link reveal ${ventureClass(venture)}`}>
      <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="row-head">
        <span className="row-rule reveal-rule" aria-hidden="true" />
        <VentureStatus venture={venture} />
        <h3 className="display-m"><a href={href}>{venture.name}</a></h3>
        <p className="meta">{venture.category}</p>
      </div>
      <div className="row-body">
        <p>{venture.positioning}</p>
        <InlineMeta items={venture.identity.length ? venture.identity : [venture.category]} />
        <p className="meta">{names.join(" · ")}</p>
        <a className="link" href={href}>View venture</a>
      </div>
    </li>
  );
}

export function VentureRows({ items = orderedVentures }: { items?: Venture[] }) {
  return <ul className="rows">{items.map((venture, i) => <VentureRow key={venture.slug} venture={venture} index={i} />)}</ul>;
}
