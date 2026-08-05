import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");
const localEnvPath = resolve(root, ".env.local");

function readEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, "utf8").split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    return match ? [[match[1], match[2]]] : [];
  }));
}

const configured = { ...readEnv(envPath), ...readEnv(localEnvPath), ...process.env };
if (!configured.SUPABASE_DATABASE_URL) {
  console.error("Mission Control was not started: SUPABASE_DATABASE_URL is missing from .env.");
  process.exit(1);
}

const services = [
  { name: "dashboard", command: process.execPath, args: ["node_modules/vite/bin/vite.js", "dev", "--force"] },
  { name: "dispatcher", command: process.execPath, args: ["scripts/run-pluto-dispatcher.mjs"] },
  { name: "learning-loop", command: process.execPath, args: ["scripts/run-pluto-learning-loop.mjs"] },
  { name: "content-video", command: process.execPath, args: ["node_modules/tsx/dist/cli.mjs", "scripts/run-content-video-runner.ts"] },
];

const children = new Map();
let stopping = false;
function log(service, message) { console.log(`[mission-control:${service}] ${message}`); }
function start(service) {
  const child = spawn(service.command, service.args, { cwd: root, env: configured, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  children.set(service.name, child);
  child.stdout.setEncoding("utf8"); child.stderr.setEncoding("utf8");
  child.stdout.on("data", (data) => process.stdout.write(`[${service.name}] ${data}`));
  child.stderr.on("data", (data) => process.stderr.write(`[${service.name}] ${data}`));
  child.on("error", (error) => log(service.name, `failed to start: ${error.message}`));
  child.on("exit", (code, signal) => {
    children.delete(service.name);
    if (!stopping) {
      log(service.name, `stopped unexpectedly (code=${code ?? "none"}, signal=${signal ?? "none"}); restarting in 3 seconds.`);
      setTimeout(() => !stopping && start(service), 3000);
    }
  });
  log(service.name, `started (pid ${child.pid}).`);
}

function stop(signal) {
  if (stopping) return;
  stopping = true;
  log("supervisor", `stopping all services (${signal}).`);
  for (const child of children.values()) child.kill();
  setTimeout(() => process.exit(0), 800).unref();
}
process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

console.log(JSON.stringify({ runner: "mission-control", services: services.map(({ name }) => name), status: "starting" }));
for (const service of services) start(service);
