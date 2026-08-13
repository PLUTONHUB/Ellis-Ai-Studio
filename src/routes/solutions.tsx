import { createFileRoute } from "@tanstack/react-router";
import { SystemsPage } from "~/components/acquisition-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/solutions")({ head: () => pageHead({ title: "Solutions | Ellis AI Studio", description: "AI systems, workflow automation, operational infrastructure, intelligent websites and digital product development — built around the problem rather than a service menu.", path: "/solutions" }), component: SystemsPage });
