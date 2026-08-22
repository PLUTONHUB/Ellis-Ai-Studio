import { createFileRoute } from "@tanstack/react-router";
import { Zone8Home } from "~/components/zone8/home";
import { zone8Head } from "~/lib/zone8-seo";

export const Route = createFileRoute("/preview/zone8/")({
  head: () =>
    zone8Head({
      title: "Zone 8 Plumbing & Sewer | Seattle Plumbing & Sewer Service",
      description:
        "Straightforward plumbing and sewer service in Seattle with transparent pricing and 24/7 availability. Call Zone 8 or request service online.",
    }),
  component: Zone8Home,
});
