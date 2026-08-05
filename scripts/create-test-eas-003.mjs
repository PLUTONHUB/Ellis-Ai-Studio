import { readFile, writeFile } from 'node:fs/promises';
import { createHash, createDecipheriv } from 'node:crypto';

const env = {};
for (const file of ['.env', '.env.local', '.data/n8n.env']) {
  try { for (const line of (await readFile(file, 'utf8')).split(/\r?\n/)) { const i=line.indexOf('='); const key=i>0?line.slice(0,i).trim():''; if (key && !(key in env)) env[key]=line.slice(i+1).trim(); } } catch {}
}
const sealed=JSON.parse(await readFile('.data/google-calendar.json','utf8'));
const encrypted=Buffer.from(sealed.ciphertext,'base64url');
const decipher=createDecipheriv('aes-256-gcm',createHash('sha256').update(env.GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY).digest(),Buffer.from(sealed.iv,'base64url'));
decipher.setAuthTag(encrypted.subarray(-16));
const token=JSON.parse(Buffer.concat([decipher.update(encrypted.subarray(0,-16)),decipher.final()]).toString('utf8'));
const headers={Authorization:`Bearer ${token.accessToken}`,'Content-Type':'application/json'};
const description=['CONTENT_ID: TEST-EAS-003','PLATFORM: LINKEDIN','TOPIC: Three repetitive tasks small businesses should automate','AUDIENCE: Small-business owners','GOAL: Educate and attract qualified leads','CTA: Ask readers which repetitive task consumes the most time','WEBSITE: https://ellisaistudio.com','APPROVAL_REQUIRED: YES','STATUS: READY'].join('\n');
const now=new Date(); const list=await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&timeMin=${encodeURIComponent(now.toISOString())}&timeMax=${encodeURIComponent(new Date(now.getTime()+86400000).toISOString())}`,{headers});
const existing=((await list.json()).items||[]).filter(e=>e.description?.includes('CONTENT_ID: TEST-EAS-003')).sort((a,b)=>String(a.start?.dateTime).localeCompare(String(b.start?.dateTime)));
let event=existing[0];
if(!event){const start=new Date(Date.now()+8*60_000),end=new Date(start.getTime()+15*60_000);const create=await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events',{method:'POST',headers,body:JSON.stringify({summary:'PRE-POST | LinkedIn Private Test 3',description,start:{dateTime:start.toISOString(),timeZone:'America/Los_Angeles'},end:{dateTime:end.toISOString(),timeZone:'America/Los_Angeles'},visibility:'private'})});event=await create.json();if(!create.ok)throw Error(JSON.stringify(event));}
await writeFile('artifacts/test-eas-003-event.json',JSON.stringify(event,null,2));
console.log(JSON.stringify({duplicates:existing.length,eventId:event.id,title:event.summary,description:event.description,start:event.start,end:event.end,visibility:event.visibility}));
