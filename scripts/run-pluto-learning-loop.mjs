import { Client } from "pg";
import { readFile } from "node:fs/promises";
const interval = Number(process.env.PLUTO_LEARNING_INTERVAL_MS ?? 600000);
const env = Object.fromEntries((await readFile('.env','utf8')).split(/\r?\n/).flatMap(line => { const m=line.match(/^([A-Z0-9_]+)=(.*)$/); return m?[[m[1],m[2]]]:[]; }));
async function cycle() {
 const client=new Client({connectionString:env.SUPABASE_DATABASE_URL,ssl:{rejectUnauthorized:false}}); await client.connect();
 try {
  const workspace=(await client.query("select id from public.pluto_workspaces where slug='ellis-ai-studio' limit 1")).rows[0];
  const ledger=JSON.parse(await readFile('.data/pluto-contact-ledger.json','utf8')); const content=JSON.parse(await readFile('.data/content-schedule.json','utf8')); const prospects=JSON.parse(await readFile('.data/prospect-intelligence.json','utf8'));
  let inserted=0; const add=async(agent,type,subject,id,at,payload)=>{const r=await client.query("insert into public.pluto_learning_events(workspace_id,event_key,agent,event_type,subject_type,subject_id,payload,occurred_at) values($1,$2,$3,$4,$5,$6,$7::jsonb,$8) on conflict(event_key) do nothing",[workspace.id,`${type}:${id}`,agent,type,subject,id,JSON.stringify(payload),new Date(at).toISOString()]); inserted+=r.rowCount??0};
  for(const send of ledger.sends??[]) await add('outreach','email_sent','prospect',send.prospectId,send.sentAt,{campaignId:send.campaignId,businessName:send.businessName});
  for(const item of content.filter(x=>x.topic==='linkedin'&&x.scheduledFor)) await add('content','content_scheduled','content',item.id,item.scheduledFor,{title:item.title});
  for(const report of prospects.reports??[]) await add('prospecting','prospect_audited','prospect',report.id,report.createdAt,{score:report.score,priority:report.priority,industry:report.industry});
  const counts=await client.query("select agent,count(*)::int as count from public.pluto_learning_events where workspace_id=$1 group by agent",[workspace.id]);
  for(const row of counts.rows) await client.query("insert into public.pluto_learning_signals(workspace_id,signal,value,evidence_count,context) values($1,$2,$3,$4,$5::jsonb) on conflict(workspace_id,signal) do update set value=excluded.value,evidence_count=excluded.evidence_count,context=excluded.context,updated_at=now()",[workspace.id,`${row.agent}_observations`,row.count,row.count,JSON.stringify({source:'learning-loop'})]);
  console.log(JSON.stringify({at:new Date().toISOString(),inserted,observations:counts.rows}));
 } finally {await client.end()}
}
while(true){try{await cycle()}catch(error){console.error(error instanceof Error?error.message:String(error))}await new Promise(r=>setTimeout(r,interval))}
