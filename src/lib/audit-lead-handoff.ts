import { auditToLeadContext } from "~/lib/audit-lead-adapter";
import type { AuditReport } from "~/types/audit";
import type { AuditLeadContext } from "~/types/lead";
export function auditHandoffHref(report: AuditReport) { return `/lead-intelligence?audit=${encodeURIComponent(JSON.stringify(auditToLeadContext(report)))}`; }
export function auditContextFromSearch(search: string): AuditLeadContext | undefined { try { const raw = new URLSearchParams(search).get("audit"); if (!raw) return undefined; const parsed = JSON.parse(raw) as AuditLeadContext; return typeof parsed.auditId === "string" ? parsed : undefined; } catch { return undefined; } }
