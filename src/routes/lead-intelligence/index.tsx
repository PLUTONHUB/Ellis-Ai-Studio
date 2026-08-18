/**
 * /lead-intelligence — the public surface.
 *
 * The route owns exactly one thing: the server boundary. `submitLead` and
 * everything it reaches — validation, the OpenAI interpretation, the
 * deterministic scoring, the Supabase writes — stay server-side, and the only
 * thing that crosses back to the browser is `LeadPublicResult`.
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { LeadIntelligencePage } from "~/components/pages/lead-intelligence";
import { submitLead } from "~/lib/lead-service.server";
import { pageHead } from "~/lib/seo";
import type { LeadIntake } from "~/types/lead";

const submit = createServerFn({ method: "POST" })
  .validator((data: LeadIntake) => data)
  .handler(async ({ data }) => submitLead(data));

export const Route = createFileRoute("/lead-intelligence/")({
  head: () =>
    pageHead({
      title: "Lead Intelligence | Ellis AI Studio",
      description:
        "Describe the business problem in your own words. Ellis Lead Intelligence reads it, identifies the system most likely to fit, sets out what still needs validating, and returns a clear next step.",
      path: "/lead-intelligence",
    }),
  component: Page,
});

function Page() {
  return <LeadIntelligencePage submit={submit} />;
}
