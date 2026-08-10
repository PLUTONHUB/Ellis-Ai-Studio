import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/components/acquisition-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/")({ head: () => pageHead({ title: "Business Systems & Automation | Ellis AI Studio", description: "Ellis AI Studio finds business bottlenecks and builds connected systems, automation, websites, integrations, and AI where it makes practical sense.", path: "/" }), component: Home });
function Home() { return <HomePage />; }
