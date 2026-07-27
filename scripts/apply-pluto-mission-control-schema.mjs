import { Client } from "pg";
import { readFile } from "node:fs/promises";

const source = await readFile(".env", "utf8");
const env = Object.fromEntries(source.split(/\r?\n/).flatMap((line) => { const match = line.match(/^([A-Z0-9_]+)=(.*)$/); return match ? [[match[1], match[2]]] : []; }));
if (!env.SUPABASE_DATABASE_URL) throw new Error("SUPABASE_DATABASE_URL is not configured.");

const client = new Client({ connectionString: env.SUPABASE_DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query(await readFile("supabase/migrations/20260726_pluto_mission_control.sql", "utf8"));
  const workspace = await client.query("insert into public.pluto_workspaces (slug, name, mission, settings) values ($1, $2, $3, $4::jsonb) on conflict (slug) do update set name = excluded.name, mission = excluded.mission, updated_at = now() returning id", ["ellis-ai-studio", "Ellis AI Studio", "Build AI-powered growth infrastructure that acquires customers, converts leads, and improves operations.", JSON.stringify({ timezone: "America/Los_Angeles", approvalPolicy: { autonomous: ["research", "drafting", "reporting", "calendar_sync"], approvalRequired: ["email_send", "social_publish", "deal_change"] } })]);
  const workspaceId = workspace.rows[0].id;
  const memory = [
    ["brand", "Current positioning", { positioning: "AI-powered growth infrastructure", audience: "service businesses", voice: ["professional", "clear", "confident", "results-focused"], avoid: ["legacy framework language", "unverified claims", "generic AI hype"] }],
    ["operations", "Connected systems", { systems: ["Pluto Mail", "Google Calendar", "LinkedIn", "Prospect Intelligence", "Content OS"] }],
    ["governance", "Approval policy", { emailSend: "approval required", socialPublish: "approval required", research: "autonomous", calendarSync: "autonomous" }]
  ];
  for (const [category, title, content] of memory) await client.query("insert into public.pluto_memory (workspace_id, category, title, content, source) select $1, $2, $3, $4::jsonb, 'mission-control-bootstrap' where not exists (select 1 from public.pluto_memory where workspace_id = $1 and title = $3)", [workspaceId, category, title, JSON.stringify(content)]);
  const connections = [["google_calendar", "connected"], ["pluto_mail", "connected"], ["linkedin", "connected"], ["prospect_intelligence", "connected"]];
  for (const [provider, status] of connections) await client.query("insert into public.pluto_connections (workspace_id, provider, status, last_synced_at) values ($1, $2, $3, now()) on conflict (workspace_id, provider) do update set status = excluded.status, last_synced_at = excluded.last_synced_at, updated_at = now()", [workspaceId, provider, status]);
  await client.query("insert into public.pluto_activity (workspace_id, type, message, metadata) values ($1, 'system_initialized', 'Pluto Mission Control initialized in Supabase.', $2::jsonb)", [workspaceId, JSON.stringify({ schema: "20260726_pluto_mission_control" })]);
  process.stdout.write(JSON.stringify({ workspaceId, memory: memory.length, connections: connections.length }));
} finally { await client.end(); }
