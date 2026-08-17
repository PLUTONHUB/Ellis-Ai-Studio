import { createFileRoute, notFound } from "@tanstack/react-router";
import { DemoCaseStudyPage } from "~/components/pages/demos";
import { demoBySlug } from "~/data/demos";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/demos/$slug")({
  // Unknown slugs are a 404 rather than an empty case study.
  loader: ({ params }) => {
    const demo = demoBySlug(params.slug);
    if (!demo) throw notFound();
    return demo;
  },
  head: ({ params }) => {
    const demo = demoBySlug(params.slug);
    if (!demo) return {};
    return pageHead({
      title: `${demo.company} — a design study | Ellis AI Studio`,
      description: `${demo.thesis} An unsolicited before-and-after redesign of ${demo.host} by Ellis AI Studio, not affiliated with ${demo.company}.`,
      path: `/demos/${demo.slug}`,
      type: "article",
    });
  },
  component: () => <DemoCaseStudyPage slug={Route.useParams().slug} />,
});
