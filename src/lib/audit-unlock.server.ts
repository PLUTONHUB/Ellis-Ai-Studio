/**
 * Lead capture for the AI Opportunity Audit roadmap unlock.
 *
 * Deliberately the same shape as ~/lib/audit-intake.server: it posts to the
 * already-configured AUDIT_FORM_WEBHOOK_URL and reports `delivered: false`
 * when no webhook is set, rather than pretending a delivery happened. No new
 * service, store or endpoint is introduced for this design phase.
 *
 * Note the deliberate asymmetry with the intake form: the caller unlocks the
 * report whether or not delivery succeeds. The visitor's report is not held
 * hostage to our integration being configured.
 */

export type AuditUnlockRequest = {
  name: string;
  email: string;
  company?: string;
  /** Which report they unlocked, so a follow-up can reference it. */
  reportId: string;
  /** The site they audited, as they entered it. */
  website: string;
  /** Headline score at the time of unlock — useful context on the lead. */
  automationOpportunity: number;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitAuditUnlock(input: AuditUnlockRequest) {
  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name) throw new Error("Please add your name.");
  if (!email || !EMAIL.test(email)) throw new Error("Please add a valid email address.");

  const destination = process.env.AUDIT_FORM_WEBHOOK_URL;
  if (!destination) return { delivered: false };

  const response = await fetch(destination, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "ai-opportunity-audit-unlock",
      ...input,
      name,
      email,
      submittedAt: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error("We could not save your details right now.");
  return { delivered: true };
}
