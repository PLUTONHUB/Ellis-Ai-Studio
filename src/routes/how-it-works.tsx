import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksPage } from "~/components/pages/studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/how-it-works")({ head: () => pageHead({ title: "How We Work | Ellis AI Studio", description: "Ellis AI Studio diagnoses business bottlenecks, designs the better process, builds connected systems, then validates and improves them.", path: "/how-it-works" }), component: HowItWorksPage });
