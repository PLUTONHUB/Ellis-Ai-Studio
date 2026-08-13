/**
 * Server function for the Business Bottleneck Audit.
 *
 * Lifted out of the legacy acquisition-site component so the only public form
 * on the site no longer depends on a presentation file. The handler itself is
 * unchanged: ~/lib/audit-intake.server posts to AUDIT_FORM_WEBHOOK_URL and
 * reports `delivered: false` when no webhook is configured, which is the
 * caller's cue to fall back to a pre-filled mail handoff.
 */
import { createServerFn } from "@tanstack/react-start";
import type { AuditApplication } from "~/lib/audit-intake.server";

export const submitAudit = createServerFn({ method: "POST" })
  .validator((data: AuditApplication) => data)
  .handler(async ({ data }) => (await import("~/lib/audit-intake.server")).submitAuditApplication(data));

/** Fields that describe where the visitor came from, not what they wrote. */
const ATTRIBUTION = ["source", "campaign", "landingPage"];

/** Renders an application as the plain-text body of a fallback email. */
export function auditEmailBody(payload: Record<string, string>) {
  return Object.entries(payload)
    .filter(([key, value]) => !ATTRIBUTION.includes(key) && String(value).trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n\n");
}
