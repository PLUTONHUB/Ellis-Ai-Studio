import { SiteShell } from "~/components/layout/site-shell";
import { PageHeader, Section, SectionIntro, InlineMeta } from "~/components/layout/page";
import { VentureRows, VentureStatus, ventureClass, orderedVentures } from "~/components/ventures/venture-parts";
import { ArticleRow } from "~/components/insights/insight-parts";
import { findVenture } from "~/data/ventures";
import { foundersOf } from "~/data/founders";
import { articlesByVenture } from "~/data/insights";
import { routes } from "~/data/links";

export function VenturesPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Ventures"
        title={<>Things we are <em>actually</em> building.</>}
        lede="Ellis AI Studio builds systems, products, brands and media around real problems and opportunities. These are the ventures the founders are building and operating now."
      />
      <Section><VentureRows /></Section>
      <Section tone="cool">
        <SectionIntro index="02" label="Work with the studio" title="Building something of your own?" copy="The same team builds client systems — AI, automation, operational infrastructure and digital products." />
        <div className="hero-actions">
          <a className="button button-solid" href={routes.apply}>Request an audit</a>
          <a className="link" href={routes.solutions}>See our capabilities</a>
        </div>
      </Section>
    </SiteShell>
  );
}

export function VentureDetailPage({ slug }: { slug: string }) {
  const venture = findVenture(slug);
  if (!venture) {
    return (
      <SiteShell>
        <PageHeader label="Not found" title="That venture doesn't exist." lede="It may have been renamed, or the link may be wrong." />
        <Section><a className="button" href={routes.ventures}>Back to ventures</a></Section>
      </SiteShell>
    );
  }

  const people = foundersOf(venture.founders);
  const related = articlesByVenture(venture.slug);

  return (
    <SiteShell>
      <div className={ventureClass(venture)}>
        <PageHeader label={venture.category} title={venture.name} lede={venture.positioning} />
        <Section>
          <div className="split">
            <div className="prose">
              <VentureStatus venture={venture} />
              {venture.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {venture.commitments && (
                <div className="pullquote" style={{ marginTop: "var(--space-4)" }}>
                  <p>How this venture works</p>
                </div>
              )}
              {venture.commitments && (
                <ul className="stack stack-3">
                  {venture.commitments.map((item) => <li key={item} className="body">— {item}</li>)}
                </ul>
              )}
            </div>
            <aside className="split-aside">
              {venture.identity.length > 0 && (
                <div className="aside-block">
                  <p className="label">Identity</p>
                  <InlineMeta items={venture.identity} />
                </div>
              )}
              {venture.categories.length > 0 && (
                <div className="aside-block">
                  <p className="label">Categories</p>
                  <InlineMeta items={venture.categories} />
                </div>
              )}
              <div className="aside-block">
                <p className="label">Founders</p>
                <ul>{people.map((f) => <li key={f.slug}><a href={`/founders/${f.slug}`}>{f.name}</a></li>)}</ul>
              </div>
              {venture.links.length > 0 && (
                <div className="aside-block">
                  <p className="label">Follow</p>
                  <ul>{venture.links.map((l) => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>)}</ul>
                </div>
              )}
              {venture.destination && (
                <a className="button" href={venture.destination} target="_blank" rel="noreferrer">Visit {venture.name}</a>
              )}
              {/* Planned properties render as text. Never a link until they exist. */}
              {!venture.destination && venture.plannedDomain && (
                <div className="aside-block">
                  <p className="label">Portfolio site</p>
                  <p className="small">{venture.plannedDomain} — not deployed yet. It will be linked here once it is live.</p>
                </div>
              )}
            </aside>
          </div>
        </Section>
        {related.length > 0 && (
          <Section tone="cool">
            <SectionIntro index="02" label="Related" title={`Writing about ${venture.name}`} />
            <ul className="rows">{related.map((a, i) => <ArticleRow key={a.slug} article={a} index={i} />)}</ul>
          </Section>
        )}
        <Section tone={related.length > 0 ? "warm" : "cool"}>
          <SectionIntro index="03" label="Ventures" title="The rest of the studio." />
          <VentureRows items={orderedVentures.filter((v) => v.slug !== venture.slug)} />
        </Section>
      </div>
    </SiteShell>
  );
}
