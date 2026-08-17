import { createServerFn } from "@tanstack/react-start";
import type { AuditReport } from "~/types/audit";

export const runOpportunityAudit = createServerFn({ method: "POST" })
  .validator((data: { website: string }) => data)
  .handler(async ({ data }): Promise<AuditReport> => (await import("~/lib/audit-engine.server")).analyzeWebsite(data.website));
