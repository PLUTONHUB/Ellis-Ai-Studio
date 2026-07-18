import { createServerFn } from "@tanstack/react-start";

export type FrictionAuditBooking = {
  name: string;
  email: string;
  company: string;
  notes?: string;
  start: string;
  end: string;
  websiteUrl?: string;
  serviceArea: string;
  primaryService: string;
};

export const bookFrictionAudit = createServerFn({ method: "POST" })
  .validator((data: FrictionAuditBooking) => {
    if (!data || !isText(data.name) || !isEmail(data.email) || !isText(data.company) || (data.websiteUrl && !isUrl(data.websiteUrl)) || !isText(data.serviceArea) || !isText(data.primaryService) || !isValidDate(data.start) || !isValidDate(data.end)) throw new Error("A name, business email, company, service area, primary service, and valid booking times are required. Enter a valid website URL when supplied.");
    if (new Date(data.end) <= new Date(data.start)) throw new Error("The booking end time must be after the start time.");
    return { ...data, name: data.name.trim(), email: data.email.trim(), company: data.company.trim(), websiteUrl: data.websiteUrl?.trim() || undefined, serviceArea: data.serviceArea.trim(), primaryService: data.primaryService.trim(), notes: data.notes?.trim().slice(0, 2_000) };
  })
  .handler(async ({ data }) => {
    const { GoogleService } = await import("~/services/google-service");
    let internalDraft = false;
    if (data.websiteUrl) {
      try {
        internalDraft = await createInternalDraftAudit({ companyName: data.company, websiteUrl: data.websiteUrl, contactName: data.name, email: data.email, serviceArea: data.serviceArea, primaryService: data.primaryService });
      } catch (error) {
        // Audit research is internal, asynchronous preparation. A temporary crawl failure must not prevent a confirmed client booking.
        console.error("Unable to prepare internal Friction Audit draft", error);
      }
    }
    const google = GoogleService.fromEnvironment();
    const event = await google.createCalendarEvent({
      summary: `Ellis AI Studio Friction Audit — ${data.company}`,
      description: [
        "Ellis AI Studio Friction Audit / Strategy Session",
        `Client: ${data.name}`,
        `Email: ${data.email}`,
        data.notes ? `Notes: ${data.notes}` : "",
      ].filter(Boolean).join("\n"),
      start: data.start,
      end: data.end,
      attendeeEmail: data.email,
    });
    await google.sendConfirmationEmail({ to: data.email, clientName: data.name, companyName: data.company, eventStart: data.start, meetLink: event.meetLink });
    return { eventId: event.eventId, meetLink: event.meetLink, auditCreated: internalDraft };
  });

function isText(value: unknown): value is string { return typeof value === "string" && value.trim().length > 1; }
function isEmail(value: unknown): value is string { return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function isValidDate(value: unknown): value is string { return typeof value === "string" && !Number.isNaN(Date.parse(value)); }
function isUrl(value: unknown): value is string { try { return typeof value === "string" && ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; } }

async function createInternalDraftAudit(intake: import("~/types/friction-audit").FrictionAuditIntake): Promise<boolean> {
  if (process.env.PLUTO_RESEARCH_ENABLED !== "true") return false;
  const [{ BusinessResearchService }, { FrictionAuditService }, { SupabaseResearchRepository }] = await Promise.all([import("~/services/business-research-service"), import("~/services/friction-audit-service"), import("~/lib/supabase/research-repository.server")]);
  const repository = SupabaseResearchRepository.fromEnvironment();
  const research = await new BusinessResearchService(repository).research({ name: intake.companyName, websiteUrl: intake.websiteUrl, idempotencyKey: crypto.randomUUID() });
  const draft = new FrictionAuditService().createDraft(intake, research);
  await repository.upsertFrictionAudit({ businessId: research.business.id, researchRunId: research.researchRunId, intake, draft });
  return true;
}
