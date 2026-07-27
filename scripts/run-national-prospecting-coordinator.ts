import { resumeNationalScan } from "../src/lib/prospect-intelligence.server";

const ids = process.argv.slice(2);
const target = Number(process.env.NATIONAL_PROSPECT_TARGET ?? 1_000);

if (!ids.length) {
  throw new Error("Usage: tsx scripts/run-national-prospecting-coordinator.ts <scan-job-id> [...scan-job-id]");
}

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

while (true) {
  const jobs = [] as Array<{ id: string; eligible: number; scanned: number; duplicates: number; status: string }>;

  for (const id of ids) {
    try {
      const result = await resumeNationalScan(id);
      const job = "job" in result ? result.job : result;
      jobs.push(job);
      process.stdout.write(`${JSON.stringify({ at: new Date().toISOString(), ...job })}\n`);
    } catch (error) {
      process.stderr.write(`${new Date().toISOString()} ${id}: ${error instanceof Error ? error.message : String(error)}\n`);
    }
    await delay(800);
  }

  const eligible = jobs.reduce((sum, job) => sum + job.eligible, 0);
  const active = jobs.some((job) => job.status === "running");
  process.stdout.write(`${JSON.stringify({ at: new Date().toISOString(), aggregate: { eligible, target, active } })}\n`);
  if (eligible >= target || !active) break;
  await delay(1_500);
}
