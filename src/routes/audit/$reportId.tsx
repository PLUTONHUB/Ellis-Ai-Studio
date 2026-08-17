/**
 * The persistent report URL: /audit/[report-id].
 *
 * Reports are not persisted server-side yet, so this resolves the one known
 * fixture id and says so plainly for anything else. The route exists now so
 * the report is a linkable artifact — share, print and return-to-results all
 * work against a real URL rather than browser-tab state.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AuditReportPage } from "~/components/pages/audit";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/audit/$reportId")({
  head: ({ params }) =>
    pageHead({
      title: "AI Opportunity Audit Report | Ellis AI Studio",
      description:
        "A scored AI and automation opportunity report: business profile, customer journey, prioritized opportunities, automation roadmap and recommended system architecture.",
      path: `/audit/${params.reportId}`,
    }),
  component: ReportRoute,
});

function ReportRoute() {
  const { reportId } = Route.useParams();
  return <AuditReportPage reportId={reportId} />;
}
