import { readFile, writeFile, rename } from 'node:fs/promises';
import { createHash, createDecipheriv, createCipheriv, randomBytes } from 'node:crypto';

const eventId = 'mrk5u15ht15604fomlhofrbvtg';
const files = ['.env', '.env.local', '.data/n8n.env'];
const env = {};
for (const file of files) {
  try {
    for (const line of (await readFile(file, 'utf8')).split(/\r?\n/)) {
      const index = line.indexOf('=');
      if (index > 0) env[line.slice(0, index).trim()] ??= line.slice(index + 1).trim();
    }
  } catch {}
}
const path = '.data/google-calendar.json';
const encrypted = JSON.parse(await readFile(path, 'utf8'));
const key = createHash('sha256').update(env.GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY).digest();
const payload = Buffer.from(encrypted.ciphertext, 'base64url');
const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(encrypted.iv, 'base64url'));
decipher.setAuthTag(payload.subarray(-16));
let tokens = JSON.parse(Buffer.concat([decipher.update(payload.subarray(0, -16)), decipher.final()]).toString());
if (tokens.expiresAt < Date.now() + 60_000) {
  const refresh = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: tokens.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const updated = await refresh.json();
  if (!refresh.ok) throw new Error(`Google token refresh failed: ${updated.error || refresh.status}`);
  tokens = { ...tokens, accessToken: updated.access_token, expiresAt: Date.now() + updated.expires_in * 1000 };
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const value = Buffer.concat([cipher.update(JSON.stringify(tokens)), cipher.final(), cipher.getAuthTag()]);
  await writeFile(`${path}.tmp`, JSON.stringify({ iv: iv.toString('base64url'), ciphertext: value.toString('base64url') }));
  await rename(`${path}.tmp`, path);
}

const start = new Date(Date.now() - 30_000);
const end = new Date(start.getTime() + 15 * 60_000);
const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${tokens.accessToken}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    start: { dateTime: start.toISOString(), timeZone: 'America/Los_Angeles' },
    end: { dateTime: end.toISOString(), timeZone: 'America/Los_Angeles' },
  }),
});
const event = await response.json();
if (!response.ok) throw new Error(`Calendar update failed: ${event.error?.message || response.status}`);
await writeFile('artifacts/rescheduled-approved-production-event.json', JSON.stringify(event, null, 2));
console.log(JSON.stringify({ eventId: event.id, start: event.start, end: event.end, timeZone: event.start.timeZone }));
