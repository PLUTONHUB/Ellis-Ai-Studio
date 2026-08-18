import type { LeadIntake } from "~/types/lead";
import { LEAD_SOURCES, URGENCY_OPTIONS } from "~/types/lead";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value: unknown, field: string, required = false) => {
  if (typeof value !== "string") { if (required) throw new Error(`${field} is required.`); return undefined; }
  const normalized = value.trim().replace(/\s+/g, " ");
  if (required && !normalized) throw new Error(`${field} is required.`);
  return normalized || undefined;
};
export function normalizeLeadWebsite(value: unknown): string | undefined {
  const raw = text(value, "Website"); if (!raw) return undefined;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try { const url = new URL(candidate); if (!url.hostname.includes(".")) throw new Error(); return url.origin.toLowerCase(); } catch { throw new Error("Website must be a valid public website address."); }
}
export function validateLeadIntake(input: LeadIntake): LeadIntake {
  const email = text(input.email, "Email", true)!.toLowerCase(); if (!emailPattern.test(email)) throw new Error("Enter a valid email address.");
  const requestId = text(input.requestId, "Request ID", true)!; if (!/^[a-zA-Z0-9_-]{12,128}$/.test(requestId)) throw new Error("Request ID is invalid.");
  if (!LEAD_SOURCES.includes(input.source)) throw new Error("Lead source is invalid.");
  if (!URGENCY_OPTIONS.includes(input.urgency)) throw new Error("Urgency is invalid.");
  return { ...input, requestId, email, firstName: text(input.firstName, "First name", true)!, lastName: text(input.lastName, "Last name", true)!, phone: text(input.phone, "Phone"), businessName: text(input.businessName, "Business name", true)!, website: normalizeLeadWebsite(input.website), industry: text(input.industry, "Industry"), location: text(input.location, "Location"), businessSize: text(input.businessSize, "Business size"), primaryChallenge: text(input.primaryChallenge, "Primary challenge", true)!, desiredOutcome: text(input.desiredOutcome, "Desired outcome", true)!, additionalContext: text(input.additionalContext, "Additional context"), approximateMonthlyLeadVolume: text(input.approximateMonthlyLeadVolume, "Monthly lead volume"), currentTools: text(input.currentTools, "Current tools"), currentProcess: text(input.currentProcess, "Current process"), biggestManualBottleneck: text(input.biggestManualBottleneck, "Manual bottleneck") };
}
