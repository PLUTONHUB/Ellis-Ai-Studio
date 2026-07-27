import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const path = ".env";
const required = ["GOOGLE_OAUTH_STATE_SECRET", "GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY", "GOOGLE_CALENDAR_DASHBOARD_ACCESS_TOKEN"];
const current = await readFile(path, "utf8");
const missing = required.filter((name) => !new RegExp(`^${name}=`, "m").test(current));

if (missing.length) {
  const additions = missing.map((name) => `${name}=${randomBytes(48).toString("base64url")}`);
  await writeFile(path, `${current.replace(/\s*$/, "")}\n${additions.join("\n")}\n`, { mode: 0o600 });
}

process.stdout.write(JSON.stringify({ created: missing, ready: required }));
