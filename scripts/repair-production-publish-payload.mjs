import { readFile, writeFile } from 'node:fs/promises';

const workflowId = 'XtVdc34ZPuHrt3Tb';
const env = Object.fromEntries((await readFile('.data/n8n.env', 'utf8')).split(/\r?\n/).filter(Boolean).map((line) => line.split('=')));
async function api(method, path, body) {
  const response = await fetch(`${env.N8N_BASE_URL}/api/v1${path}`, {
    method,
    headers: { 'X-N8N-API-KEY': env.N8N_API_KEY, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  return response.json();
}
const source = await api('GET', `/workflows/${workflowId}`);
await writeFile('artifacts/production-before-publish-payload-repair.json', JSON.stringify(source, null, 2));
const backup = await api('POST', '/workflows', {
  name: `Ellis content production backup before publish payload repair ${new Date().toISOString()}`,
  nodes: source.nodes,
  connections: source.connections,
  settings: source.settings,
});
const workflow = structuredClone(source);
const approve = workflow.nodes.find((node) => node.name === 'Approve Approval');
const publish = workflow.nodes.find((node) => node.name === 'Publish LinkedIn After Approval');
if (!approve || !publish) throw new Error('Required production publishing nodes are missing');
approve.parameters.jsCode = `const token = $input.first().json.query?.token;
const store = $getWorkflowStaticData('global');
const record = store.approvals?.[token];
if (!record || record.expiresAt < Date.now() || record.status !== 'pending') {
  throw new Error('This approval link is invalid, expired, or already used.');
}
if (!record.contentId || !record.caption) throw new Error('Approval record is missing content required for publishing.');
record.status = 'approved';
record.used = true;
record.usedAt = new Date().toISOString();
store.content[record.contentId] = { ...(store.content[record.contentId] || {}), status: 'publishing', updatedAt: record.usedAt };
const linkedinRequestBody = {
  author: 'urn:li:person:FH-4k7y7li',
  lifecycleState: 'PUBLISHED',
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: { text: record.caption },
      shareMediaCategory: 'NONE',
    },
  },
  visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
};
return [{ json: { contentId: record.contentId, status: 'approved', caption: record.caption, linkedinRequestBody } }];`;
publish.parameters = {
  ...publish.parameters,
  contentType: 'json',
  specifyBody: 'json',
  jsonBody: '={{ $json.linkedinRequestBody }}',
};
delete publish.parameters.body;
delete publish.parameters.rawContentType;
await writeFile('artifacts/production-publish-payload-repaired.json', JSON.stringify(workflow, null, 2));
const updated = await api('PUT', `/workflows/${workflowId}`, { name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings });
const verified = await api('GET', `/workflows/${workflowId}`);
if (verified.nodes.find((node) => node.name === 'Publish LinkedIn After Approval')?.parameters?.jsonBody !== '={{ $json.linkedinRequestBody }}') throw new Error('Publisher read-back verification failed');
console.log(JSON.stringify({ backupId: backup.id, workflowId: updated.id, repairedNodeIds: [approve.id, publish.id] }));
