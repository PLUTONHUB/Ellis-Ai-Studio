import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/components/pages/home";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/")({ head: () => pageHead({ title: "Ellis AI Studio | AI Systems & Business Operations", description: "Your business doesn't need more tools. It needs a better system. Ellis AI Studio diagnoses operational bottlenecks and builds the AI-powered systems that fix them.", path: "/" }), component: HomePage });
