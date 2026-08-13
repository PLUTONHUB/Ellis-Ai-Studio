import { createFileRoute } from "@tanstack/react-router";
import { FounderDetailPage } from "~/components/pages/founders";
import { findFounder } from "~/data/founders";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/founders/$founder")({
  head: ({ params }) => {
    const founder = findFounder(params.founder);
    return pageHead({ title: founder ? `${founder.name} | ${founder.role}, Ellis AI Studio` : "Founder | Ellis AI Studio", description: founder?.positioning ?? "A co-founder of Ellis AI Studio.", path: `/founders/${params.founder}`, type: "article" });
  },
  component: FounderRoute,
});

function FounderRoute() { const { founder } = Route.useParams(); return <FounderDetailPage slug={founder} />; }
