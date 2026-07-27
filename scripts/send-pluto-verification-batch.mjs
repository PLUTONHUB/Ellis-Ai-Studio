import { createHash, randomUUID, webcrypto } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const root = process.cwd();
const intelligencePath = `${root}/.data/prospect-intelligence.json`;
const campaignPath = `${root}/.data/pluto-prospecting-v3.json`;
const ledgerPath = `${root}/.data/pluto-contact-ledger.json`;
const gmailPath = `${root}/.data/gmail.json`;

async function environment() {
  const source = await readFile(`${root}/.env`, "utf8");
  return Object.fromEntries(source.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    return match ? [[match[1], match[2]]] : [];
  }));
}

async function saveJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 });
  await rename(temporary, path);
}

async function loadJson(path, empty) {
  try { return JSON.parse(await readFile(path, "utf8")); } catch (error) { if (error.code === "ENOENT") return empty; throw error; }
}

function validAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? "") && !/^(example|test|noreply)@/i.test(value);
}

function encodedHeader(value) {
  return /[^\x20-\x7e]/.test(value) ? `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=` : value;
}

function fold(value) { return value.match(/.{1,76}/g)?.join("\r\n") ?? ""; }
function escapeHtml(value) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />"); }

function rawMessage({ to, subject, body }) {
  const boundary = `alt_${randomUUID().replaceAll("-", "")}`;
  const html = escapeHtml(body);
  return [
    `To: ${to}`,
    `Subject: ${encodedHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary=\"${boundary}\"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    fold(Buffer.from(body, "utf8").toString("base64")),
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    fold(Buffer.from(html, "utf8").toString("base64")),
    "",
    `--${boundary}--`,
  ].join("\r\n");
}

async function loadToken(secret) {
  const encrypted = await loadJson(gmailPath, null);
  if (!encrypted) throw new Error("No connected Pluto Mail account is available.");
  const digest = await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  const key = await webcrypto.subtle.importKey("raw", digest, "AES-GCM", false, ["decrypt"]);
  const plaintext = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv: Buffer.from(encrypted.iv, "base64url") }, key, Buffer.from(encrypted.ciphertext, "base64url"));
  return JSON.parse(new TextDecoder().decode(plaintext));
}

function observation(report) {
  return (report.findings ?? report.weaknesses ?? []).filter((item) => /SSL|contact form|booking|analytics|viewport|description|CRM|automation/i.test(item)).slice(0, 2).map((item) => item.replace(/\.$/, "").toLowerCase()).join(" and ");
}

function draft(report) {
  const findings = observation(report) || "a few opportunities in the public customer journey";
  const subject = `${report.businessName} — an idea after reviewing your website`;
  const body = `Hi there,\n\nMy name is Jake Ellis, founder of Ellis AI Studio. While reviewing ${report.businessName}'s public online presence, I noticed ${findings}.\n\nThose details can make it harder to turn interested visitors into qualified conversations. We can address them with a clearer lead-capture path, mobile-ready website improvements, stronger local SEO foundations, and connected CRM or follow-up automation where it fits your process.\n\nEllis AI Studio builds websites, SEO foundations, CRM systems, AI-assisted workflows, analytics, and lead-recovery systems as one connected plan—not disconnected tools. When multiple issues are linked, we can package the work into a phased plan with discounted bundled pricing.\n\nIf you reply with your biggest goal this year and the operational issue slowing you down, I’ll personally share where I believe we could help. There’s no obligation.\n\nThank you,\nJake Ellis\nFounder, Ellis AI Studio\nhttps://ellisaistudio.com\n\nIf you do not want to receive future outreach from Ellis AI Studio, reply “unsubscribe.”`;
  return { subject, body };
}

async function refreshIfNeeded(token, settings) {
  if (token.expiresAt > Date.now() + 60_000) return token;
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: settings.GOOGLE_OAUTH_CLIENT_ID, client_secret: settings.GOOGLE_OAUTH_CLIENT_SECRET, refresh_token: token.refreshToken, grant_type: "refresh_token" }) });
  const next = await response.json();
  if (!response.ok || !next.access_token || !next.expires_in) throw new Error("Pluto Mail could not refresh its Gmail connection.");
  return { ...token, accessToken: next.access_token, expiresAt: Date.now() + next.expires_in * 1000 };
}

async function send(token, report, content) {
  const request = async (path, init) => {
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, { ...init, headers: { Authorization: `Bearer ${token.accessToken}`, "Content-Type": "application/json", ...(init.headers ?? {}) } });
    if (!response.ok) throw new Error(`Gmail request failed (${response.status}).`);
    return response.json();
  };
  const raw = Buffer.from(rawMessage({ to: report.email, ...content }), "utf8").toString("base64url");
  const created = await request("drafts", { method: "POST", body: JSON.stringify({ message: { raw } }) });
  return request("drafts/send", { method: "POST", body: JSON.stringify({ id: created.id }) });
}

const settings = await environment();
const intelligence = await loadJson(intelligencePath, { reports: [] });
const ledger = await loadJson(ledgerPath, { sends: [] });
const campaigns = await loadJson(campaignPath, { campaigns: [] });
const alreadySent = new Set(ledger.sends.map((item) => item.prospectId));
const prospects = intelligence.reports
  .filter((item) => item.score >= 45 && item.stage !== "opted_out" && validAddress(item.email) && !alreadySent.has(item.id))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);

if (prospects.length < 10) throw new Error(`Only ${prospects.length} eligible, unsent prospects are available.`);

let token = await refreshIfNeeded(await loadToken(settings.GMAIL_TOKEN_ENCRYPTION_KEY), settings);
const campaign = { id: randomUUID(), name: "Batch 3 verification — 10 personalized emails", prospectIds: prospects.map((item) => item.id), status: "approved", createdAt: Date.now(), approvedAt: Date.now(), sentProspectIds: [], sendFailures: [], delivery: { queued: prospects.length, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, meetings: 0, proposals: 0, won: 0, lost: 0, revenue: 0 } };

for (const report of prospects) {
  try {
    token = await refreshIfNeeded(token, settings);
    const content = draft(report);
    const sent = await send(token, report, content);
    campaign.sentProspectIds.push(report.id);
    campaign.delivery.sent++;
    ledger.sends.push({ campaignId: campaign.id, prospectId: report.id, businessName: report.businessName, email: report.email, sentAt: Date.now(), messageId: sent.id, subjectFingerprint: createHash("sha256").update(content.subject).digest("hex").slice(0, 12) });
    process.stdout.write(`SENT ${report.businessName}\n`);
  } catch (error) {
    campaign.sendFailures.push({ prospectId: report.id, reason: error instanceof Error ? error.message : "Pluto Mail could not send this message." });
    process.stdout.write(`FAILED ${report.businessName}\n`);
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
}

campaign.status = campaign.sendFailures.length ? "paused" : "complete";
campaigns.campaigns.unshift(campaign);
await saveJson(ledgerPath, ledger);
await saveJson(campaignPath, campaigns);
process.stdout.write(`RESULT sent=${campaign.delivery.sent} failed=${campaign.sendFailures.length} campaign=${campaign.id}\n`);
