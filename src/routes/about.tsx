import { createFileRoute } from "@tanstack/react-router";
import { StandardPage } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title: "About Ellis AI Studio | Service Business AI Systems", description: "Learn how Ellis AI Studio combines business strategy, AI systems, websites, and automation for measurable service-business growth.", path: "/about" }),
  component: () => <StandardPage eyebrow="About Ellis AI Studio" title="A long-term partner for AI-powered growth." intro="Ellis exists to help service businesses build systems that make growth more measurable, customer journeys clearer, and operations more efficient."><div className="about"><h2>Business outcomes are the product.</h2><p>We combine business intelligence, thoughtful system design, implementation, and continuous learning. Technology supports the story; a stronger business outcome is the goal.</p></div></StandardPage>,
});
