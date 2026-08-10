export type AuditApplication = {
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  teamSize?: string;
  challenge: string;
  affectedArea: string;
  currentProcess: string;
  manualWork: string;
  failureImpact: string;
  tools?: string;
  frequency: string;
  desiredOutcome: string;
  priority: string;
  readiness: string;
  foundingInterest: string;
  source?: string;
  campaign?: string;
  landingPage?: string;
};

function required(value: string | undefined, label: string) {
  const clean = value?.trim();
  if (!clean) throw new Error(`${label} is required.`);
  return clean;
}

export async function submitAuditApplication(input: AuditApplication) {
  const application = {
    ...input,
    name: required(input.name, "Name"),
    businessName: required(input.businessName, "Business name"),
    email: required(input.email, "Email"),
    challenge: required(input.challenge, "Business challenge"),
    affectedArea: required(input.affectedArea, "Affected area"),
    currentProcess: required(input.currentProcess, "Current process"),
    manualWork: required(input.manualWork, "Manual work"),
    failureImpact: required(input.failureImpact, "Delay impact"),
    frequency: required(input.frequency, "Process frequency"),
    desiredOutcome: required(input.desiredOutcome, "Desired outcome"),
    priority: required(input.priority, "Priority"),
    readiness: required(input.readiness, "Readiness"),
    foundingInterest: required(input.foundingInterest, "Founding program interest"),
    submittedAt: new Date().toISOString(),
  };

  const destination = process.env.AUDIT_FORM_WEBHOOK_URL;
  if (!destination) return { delivered: false };

  const response = await fetch(destination, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  if (!response.ok) throw new Error("We could not send your application right now. Please try again or email Jake@ellisaistudio.com.");
  return { delivered: true };
}
