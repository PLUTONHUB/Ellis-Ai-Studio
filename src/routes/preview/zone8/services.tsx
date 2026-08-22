import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "~/components/zone8/pages";
import { zone8Head } from "~/lib/zone8-seo";

export const Route = createFileRoute("/preview/zone8/services")({
  head: () =>
    zone8Head({
      title: "Plumbing Services in Seattle | Zone 8 Plumbing & Sewer",
      description:
        "Emergency plumbing, drain cleaning, sewer repair, leak detection, water heaters and pipe repair for Seattle homeowners — priced up front.",
    }),
  component: ServicesPage,
});
