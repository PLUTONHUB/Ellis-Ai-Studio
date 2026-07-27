import { resumeNationalScan } from "../src/lib/prospect-intelligence.server";

const id = process.argv[2];
if (!id) throw new Error("Usage: tsx scripts/run-national-prospecting.ts <scan-job-id>");

while (true) {
  const result = await resumeNationalScan(id);
  const job = "job" in result ? result.job : result;
  process.stdout.write(`${JSON.stringify({ at: new Date().toISOString(), id: job.id, eligible: job.eligible, goal: job.goal, scanned: job.scanned, duplicates: job.duplicates, status: job.status })}\n`);
  if (job.status !== "running") break;
  await new Promise((resolve) => setTimeout(resolve, 1_500));
}
