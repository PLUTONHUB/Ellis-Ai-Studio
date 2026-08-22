import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "~/components/zone8/pages";
import { serviceBySlug } from "~/data/zone8";
import { zone8Head } from "~/lib/zone8-seo";

const service = serviceBySlug("drain-cleaning")!;

export const Route = createFileRoute("/preview/zone8/drain-cleaning")({
  head: () =>
    zone8Head({
      title: service.detail!.metaTitle,
      description: service.detail!.metaDescription,
    }),
  component: () => <ServiceDetailPage service={service} />,
});
