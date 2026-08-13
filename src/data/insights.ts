/**
 * Insights publishing architecture.
 *
 * This is a real content model, not a decorative blog. An article is only
 * rendered as published when `status === "published"` AND it has a body — so a
 * seeded topic can never accidentally present itself as a finished piece.
 *
 * The seeded records below are planned topics with no body text. They exist so
 * the pipeline is visible and the schema is exercised, and they are labelled as
 * drafts everywhere they appear.
 */

export type ArticleStatus = "draft" | "published";

export type ArticleCategory =
  | "AI & Automation"
  | "Business Systems"
  | "Founder Journey"
  | "Creator Economy"
  | "UGC & Brand Partnerships"
  | "Product Building"
  | "Lifestyle & Wellness"
  | "Travel & Experiences"
  | "Motherhood"
  | "Finance"
  | "Behind the Studio";

export const articleCategories: ArticleCategory[] = [
  "AI & Automation",
  "Business Systems",
  "Founder Journey",
  "Creator Economy",
  "UGC & Brand Partnerships",
  "Product Building",
  "Lifestyle & Wellness",
  "Travel & Experiences",
  "Motherhood",
  "Finance",
  "Behind the Studio",
];

export type Article = {
  title: string;
  slug: string;
  status: ArticleStatus;
  excerpt: string;
  /** Paragraphs of body copy. Empty until the piece is actually written. */
  body: string[];
  /** Founder slugs. Multiple authors indicate a joint piece. */
  authors: string[];
  /** ISO date, or null while unpublished. */
  publishedAt: string | null;
  updatedAt: string | null;
  categories: ArticleCategory[];
  tags: string[];
  coverImage: string | null;
  coverAlt: string | null;
  /** SEO overrides. Fall back to title/excerpt when null. */
  seoTitle: string | null;
  metaDescription: string | null;
  /** Open Graph overrides. Fall back to the studio defaults when null. */
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  /** Venture slug this article belongs to, when relevant. */
  relatedVenture: string | null;
  /** Slugs of related articles. */
  relatedArticles: string[];
};

/** Fields every seeded topic shares, so the drafts stay terse and consistent. */
const draftDefaults = {
  status: "draft" as const,
  body: [] as string[],
  publishedAt: null,
  updatedAt: null,
  coverImage: null,
  coverAlt: null,
  seoTitle: null,
  metaDescription: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: null,
  relatedArticles: [] as string[],
};

export const articles: Article[] = [
  {
    ...draftDefaults,
    title: "What Building Pluton Taught Me About Automating Business Discovery",
    slug: "what-building-pluton-taught-me-about-automating-business-discovery",
    excerpt:
      "Notes on what actually held up when the discovery process itself was turned into a system.",
    authors: ["jacob-ellis"],
    categories: ["AI & Automation", "Business Systems"],
    tags: ["automation", "discovery", "internal tools"],
    relatedVenture: null,
  },
  {
    ...draftDefaults,
    title: "Building RECON in Public",
    slug: "building-recon-in-public",
    excerpt: "An in-progress account of building a product while running a studio.",
    authors: ["jacob-ellis"],
    categories: ["Product Building", "Founder Journey"],
    tags: ["recon", "building in public"],
    relatedVenture: "recon",
  },
  {
    ...draftDefaults,
    title: "Why AI Tools Aren’t the Same as Business Systems",
    slug: "why-ai-tools-arent-the-same-as-business-systems",
    excerpt:
      "The distinction that decides whether a business gets leverage or just another subscription.",
    authors: ["jacob-ellis"],
    categories: ["AI & Automation", "Business Systems"],
    tags: ["ai", "systems thinking"],
    relatedVenture: null,
  },
  {
    ...draftDefaults,
    title: "What Brands Actually Need From a New UGC Creator",
    slug: "what-brands-actually-need-from-a-new-ugc-creator",
    excerpt:
      "The gap between what new creators think they’re being hired for and what a brand is really buying.",
    authors: ["amber-dowling"],
    categories: ["UGC & Brand Partnerships", "Creator Economy"],
    tags: ["ugc", "brand partnerships"],
    relatedVenture: "organicambervibez",
  },
  {
    ...draftDefaults,
    title: "Building organicambervibez From Zero",
    slug: "building-organicambervibez-from-zero",
    excerpt: "Starting a creator venture without pretending the audience is already there.",
    authors: ["amber-dowling"],
    categories: ["Creator Economy", "Founder Journey"],
    tags: ["creator economy", "starting out"],
    relatedVenture: "organicambervibez",
  },
  {
    ...draftDefaults,
    title: "What Makes Creator Content Feel Authentic Instead of Scripted",
    slug: "what-makes-creator-content-feel-authentic-instead-of-scripted",
    excerpt: "Why the same script lands from one creator and dies from another.",
    authors: ["amber-dowling"],
    categories: ["Creator Economy", "UGC & Brand Partnerships"],
    tags: ["authenticity", "content"],
    relatedVenture: "organicambervibez",
  },
  {
    ...draftDefaults,
    title: "Why We Turned Ellis AI Studio Into a Venture Studio",
    slug: "why-we-turned-ellis-ai-studio-into-a-venture-studio",
    excerpt:
      "The reasoning behind building our own ventures alongside the systems we build for clients.",
    authors: ["jacob-ellis", "amber-dowling"],
    categories: ["Behind the Studio", "Founder Journey"],
    tags: ["venture studio", "strategy"],
    relatedVenture: null,
  },
];

/** An article only counts as published once it has been written. */
export function isPublished(article: Article) {
  return article.status === "published" && article.body.length > 0;
}

export const publishedArticles = articles.filter(isPublished);
export const draftArticles = articles.filter((article) => !isPublished(article));

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function articlesByAuthor(founderSlug: string) {
  return publishedArticles.filter((article) => article.authors.includes(founderSlug));
}

export function articlesByVenture(ventureSlug: string) {
  return publishedArticles.filter((article) => article.relatedVenture === ventureSlug);
}

export function draftsByAuthor(founderSlug: string) {
  return draftArticles.filter((article) => article.authors.includes(founderSlug));
}

/** Categories that currently have at least one published article behind them. */
export function activeCategories() {
  return articleCategories.filter((category) =>
    publishedArticles.some((article) => article.categories.includes(category)),
  );
}
