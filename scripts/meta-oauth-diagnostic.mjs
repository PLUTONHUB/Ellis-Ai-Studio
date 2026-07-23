import { createHmac, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

async function loadEnvironment() {
  const values = {};
  for (const path of [".env", ".env.local"]) {
    try {
      for (const line of (await readFile(path, "utf8")).split(/\r?\n/)) {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (match && !values[match[1]]) values[match[1]] = match[2];
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return values;
}

function signedState(secret) {
  const payload = Buffer.from(JSON.stringify({ nonce: randomBytes(16).toString("base64url"), expiresAt: Date.now() + 600_000 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}

function redact(url) {
  try {
    const parsed = new URL(url);
    for (const parameter of ["code", "state", "access_token", "client_secret"]) if (parsed.searchParams.has(parameter)) parsed.searchParams.set(parameter, "[redacted]");
    return parsed.toString().replace(/(code|state|access_token|client_secret)(%3D|=)[^&\s]*/gi, "$1$2[redacted]");
  } catch { return url; }
}

function redirectFingerprint(url) {
  const parsed = new URL(url);
  for (const parameter of ["cache_buster", "logger_id", "params[cache_buster]", "params[logger_id]"]) parsed.searchParams.delete(parameter);
  return `${parsed.origin}${parsed.pathname}?${[...parsed.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&")}`;
}

const environment = await loadEnvironment();
const appId = environment.META_APP_ID;
const callback = environment.META_OAUTH_REDIRECT_URI;
const stateSecret = environment.META_OAUTH_STATE_SECRET;
if (!appId || !callback || !stateSecret) throw new Error("META_APP_ID, META_OAUTH_REDIRECT_URI, and META_OAUTH_STATE_SECRET are required.");

const runId = new Date().toISOString().replace(/[:.]/g, "-");
const output = join(".diagnostics", "meta-oauth", runId);
await mkdir(join(output, "screenshots"), { recursive: true });
const scopes = ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "instagram_basic", "instagram_content_publish"].join(",");
const authorization = new URL(`https://www.facebook.com/${environment.META_GRAPH_API_VERSION ?? "v24.0"}/dialog/oauth`);
authorization.search = new URLSearchParams({ client_id: appId, redirect_uri: callback, state: signedState(stateSecret), response_type: "code", scope: scopes }).toString();

const events = [];
const consoleLogs = [];
const cookies = [];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ ignoreHTTPSErrors: true, recordHar: { path: join(output, "network.har"), content: "embed", mode: "full" } });
await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
const page = await context.newPage();
let screenshotIndex = 0;
let loop;
const seen = new Map();

async function screenshot(label) {
  const target = join(output, "screenshots", `${String(++screenshotIndex).padStart(3, "0")}-${label}.png`);
  try { await page.screenshot({ path: target, fullPage: true }); return target; } catch { return undefined; }
}

page.on("console", (message) => consoleLogs.push({ at: new Date().toISOString(), type: message.type(), text: message.text(), url: redact(page.url()) }));
page.on("pageerror", (error) => consoleLogs.push({ at: new Date().toISOString(), type: "pageerror", text: error.message, url: redact(page.url()) }));
page.on("response", async (response) => {
  if (!response.request().isNavigationRequest() || response.frame() !== page.mainFrame()) return;
  const headers = await response.allHeaders();
  const location = headers.location;
  const event = { at: new Date().toISOString(), url: redact(response.url()), status: response.status(), location: location ? redact(new URL(location, response.url()).toString()) : undefined, setCookie: headers["set-cookie"] ? "[captured in HAR]" : undefined, facebookDebug: headers["x-fb-debug"], fbtraceId: headers["x-fb-trace-id"] };
  events.push(event);
  if (location) {
    const destination = new URL(location, response.url()).toString();
    const fingerprint = redirectFingerprint(destination);
    const prior = seen.get(fingerprint);
    if (prior !== undefined && !loop) loop = { beginsAtEvent: prior, repeatsAtEvent: events.length - 1, fingerprint: redact(fingerprint) };
    else seen.set(fingerprint, events.length - 1);
  }
  await screenshot(`navigation-${events.length}`);
});

let navigationError;
try {
  await page.goto(authorization.toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForTimeout(8_000);
} catch (error) {
  navigationError = error instanceof Error ? error.message : String(error);
}
await screenshot("final");
for (const cookie of await context.cookies(["https://www.facebook.com"])) cookies.push({ name: cookie.name, domain: cookie.domain, path: cookie.path, secure: cookie.secure, httpOnly: cookie.httpOnly, sameSite: cookie.sameSite, expires: cookie.expires });
const finalUrl = page.url();
const finalParameters = (() => { try { const parsed = new URL(finalUrl); return { code: parsed.searchParams.has("code"), error: parsed.searchParams.get("error") ?? undefined, error_reason: parsed.searchParams.get("error_reason") ?? undefined, error_description: parsed.searchParams.get("error_description") ?? undefined, fbtrace_id: parsed.searchParams.get("fbtrace_id") ?? undefined }; } catch { return {}; } })();
await context.tracing.stop({ path: join(output, "playwright-trace.zip") });
await context.close();
await browser.close();

const report = { runId, startedAuthorizationUrl: redact(authorization.toString()), finalUrl: redact(finalUrl), navigationError, events, cookies, consoleLogs, loop, callbackReturnedCode: finalParameters.code === true, callbackError: finalParameters.error, callbackErrorReason: finalParameters.error_reason, callbackErrorDescription: finalParameters.error_description, fbtraceId: finalParameters.fbtrace_id, conclusion: loop ? "Redirect loop detected; inspect loop fingerprint and HAR." : finalParameters.code ? "Authorization code returned." : new URL(finalUrl).hostname.endsWith("facebook.com") ? "Ellis never regained control; browser remains on Facebook." : "Browser left Facebook without an authorization code." };
await writeFile(join(output, "report.json"), JSON.stringify(report, null, 2));
await writeFile(join(output, "report.md"), [
  `# Meta OAuth diagnostic ${runId}`,
  "",
  `- Authorization URL: ${report.startedAuthorizationUrl}`,
  `- Final URL: ${report.finalUrl}`,
  `- Code returned: ${report.callbackReturnedCode}`,
  `- OAuth error: ${report.callbackError ?? "none"}`,
  `- Loop: ${loop ? `yes; event ${loop.beginsAtEvent} repeats at ${loop.repeatsAtEvent}` : "no"}`,
  `- Conclusion: ${report.conclusion}`,
  "",
  "Artifacts: network.har, playwright-trace.zip, screenshots/, report.json.",
  "",
].join("\n"));
console.log(JSON.stringify({ output, conclusion: report.conclusion, events: events.length, loop, callbackReturnedCode: report.callbackReturnedCode, finalUrl: report.finalUrl }, null, 2));
