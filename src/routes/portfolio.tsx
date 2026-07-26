import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "~/components/portfolio-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/portfolio")({
  head: () => pageHead({ title: "Business Infrastructure Portfolio | Ellis AI Studio", description: "Explore selected web platforms, automation systems, AI solutions, SEO infrastructure, internal software, and analytics implementations.", path: "/portfolio" }),
  component: PortfolioPage,
});
