import { createFileRoute } from "@tanstack/react-router";
import { StandardPage } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title: "About Ellis AI Studio | Intelligent Business Infrastructure", description: "Ellis AI Studio researches, designs, engineers, deploys, and improves connected digital infrastructure for organizations.", path: "/about" }),
  component: () => <StandardPage eyebrow="About Ellis AI Studio" title="Engineering the operating infrastructure of modern organizations." intro="Ellis brings research, architecture, engineering, deployment, and continuous improvement into one accountable implementation practice."><div className="about"><h2>Systems are the product.</h2><p>We connect customer experience, operations, intelligence, and growth into durable infrastructure—then maintain and improve it as the organization evolves.</p></div></StandardPage>,
});
