import { readFile, writeFile } from 'node:fs/promises';

const workflowId = 'XtVdc34ZPuHrt3Tb';
const env = Object.fromEntries((await readFile('.data/n8n.env', 'utf8')).split(/\r?\n/).filter(Boolean).map((line) => line.split('=')));
async function api(method, path, body) {
  const response = await fetch(`${env.N8N_BASE_URL}/api/v1${path}`, { method, headers: { 'X-N8N-API-KEY': env.N8N_API_KEY, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  return response.json();
}
const source = await api('GET', `/workflows/${workflowId}`);
await writeFile('artifacts/production-before-approval-caption-fallback.json', JSON.stringify(source, null, 2));
const backup = await api('POST', '/workflows', { name: `Ellis content production backup before approval caption fallback ${new Date().toISOString()}`, nodes: source.nodes, connections: source.connections, settings: source.settings });
const workflow = structuredClone(source);
const approve = workflow.nodes.find((node) => node.name === 'Approve Approval');
if (!approve) throw new Error('Approve Approval node missing');
approve.parameters.jsCode = `const token = $input.first().json.query?.token;
const store = $getWorkflowStaticData('global');
const record = store.approvals?.[token];
if (!record || record.expiresAt < Date.now() || record.status !== 'pending') {
  throw new Error('This approval link is invalid, expired, or already used.');
}
const contentId = record.contentId;
const caption = record.caption || record.linkedinDraft || store.content?.[contentId]?.finalCaption;
if (!contentId || !caption) throw new Error('Approval record is missing content required for publishing.');
record.status = 'approved';
record.used = true;
record.usedAt = new Date().toISOString();
store.content[contentId] = { ...(store.content[contentId] || {}), status: 'publishing', finalCaption: caption, updatedAt: record.usedAt };
const linkedinRequestBody = {
  author: 'urn:li:person:FH-4k7y7li', lifecycleState: 'PUBLISHED',
  specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text: caption }, shareMediaCategory: 'NONE' } },
  visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
};
return [{ json: { contentId, status: 'approved', caption, linkedinRequestBody } }];`;
await writeFile('artifacts/production-approval-caption-fallback-repaired.json', JSON.stringify(workflow, null, 2));
await api('PUT', `/workflows/${workflowId}`, { name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings });
const verified = await api('GET', `/workflows/${workflowId}`);
if (!verified.nodes.find((node) => node.name === 'Approve Approval')?.parameters?.jsCode.includes('finalCaption')) throw new Error('Read-back verification failed');
console.log(JSON.stringify({ backupId: backup.id, repairedNodeId: approve.id }));
