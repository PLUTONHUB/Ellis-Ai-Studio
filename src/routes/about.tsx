import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "~/components/pages/studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/about")({ head: () => pageHead({ title: "About | Ellis AI Studio", description: "Ellis AI Studio is a founder-led venture studio building systems, products, brands and ventures — for itself and for the businesses it works with.", path: "/about" }), component: AboutPage });
