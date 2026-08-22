import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "~/components/zone8/pages";
import { zone8Head } from "~/lib/zone8-seo";

export const Route = createFileRoute("/preview/zone8/pricing")({
  head: () =>
    zone8Head({
      title: "Upfront Plumbing Pricing | Zone 8 Plumbing & Sewer",
      description:
        "One service, one price. Know what you're paying before the work starts — Zone 8's transparent pricing approach for Seattle plumbing and sewer work.",
    }),
  component: PricingPage,
});
