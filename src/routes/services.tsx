import { createFileRoute } from "@tanstack/react-router";
import { StandardPage, services } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => pageHead({ title: "Infrastructure Capabilities | Ellis AI Studio", description: "Explore the connected digital infrastructure Ellis AI Studio engineers across customer experience, intelligence, operations, growth, and analytics.", path: "/services" }),
  component: () => <StandardPage eyebrow="Infrastructure" title="Connected capabilities, engineered as one operating foundation." intro="Digital presence, customer experience, operational systems, intelligence, automation, and analytics are designed to exchange context—not operate as isolated tools."><div className="service-grid">{services.map(([title, description], index) => <article className="service-card" key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{description}</p><a href={`/services/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`}>View infrastructure layer</a></article>)}</div></StandardPage>,
});
