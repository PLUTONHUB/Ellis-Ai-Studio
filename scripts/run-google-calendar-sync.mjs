import { randomUUID, webcrypto } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

const interval = Number(process.env.GOOGLE_CALENDAR_SYNC_INTERVAL_MS ?? 300_000);
const schedulePath = ".data/content-schedule.json";
const syncPath = ".data/google-calendar-sync.json";
const tokenPath = ".data/google-calendar.json";

async function environment() {
  const source = await readFile(".env", "utf8");
  return Object.fromEntries(source.split(/\r?\n/).flatMap((line) => { const match = line.match(/^([A-Z0-9_]+)=(.*)$/); return match ? [[match[1], match[2]]] : []; }));
}
async function json(path, empty) { try { return JSON.parse(await readFile(path, "utf8")); } catch (error) { if (error.code === "ENOENT") return empty; throw error; } }
async function save(path, value) { await mkdir(".data", { recursive: true }); const temporary = `${path}.${randomUUID()}.tmp`; await writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 }); await rename(temporary, path); }
async function token(settings) {
  const encrypted = await json(tokenPath, null);
  if (!encrypted) throw new Error("Google Calendar is not connected.");
  const digest = await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(settings.GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY));
  const key = await webcrypto.subtle.importKey("raw", digest, "AES-GCM", false, ["decrypt"]);
  const plaintext = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv: Buffer.from(encrypted.iv, "base64url") }, key, Buffer.from(encrypted.ciphertext, "base64url"));
  return JSON.parse(new TextDecoder().decode(plaintext));
}
async function active(current, settings) {
  if (current.expiresAt > Date.now() + 60_000) return current;
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: settings.GOOGLE_OAUTH_CLIENT_ID, client_secret: settings.GOOGLE_OAUTH_CLIENT_SECRET, refresh_token: current.refreshToken, grant_type: "refresh_token" }) });
  const next = await response.json();
  if (!response.ok || !next.access_token || !next.expires_in) throw new Error("Google Calendar token refresh failed.");
  return { ...current, accessToken: next.access_token, expiresAt: Date.now() + next.expires_in * 1000 };
}
function eventFor(item) {
  const start = new Date(item.scheduledFor); const end = new Date(start.getTime() + 15 * 60_000);
  return { summary: `LinkedIn: ${item.title}`, description: `${item.body}\n\nManaged in Ellis AI Studio Content OS.`, start: { dateTime: start.toISOString(), timeZone: "America/Los_Angeles" }, end: { dateTime: end.toISOString(), timeZone: "America/Los_Angeles" }, extendedProperties: { private: { contentOsId: item.id } } };
}
async function sync() {
  const settings = await environment();
  const content = (await json(schedulePath, [])).filter((item) => item.topic === "linkedin" && item.scheduledFor && !item.published);
  const mapping = await json(syncPath, {});
  const auth = await active(await token(settings), settings);
  let created = 0; let updated = 0;
  for (const item of content) {
    const event = eventFor(item); const known = mapping[item.id];
    const endpoint = known ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(known)}` : "https://www.googleapis.com/calendar/v3/calendars/primary/events";
    const response = await fetch(endpoint, { method: known ? "PATCH" : "POST", headers: { Authorization: `Bearer ${auth.accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify(event) });
    const result = await response.json();
    if (!response.ok || !result.id) throw new Error(result.error?.message ?? "Google Calendar synchronization failed.");
    if (known) updated++; else { mapping[item.id] = result.id; created++; }
  }
  await save(syncPath, mapping);
  return { created, updated, total: content.length };
}

while (true) {
  try { process.stdout.write(`${JSON.stringify({ at: new Date().toISOString(), ...(await sync()) })}\n`); }
  catch (error) { process.stderr.write(`${new Date().toISOString()} ${error instanceof Error ? error.message : String(error)}\n`); }
  await new Promise((resolve) => setTimeout(resolve, interval));
}
