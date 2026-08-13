import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/components/pages/home";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/")({ head: () => pageHead({ title: "Ellis AI Studio | Founder-Led Venture Studio", description: "Systems, products, brands and ventures — built around real problems and opportunities. Ellis AI Studio builds its own, and builds for businesses that need the same infrastructure.", path: "/" }), component: HomePage });
