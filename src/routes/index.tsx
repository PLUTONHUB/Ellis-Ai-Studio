import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/components/acquisition-site";
import { VenturesPreview, FoundersPreview, InsightsPreview } from "~/components/venture-studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/")({ head: () => pageHead({ title: "Ellis AI Studio | Founder-Led Venture Studio", description: "Ellis AI Studio builds systems, products, brands and digital ventures around real problems — and builds AI systems, automation and business infrastructure for companies that need the same.", path: "/" }), component: Home });

function Home() { return <HomePage ecosystem={<><VenturesPreview /><FoundersPreview /><InsightsPreview /></>} />; }
