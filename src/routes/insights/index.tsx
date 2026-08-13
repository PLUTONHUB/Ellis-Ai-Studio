import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "~/components/venture-studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/insights/")({ head: () => pageHead({ title: "Insights | Ellis AI Studio", description: "Writing from Jacob Ellis and Amber Dowling on business systems, AI, product building and the creator economy.", path: "/insights" }), component: InsightsPage });
