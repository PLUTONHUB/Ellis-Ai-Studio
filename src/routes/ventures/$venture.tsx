import { createFileRoute } from "@tanstack/react-router";
import { VentureDetailPage } from "~/components/pages/ventures";
import { findVenture } from "~/data/ventures";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/ventures/$venture")({
  head: ({ params }) => {
    const venture = findVenture(params.venture);
    return pageHead({ title: venture ? `${venture.name} | Ellis AI Studio Ventures` : "Venture | Ellis AI Studio", description: venture?.positioning ?? "A venture built inside Ellis AI Studio.", path: `/ventures/${params.venture}` });
  },
  component: VentureRoute,
});

function VentureRoute() { const { venture } = Route.useParams(); return <VentureDetailPage slug={venture} />; }
