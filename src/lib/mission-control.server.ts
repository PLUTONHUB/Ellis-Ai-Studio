import { Client } from "pg";
import { readFile } from "node:fs/promises";

type TaskStatus = "queued" | "running" | "awaiting_approval" | "blocked" | "complete" | "failed";

async function databaseUrl() {
  const source = await readFile(".env", "utf8");
  const value = source.split(/\r?\n/).map((line) => line.match(/^SUPABASE_DATABASE_URL=(.*)$/)?.[1]).find(Boolean);
  if (!value) throw new Error("Supabase database access is not configured.");
  return value;
}
async function query<T>(work: (client: Client) => Promise<T>) {
  const client = new Client({ connectionString: await databaseUrl(), ssl: { rejectUnauthorized: false } });
  await client.connect();
  try { return await work(client); } finally { await client.end(); }
}

const agents = [
  { id: "prospecting", name: "Prospecting Agent", icon: "⌕", purpose: "Discovers, audits, deduplicates, and qualifies businesses.", tools: ["Prospect Intelligence", "Google Maps"] },
  { id: "outreach", name: "Outreach Agent", icon: "✉", purpose: "Prepares evidence-led emails and protects follow-up rules.", tools: ["Pluto Mail", "CRM"] },
  { id: "content", name: "Content Agent", icon: "✦", purpose: "Plans distinct content and maintains the publishing calendar.", tools: ["Content OS", "LinkedIn", "Google Calendar"] },
  { id: "sales", name: "Sales Agent", icon: "↗", purpose: "Organizes replies, meetings, proposals, and deal progress.", tools: ["Pipeline", "Proposals"] },
  { id: "intelligence", name: "Intelligence Agent", icon: "◌", purpose: "Turns activity and revenue signals into operator decisions.", tools: ["Analytics", "Reporting"] },
];

export async function dashboard() {
  return query(async (client) => {
    const workspace = await client.query<{ id: string; name: string }>("select id, name from public.pluto_workspaces where slug = 'ellis-ai-studio' limit 1");
    const workspaceId = workspace.rows[0]?.id;
    if (!workspaceId) throw new Error("Ellis AI Studio workspace is missing.");
    const [tasks, approvals, connections, activity, automations] = await Promise.all([
      client.query("select id, agent, title, objective, status, priority, created_at from public.pluto_tasks where workspace_id = $1 order by created_at desc limit 30", [workspaceId]),
      client.query("select id, action_type, summary, status, requested_at from public.pluto_approvals where workspace_id = $1 order by requested_at desc limit 12", [workspaceId]),
      client.query("select provider, status, last_synced_at from public.pluto_connections where workspace_id = $1 order by provider", [workspaceId]),
      client.query("select type, message, created_at from public.pluto_activity where workspace_id = $1 order by created_at desc limit 16", [workspaceId]),
      client.query("select name, agent, trigger, approval_mode, status from public.pluto_automations where workspace_id = $1 order by name", [workspaceId]),
    ]);
    return { workspace: workspace.rows[0], agents, tasks: tasks.rows, approvals: approvals.rows, connections: connections.rows, activity: activity.rows, automations: automations.rows };
  });
}

export async function createTask(input: { agent: string; title: string; objective?: string; priority?: "low" | "normal" | "high" | "urgent" }) {
  return query(async (client) => {
    const workspace = await client.query<{ id: string }>("select id from public.pluto_workspaces where slug = 'ellis-ai-studio' limit 1"); const workspaceId = workspace.rows[0].id;
    const task = await client.query("insert into public.pluto_tasks (workspace_id, agent, title, objective, priority, status) values ($1, $2, $3, $4, $5, 'queued') returning id, agent, title, status", [workspaceId, input.agent, input.title.trim(), input.objective?.trim() || null, input.priority ?? "normal"]);
    await client.query("insert into public.pluto_activity (workspace_id, task_id, type, message) values ($1, $2, 'task_created', $3)", [workspaceId, task.rows[0].id, `${input.agent} queued: ${input.title.trim()}`]);
    return task.rows[0];
  });
}

export async function updateTask(id: string, status: TaskStatus) { return query(async (client) => client.query("update public.pluto_tasks set status = $2, started_at = case when $2 = 'running' then coalesce(started_at, now()) else started_at end, completed_at = case when $2 = 'complete' then now() else completed_at end, updated_at = now() where id = $1 returning id, status", [id, status])); }
