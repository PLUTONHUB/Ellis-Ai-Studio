/**
 * Server function for the Business Bottleneck Audit.
 *
 * The Bottleneck Audit is an upstream Lead Intelligence source. Its
 * first-party operational answers are persisted and analyzed server-side;
 * they are never handed back to a mail client for a manual send.
 */
import { createServerFn } from "@tanstack/react-start";
import type { AuditApplication } from "~/lib/audit-intake.server";
import { bottleneckAuditToLead } from "~/lib/bottleneck-audit-lead-adapter";
import { submitLead } from "~/lib/lead-service.server";

export const submitAudit = createServerFn({ method: "POST" })
  .validator((data: AuditApplication) => data)
  .handler(async ({ data }) => submitLead(bottleneckAuditToLead(data)));
