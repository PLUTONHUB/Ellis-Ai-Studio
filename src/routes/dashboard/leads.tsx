/**
 * /dashboard/leads — the internal Opportunity Intelligence console.
 *
 * The protection model is unchanged: `leadDashboardAllowed()` is evaluated on
 * the server for every load, and when it fails the loader returns no leads at
 * all rather than returning them and hiding them in the client. There is no
 * path by which lead data reaches the browser without the cookie.
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Console, ConsoleGate } from "~/components/dashboard/console";
import { LeadList } from "~/components/dashboard/lead-list";
import { leadDashboardAllowed, unlockLeadDashboard } from "~/lib/lead-dashboard-auth.server";
import { listLeads } from "~/lib/lead-repository.server";
import type { LeadListRow } from "~/types/lead-record";

const load = createServerFn({ method: "GET" }).handler(async () =>
  leadDashboardAllowed() ? { accessRequired: false, leads: await listLeads() } : { accessRequired: true, leads: [] },
);

const unlock = createServerFn({ method: "POST" })
  .validator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => unlockLeadDashboard(data.accessToken));

export const Route = createFileRoute("/dashboard/leads")({ loader: () => load(), component: Page });

function Page() {
  const data = Route.useLoaderData() as Awaited<ReturnType<typeof load>>;
  const router = useRouter();
  const requestUnlock = useServerFn(unlock);

  if (data.accessRequired) {
    return (
      <Console>
        <ConsoleGate
          onUnlock={async (accessToken) => {
            await requestUnlock({ data: { accessToken } });
            await router.invalidate();
          }}
        />
      </Console>
    );
  }

  return (
    <Console>
      <LeadList leads={data.leads as LeadListRow[]} />
    </Console>
  );
}
