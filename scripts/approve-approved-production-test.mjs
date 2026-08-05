import { readFile } from 'node:fs/promises';

const env = Object.fromEntries((await readFile('.data/n8n.env', 'utf8')).split(/\r?\n/).filter(Boolean).map((line) => line.split('=')));
const executionId = '979';
const response = await fetch(`${env.N8N_BASE_URL}/api/v1/executions/${executionId}?includeData=true`, {
  headers: { 'X-N8N-API-KEY': env.N8N_API_KEY },
});
if (!response.ok) throw new Error(`Execution fetch failed: ${response.status}`);
const execution = await response.json();
const data = execution.data?.resultData?.runData?.['Create Secure Approval']?.[0]?.data?.main?.[0]?.[0]?.json;
const approveUrl = data?.approveUrl;
if (!approveUrl) throw new Error('Approval URL was not found in the approved scheduled execution');
const approval = await fetch(approveUrl, { redirect: 'manual' });
const text = await approval.text();
if (!approval.ok) throw new Error(`Approval webhook failed: HTTP ${approval.status}`);
console.log(JSON.stringify({ approvalWebhookHttpStatus: approval.status, responseLength: text.length }));
