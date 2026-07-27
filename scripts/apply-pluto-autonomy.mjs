import { Client } from "pg";
import { readFile } from "node:fs/promises";
const env = Object.fromEntries((await readFile(".env", "utf8")).split(/\r?\n/).flatMap((line) => { const match = line.match(/^([A-Z0-9_]+)=(.*)$/); return match ? [[match[1], match[2]]] : []; }));
const client = new Client({ connectionString: env.SUPABASE_DATABASE_URL, ssl: { rejectUnauthorized: false } }); await client.connect();
try {
  await client.query(await readFile("supabase/migrations/20260727_pluto_autonomy.sql", "utf8"));
  const workspace = await client.query("select id from public.pluto_workspaces where slug = 'ellis-ai-studio' limit 1"); const id = workspace.rows[0].id;
  const automations = [
    ["Calendar reconciliation", "content", "Every 5 minutes", "autonomous", { runner: "google-calendar-sync", purpose: "Keep Content OS and Google Calendar aligned" }],
    ["Prospect research", "prospecting", "Daily research cycle", "autonomous", { runner: "national-prospecting", purpose: "Discover and audit public businesses" }],
    ["Qualified-draft preparation", "outreach", "When a prospect qualifies", "autonomous", { action: "generate_personalized_draft", purpose: "Prepare evidence-led drafts only" }],
    ["Outbound send gate", "outreach", "Before any outbound send", "approval_required", { action: "send_email", purpose: "Human approval and opt-out checks required" }],
    ["Social publish gate", "content", "Before LinkedIn publishing", "approval_required", { action: "publish_linkedin", purpose: "Human approval required" }],
    ["Daily operator brief", "intelligence", "08:00 America/Los_Angeles", "autonomous", { action: "daily_brief", purpose: "Priorities, approvals, activity, and exceptions" }]
  ];
  for (const [name, agent, trigger, approval, configuration] of automations) await client.query("insert into public.pluto_automations (workspace_id,name,agent,trigger,approval_mode,configuration,status) values ($1,$2,$3,$4,$5,$6::jsonb,'enabled') on conflict (workspace_id,name) do update set trigger=excluded.trigger, approval_mode=excluded.approval_mode, configuration=excluded.configuration, status='enabled', updated_at=now()", [id,name,agent,trigger,approval,JSON.stringify(configuration)]);
  await client.query("insert into public.pluto_memory (workspace_id,category,title,content,source) select $1,'governance','Autonomous operating rules',$2::jsonb,'autonomy-bootstrap' where not exists (select 1 from public.pluto_memory where workspace_id=$1 and title='Autonomous operating rules')", [id, JSON.stringify({ autonomous: ["research", "public website audits", "draft preparation", "calendar sync", "daily brief"], approvalRequired: ["email sends", "social publishing", "proposals", "deal changes"], neverAutonomous: ["payments", "deleting records", "account permissions"] })]);
  process.stdout.write(JSON.stringify({ automations: automations.length }));
} finally { await client.end(); }
