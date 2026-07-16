import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "~/components/marketing-site";

export const Route = createFileRoute("/")({ component: Home });
function Home() { return <MarketingPage page="home" />; }
