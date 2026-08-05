import { readFile } from "node:fs/promises";
const values = {};
for (const file of [".env", ".env.local", ".data/n8n.env"]) { try { for (const line of (await readFile(file, "utf8")).split(/\r?\n/)) { const match = line.match(/^([A-Z0-9_]+)=(.*)$/); if (match && !(match[1] in values)) values[match[1]] = match[2]; } } catch {} }
const base = values.N8N_BASE_URL?.replace(/\/$/, ""); if (!base || !values.N8N_API_KEY) throw new Error("n8n configuration is missing.");
const response = await fetch(`${base}/api/v1/workflows?limit=1`, { headers: { "X-N8N-API-KEY": values.N8N_API_KEY, Accept: "application/json" } });
if (!response.ok) throw new Error(`n8n verification failed (HTTP ${response.status}).`);
console.log("N8N_CONNECTED");
