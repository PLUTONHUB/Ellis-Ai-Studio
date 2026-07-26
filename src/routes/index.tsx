import { createFileRoute } from "@tanstack/react-router";
import { GrowthHome } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/")({ head: () => pageHead({ title: "Intelligent Business Infrastructure | Ellis AI Studio", description: "Ellis AI Studio designs intelligent websites, AI employees, automation systems, custom software, SEO infrastructure, and business intelligence for modern businesses.", path: "/" }), component: Home });
function Home() { return <GrowthHome />; }
