import { createFileRoute } from "@tanstack/react-router";
import { GrowthHome } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/")({ head: () => pageHead({ title: "AI Automation & Custom Software for Service Businesses | Ellis AI Studio", description: "AI websites, lead recovery, CRM automation, and custom software for contractors and service businesses ready to grow.", path: "/" }), component: Home });
function Home() { return <GrowthHome />; }
