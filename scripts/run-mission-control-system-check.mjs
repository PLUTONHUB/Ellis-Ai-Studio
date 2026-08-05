import { readFile } from "node:fs/promises";
import { Client } from "pg";

const env = Object.fromEntries((await readFile(".env", "utf8")).split(/\r?\n/).filter(Boolean).map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
const client = new Client({ connectionString: env.SUPABASE_DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  const workspace = (await client.query("select id from public.pluto_workspaces where slug = 'ellis-ai-studio' limit 1")).rows[0];
  const tables = ["pluto_workspaces", "pluto_tasks", "pluto_approvals", "pluto_activity", "pluto_connections", "pluto_automations"];
  const tableCheck = await client.query("select unnest($1::text[]) table_name, to_regclass('public.' || unnest($1::text[])) is not null present", [tables]);
  const agents = ["prospecting", "outreach", "content", "sales", "intelligence"];
  const invalid = await client.query("select id from public.pluto_tasks where workspace_id = $1 and agent <> all($2::text[])", [workspace.id, agents]);
  if (invalid.rowCount) await client.query("update public.pluto_tasks set agent = 'intelligence', updated_at = now() where workspace_id = $1 and agent <> all($2::text[])", [workspace.id, agents]);
  const orphanApprovals = await client.query("select count(*)::int count from public.pluto_approvals a left join public.pluto_tasks t on t.id = a.task_id where a.workspace_id = $1 and a.task_id is not null and t.id is null", [workspace.id]);
  const result = { database: "passed", tables: tableCheck.rows.every((row) => row.present) ? "passed" : "failed", invalidAssignments: invalid.rowCount, repaired: invalid.rowCount, orphanApprovals: orphanApprovals.rows[0].count };
  await client.query("insert into public.pluto_activity(workspace_id, type, message, metadata) values($1, 'system_check', $2, $3::jsonb)", [workspace.id, "Pluto system check completed successfully.", JSON.stringify(result)]);
  console.log(JSON.stringify(result));
} finally { await client.end(); }
