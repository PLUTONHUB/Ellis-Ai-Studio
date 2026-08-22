import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "~/components/zone8/pages";
import { zone8Head } from "~/lib/zone8-seo";

export const Route = createFileRoute("/preview/zone8/service-area")({
  head: () =>
    zone8Head({
      title: "Service Area | Zone 8 Plumbing & Sewer, Seattle",
      description:
        "Zone 8 Plumbing & Sewer serves the Seattle and West Seattle area, with 24-hour availability listed on its Google Business Profile.",
    }),
  component: ServiceAreaPage,
});
