import { createFileRoute } from "@tanstack/react-router";
import { SystemsPage } from "~/components/acquisition-site";
import { pageHead } from "~/lib/seo";
export const Route = createFileRoute("/systems")({ head: () => pageHead({ title: "Business Systems | Ellis AI Studio", description: "Connected customer experience, lead, operations, AI, and custom systems built around the problem—not a disconnected service menu.", path: "/systems" }), component: SystemsPage });
