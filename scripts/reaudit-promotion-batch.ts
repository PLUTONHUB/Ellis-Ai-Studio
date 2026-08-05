import { readFile } from "node:fs/promises";
import { reAudit } from "../src/lib/prospect-intelligence.server";

const campaignId = "37d7ad01-daee-4a7e-9afd-6f73aa12a219";
const campaigns = JSON.parse(await readFile(".data/pluto-prospecting-v3.json", "utf8")) as { campaigns: Array<{ id: string; prospectIds: string[] }> };
const campaign = campaigns.campaigns.find((item) => item.id === campaignId);
if (!campaign) throw new Error("Promotion campaign was not found.");
const results = [];
for (const id of campaign.prospectIds) {
  try { const report = await reAudit(id); results.push({ id, businessName: report.businessName, score: report.score, findings: report.findings }); }
  catch (error) { results.push({ id, error: error instanceof Error ? error.message : String(error) }); }
}
console.log(JSON.stringify({ campaignId, results }, null, 2));
