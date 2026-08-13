import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "~/components/pages/insights";
import { findArticle, isPublished } from "~/data/insights";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/insights/$slug")({
  head: ({ params }) => {
    const article = findArticle(params.slug);
    const head = pageHead({ title: article ? `${article.seoTitle ?? article.title} | Ellis AI Studio` : "Insights | Ellis AI Studio", description: article?.metaDescription ?? article?.excerpt ?? "Writing from Ellis AI Studio.", path: `/insights/${params.slug}`, type: "article" });
    // Unwritten topics must never be indexed as if they were articles.
    if (article && !isPublished(article)) head.meta.push({ name: "robots", content: "noindex, follow" });
    return head;
  },
  component: ArticleRoute,
});

function ArticleRoute() { const { slug } = Route.useParams(); return <ArticlePage slug={slug} />; }
