import { createFileRoute } from "@tanstack/react-router";
import { StandardPage, process } from "~/components/growth-site";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/process")({
  head: () => pageHead({ title: "AI Systems Implementation Process | Ellis AI Studio", description: "See Ellis AI Studio’s practical process for designing, implementing, measuring, and improving AI systems for service businesses.", path: "/process" }),
  component: () => <StandardPage eyebrow="Process" title="A clear path from insight to continuous growth." intro="We partner with your team through a practical, evidence-led client journey."><div className="process-grid">{process.map((x, i) => <article className="process-step" key={x}><span>0{i + 1}</span><h3>{x}</h3><p>Agree the outcome, create the system, review the evidence, and improve the next decision.</p></article>)}</div></StandardPage>,
});
