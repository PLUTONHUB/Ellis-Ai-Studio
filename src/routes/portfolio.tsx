import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "~/components/portfolio-site";

export const Route = createFileRoute("/portfolio")({ component: PortfolioPage });
