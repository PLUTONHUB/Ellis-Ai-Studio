import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "~/components/acquisition-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title: "About Jacob Ellis | Ellis AI Studio", description: "Why Ellis AI Studio starts with the business problem before recommending technology.", path: "/about" }),
  component: AboutPage,
});
