import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "~/components/portfolio-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/portfolio")({
  head: () => pageHead({ title: "Service Business Website & AI System Portfolio | Ellis", description: "Explore Ellis AI Studio’s conversion-focused service-business website concepts and system design work.", path: "/portfolio" }),
  component: PortfolioPage,
});
