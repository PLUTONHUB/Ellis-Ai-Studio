import { createFileRoute } from "@tanstack/react-router";
import { OpportunityAudit } from "~/components/opportunity-audit";
import { pageHead } from "~/lib/seo";
export const Route = createFileRoute("/audit")({ head: () => pageHead({ title: "AI Opportunity Audit | Ellis AI Studio", description: "Discover where AI, automation, and better systems could improve your business.", path: "/audit" }), component: OpportunityAudit });
