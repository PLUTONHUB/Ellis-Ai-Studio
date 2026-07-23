import { existsSync, readFileSync } from "node:fs";

/** Loads local development secrets without replacing deployment-provided values. */
export function loadLocalEnvironment() {
  if (process.env.NODE_ENV === "production" || !existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] in process.env) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    if (value) process.env[match[1]] = value;
  }
}
