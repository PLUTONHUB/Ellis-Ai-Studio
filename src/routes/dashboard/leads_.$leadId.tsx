/**
 * /dashboard/leads/[id] — one lead, read as an intelligence brief.
 *
 * Both server functions re-check `leadDashboardAllowed()` independently. The
 * loader will not fetch a record without it, and the pipeline mutation refuses
 * outright — a stale page cannot be used to write to a record after access has
 * lapsed.
 *
 * The filename carries a trailing underscore — `leads_.$leadId` — which is the
 * router's opt-out from nesting. Without it the generator makes `leads.tsx`
 * this route's parent, and because a list page has no `<Outlet />` to render a
 * child into, /dashboard/leads/[id] silently renders the list instead of the
 * record. The URL is unaffected: the underscore is stripped from the path.
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Console, ConsoleNotice } from "~/components/dashboard/console";
import { LeadDetail } from "~/components/dashboard/lead-detail";
import { leadDashboardAllowed } from "~/lib/lead-dashboard-auth.server";
import { getLead, updatePipelineStatus } from "~/lib/lead-repository.server";
import { PIPELINE_STATUSES, type PipelineStatus } from "~/types/lead";
import type { LeadAnalysisRow, LeadRow } from "~/types/lead-record";

const load = createServerFn({ method: "GET" })
  .validator((data: { leadId: string }) => data)
  .handler(async ({ data }) =>
    leadDashboardAllowed()
      ? { accessRequired: false, record: await getLead(data.leadId) }
      : { accessRequired: true, record: null },
  );

const updateStatus = createServerFn({ method: "POST" })
  .validator((data: { leadId: string; status: PipelineStatus }) => data)
  .handler(async ({ data }) => {
    if (!leadDashboardAllowed()) throw new Error("Dashboard access was denied.");
    if (!PIPELINE_STATUSES.includes(data.status)) throw new Error("Pipeline status is invalid.");
    await updatePipelineStatus(data.leadId, data.status);
  });

export const Route = createFileRoute("/dashboard/leads_/$leadId")({
  loader: ({ params }) => load({ data: params }),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData() as Awaited<ReturnType<typeof load>>;
  const router = useRouter();
  const update = useServerFn(updateStatus);

  if (data.accessRequired) {
    return (
      <Console>
        <ConsoleNotice
          title="Access required"
          copy="Unlock the Lead Intelligence console before opening a record."
          action={<a className="button button-solid" href="/dashboard/leads">Go to the console</a>}
        />
      </Console>
    );
  }

  if (!data.record) {
    return (
      <Console>
        <ConsoleNotice
          title="Record not found"
          copy="No lead exists at this address. It may have been removed, or the link may be from another environment."
          action={<a className="button button-solid" href="/dashboard/leads">Back to all opportunities</a>}
        />
      </Console>
    );
  }

  const { lead, analysis, activities } = data.record;

  return (
    <Console breadcrumb={<span>{(lead as LeadRow).business_name}</span>}>
      <LeadDetail
        lead={lead as LeadRow}
        analysis={analysis as LeadAnalysisRow | null}
        activities={activities}
        onPipelineChange={async (status) => {
          await update({ data: { leadId: (lead as LeadRow).id, status } });
          await router.invalidate();
        }}
      />
    </Console>
  );
}
