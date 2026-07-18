import "@tanstack/react-start/server-only";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

type GoogleServiceConfig = {
  serviceAccount: ServiceAccount;
  delegatedUser: string;
  calendarId: string;
  driveParentFolderId: string;
};

type AccessToken = { value: string; expiresAt: number };

export type CalendarEventInput = {
  summary: string;
  description: string;
  start: string;
  end: string;
  attendeeEmail: string;
};

export class GoogleService {
  private readonly tokens = new Map<string, AccessToken>();

  constructor(private readonly config: GoogleServiceConfig) {}

  static fromEnvironment(): GoogleService {
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const delegatedUser = process.env.GOOGLE_WORKSPACE_IMPERSONATED_USER;
    const calendarId = process.env.GOOGLE_CALENDAR_ID ?? process.env.GOOGLE_WORKSPACE_CALENDER_ID;
    const driveParentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
    const missing = [
      !credentials && "GOOGLE_SERVICE_ACCOUNT_JSON",
      !delegatedUser && "GOOGLE_WORKSPACE_IMPERSONATED_USER",
      !calendarId && "GOOGLE_CALENDAR_ID",
      !driveParentFolderId && "GOOGLE_DRIVE_PARENT_FOLDER_ID",
    ].filter((value): value is string => Boolean(value));
    if (missing.length) {
      throw new Error(`Google Workspace is not configured. Add these Worker secrets: ${missing.join(", ")}.`);
    }

    let serviceAccount: ServiceAccount;
    try {
      serviceAccount = JSON.parse(credentials!) as ServiceAccount;
    } catch {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must contain valid service-account JSON.");
    }
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email or private_key.");
    }
    return new GoogleService({ serviceAccount, delegatedUser: delegatedUser!, calendarId: calendarId!, driveParentFolderId: driveParentFolderId! });
  }

  async sendConfirmationEmail(input: { to: string; clientName: string; companyName: string; eventStart: string; meetLink: string }): Promise<void> {
    const start = new Date(input.eventStart);
    const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: "America/Los_Angeles" }).format(start);
    const time = new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "America/Los_Angeles" }).format(start);
    const subject = "Your Ellis AI Studio Friction Audit is Booked";
    const text = [
      `Hi ${input.clientName},`,
      "",
      "Your Ellis AI Studio Friction Audit has been confirmed.",
      "",
      `Date: ${date}`,
      `Time: ${time} PT`,
      `Google Meet: ${input.meetLink}`,
      "",
      "We'll review your business before the session and identify the highest-impact opportunities to improve customer acquisition, operational efficiency, and revenue growth.",
      "",
      "See you soon,",
      "Ellis AI Studio",
    ].join("\r\n");
    await this.request(GMAIL_SCOPE, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      body: JSON.stringify({ raw: base64Url(new TextEncoder().encode(`To: ${input.to}\r\nSubject: ${subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}`)) }),
    });
  }

  async sendClientWelcomeEmail(input: { to: string; clientName: string; projectName: string }): Promise<void> {
    const subject = "Welcome to Ellis AI Studio";
    const text = [
      `Hi ${input.clientName},`,
      "",
      "Thank you for choosing Ellis AI Studio. Your deposit has been received and your project has officially started.",
      "",
      `Project: ${input.projectName}`,
      "",
      "We’ll be in touch with the next milestone. Your client workspace is now available for project updates, deliverables, and meetings.",
      "",
      "Welcome aboard,",
      "Ellis AI Studio",
    ].join("\r\n");
    await this.request(GMAIL_SCOPE, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      body: JSON.stringify({ raw: base64Url(new TextEncoder().encode(`To: ${input.to}\r\nSubject: ${subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}`)) }),
    });
  }

  async createCalendarEvent(input: CalendarEventInput): Promise<{ eventId: string; meetLink: string }> {
    const event = await this.request<{ id: string; hangoutLink?: string }>(CALENDAR_SCOPE, `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.config.calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`, {
      method: "POST",
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.start },
        end: { dateTime: input.end },
        attendees: [{ email: input.attendeeEmail }],
        conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
      }),
    });
    if (!event.id || !event.hangoutLink) throw new Error("Google Calendar did not return a Google Meet link.");
    return { eventId: event.id, meetLink: event.hangoutLink };
  }

  async createClientFolder(companyName: string): Promise<{ folderId: string; webViewLink?: string }> {
    const folder = await this.request<{ id: string; webViewLink?: string }>(DRIVE_SCOPE, "https://www.googleapis.com/drive/v3/files?fields=id,webViewLink", {
      method: "POST",
      body: JSON.stringify({ name: `${safeName(companyName)} - Ellis AI Studio Client`, mimeType: "application/vnd.google-apps.folder", parents: [this.config.driveParentFolderId] }),
    });
    if (!folder.id) throw new Error("Google Drive did not return a client folder id.");
    return { folderId: folder.id, webViewLink: folder.webViewLink };
  }

  private async request<T = void>(scope: string, url: string, init: RequestInit): Promise<T> {
    const token = await this.getAccessToken(scope);
    const response = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers } });
    if (!response.ok) throw new Error(`Google API request failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
    return response.status === 204 ? undefined as T : await response.json() as T;
  }

  private async getAccessToken(scope: string): Promise<string> {
    const cached = this.tokens.get(scope);
    if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;
    const now = Math.floor(Date.now() / 1_000);
    const assertion = await signJwt({ iss: this.config.serviceAccount.client_email, sub: this.config.delegatedUser, scope, aud: this.config.serviceAccount.token_uri ?? TOKEN_URL, iat: now, exp: now + 3_600 }, this.config.serviceAccount.private_key);
    const response = await fetch(this.config.serviceAccount.token_uri ?? TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }) });
    if (!response.ok) throw new Error(`Google OAuth token request failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
    const payload = await response.json() as { access_token?: string; expires_in?: number };
    if (!payload.access_token) throw new Error("Google OAuth token response did not include an access token.");
    this.tokens.set(scope, { value: payload.access_token, expiresAt: Date.now() + (payload.expires_in ?? 3_600) * 1_000 });
    return payload.access_token;
  }
}

async function signJwt(claims: Record<string, string | number>, pem: string): Promise<string> {
  const header = base64Url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64Url(new TextEncoder().encode(JSON.stringify(claims)));
  const key = await crypto.subtle.importKey("pkcs8", pemToBytes(pem), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${payload}`));
  return `${header}.${payload}.${base64Url(new Uint8Array(signature))}`;
}

function pemToBytes(pem: string): ArrayBuffer {
  const base64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer;
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function safeName(value: string): string {
  return value.trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").slice(0, 120) || "New client";
}
