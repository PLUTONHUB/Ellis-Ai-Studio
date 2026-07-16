import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "~/components/marketing-site";
export const Route = createFileRoute("/about")({ component: () => <MarketingPage page="about" /> });
