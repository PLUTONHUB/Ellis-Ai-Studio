import { SiteShell } from "~/components/layout/site-shell";
import { PageHeader, Section, SectionIntro, InlineMeta } from "~/components/layout/page";
import { ArticleRow, DraftRow, formatDate } from "~/components/insights/insight-parts";
import { publishedArticles, draftArticles, findArticle, isPublished, articleCategories } from "~/data/insights";
import { foundersOf } from "~/data/founders";
import { findVenture } from "~/data/ventures";
import { routes } from "~/data/links";

export function InsightsPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Insights"
        title="Notes from building."
        lede="Writing from Jacob Ellis and Amber Dowling on systems, products, ventures and the creator side of the studio."
      />
      <Section>
        {publishedArticles.length > 0 ? (
          <ul className="rows">{publishedArticles.map((a, i) => <ArticleRow key={a.slug} article={a} index={i} />)}</ul>
        ) : (
          <div className="empty" style={{ borderTop: 0, paddingTop: 0 }}>
            <p className="label">Nothing published yet</p>
            <h2 className="display-m">We haven't published our first piece.</h2>
            <p className="lede">Rather than fill this page with filler, it stays empty until there is something worth reading. The pieces below are the ones actually being written.</p>
          </div>
        )}
      </Section>
      {draftArticles.length > 0 && (
        <Section tone="cool">
          <SectionIntro index="02" label="In progress" title="What we're writing" copy="Planned pieces, listed so you can see where this is going. These are drafts — not published claims." />
          <ul className="rows">{draftArticles.map((a, i) => <DraftRow key={a.slug} article={a} index={i} />)}</ul>
        </Section>
      )}
      <Section tone="warm">
        <SectionIntro index="03" label="Topics" title="What we write about" />
        <InlineMeta items={articleCategories} />
      </Section>
    </SiteShell>
  );
}

export function ArticlePage({ slug }: { slug: string }) {
  const article = findArticle(slug);
  if (!article) {
    return (
      <SiteShell>
        <PageHeader label="Not found" title="That article doesn't exist." lede="The link may be wrong." />
        <Section><a className="button" href={routes.insights}>Back to Insights</a></Section>
      </SiteShell>
    );
  }

  const authors = foundersOf(article.authors);
  const names = authors.map((a) => a.name).join(" & ");

  // A seeded topic can never render as a finished article.
  if (!isPublished(article)) {
    return (
      <SiteShell>
        <PageHeader label="In progress" title={article.title} lede={article.excerpt} />
        <Section>
          <div className="empty" style={{ borderTop: 0, paddingTop: 0 }}>
            <p>This piece hasn't been written yet — it's a planned topic, not a published article. It will appear here in full when it's finished.</p>
            <p className="meta">Planned by {names}</p>
            <a className="link" href={routes.insights}>Back to Insights</a>
          </div>
        </Section>
      </SiteShell>
    );
  }

  const venture = article.relatedVenture ? findVenture(article.relatedVenture) : undefined;

  return (
    <SiteShell>
      <PageHeader label={article.categories[0] ?? "Insights"} title={article.title} lede={article.excerpt} />
      <Section>
        <div className="split">
          <article className="prose">
            <p className="meta">
              {names}
              {article.publishedAt && <> · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></>}
              {article.updatedAt && <> · Updated {formatDate(article.updatedAt)}</>}
            </p>
            {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
          <aside className="split-aside">
            <div className="aside-block">
              <p className="label">Categories</p>
              <InlineMeta items={article.categories} />
            </div>
            {article.tags.length > 0 && (
              <div className="aside-block">
                <p className="label">Tags</p>
                <InlineMeta items={article.tags} />
              </div>
            )}
            {venture && (
              <div className="aside-block">
                <p className="label">Related venture</p>
                <ul><li><a href={`/ventures/${venture.slug}`}>{venture.name}</a></li></ul>
              </div>
            )}
            <div className="aside-block">
              <p className="label">Author</p>
              <ul>{authors.map((a) => <li key={a.slug}><a href={`/founders/${a.slug}`}>{a.name}</a></li>)}</ul>
            </div>
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
