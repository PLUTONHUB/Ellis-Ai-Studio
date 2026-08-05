import { readFile } from "node:fs/promises";
import { createHash, createDecipheriv } from "node:crypto";

const env = {};
for (const path of [".env", ".env.local", ".data/n8n.env"]) try { for (const line of (await readFile(path, "utf8")).split(/\r?\n/)) { const at=line.indexOf("="); const key=at>0?line.slice(0,at).trim():""; if(key && !(key in env)) env[key]=line.slice(at+1).trim(); } } catch {}
const sealed = JSON.parse(await readFile(".data/linkedin.json", "utf8"));
const bytes = Buffer.from(sealed.ciphertext, "base64url");
const decipher = createDecipheriv("aes-256-gcm", createHash("sha256").update(env.LINKEDIN_TOKEN_ENCRYPTION_KEY).digest(), Buffer.from(sealed.iv, "base64url"));
decipher.setAuthTag(bytes.subarray(-16));
const token = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(0,-16)), decipher.final()]).toString("utf8"));
const base = env.N8N_BASE_URL.replace(/\/$/, "");
const response = await fetch(`${base}/api/v1/credentials`, { method:"POST", headers:{"X-N8N-API-KEY":env.N8N_API_KEY,"Content-Type":"application/json",Accept:"application/json"}, body:JSON.stringify({ name:"Ellis LinkedIn publishing token (managed)", type:"httpHeaderAuth", data:{ name:"Authorization", value:`Bearer ${token.accessToken}` } }) });
const raw=await response.text(); if(!response.ok) throw new Error(`Credential import failed (${response.status}): ${raw.slice(0,300)}`);
const credential=JSON.parse(raw); console.log(JSON.stringify({id:credential.id,name:credential.name,type:credential.type,expiresAt:new Date(token.expiresAt).toISOString()}));
