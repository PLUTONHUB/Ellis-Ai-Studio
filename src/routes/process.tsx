import { createFileRoute } from "@tanstack/react-router";
import { StandardPage, process } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/process")({
  head: () => pageHead({ title: "Infrastructure Engineering Lifecycle | Ellis AI Studio", description: "See how Ellis AI Studio researches, architects, engineers, deploys, monitors, and improves connected business infrastructure.", path: "/process" }),
  component: () => <StandardPage eyebrow="Engineering lifecycle" title="Research to continuous improvement." intro="Every implementation begins with evidence, is shaped by architecture, and is improved through real operating signals."><div className="process-grid">{process.map((step, index) => <article className="process-step" key={step}><span>0{index + 1}</span><h3>{step}</h3><p>Establish the operating context, engineer the next layer, measure the result, and improve what follows.</p></article>)}</div></StandardPage>,
});
