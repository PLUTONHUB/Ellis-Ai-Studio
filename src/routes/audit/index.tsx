import { createFileRoute } from "@tanstack/react-router";
import { AuditPage } from "~/components/pages/audit";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/audit/")({
  head: () =>
    pageHead({
      title: "AI Opportunity Audit | Ellis AI Studio",
      description:
        "Enter your website and discover where AI, automation and better systems could save time, improve customer experience, or support revenue growth. A scored, prioritized automation roadmap built from publicly observable information.",
      path: "/audit",
    }),
  component: AuditPage,
});
