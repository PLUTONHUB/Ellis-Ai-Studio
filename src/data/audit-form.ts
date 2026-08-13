/**
 * The Business Bottleneck Audit questionnaire.
 *
 * Extracted verbatim from the legacy acquisition site so the form's actual
 * content survives the frontend reset. Field names must keep matching
 * `AuditApplication` in ~/lib/audit-intake.server, which is what the webhook
 * and the mailto fallback both serialise.
 */

export type AuditField =
  | { kind: "text"; name: string; label: string; type?: string; required?: boolean; autoComplete?: string }
  | { kind: "textarea"; name: string; label: string; required?: boolean }
  | { kind: "select"; name: string; label: string; options: string[]; required?: boolean };

export type AuditFieldset = { legend: string; hint?: string; fields: AuditField[] };

export const auditFieldsets: AuditFieldset[] = [
  {
    legend: "About you",
    fields: [
      { kind: "text", name: "name", label: "Name", required: true, autoComplete: "name" },
      { kind: "text", name: "businessName", label: "Business name", required: true, autoComplete: "organization" },
      { kind: "text", name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
      { kind: "text", name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
      { kind: "text", name: "website", label: "Website", type: "url" },
      { kind: "text", name: "industry", label: "Industry" },
      { kind: "text", name: "teamSize", label: "Approximate team size" },
    ],
  },
  {
    legend: "The problem",
    hint: "The more specific this is, the more useful the audit will be.",
    fields: [
      { kind: "textarea", name: "challenge", label: "What is the biggest challenge in your business right now?", required: true },
      {
        kind: "select", name: "affectedArea", label: "Which area is most affected?", required: true,
        options: ["Lead generation", "Lead follow-up", "Sales", "Customer communication", "Scheduling", "Onboarding", "Administrative work", "Internal operations", "Reporting", "Content/marketing", "Website/customer experience", "Disconnected software", "Other"],
      },
      { kind: "textarea", name: "currentProcess", label: "Walk us through what currently happens.", required: true },
      { kind: "textarea", name: "manualWork", label: "What part requires the most manual work?", required: true },
      { kind: "textarea", name: "failureImpact", label: "What happens when this process goes wrong or gets delayed?", required: true },
      { kind: "text", name: "tools", label: "Which software/tools are involved?" },
      { kind: "select", name: "frequency", label: "Approximately how often does this process happen?", required: true, options: ["Daily", "Several times weekly", "Weekly", "Occasionally"] },
    ],
  },
  {
    legend: "Desired outcome",
    fields: [
      { kind: "textarea", name: "desiredOutcome", label: "If this process worked exactly how you wanted, what would change?", required: true },
      {
        kind: "select", name: "priority", label: "What matters most?", required: true,
        options: ["Save time", "Respond faster", "Reduce manual work", "Improve customer experience", "Capture more opportunities", "Organize information", "Reduce errors", "Increase visibility", "Support growth"],
      },
    ],
  },
  {
    legend: "Readiness",
    fields: [
      { kind: "select", name: "readiness", label: "If we identify a strong solution, are you prepared to invest in implementation?", required: true, options: ["Yes", "Possibly — depending on recommendation", "Researching only"] },
      { kind: "select", name: "foundingInterest", label: "Is this for the Founding Client Program?", required: true, options: ["Yes", "No", "Not sure"] },
    ],
  },
];

/** Questions answered on the audit page, extracted from the legacy FAQ. */
export const auditFaq: Array<[string, string]> = [
  ["Do I need to know what service I need?", "No. Start with the business problem. Part of our job is determining what type of system, if any, makes sense."],
  ["Does every project use AI?", "No. AI is useful when interpretation, generation, classification, research, or reasoning helps the process. Many operational problems are better solved with straightforward automation or better system design."],
  ["Do you still build websites?", "Yes — when the website is part of the solution. We look at how it connects to the rest of the business rather than treating it as an isolated asset."],
  ["Can you work with the software we already use?", "Often, yes. We first determine whether the existing stack should be connected, simplified, replaced, or left alone."],
  ["Will everything run automatically?", "Not necessarily. Some workflows are safe to automate end-to-end. Others require approval or human judgment."],
  ["How much does a project cost?", "Implementation depends on the business problem, complexity, integrations, and scope. After diagnosis, you'll receive a defined recommendation and pricing before implementation begins."],
  ["What if automation isn't the right solution?", "We'll tell you."],
];
