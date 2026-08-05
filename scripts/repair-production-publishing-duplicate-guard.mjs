import { readFile, writeFile } from 'node:fs/promises';

const workflowId = 'XtVdc34ZPuHrt3Tb';
const env = Object.fromEntries((await readFile('.data/n8n.env', 'utf8')).split(/\r?\n/).filter(Boolean).map((line) => line.split('=')));
async function api(method, path, body) {
  const response = await fetch(`${env.N8N_BASE_URL}/api/v1${path}`, { method, headers: { 'X-N8N-API-KEY': env.N8N_API_KEY, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  return response.json();
}
const source = await api('GET', `/workflows/${workflowId}`);
await writeFile('artifacts/production-before-publishing-duplicate-guard.json', JSON.stringify(source, null, 2));
const backup = await api('POST', '/workflows', { name: `Ellis content production backup before publishing duplicate guard ${new Date().toISOString()}`, nodes: source.nodes, connections: source.connections, settings: source.settings });
const workflow = structuredClone(source);
const parse = workflow.nodes.find((node) => node.name === 'Parse and Guard Content');
if (!parse) throw new Error('Parse and Guard Content node missing');
parse.parameters.jsCode = parse.parameters.jsCode.replace("prior?.status==='published'||prior?.status==='awaiting_approval'||prior?.status==='approved'", "prior?.status==='published'||prior?.status==='awaiting_approval'||prior?.status==='approved'||prior?.status==='publishing'");
if (!parse.parameters.jsCode.includes("prior?.status==='publishing'")) throw new Error('Could not apply publishing duplicate guard');
await writeFile('artifacts/production-publishing-duplicate-guard-repaired.json', JSON.stringify(workflow, null, 2));
await api('PUT', `/workflows/${workflowId}`, { name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings });
const verified = await api('GET', `/workflows/${workflowId}`);
if (!verified.nodes.find((node) => node.name === 'Parse and Guard Content')?.parameters?.jsCode.includes("prior?.status==='publishing'")) throw new Error('Read-back verification failed');
console.log(JSON.stringify({ backupId: backup.id, repairedNodeId: parse.id }));
