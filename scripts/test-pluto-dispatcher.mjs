import { readFile } from "node:fs/promises";
import { Client } from "pg";
const env = Object.fromEntries((await readFile(".env", "utf8")).split(/\r?\n/).filter(Boolean).map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)]; }));
const client = new Client({ connectionString: env.SUPABASE_DATABASE_URL, ssl: { rejectUnauthorized: false } }); await client.connect();
try { const workspace = (await client.query("select id from public.pluto_workspaces where slug = 'ellis-ai-studio' limit 1")).rows[0]; const task = await client.query("insert into public.pluto_tasks(workspace_id,agent,title,status,priority) values($1,'intelligence','Autonomy proof: summarize current Mission Control workload','queued','normal') returning id", [workspace.id]); console.log(task.rows[0].id); } finally { await client.end(); }
