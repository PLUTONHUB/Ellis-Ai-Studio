import { createFileRoute } from "@tanstack/react-router";
import { AuditReceivedPage } from "~/components/pages/audit-received";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/audit/received")({
  head: () => pageHead({
    title: "Inquiry Received | Ellis AI Studio",
    description: "Ellis AI Studio has received your Business Bottleneck Audit inquiry.",
    path: "/audit/received",
  }),
  component: AuditReceivedPage,
});
