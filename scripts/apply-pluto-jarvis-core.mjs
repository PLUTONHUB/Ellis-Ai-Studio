import { Client } from "pg";
import { readFile } from "node:fs/promises";
const lines = (await readFile('.env', 'utf8')).split(/\r?\n/);
const env = Object.fromEntries(lines.flatMap((line) => {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  return match ? [[match[1], match[2]]] : [];
}));
const client=new Client({connectionString:env.SUPABASE_DATABASE_URL,ssl:{rejectUnauthorized:false}});await client.connect();
try{await client.query(await readFile('supabase/migrations/20260727_pluto_jarvis_core.sql','utf8'));const w=(await client.query("select id from public.pluto_workspaces where slug='ellis-ai-studio' limit 1")).rows[0];const rules=[['prospecting','public_research','autonomous'],['prospecting','website_audit','autonomous'],['outreach','draft_email','autonomous'],['outreach','send_email','approval_required'],['content','prepare_content','autonomous'],['content','publish_content','approval_required'],['sales','prepare_sales_context','autonomous'],['sales','change_deal','approval_required'],['intelligence','analyze_operations','autonomous']];for(const [agent,capability,authority] of rules)await client.query("insert into public.pluto_agent_capabilities(workspace_id,agent,capability,authority) values($1,$2,$3,$4) on conflict(workspace_id,agent,capability) do update set authority=excluded.authority,updated_at=now()",[w.id,agent,capability,authority]);console.log(JSON.stringify({capabilities:rules.length}));}finally{await client.end()}
