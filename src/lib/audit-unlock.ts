/**
 * Server-function wrapper for the roadmap unlock, following the same
 * dynamic-import pattern as ~/lib/audit-submit so the server-only module
 * never reaches the client bundle.
 */
import { createServerFn } from "@tanstack/react-start";
import type { AuditUnlockRequest } from "~/lib/audit-unlock.server";

export const requestAuditUnlock = createServerFn({ method: "POST" })
  .validator((data: AuditUnlockRequest) => data)
  .handler(async ({ data }) => (await import("~/lib/audit-unlock.server")).submitAuditUnlock(data));
