import { createServerFn } from "@tanstack/react-start";

export type RoofingGrowthBlueprintBooking = {
  name: string;
  email: string;
  company: string;
  notes?: string;
  start: string;
  end: string;
};

export const bookRoofingGrowthBlueprint = createServerFn({ method: "POST" })
  .validator((data: RoofingGrowthBlueprintBooking) => {
    if (!data || !isText(data.name) || !isEmail(data.email) || !isText(data.company) || !isValidDate(data.start) || !isValidDate(data.end)) throw new Error("A name, business email, company, and valid booking times are required.");
    if (new Date(data.end) <= new Date(data.start)) throw new Error("The booking end time must be after the start time.");
    return { ...data, name: data.name.trim(), email: data.email.trim(), company: data.company.trim(), notes: data.notes?.trim().slice(0, 2_000) };
  })
  .handler(async ({ data }) => {
    const { GoogleService } = await import("~/services/google-service");
    const google = GoogleService.fromEnvironment();
    const baseUrl = process.env.PUBLIC_APP_URL;
    if (!baseUrl) throw new Error("PUBLIC_APP_URL must be set as a Worker secret.");
    const onboardingUrl = new URL("/onboarding", baseUrl).toString();
    const folder = await google.createClientFolder(data.company);
    const event = await google.createCalendarEvent({ summary: `Roofing Growth Blueprint — ${data.company}`, description: [`Client: ${data.name}`, `Email: ${data.email}`, `Drive folder: ${folder.webViewLink ?? folder.folderId}`, data.notes ? `Notes: ${data.notes}` : ""].filter(Boolean).join("\n"), start: data.start, end: data.end, attendeeEmail: data.email });
    await google.sendConfirmationEmail({ to: data.email, clientName: data.name, companyName: data.company, eventStart: data.start, meetLink: event.meetLink, onboardingUrl });
    return { eventId: event.eventId, meetLink: event.meetLink, onboardingUrl };
  });

function isText(value: unknown): value is string { return typeof value === "string" && value.trim().length > 1; }
function isEmail(value: unknown): value is string { return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function isValidDate(value: unknown): value is string { return typeof value === "string" && !Number.isNaN(Date.parse(value)); }
