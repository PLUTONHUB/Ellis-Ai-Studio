import { createHmac, randomBytes } from "node:crypto";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
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
    return parsed.toString().replace(/([?&]|%26)(code|state|access_token|client_secret)(%3D|=)[^&\s]*/gi, "$1$2$3[redacted]");
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
const interactive = process.argv.includes("--interactive");
const maxWaitMs = Number(process.env.META_OAUTH_DIAGNOSTIC_TIMEOUT_MS ?? (interactive ? 3_600_000 : 8_000));
const dashboardUrl = new URL("/dashboard/meta", callback).toString();
const dashboardAccessToken = environment.META_DASHBOARD_ACCESS_TOKEN;
if (interactive && !dashboardAccessToken) throw new Error("META_DASHBOARD_ACCESS_TOKEN is required for interactive mode.");

const runId = new Date().toISOString().replace(/[:.]/g, "-");
const output = join(".diagnostics", "meta-oauth", runId);
await mkdir(join(output, "screenshots"), { recursive: true });
const scopes = ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "instagram_basic", "instagram_content_publish"].join(",");
const authorization = new URL(`https://www.facebook.com/${environment.META_GRAPH_API_VERSION ?? "v24.0"}/dialog/oauth`);
authorization.search = new URLSearchParams({ client_id: appId, redirect_uri: callback, state: signedState(stateSecret), response_type: "code", scope: scopes }).toString();

const events = [];
const requests = [];
const responses = [];
const failures = [];
const consoleLogs = [];
const cookies = [];
const browser = await chromium.launch({ headless: !interactive });
const context = await browser.newContext({ ignoreHTTPSErrors: true, recordHar: { path: join(output, "network.har"), content: "embed", mode: "full" } });
await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
const page = await context.newPage();
let screenshotIndex = 0;
let loop;
const seen = new Map();
let pageClosed = false;
let browserDisconnected = false;
let lastScreenshotAt = 0;
let writeQueue = Promise.resolve();

function enqueuePersistence(record) {
  writeQueue = writeQueue.then(async () => {
    await appendFile(join(output, "network.ndjson"), `${JSON.stringify(record)}\n`);
    await writeFile(join(output, "network.partial.har.json"), JSON.stringify({ log: { version: "1.2", creator: { name: "Ellis Meta OAuth observer" }, entries: responses } }, null, 2));
  }).catch(() => undefined);
  return writeQueue;
}

async function screenshot(label) {
  const target = join(output, "screenshots", `${String(++screenshotIndex).padStart(3, "0")}-${label}.png`);
  try { await page.screenshot({ path: target, fullPage: true }); return target; } catch { return undefined; }
}

page.on("close", () => { pageClosed = true; });
browser.on("disconnected", () => { browserDisconnected = true; });
page.on("console", (message) => { const record = { at: new Date().toISOString(), type: message.type(), text: message.text(), url: redact(page.url()) }; consoleLogs.push(record); void enqueuePersistence({ kind: "console", ...record }); });
page.on("pageerror", (error) => { const record = { at: new Date().toISOString(), type: "pageerror", text: error.message, url: redact(page.url()) }; consoleLogs.push(record); void enqueuePersistence({ kind: "pageerror", ...record }); });
page.on("request", (request) => { const record = { at: new Date().toISOString(), method: request.method(), url: redact(request.url()), resourceType: request.resourceType(), navigation: request.isNavigationRequest() }; requests.push(record); void enqueuePersistence({ kind: "request", ...record }); });
page.on("requestfailed", (request) => { const record = { at: new Date().toISOString(), method: request.method(), url: redact(request.url()), resourceType: request.resourceType(), failure: request.failure()?.errorText }; failures.push(record); void enqueuePersistence({ kind: "requestfailed", ...record }); });
page.on("response", async (response) => {
  const headers = await response.allHeaders().catch(() => ({}));
  const location = headers.location;
  const responseRecord = { at: new Date().toISOString(), url: redact(response.url()), status: response.status(), statusText: response.statusText(), request: { method: response.request().method(), resourceType: response.request().resourceType(), navigation: response.request().isNavigationRequest() }, headers, location: location ? redact(new URL(location, response.url()).toString()) : undefined };
  responses.push(responseRecord);
  void enqueuePersistence({ kind: "response", ...responseRecord });
  if (!response.request().isNavigationRequest() || response.frame() !== page.mainFrame()) return;
  const event = { at: responseRecord.at, url: responseRecord.url, status: responseRecord.status, location: responseRecord.location, setCookie: headers["set-cookie"] ? "[captured in incremental HAR]" : undefined, facebookDebug: headers["x-fb-debug"], fbtraceId: headers["x-fb-trace-id"] };
  events.push(event);
  if (location) {
    const destination = new URL(location, response.url()).toString();
    const fingerprint = redirectFingerprint(destination);
    const prior = seen.get(fingerprint);
    if (prior !== undefined && !loop) { loop = { beginsAtEvent: prior, repeatsAtEvent: events.length - 1, fingerprint: redact(fingerprint) }; void enqueuePersistence({ kind: "redirect_loop_detected", at: new Date().toISOString(), ...loop }); }
    else seen.set(fingerprint, events.length - 1);
  }
  await screenshot(`navigation-${events.length}`);
});

