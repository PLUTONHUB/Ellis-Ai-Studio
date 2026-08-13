import { SiteShell } from "~/components/layout/site-shell";
import { Section, SectionIntro } from "~/components/layout/page";
import { VentureRows, orderedVentures, VentureStatus, ventureClass } from "~/components/ventures/venture-parts";
import { FounderRows } from "~/components/founders/founder-parts";
import { ArticleRow, DraftRow } from "~/components/insights/insight-parts";
import { capabilities } from "~/data/solutions";
import { publishedArticles, draftArticles } from "~/data/insights";
import { routes, studio } from "~/data/links";
import "~/styles/system/content.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <p className="label">Founder-led venture studio</p>
        <h1 className="display-xl">We build things.</h1>
        <p className="lede">
          Systems, products, brands and ventures — built around real problems and real
          opportunities. Ellis AI Studio builds its own, and builds for businesses that
          need the same kind of infrastructure.
        </p>
        <div className="hero-actions">
          <a className="button button-solid" href={routes.contact}>Start a project</a>
          <a className="link" href={routes.ventures}>See what we're building</a>
        </div>
        <div className="hero-meta">
          <span>Systems</span><span>Products</span><span>Brands</span><span>Ventures</span>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <Section tone="sunken" ruled id="studio">
      <SectionIntro
        label="The studio"
        title="What businesses hire us to build."
        copy="Client work is still the core of Ellis AI Studio. We start with the business problem and decide what — if anything — should be built."
      />
      <ul className="rows">
        {capabilities.map((capability, index) => (
          <li className="row reveal" key={capability.name}>
            <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="row-head"><h3 className="heading">{capability.name}</h3></div>
            <div className="row-body">
              <p>{capability.summary}</p>
              <ul className="inline-meta">{capability.includes.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "var(--space-7)" }}>
        <a className="link" href={routes.solutions}>How we work</a>
      </div>
    </Section>
  );
}

function Ventures() {
  return (
    <Section ruled id="ventures">
      <SectionIntro
        label="Ventures"
        title="What we're building for ourselves."
        copy="Alongside client systems, the founders build and operate their own ventures. Each one is a real thing in progress — not a portfolio of logos."
      />
      <VentureRows />
      <div style={{ marginTop: "var(--space-7)" }}>
        <a className="link" href={routes.ventures}>All ventures</a>
      </div>
    </Section>
  );
}

function Founders() {
  return (
    <Section tone="sunken" ruled id="founders">
      <SectionIntro
        label="Founders"
        title="Two founders, building in the open."
        copy="You work with the people whose names are on the studio. There is no account layer in between."
      />
      <FounderRows />
    </Section>
  );
}

/**
 * A factual log of what is active right now. Deliberately carries no metrics,
 * customers or dates — only the status each venture actually holds.
 */
function CurrentlyBuilding() {
  return (
    <Section ruled>
      <SectionIntro
        label="Currently building"
        title="Where things actually stand."
        copy="Status, stated plainly. We publish traction when there is traction to publish."
      />
      <ul className="ledger">
        {orderedVentures.map((venture) => (
          <li className={`reveal ${ventureClass(venture)}`} key={venture.slug}>
            <VentureStatus venture={venture} />
            <div>
              <strong>{venture.name}</strong>
              <p>{venture.status === "In Development"
                ? "In active development inside the studio. Nothing is being shown publicly until there is something real to show."
                : venture.positioning}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Insights() {
  const featured = publishedArticles.slice(0, 3);
  const drafts = draftArticles.slice(0, 3);
  return (
    <Section tone="sunken" ruled id="insights">
      <SectionIntro
        label="Insights"
        title="Notes from the work."
        copy="What we're learning while building systems, products and ventures."
      />
      {featured.length > 0 ? (
        <ul className="rows">{featured.map((article, i) => <ArticleRow key={article.slug} article={article} index={i} />)}</ul>
      ) : (
        <>
          <div className="empty">
            <p>Nothing is published yet. Rather than backfill this with filler, it stays empty until the first piece is finished. These are the ones being written.</p>
          </div>
          <ul className="rows">{drafts.map((article, i) => <DraftRow key={article.slug} article={article} index={i} />)}</ul>
        </>
      )}
      <div style={{ marginTop: "var(--space-7)" }}>
        <a className="link" href={routes.insights}>Go to Insights</a>
      </div>
    </Section>
  );
}

function Conversion() {
  return (
    <Section ruled id="contact">
      <div className="section-intro reveal">
        <p className="label">Work with the studio</p>
        <h2 className="display-l">Have something you want built?</h2>
        <p className="lede">
          Start with the problem rather than a service. We'll tell you what we think
          should happen — including when the answer is that you don't need us.
        </p>
      </div>
      <div className="hero-actions">
        <a className="button button-solid" href={routes.apply}>Request an audit</a>
        <a className="link" href={studio.booking} target="_blank" rel="noreferrer">Book a conversation</a>
      </div>
    </Section>
  );
}

export function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Capabilities />
      <Ventures />
      <Founders />
      <CurrentlyBuilding />
      <Insights />
      <Conversion />
    </SiteShell>
  );
}
