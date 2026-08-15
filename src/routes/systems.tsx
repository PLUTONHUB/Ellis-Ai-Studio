import { createFileRoute } from "@tanstack/react-router";
import { SystemsPage } from "~/components/pages/studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/systems")({ head: () => pageHead({ title: "Systems | Ellis AI Studio", description: "Lead capture, workflow automation, AI-enabled operations and conversion websites — organised around what a business is trying to accomplish, not a service menu.", path: "/systems" }), component: SystemsPage });
