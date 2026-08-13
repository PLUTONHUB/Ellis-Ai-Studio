import { SiteShell, SectionTitle, AuditCTA, PageHero, calendlyUrl } from "~/components/acquisition-site";
import { ventures, findVenture, statusOrder, type Venture } from "~/data/ventures";
import { founders, findFounder, foundersOf, monogram, type Founder } from "~/data/founders";
import {
  publishedArticles,
  draftArticles,
  draftsByAuthor,
  articlesByAuthor,
  articlesByVenture,
  activeCategories,
  articleCategories,
  findArticle,
  isPublished,
  type Article,
} from "~/data/insights";
import "~/styles/venture-studio.css";

const orderedVentures = [...ventures].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

/* ------------------------------------------------------------------ shared */

function StatusPill({ status }: { status: Venture["status"] }) {
  const tone = status === "Active" ? "live" : status === "Active / Building" ? "building" : "dev";
  return <span className={`vs-status vs-status-${tone}`}>{status}</span>;
}

/**
 * Venture imagery is optional by design. When a venture has no authentic asset
 * yet we render its name as a typographic panel rather than inventing a visual.
 */
function VentureCover({ venture }: { venture: Venture }) {
  if (venture.cover) {
    return <img className="vs-cover-image" src={venture.cover} alt={venture.coverAlt ?? venture.name} loading="lazy" decoding="async" />;
  }
  return <div className="vs-cover-fallback" aria-hidden="true"><span>{venture.name}</span></div>;
}

function FounderPortrait({ founder, className = "" }: { founder: Founder; className?: string }) {
  if (founder.portrait) {
    return <img className={`vs-portrait-image ${className}`} src={founder.portrait} alt={founder.portraitAlt ?? founder.name} loading="lazy" decoding="async" />;
  }
  // Deliberate: no stock photo and no generated face stands in for a real person.
  return <div className={`vs-portrait-fallback ${className}`} role="img" aria-label={`${founder.name} — portrait not yet published`}><span>{monogram(founder.name)}</span></div>;
}

