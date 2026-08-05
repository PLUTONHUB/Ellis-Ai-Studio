import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { reAudit } from "../src/lib/prospect-intelligence.server";

type Report = { id: string; businessName: string; email?: string; website: string; score: number; stage?: string; findings?: string[] };
type Ledger = { sends: Array<{ prospectId: string; email?: string }> };
const reports = (JSON.parse(await readFile(".data/prospect-intelligence.json", "utf8")) as { reports: Report[] }).reports;
const ledger = JSON.parse(await readFile(".data/pluto-contact-ledger.json", "utf8")) as Ledger;
const campaignsPath = ".data/pluto-prospecting-v3.json";
const campaigns = JSON.parse(await readFile(campaignsPath, "utf8")) as { campaigns: unknown[] };
const sentIds = new Set(ledger.sends.map((send) => send.prospectId));
const seenDomains = new Set<string>();
const candidates = reports.filter((report) => {
  if (!report.email || /^(example|test|noreply)@/i.test(report.email) || report.stage === "opted_out" || sentIds.has(report.id)) return false;
  try { const domain = new URL(report.website).hostname.replace(/^www\./, "").toLowerCase(); if (/(jotform|typeform|forms\.gle|facebook\.com)$/.test(domain) || seenDomains.has(domain)) return false; seenDomains.add(domain); return true; } catch { return false; }
}).sort((a, b) => b.score - a.score).slice(0, 160);

const verified: Report[] = [];
for (const candidate of candidates) {
  if (verified.length >= 30) break;
  try {
    const refreshed = await reAudit(candidate.id);
    if (refreshed.score >= 45 && refreshed.email) verified.push(refreshed);
  } catch { /* An unreachable page is not eligible for this verified batch. */ }
}
if (verified.length < 30) throw new Error(`Only ${verified.length} candidates passed the corrected verification threshold.`);
campaigns.campaigns = campaigns.campaigns.filter((item) => (item as { name?: string }).name !== "Verified outreach review — 30 businesses");
const campaign = { id: randomUUID(), name: "Verified outreach review — 30 businesses", prospectIds: verified.map((report) => report.id), status: "awaiting_approval", createdAt: Date.now(), verification: { auditMethod: "raw HTML + final redirect URL", verifiedAt: new Date().toISOString(), count: verified.length }, delivery: { queued: verified.length, sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, meetings: 0, proposals: 0, won: 0, lost: 0, revenue: 0 } };
campaigns.campaigns.unshift(campaign);
const temporary = `${campaignsPath}.${randomUUID()}.tmp`; await writeFile(temporary, JSON.stringify(campaigns, null, 2), { mode: 0o600 }); await rename(temporary, campaignsPath);
console.log(JSON.stringify({ campaignId: campaign.id, status: campaign.status, verified: verified.map((report) => ({ businessName: report.businessName, email: report.email, website: report.website, score: report.score, findings: report.findings })) }, null, 2));
