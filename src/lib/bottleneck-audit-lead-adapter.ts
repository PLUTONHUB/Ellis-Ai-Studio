import type { AuditApplication } from "~/lib/audit-intake.server";
import type { LeadIntake, LeadUrgency } from "~/types/lead";

function contactName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "Unknown",
    // The legacy Bottleneck Audit has one required name field. Keep a
    // single-word submission valid without asking the visitor to re-enter it.
    lastName: parts.slice(1).join(" ") || "Not provided",
  };
}

function urgencyFor(readiness: string): LeadUrgency {
  if (readiness === "Yes") return "within_30_days";
  if (readiness.startsWith("Possibly")) return "one_to_three_months";
  return "exploring";
}

/** Maps first-party Bottleneck Audit answers into the canonical lead contract. */
export function bottleneckAuditToLead(input: AuditApplication): LeadIntake {
  const contact = contactName(input.name);
  return {
    requestId: input.requestId,
    source: "business_bottleneck_audit",
    ...contact,
    email: input.email,
    phone: input.phone,
    businessName: input.businessName,
    website: input.website,
    industry: input.industry,
    businessSize: input.teamSize,
    primaryChallenge: input.challenge,
    desiredOutcome: input.desiredOutcome,
    urgency: urgencyFor(input.readiness),
    additionalContext: [
      `Affected area: ${input.affectedArea}`,
      `Failure impact: ${input.failureImpact}`,
      `Process frequency: ${input.frequency}`,
      `Priority: ${input.priority}`,
      `Readiness: ${input.readiness}`,
      `Founding program interest: ${input.foundingInterest}`,
    ].join("\n"),
    currentTools: input.tools,
    currentProcess: input.currentProcess,
    biggestManualBottleneck: input.manualWork,
    bottleneckAudit: {
      affectedArea: input.affectedArea,
      manualWork: input.manualWork,
      failureImpact: input.failureImpact,
      frequency: input.frequency,
      priority: input.priority,
      readiness: input.readiness,
      foundingInterest: input.foundingInterest,
    },
  };
}
