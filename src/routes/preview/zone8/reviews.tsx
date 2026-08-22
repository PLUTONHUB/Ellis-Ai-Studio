import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "~/components/zone8/pages";
import { zone8Head } from "~/lib/zone8-seo";

export const Route = createFileRoute("/preview/zone8/reviews")({
  head: () =>
    zone8Head({
      title: "Reviews | Zone 8 Plumbing & Sewer, Seattle",
      description:
        "Zone 8 Plumbing & Sewer holds a 4.9-star average across 62 Google reviews from Seattle-area homeowners.",
    }),
  component: ReviewsPage,
});
