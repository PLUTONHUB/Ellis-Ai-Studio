import { createFileRoute } from "@tanstack/react-router";
import { StandardPage, bookingUrl } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({ title: "Contact Ellis AI Studio | Intelligent Business Infrastructure", description: "Start a conversation about the connected digital infrastructure your organization needs next.", path: "/contact" }),
  component: () => <StandardPage eyebrow="Contact" title="Let’s identify the next system your organization needs." intro="Bring the operating challenge, customer journey, or system gap you want to improve. We will discuss the current context and a practical next step."><div className="inquiry"><p>Ellis AI Studio designs infrastructure around real goals, existing tools, and the workflows your team owns—not generic technology packages.</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">Schedule a consultation</a></div></StandardPage>,
});
