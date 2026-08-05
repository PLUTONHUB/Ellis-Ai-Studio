import { readFile, writeFile } from 'node:fs/promises';
const env={};
for(const file of ['.env','.env.local','.data/n8n.env']) try { for(const line of (await readFile(file,'utf8')).split(/\r?\n/)){const at=line.indexOf('=');const key=at>0?line.slice(0,at).trim():'';if(key&&!(key in env))env[key]=line.slice(at+1).trim();} } catch {}
const base=env.N8N_BASE_URL.replace(/\/$/,''); const headers={'X-N8N-API-KEY':env.N8N_API_KEY,'Content-Type':'application/json',Accept:'application/json'};
async function api(method,path,body){const r=await fetch(base+'/api/v1'+path,{method,headers,body:body?JSON.stringify(body):undefined});const text=await r.text();if(!r.ok)throw new Error(`${method} ${path}: ${r.status} ${text.slice(0,400)}`);return text?JSON.parse(text):{};}
const source=await api('GET','/workflows/7SdaEBilKG5ufROO');
await writeFile('artifacts/phase1-private-test-current-export.json',JSON.stringify(source,null,2));
const backup=await api('POST','/workflows',{name:`Ellis Phase 1 PRIVATE TEST backup before OpenAI repair ${new Date().toISOString()}`,nodes:source.nodes,connections:source.connections,settings:source.settings});
const code=await readFile('scripts/assets/prepare-openai-json-request.js','utf8');
const workflow=structuredClone(source); workflow.nodes=workflow.nodes.filter(n=>n.name!=='Prepare OpenAI JSON Request');
workflow.nodes.push({id:'prepare-openai-json-request',name:'Prepare OpenAI JSON Request',type:'n8n-nodes-base.code',typeVersion:2,position:[-490,120],parameters:{mode:'runOnceForAllItems',language:'javaScript',jsCode:code}});
const http=workflow.nodes.find(n=>n.name==='Generate LinkedIn Draft'); if(!http)throw new Error('Generate LinkedIn Draft node missing.');
http.parameters={method:'POST',url:'https://api.openai.com/v1/responses',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendHeaders:true,headerParameters:{parameters:[{name:'Content-Type',value:'application/json'}]},sendBody:true,contentType:'json',specifyBody:'json',jsonBody:'={{ $json.openaiRequestBody }}',options:{timeout:120000}};
workflow.connections['Parse and Guard Content']={main:[[ {node:'Prepare OpenAI JSON Request',type:'main',index:0} ]]}; workflow.connections['Prepare OpenAI JSON Request']={main:[[ {node:'Generate LinkedIn Draft',type:'main',index:0} ]]};
for(const [name,outs] of Object.entries(workflow.connections)) for(const output of outs.main??[]) for(const ref of output) if(!workflow.nodes.some(n=>n.name===ref.node)) throw new Error(`Broken connection ${name} -> ${ref.node}`);
await writeFile('artifacts/phase1-private-test-openai-repaired.json',JSON.stringify(workflow,null,2));
const updated=await api('PUT','/workflows/'+workflow.id,{name:workflow.name,nodes:workflow.nodes,connections:workflow.connections,settings:workflow.settings});
console.log(JSON.stringify({backupId:backup.id,workflowId:updated.id,export:'artifacts/phase1-private-test-current-export.json',patched:'artifacts/phase1-private-test-openai-repaired.json'}));
