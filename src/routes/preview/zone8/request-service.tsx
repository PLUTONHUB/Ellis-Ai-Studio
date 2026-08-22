import { createFileRoute } from "@tanstack/react-router";
import { RequestServicePage } from "~/components/zone8/pages";
import { zone8Head } from "~/lib/zone8-seo";

export const Route = createFileRoute("/preview/zone8/request-service")({
  head: () =>
    zone8Head({
      title: "Request Service | Zone 8 Plumbing & Sewer, Seattle",
      description:
        "Tell Zone 8 what's happening and get a call back with the price confirmed before the work starts. Seattle plumbing and sewer service.",
    }),
  component: RequestServicePage,
});
