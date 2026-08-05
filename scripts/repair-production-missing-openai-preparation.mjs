import { readFile, writeFile } from 'node:fs/promises';

const workflowId = 'XtVdc34ZPuHrt3Tb';
const env = Object.fromEntries(
  (await readFile('.data/n8n.env', 'utf8'))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split('='))
);

async function api(method, path, body) {
  const response = await fetch(`${env.N8N_BASE_URL}/api/v1${path}`, {
    method,
    headers: {
      'X-N8N-API-KEY': env.N8N_API_KEY,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`${method} ${path}: HTTP ${response.status} ${await response.text()}`);
  return response.json();
}

const source = await api('GET', `/workflows/${workflowId}`);
await writeFile('artifacts/production-before-openai-preparation-repair.json', JSON.stringify(source, null, 2));

const backup = await api('POST', '/workflows', {
  name: `Ellis content production backup before OpenAI preparation repair ${new Date().toISOString()}`,
  nodes: source.nodes,
  connections: source.connections,
  settings: source.settings,
});

const workflow = structuredClone(source);
const code = await readFile('scripts/assets/prepare-openai-json-request.js', 'utf8');
const existing = workflow.nodes.find((node) => node.name === 'Prepare OpenAI JSON Request');
if (existing) {
  existing.type = 'n8n-nodes-base.code';
  existing.typeVersion = 2;
  existing.parameters = { mode: 'runOnceForAllItems', language: 'javaScript', jsCode: code };
} else {
  workflow.nodes.push({
    id: 'prepare-openai-json-request',
    name: 'Prepare OpenAI JSON Request',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [-560, 120],
    parameters: { mode: 'runOnceForAllItems', language: 'javaScript', jsCode: code },
  });
}

const openai = workflow.nodes.find((node) => node.name === 'Generate LinkedIn Draft');
if (!openai) throw new Error('Generate LinkedIn Draft node is missing');
openai.parameters = {
  ...openai.parameters,
  contentType: 'json',
  specifyBody: 'json',
  jsonBody: '={{ $json.openaiRequestBody }}',
};
delete openai.parameters.body;
delete openai.parameters.rawContentType;

workflow.connections['Parse and Guard Content'] = {
  main: [[{ node: 'Prepare OpenAI JSON Request', type: 'main', index: 0 }]],
};
workflow.connections['Prepare OpenAI JSON Request'] = {
  main: [[{ node: 'Generate LinkedIn Draft', type: 'main', index: 0 }]],
};

const names = new Set(workflow.nodes.map((node) => node.name));
for (const [sourceName, outputs] of Object.entries(workflow.connections)) {
  if (!names.has(sourceName)) throw new Error(`Connection source missing: ${sourceName}`);
  for (const branch of outputs.main ?? []) for (const target of branch) {
    if (!names.has(target.node)) throw new Error(`Connection target missing: ${sourceName} -> ${target.node}`);
    if (target.index !== 0) throw new Error(`Unexpected output index: ${sourceName} -> ${target.node}`);
  }
}

await writeFile('artifacts/production-openai-preparation-repaired.json', JSON.stringify(workflow, null, 2));
const updated = await api('PUT', `/workflows/${workflowId}`, {
  name: workflow.name,
  nodes: workflow.nodes,
  connections: workflow.connections,
  settings: workflow.settings,
});
const verified = await api('GET', `/workflows/${workflowId}`);
const verifiedNode = verified.nodes.find((node) => node.name === 'Prepare OpenAI JSON Request');
if (!verifiedNode || verifiedNode.parameters?.jsCode !== code) throw new Error('Read-back verification failed');
console.log(JSON.stringify({ backupId: backup.id, workflowId: updated.id, repairedNodeId: verifiedNode.id }));
