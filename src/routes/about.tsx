import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "~/components/pages/studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/about")({ head: () => pageHead({ title: "About | Ellis AI Studio", description: "Ellis AI Studio is an AI systems and business-operations company. We identify friction inside a business and build the systems that remove it.", path: "/about" }), component: AboutPage });
