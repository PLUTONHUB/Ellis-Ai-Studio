import { webcrypto, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

const schedulePath = ".data/content-schedule.json";
const syncPath = ".data/google-calendar-sync.json";
const tokenPath = ".data/google-calendar.json";

async function environment() {
  const source = await readFile(".env", "utf8");
  return Object.fromEntries(source.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    return match ? [[match[1], match[2]]] : [];
  }));
}
async function json(path) { return JSON.parse(await readFile(path, "utf8")); }
async function save(path, value) { await mkdir(".data", { recursive: true }); const temporary = `${path}.${randomUUID()}.tmp`; await writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 }); await rename(temporary, path); }
async function token(settings) {
  const encrypted = await json(tokenPath);
  const digest = await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(settings.GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY));
  const key = await webcrypto.subtle.importKey("raw", digest, "AES-GCM", false, ["decrypt"]);
  const plaintext = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv: Buffer.from(encrypted.iv, "base64url") }, key, Buffer.from(encrypted.ciphertext, "base64url"));
  return JSON.parse(new TextDecoder().decode(plaintext));
}
async function active(current, settings) {
  if (current.expiresAt > Date.now() + 60_000) return current;
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: settings.GOOGLE_OAUTH_CLIENT_ID, client_secret: settings.GOOGLE_OAUTH_CLIENT_SECRET, refresh_token: current.refreshToken, grant_type: "refresh_token" }) });
  const next = await response.json();
  if (!response.ok || !next.access_token) throw new Error("Google Calendar token refresh failed.");
  return { ...current, accessToken: next.access_token };
}
function currentCopy(item) {
  let body = item.body;
  body = body.replace("That is the kind of infrastructure Ellis AI Studio builds.", "That is how Ellis AI Studio builds AI-powered growth infrastructure.");
  body = body.replace("Conversion clarity is infrastructure.", "Conversion clarity is a growth-system requirement.");
  body = body.replace("New visuals are the surface. Better infrastructure is the result.", "New visuals are the surface. Better growth systems are the result.");
  body = body.replace("Ellis AI Studio designs intelligent business infrastructure.", "Ellis AI Studio designs, builds, and manages AI-powered growth infrastructure.");
  body = body.replace("When the system works together, growth becomes easier to operate.", "When the systems work together, customer acquisition and operations become easier to improve.");
  const title = item.title === "What Ellis AI Studio actually builds" ? "What Ellis AI Studio builds" : item.title;
  return { ...item, title, body, lastModified: Date.now() };
}

const settings = await environment();
const schedule = await json(schedulePath);
const sync = await json(syncPath);
const updated = schedule.map((item) => item.campaignTag === "linkedin-week-2026-07-27" ? currentCopy(item) : item);
const access = await active(await token(settings), settings);
let calendarUpdated = 0;
for (const item of updated.filter((entry) => entry.campaignTag === "linkedin-week-2026-07-27")) {
  const eventId = sync[item.id];
  if (!eventId) throw new Error(`Missing Google Calendar event for ${item.id}.`);
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`, { method: "PATCH", headers: { Authorization: `Bearer ${access.accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ summary: `LinkedIn: ${item.title}`, description: `${item.body}\n\nManaged in Ellis AI Studio Content OS.` }) });
  if (!response.ok) throw new Error(`Google Calendar update failed (${response.status}).`);
  calendarUpdated++;
}
await save(schedulePath, updated);
process.stdout.write(JSON.stringify({ contentUpdated: updated.filter((item) => item.campaignTag === "linkedin-week-2026-07-27").length, calendarUpdated }));
