import { readFile, writeFile } from 'node:fs/promises';

const workflowId = 'XtVdc34ZPuHrt3Tb';
const env = Object.fromEntries((await readFile('.data/n8n.env', 'utf8')).split(/\r?\n/).filter(Boolean).map((line) => line.split('=')));
async function api(method, path, body) {
  const response = await fetch(`${env.N8N_BASE_URL}/api/v1${path}`, { method, headers: { 'X-N8N-API-KEY': env.N8N_API_KEY, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  return response.json();
}
const source = await api('GET', `/workflows/${workflowId}`);
await writeFile('artifacts/production-before-normalize-field-preservation.json', JSON.stringify(source, null, 2));
const backup = await api('POST', '/workflows', { name: `Ellis content production backup before normalize field preservation ${new Date().toISOString()}`, nodes: source.nodes, connections: source.connections, settings: source.settings });
const workflow = structuredClone(source);
const normalize = workflow.nodes.find((node) => node.name === 'Normalize LinkedIn Draft');
if (!normalize) throw new Error('Normalize LinkedIn Draft node missing');
normalize.parameters.jsCode = `const response = $input.first().json;
const source = $('Prepare OpenAI JSON Request').first().json;
let draft = '';
if (typeof response.output_text === 'string' && response.output_text.trim()) draft = response.output_text.trim();
if (!draft && Array.isArray(response.output)) {
  draft = response.output
    .flatMap((output) => Array.isArray(output.content) ? output.content : [])
    .filter((content) => content?.type === 'output_text')
    .map((content) => typeof content.text === 'string' ? content.text : '')
    .filter(Boolean)
    .join('\\n')
    .trim();
}
if (!draft) throw new Error('OpenAI response contained no output_text content');
const wordCount = draft.split(/\\s+/).filter(Boolean).length;
const hashtagCount = (draft.match(/(^|\\s)#[A-Za-z0-9_]+/g) || []).length;
if (wordCount < 120 || wordCount > 220) throw new Error('LinkedIn draft word count '+wordCount+' is outside the allowed 120–220 range');
if (hashtagCount > 4) throw new Error('LinkedIn draft contains '+hashtagCount+' hashtags; maximum allowed is 4');
return [{ json: { ...source, openaiResponse: response, linkedinDraft: draft, linkedinDraftWordCount: wordCount, linkedinDraftHashtagCount: hashtagCount, openaiModelUsed: response.model || source.openaiModelUsed || 'gpt-5-mini-2025-08-07' } }];`;
await writeFile('artifacts/production-normalize-field-preservation-repaired.json', JSON.stringify(workflow, null, 2));
await api('PUT', `/workflows/${workflowId}`, { name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings });
const verified = await api('GET', `/workflows/${workflowId}`);
if (!verified.nodes.find((node) => node.name === 'Normalize LinkedIn Draft')?.parameters?.jsCode.includes("$('Prepare OpenAI JSON Request')")) throw new Error('Read-back verification failed');
console.log(JSON.stringify({ backupId: backup.id, repairedNodeId: normalize.id }));
