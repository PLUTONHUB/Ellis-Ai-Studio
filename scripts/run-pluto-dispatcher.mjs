import { readFile } from "node:fs/promises";
import { Client } from "pg";

const interval = Number(process.env.PLUTO_DISPATCH_INTERVAL_MS ?? 10000);
const env = Object.fromEntries((await readFile(".env", "utf8")).split(/\r?\n/).flatMap((line) => { const match = line.match(/^([A-Z0-9_]+)=(.*)$/); return match ? [[match[1], match[2]]] : []; }));
const approvalWords = /\b(send|email|publish|linkedin|proposal|deal|payment|delete|permission)\b/i;
const workerFor = { prospecting: "prospect-auditor", outreach: "outreach-drafter", content: "content-operator", sales: "sales-operator", intelligence: "intelligence-analyst" };

async function log(client, workspaceId, taskId, type, message, metadata = {}) {
  await client.query("insert into public.pluto_activity(workspace_id, task_id, type, message, metadata) values($1,$2,$3,$4,$5::jsonb)", [workspaceId, taskId, type, message, JSON.stringify(metadata)]);
  await client.query("insert into public.pluto_events(workspace_id, task_id, event_type, actor, payload) values($1,$2,$3,'pluto-dispatcher',$4::jsonb)", [workspaceId, taskId, type, JSON.stringify({ message, ...metadata })]);
}
async function plan(client, task) {
  const steps = task.agent === "prospecting" ? ["Collect public business signals", "Audit website and qualification evidence", "Record opportunity results"] : task.agent === "outreach" ? ["Load verified prospect evidence", "Prepare personalized draft", "Apply approval gate before send"] : task.agent === "content" ? ["Gather content context", "Prepare channel-ready content", "Apply approval gate before publish"] : task.agent === "sales" ? ["Collect conversation and pipeline context", "Prepare next sales action", "Apply approval gate for deal change"] : ["Collect operating signals", "Evaluate current workload", "Record prioritized recommendation"];
  for (const [ordinal, title] of steps.entries()) await client.query("insert into public.pluto_task_steps(task_id,ordinal,title,status) values($1,$2,$3,'pending') on conflict(task_id,ordinal) do nothing", [task.id, ordinal + 1, title]);
  return steps;
}
async function claim(client, workspaceId) {
  const result = await client.query("with next as (select id from public.pluto_tasks where workspace_id=$1 and status='queued' and (scheduled_for is null or scheduled_for <= now()) order by case priority when 'urgent' then 1 when 'high' then 2 when 'normal' then 3 else 4 end, created_at for update skip locked limit 1) update public.pluto_tasks t set status='running', started_at=coalesce(t.started_at,now()), updated_at=now() from next where t.id=next.id returning t.id,t.agent,t.title,t.objective,t.priority", [workspaceId]);
  return result.rows[0];
}
async function currentProspectSummary() {
  try { const source = JSON.parse(await readFile(".data/prospect-intelligence.json", "utf8")); return { audited: source.reports?.length ?? 0, source: "local prospect intelligence ledger" }; } catch { return { audited: 0, source: "prospect intelligence source unavailable" }; }
}
async function execute(client, workspaceId, task) {
  const workerKey = workerFor[task.agent] ?? "intelligence-analyst";
  await client.query("update public.pluto_workers set status='busy',current_task_id=$3,last_heartbeat_at=now(),runs=runs+1,updated_at=now() where workspace_id=$1 and worker_key=$2", [workspaceId, workerKey, task.id]);
  const steps = await plan(client, task);
  await client.query("update public.pluto_task_steps set status='running',started_at=now() where task_id=$1 and ordinal=1", [task.id]);
  await log(client, workspaceId, task.id, "plan_created", `Pluto created a ${steps.length}-step plan for ${task.agent}.`, { steps });
  const gate = approvalWords.test(`${task.title} ${task.objective ?? ""}`);
  if (gate) {
    const action = /publish|linkedin/i.test(task.title) ? "publish_content" : /proposal/i.test(task.title) ? "create_proposal" : /deal/i.test(task.title) ? "change_deal" : "send_email";
    await client.query("insert into public.pluto_approvals(workspace_id,task_id,action_type,summary,payload) values($1,$2,$3,$4,$5::jsonb)", [workspaceId, task.id, action, `Pluto approval required: ${task.title}`, JSON.stringify({ agent: task.agent, task: task.title })]);
    await client.query("update public.pluto_tasks set status='awaiting_approval', output=$2::jsonb, updated_at=now() where id=$1", [task.id, JSON.stringify({ outcome: "approval_required", reason: "Consequence-changing action requires a human decision." })]);
    await client.query("update public.pluto_task_steps set status=case when ordinal=1 then 'complete' else 'blocked' end, completed_at=case when ordinal=1 then now() else null end where task_id=$1", [task.id]);
    await log(client, workspaceId, task.id, "approval_requested", `Pluto paused ${task.agent} work for approval: ${task.title}`);
    await client.query("update public.pluto_workers set status='online',current_task_id=null,last_heartbeat_at=now(),updated_at=now() where workspace_id=$1 and worker_key=$2", [workspaceId, workerKey]); return;
  }
  let output;
  if (task.agent === "prospecting") output = { outcome: "research_prepared", summary: await currentProspectSummary(), next: "The national research runner may safely claim this prepared research segment." };
  else if (task.agent === "outreach") output = { outcome: "draft_prepared", next: "A personalized draft can be generated from verified audit evidence; sending remains approval-gated." };
  else if (task.agent === "content") output = { outcome: "content_prepared", next: "Content is ready for review or calendar preparation; publishing remains approval-gated." };
  else if (task.agent === "sales") output = { outcome: "sales_work_prepared", next: "Pipeline context prepared. Proposal and deal changes remain approval-gated." };
  else {
    const counts = await client.query("select status,count(*)::int count from public.pluto_tasks where workspace_id=$1 group by status", [workspaceId]);
    output = { outcome: "operating_analysis_complete", taskCounts: counts.rows, next: "Pluto can prioritize the next queued task." };
  }
  await client.query("update public.pluto_tasks set status='complete', completed_at=now(), output=$2::jsonb, updated_at=now() where id=$1", [task.id, JSON.stringify(output)]);
  await client.query("update public.pluto_task_steps set status='complete', completed_at=now() where task_id=$1", [task.id]);
  await log(client, workspaceId, task.id, "task_completed", `Pluto completed ${task.agent} task: ${task.title}`, output);
  await client.query("update public.pluto_workers set status='online',current_task_id=null,last_heartbeat_at=now(),updated_at=now() where workspace_id=$1 and worker_key=$2", [workspaceId, workerKey]);
}
async function cycle() {
  const client = new Client({ connectionString: env.SUPABASE_DATABASE_URL, ssl: { rejectUnauthorized: false } }); await client.connect();
  try {
    const lock = await client.query("select pg_try_advisory_lock(781238) locked"); if (!lock.rows[0].locked) return;
    const workspace = (await client.query("select id from public.pluto_workspaces where slug='ellis-ai-studio' limit 1")).rows[0]; if (!workspace) throw new Error("Ellis AI Studio workspace is missing.");
    await client.query("update public.pluto_workers set status=case when status='error' then 'error' else 'online' end,last_heartbeat_at=now(),updated_at=now() where workspace_id=$1 and current_task_id is null", [workspace.id]);
    await client.query("update public.pluto_workers set last_heartbeat_at=now(),updated_at=now() where workspace_id=$1 and worker_key='pluto-dispatcher'", [workspace.id]);
    const recovered = await client.query("update public.pluto_tasks set status='queued', started_at=null, updated_at=now(), output=output || $2::jsonb where workspace_id=$1 and status='running' and updated_at < now() - interval '5 minutes' returning id,title,agent", [workspace.id, JSON.stringify({ recovery: "Pluto returned this task to the queue after five minutes without a heartbeat." })]);
    for (const stale of recovered.rows) await log(client, workspace.id, stale.id, "task_recovered", `Pluto recovered stalled ${stale.agent} task: ${stale.title}`, { reason: "No worker heartbeat for five minutes." });
    const task = await claim(client, workspace.id);
    if (task) { await log(client, workspace.id, task.id, "task_started", `Pluto dispatched ${task.agent}: ${task.title}`, { agent: task.agent, priority: task.priority }); await execute(client, workspace.id, task); console.log(JSON.stringify({ action: "dispatched", task: task.title, agent: task.agent })); }
  } finally { await client.query("select pg_advisory_unlock(781238)").catch(() => undefined); await client.end(); }
}
console.log(JSON.stringify({ runner: "pluto-dispatcher", intervalMs: interval, status: "started" }));
while (true) { try { await cycle(); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); } await new Promise((resolve) => setTimeout(resolve, interval)); }
