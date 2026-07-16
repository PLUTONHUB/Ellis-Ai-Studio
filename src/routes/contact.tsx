import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "~/components/marketing-site";
export const Route = createFileRoute("/contact")({ component: () => <MarketingPage page="contact" /> });
