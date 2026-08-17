import { createFileRoute } from "@tanstack/react-router";
import { DemosIndexPage } from "~/components/pages/demos";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/demos/")({
  head: () =>
    pageHead({
      title: "Design studies | Ellis AI Studio",
      description:
        "Unsolicited before-and-after redesigns of six established companies — Berkshire Hathaway, Craigslist, Ryanair, USPS, Yahoo and JCPenney. Each pairs a screenshot of the live site with a concept we designed and built.",
      path: "/demos",
    }),
  component: DemosIndexPage,
});
