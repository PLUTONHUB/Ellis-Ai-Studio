import { foundersOf } from "~/data/founders";
import type { Article } from "~/data/insights";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function byline(article: Article) {
  return foundersOf(article.authors).map((a) => a.name).join(" & ");
}

export function ArticleRow({ article, index }: { article: Article; index: number }) {
  const href = `/insights/${article.slug}`;
  return (
    <li className="row row-link reveal">
      <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="row-head">
        <p className="label">{article.categories[0]}</p>
        <h3 className="display-m"><a href={href}>{article.title}</a></h3>
      </div>
      <div className="row-body">
        <p>{article.excerpt}</p>
        <p className="meta">
          {byline(article)}
          {article.publishedAt && <> · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></>}
        </p>
        <a className="link" href={href}>Read</a>
      </div>
    </li>
  );
}

/**
 * Planned topics. Rendered in a quieter register and labelled on every row —
 * a draft must never be able to read as a finished, published piece.
 */
export function DraftRow({ article, index }: { article: Article; index: number }) {
  return (
    <li className="row reveal">
      <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="row-head">
        <span className="status status-pending">In progress</span>
        <h3 className="heading">{article.title}</h3>
      </div>
      <div className="row-body">
        <p>{article.excerpt}</p>
        <p className="meta">{byline(article)}</p>
      </div>
    </li>
  );
}