let navigationError;
let stage = "authorization_request";
let tokenExchangeCompleted = false;
try {
  if (interactive) {
    stage = "dashboard_unlock";
    await page.goto(dashboardUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    const unlock = page.getByRole("button", { name: "Unlock" });
    const connect = page.getByRole("button", { name: "Connect Meta" });
    if (await unlock.isVisible()) {
      await page.locator('input[type="password"]').fill(dashboardAccessToken);
      await unlock.click();
      for (let attempt = 0; attempt < 40 && !await connect.isVisible(); attempt += 1) await page.waitForTimeout(250);
    }
    if (!await connect.isVisible()) throw new Error(`Connect Meta was not available after dashboard unlock: ${(await page.locator("body").innerText()).slice(0, 400)}`);
    stage = "facebook_login";
    await connect.click();
    await page.waitForURL(/facebook\.com/, { timeout: 45_000 });
    console.log("Interactive Chromium is open at Facebook. Complete login and consent in that browser; tracing will resume automatically.");
  } else {
    await page.goto(authorization.toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
  }
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline && !pageClosed && !browserDisconnected) {
    const current = page.url();
    const parsed = new URL(current);
    if (parsed.searchParams.has("error")) stage = "meta_error_callback";
    if (parsed.searchParams.has("code")) {
      stage = "authorization_code_callback";
      await page.waitForTimeout(3_000);
      tokenExchangeCompleted = (await page.locator("body").innerText()).includes("Meta is connected.");
      if (tokenExchangeCompleted) stage = "token_exchange_complete";
      if (tokenExchangeCompleted) break;
    }
    if (Date.now() - lastScreenshotAt >= 5_000) { await screenshot("periodic"); lastScreenshotAt = Date.now(); }
    await writeQueue;
    await page.waitForTimeout(500);
  }
  if (pageClosed || browserDisconnected) stage = "manual_browser_close";
  else if (Date.now() >= deadline) stage = "observer_timeout";
} catch (error) {
  navigationError = error instanceof Error ? error.message : String(error);
  stage = pageClosed || browserDisconnected ? "manual_browser_close" : "harness_error";
}
await screenshot("final");
if (browser.isConnected()) for (const cookie of await context.cookies(["https://www.facebook.com"]).catch(() => [])) cookies.push({ name: cookie.name, domain: cookie.domain, path: cookie.path, secure: cookie.secure, httpOnly: cookie.httpOnly, sameSite: cookie.sameSite, expires: cookie.expires });
const finalUrl = pageClosed ? "browser-closed://manual" : page.url();
const finalParameters = (() => { try { const parsed = new URL(finalUrl); return { code: parsed.searchParams.has("code"), error: parsed.searchParams.get("error") ?? undefined, error_reason: parsed.searchParams.get("error_reason") ?? undefined, error_description: parsed.searchParams.get("error_description") ?? undefined, fbtrace_id: parsed.searchParams.get("fbtrace_id") ?? undefined }; } catch { return {}; } })();
await writeQueue;
if (browser.isConnected()) {
  await context.tracing.stop({ path: join(output, "playwright-trace.zip") });
  await context.close();
  await browser.close();
}

const report = { runId, interactive, observerTimeoutMinutes: maxWaitMs / 60_000, startedAuthorizationUrl: redact(authorization.toString()), finalUrl: redact(finalUrl), navigationError, stage, events, requests, responses, failures, cookies, consoleLogs, loop, callbackReturnedCode: finalParameters.code === true, tokenExchangeCompleted, callbackError: finalParameters.error, callbackErrorReason: finalParameters.error_reason, callbackErrorDescription: finalParameters.error_description, fbtraceId: finalParameters.fbtrace_id, conclusion: tokenExchangeCompleted ? "Ellis received an authorization code and completed token exchange." : pageClosed || browserDisconnected ? "Browser was manually closed before OAuth completion." : loop ? "Redirect loop was observed and recorded; browser remained under observation until a terminal condition." : finalParameters.error ? "Meta returned an explicit OAuth error callback; observation continued." : "Observation ended without an authorization code." };
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
console.log(JSON.stringify({ output, conclusion: report.conclusion, stage, events: events.length, loop, callbackReturnedCode: report.callbackReturnedCode, tokenExchangeCompleted, finalUrl: report.finalUrl }, null, 2));
