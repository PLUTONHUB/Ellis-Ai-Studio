import { createFileRoute } from "@tanstack/react-router";
import { StandardPage, bookingUrl } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({ title: "Request an AI Systems Assessment | Ellis AI Studio", description: "Talk with Ellis AI Studio about AI websites, automation, custom CRM systems, and software for your service business.", path: "/contact" }),
  component: () => <StandardPage eyebrow="Contact" title="Plan your next AI-powered growth system." intro="Request a Business Assessment and we’ll come prepared to discuss your business goals, current infrastructure, and a practical next step."><div className="inquiry"><p>Bring your website, primary growth goal, and the operational system you want to improve. You’ll leave with clearer priorities—not a generic technology pitch.</p><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">Request a Business Assessment</a></div></StandardPage>,
});