function TagRow({ items, label }: { items: string[]; label?: string }) {
  if (items.length === 0) return null;
  return <div className="vs-tags">{label && <p className="vs-tags-label">{label}</p>}<ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function VentureCard({ venture }: { venture: Venture }) {
  return (
    <article className={`vs-venture-card vs-accent-${venture.accent}`}>
      <a className="vs-venture-media" href={`/ventures/${venture.slug}`} aria-label={`${venture.name} — ${venture.category}`}><VentureCover venture={venture} /></a>
      <div className="vs-venture-body">
        <div className="vs-venture-head"><StatusPill status={venture.status} /><span className="vs-venture-category">{venture.category}</span></div>
        <h3><a href={`/ventures/${venture.slug}`}>{venture.name}</a></h3>
        <p>{venture.positioning}</p>
        <a className="acq-text-link" href={`/ventures/${venture.slug}`}>View venture <span>→</span></a>
      </div>
    </article>
  );
}

function FounderCard({ founder }: { founder: Founder }) {
  const venture = founder.venture ? findVenture(founder.venture) : undefined;
  return (
    <article className="vs-founder-card">
      <a className="vs-founder-media" href={`/founders/${founder.slug}`}><FounderPortrait founder={founder} /></a>
      <div className="vs-founder-body">
        <p className="vs-role">{founder.role}</p>
        <h3><a href={`/founders/${founder.slug}`}>{founder.name}</a></h3>
        <p className="vs-founder-copy">{founder.positioning}</p>
        {venture && <p className="vs-founder-venture">Venture — <a href={`/ventures/${venture.slug}`}>{venture.name}</a></p>}
        <a className="acq-text-link" href={`/founders/${founder.slug}`}>Read more <span>→</span></a>
      </div>
    </article>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const authors = foundersOf(article.authors);
  return (
    <article className="vs-article-card">
      <div className="vs-article-meta">{article.categories.slice(0, 2).map((category) => <span key={category}>{category}</span>)}</div>
      <h3><a href={`/insights/${article.slug}`}>{article.title}</a></h3>
      <p>{article.excerpt}</p>
      <p className="vs-byline">{authors.map((author) => author.name).join(" & ")}{article.publishedAt && <> · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></>}</p>
    </article>
  );
}

function DraftCard({ article }: { article: Article }) {
  const authors = foundersOf(article.authors);
  return (
    <article className="vs-draft-card">
      <p className="vs-draft-flag">In progress</p>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <p className="vs-byline">{authors.map((author) => author.name).join(" & ")}</p>
    </article>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/* ------------------------------------------------------- homepage sections */

export function VenturesPreview() {
  return (
    <section className="acq-section vs-section">
      <div className="acq-wrap">
        <SectionTitle kicker="VENTURES" title="What we’re building for ourselves." copy="Alongside client systems, the studio builds and operates its own ventures. Each one is a real thing being worked on — not a portfolio of logos." />
        <div className="vs-venture-grid">{orderedVentures.map((venture) => <VentureCard key={venture.slug} venture={venture} />)}</div>
        <div className="center-action"><a className="acq-text-link" href="/ventures">See all ventures <span>→</span></a></div>
      </div>
    </section>
  );
}

export function FoundersPreview() {
  return (
    <section className="acq-section acq-panel vs-section">
      <div className="acq-wrap">
        <SectionTitle kicker="FOUNDERS" title="Two founders, building in the open." copy="Ellis AI Studio is run by its founders. You work with the people whose names are on it." />
        <div className="vs-founder-grid">{founders.map((founder) => <FounderCard key={founder.slug} founder={founder} />)}</div>
      </div>
    </section>
  );
}

export function InsightsPreview() {
  const featured = publishedArticles.slice(0, 3);
  return (
    <section className="acq-section vs-section">
      <div className="acq-wrap">
        <SectionTitle kicker="INSIGHTS" title="Notes from the work." copy="What we’re learning while building systems, products and ventures." />
        {featured.length > 0
          ? <div className="vs-article-grid">{featured.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
          : <div className="vs-empty"><p>No articles are published yet. The first pieces are being written now — they’ll appear here rather than being backfilled with filler.</p></div>}
        <div className="center-action"><a className="acq-text-link" href="/insights">Go to Insights <span>→</span></a></div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ ventures page */

export function VenturesPage() {
  return (
    <SiteShell>
      <main>
        <PageHero kicker="VENTURES" title="Things we are actually building." copy="Ellis AI Studio builds systems, products, brands and media around real problems and opportunities. These are the ventures currently being built and operated by the founders." />
        <section className="acq-section">
          <div className="acq-wrap vs-venture-list">
            {orderedVentures.map((venture) => (
              <article key={venture.slug} className={`vs-venture-row vs-accent-${venture.accent}`}>
                <a className="vs-venture-row-media" href={`/ventures/${venture.slug}`}><VentureCover venture={venture} /></a>
                <div className="vs-venture-row-body">
                  <div className="vs-venture-head"><StatusPill status={venture.status} /><span className="vs-venture-category">{venture.category}</span></div>
                  <h2><a href={`/ventures/${venture.slug}`}>{venture.name}</a></h2>
                  <p className="vs-lede">{venture.positioning}</p>
                  <p className="vs-founder-venture">{foundersOf(venture.founders).map((founder) => <a key={founder.slug} href={`/founders/${founder.slug}`}>{founder.name}</a>)}</p>
                  <TagRow items={venture.identity} />
                  <a className="acq-text-link" href={`/ventures/${venture.slug}`}>View venture <span>→</span></a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <StudioConversion />
      </main>
    </SiteShell>
  );
}

export function VentureDetailPage({ slug }: { slug: string }) {
  const venture = findVenture(slug);
  if (!venture) return <SiteShell><main className="acq-wrap vs-notfound"><p className="kicker">VENTURE NOT FOUND</p><h1>That venture doesn’t exist.</h1><a className="acq-button" href="/ventures">Back to Ventures</a></main></SiteShell>;
  const related = articlesByVenture(venture.slug);
  return (
    <SiteShell>
      <main className={`vs-venture-detail vs-accent-${venture.accent}`}>
        <PageHero kicker={venture.category.toUpperCase()} title={venture.name} copy={venture.positioning} />
        <section className="acq-section">
          <div className="acq-wrap vs-detail-grid">
            <div className="vs-detail-main">
              <div className="vs-venture-head"><StatusPill status={venture.status} /></div>
              {venture.description.map((paragraph) => <p key={paragraph} className="vs-body-copy">{paragraph}</p>)}
              {venture.cover && <figure className="vs-detail-figure"><img src={venture.cover} alt={venture.coverAlt ?? venture.name} loading="lazy" decoding="async" /></figure>}
              {venture.commitments && <div className="vs-commitments"><h2>How this venture works</h2><ul>{venture.commitments.map((item) => <li key={item}>{item}</li>)}</ul></div>}
              {venture.status === "In Development" && <p className="vs-note">This venture is an active build. We’ll publish detail here when there is something real to show.</p>}
            </div>
            <aside className="vs-detail-aside">
              <TagRow items={venture.identity} label="IDENTITY" />
              <TagRow items={venture.categories} label="CATEGORIES" />
              <div className="vs-meta-block"><p className="vs-tags-label">FOUNDERS</p><ul className="vs-plain-list">{foundersOf(venture.founders).map((founder) => <li key={founder.slug}><a href={`/founders/${founder.slug}`}>{founder.name}</a></li>)}</ul></div>
              {venture.links.length > 0 && <div className="vs-meta-block"><p className="vs-tags-label">FOLLOW</p><ul className="vs-plain-list">{venture.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>)}</ul></div>}
              {venture.destination && <a className="acq-button" href={venture.destination} target="_blank" rel="noreferrer">Visit {venture.name}</a>}
              {!venture.destination && venture.plannedDomain && <div className="vs-meta-block"><p className="vs-tags-label">PORTFOLIO SITE</p><p className="vs-planned">{venture.plannedDomain} — not deployed yet. We’ll link it here once it’s live.</p></div>}
            </aside>
          </div>
        </section>
        {related.length > 0 && (
          <section className="acq-section acq-panel">
            <div className="acq-wrap"><SectionTitle kicker="RELATED INSIGHTS" title={`Writing about ${venture.name}`} /><div className="vs-article-grid">{related.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></div>
          </section>
        )}
        <StudioConversion />
      </main>
    </SiteShell>
  );
}

/* ----------------------------------------------------------- founders pages */

export function FoundersPage() {
  return (
    <SiteShell>
      <main>
        <PageHero kicker="FOUNDERS" title="Ellis AI Studio is its founders." copy="Jacob Ellis and Amber Dowling build the studio’s client systems and its own ventures. There is no account layer between you and them." />
        <section className="acq-section">
          <div className="acq-wrap vs-founder-grid vs-founder-grid-wide">{founders.map((founder) => <FounderCard key={founder.slug} founder={founder} />)}</div>
        </section>
        <StudioConversion />
      </main>
    </SiteShell>
  );
}

export function FounderDetailPage({ slug }: { slug: string }) {
  const founder = findFounder(slug);
  if (!founder) return <SiteShell><main className="acq-wrap vs-notfound"><p className="kicker">FOUNDER NOT FOUND</p><h1>That page doesn’t exist.</h1><a className="acq-button" href="/founders">Back to Founders</a></main></SiteShell>;
  const venture = founder.venture ? findVenture(founder.venture) : undefined;
  const published = articlesByAuthor(founder.slug);
  const drafts = draftsByAuthor(founder.slug);
  return (
    <SiteShell>
      <main>
        <PageHero kicker={founder.role.toUpperCase()} title={founder.name} copy={founder.positioning} />
        <section className="acq-section">
          <div className="acq-wrap vs-detail-grid">
            <div className="vs-detail-main">
              <figure className="vs-founder-figure"><FounderPortrait founder={founder} />{!founder.portrait && <figcaption>A founder portrait for {founder.name} hasn’t been published yet.</figcaption>}</figure>
              {founder.bio.map((paragraph) => <p key={paragraph} className="vs-body-copy">{paragraph}</p>)}
            </div>
            <aside className="vs-detail-aside">
              <TagRow items={founder.focus} label="FOCUS" />
              {venture && <div className="vs-meta-block"><p className="vs-tags-label">VENTURE</p><ul className="vs-plain-list"><li><a href={`/ventures/${venture.slug}`}>{venture.name}</a></li></ul></div>}
              <div className="vs-meta-block"><p className="vs-tags-label">CONTACT</p><ul className="vs-plain-list"><li><a href={`mailto:${founder.email}`}>{founder.email}</a></li></ul></div>
              <div className="vs-meta-block"><p className="vs-tags-label">ELSEWHERE</p><ul className="vs-plain-list">{founder.socials.map((social) => <li key={social.href}><a href={social.href} target="_blank" rel="noreferrer">{social.label}</a></li>)}</ul></div>
            </aside>
          </div>
        </section>
        {(published.length > 0 || drafts.length > 0) && (
          <section className="acq-section acq-panel">
            <div className="acq-wrap">
              <SectionTitle kicker="WRITING" title={`From ${founder.name}`} />
              {published.length > 0 && <div className="vs-article-grid">{published.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>}
              {drafts.length > 0 && <div className="vs-draft-grid">{drafts.map((article) => <DraftCard key={article.slug} article={article} />)}</div>}
            </div>
          </section>
        )}
        <StudioConversion />
      </main>
    </SiteShell>
  );
}

/* ----------------------------------------------------------- insights pages */

export function InsightsPage() {
  const live = activeCategories();
  return (
    <SiteShell>
      <main>
        <PageHero kicker="INSIGHTS" title="Notes from building." copy="Writing from Jacob Ellis and Amber Dowling on systems, products, ventures and the creator side of the studio." />
        <section className="acq-section">
          <div className="acq-wrap">
            {live.length > 0 && <div className="vs-filter-row">{live.map((category) => <span key={category}>{category}</span>)}</div>}
            {publishedArticles.length > 0
              ? <div className="vs-article-grid">{publishedArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
              : <div className="vs-empty vs-empty-lg">
                  <p className="kicker">NOTHING PUBLISHED YET</p>
                  <h2>We haven’t published our first article.</h2>
                  <p>Rather than fill this page with filler, it stays empty until there is something worth reading. The pieces below are the ones actually being written.</p>
                </div>}
            {draftArticles.length > 0 && (
              <div className="vs-drafts">
                <SectionTitle kicker="IN PROGRESS" title="What we’re writing" copy="Planned pieces, listed so you can see where this is going. These are drafts — not published claims." />
                <div className="vs-draft-grid">{draftArticles.map((article) => <DraftCard key={article.slug} article={article} />)}</div>
              </div>
            )}
          </div>
        </section>
        <section className="acq-section acq-panel">
          <div className="acq-wrap"><SectionTitle kicker="CATEGORIES" title="What we write about" /><TagRow items={articleCategories} /></div>
        </section>
      </main>
    </SiteShell>
  );
}

export function ArticlePage({ slug }: { slug: string }) {
  const article = findArticle(slug);
  if (!article) return <SiteShell><main className="acq-wrap vs-notfound"><p className="kicker">NOT FOUND</p><h1>That article doesn’t exist.</h1><a className="acq-button" href="/insights">Back to Insights</a></main></SiteShell>;
  const authors = foundersOf(article.authors);
  // A seeded topic must never render as a finished article.
  if (!isPublished(article)) {
    return (
      <SiteShell>
        <main>
          <PageHero kicker="IN PROGRESS" title={article.title} copy={article.excerpt} />
          <section className="acq-section"><div className="acq-wrap vs-empty vs-empty-lg"><p>This piece hasn’t been written yet — it’s a planned topic, not a published article. It’ll appear here in full when it’s finished.</p><p className="vs-byline">Planned by {authors.map((author) => author.name).join(" & ")}</p><a className="acq-text-link" href="/insights">Back to Insights <span>→</span></a></div></section>
        </main>
      </SiteShell>
    );
  }
  const venture = article.relatedVenture ? findVenture(article.relatedVenture) : undefined;
  return (
    <SiteShell>
      <main>
        <PageHero kicker={article.categories[0]?.toUpperCase() ?? "INSIGHTS"} title={article.title} copy={article.excerpt} />
        <section className="acq-section">
          <div className="acq-wrap vs-article-layout">
            <article className="vs-article-body">
              <p className="vs-byline">{authors.map((author) => <a key={author.slug} href={`/founders/${author.slug}`}>{author.name}</a>)}{article.publishedAt && <> · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></>}{article.updatedAt && <> · Updated {formatDate(article.updatedAt)}</>}</p>
              {article.coverImage && <figure className="vs-detail-figure"><img src={article.coverImage} alt={article.coverAlt ?? ""} /></figure>}
              {article.body.map((paragraph) => <p key={paragraph} className="vs-body-copy">{paragraph}</p>)}
            </article>
            <aside className="vs-detail-aside">
              <TagRow items={article.categories} label="CATEGORIES" />
              <TagRow items={article.tags} label="TAGS" />
              {venture && <div className="vs-meta-block"><p className="vs-tags-label">RELATED VENTURE</p><ul className="vs-plain-list"><li><a href={`/ventures/${venture.slug}`}>{venture.name}</a></li></ul></div>}
            </aside>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

/* ------------------------------------------------------------- contact page */

export function ContactPage() {
  return (
    <SiteShell>
      <main>
        <PageHero kicker="CONTACT" title="Tell us what you’re trying to build." copy="Business systems work and creator work start in different places. Pick the one that matches what you need." />
        <section className="acq-section">
          <div className="acq-wrap vs-contact-grid">
            <article className="vs-contact-card vs-contact-primary">
              <p className="kicker">HIRE THE STUDIO</p>
              <h2>AI systems, automation, websites and business infrastructure.</h2>
              <p>Start with the business problem rather than picking a service. We’ll assess the process first and tell you whether we’re the right fit.</p>
              <div className="vs-contact-actions"><AuditCTA /><a className="acq-text-link" href={calendlyUrl} target="_blank" rel="noreferrer">Or book a 30-minute conversation <span>→</span></a></div>
              <p className="vs-contact-note">Prefer email? <a href="mailto:jake@ellisaistudio.com">jake@ellisaistudio.com</a></p>
            </article>
            <article className="vs-contact-card">
              <p className="kicker">CREATOR & UGC</p>
              <h2>Brand partnerships and content.</h2>
              <p>Creator enquiries go straight to the founder who’d be doing the work — not into a sales pipeline.</p>
              <ul className="vs-contact-list">
                <li><strong>JAK3FFECT</strong><span>Fitness, wellness, tech, travel, lifestyle</span><a href="mailto:jake@ellisaistudio.com?subject=UGC%20Inquiry%20%E2%80%94%20JAK3FFECT">jake@ellisaistudio.com</a></li>
                <li><strong>organicambervibez</strong><span>Lifestyle, motherhood, finance, beauty, wellness</span><a href="mailto:amberd@ellisaistudio.com?subject=UGC%20Inquiry%20%E2%80%94%20organicambervibez">amberd@ellisaistudio.com</a></li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

/* --------------------------------------------------------------- conversion */

export function StudioConversion() {
  return (
    <section className="acq-section acq-panel vs-conversion">
      <div className="acq-wrap centered-copy">
        <SectionTitle kicker="WORK WITH THE STUDIO" title="Have something you want built?" copy="Ellis AI Studio still takes on client work — AI systems, automation, operational infrastructure, intelligent websites and digital products." />
        <div className="vs-conversion-actions"><AuditCTA /><a className="acq-text-link" href={calendlyUrl} target="_blank" rel="noreferrer">Book a conversation <span>→</span></a></div>
      </div>
    </section>
  );
}
