import { createHash, createHmac, randomBytes, timingSafeEqual, webcrypto } from "node:crypto";
import { appendFile, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export type OAuthDiagnosticEvent = string;
export type OAuthDiagnostic = { provider: string; event: OAuthDiagnosticEvent; at: string; [key: string]: string | number | boolean | undefined };

export function fingerprint(value: string) { return createHash("sha256").update(value).digest("base64url").slice(0, 12); }

export function createOAuthDiagnostics(provider: string, path = `.diagnostics/${provider}-oauth.log`) {
  return (event: OAuthDiagnosticEvent, data: Record<string, string | number | boolean | undefined> = {}) => {
    const entry: OAuthDiagnostic = { provider, event, at: new Date().toISOString(), ...data };
    const line = JSON.stringify(entry);
    console.info(`[${provider}-oauth]`, line);
    void mkdir(dirname(path), { recursive: true }).then(() => appendFile(path, `${line}\n`, { mode: 0o600 })).catch(() => undefined);
  };
}

export function createSignedState(secret: string, ttlMs = 600_000) {
  const payload = Buffer.from(JSON.stringify({ nonce: randomBytes(16).toString("base64url"), expiresAt: Date.now() + ttlMs })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function validateSignedState(state: string, secret: string) {
  const [payload, signature] = state.split(".");
  const expected = payload ? createHmac("sha256", secret).update(payload).digest("base64url") : "";
  if (!payload || !signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("OAuth state validation failed.");
  let decoded: { expiresAt?: number };
  try { decoded = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { throw new Error("OAuth state is malformed."); }
  if (!decoded.expiresAt || decoded.expiresAt < Date.now()) throw new Error("OAuth state expired. Start the connection again.");
  return decoded;
}

export function createEncryptedJsonStore<T>(options: { path: string; encryptionSecret: () => string; empty: () => T }) {
  async function cryptoKey() { const digest = await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(options.encryptionSecret())); return webcrypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]); }
  return {
    async load(): Promise<T> { try { const item = JSON.parse(await readFile(options.path, "utf8")) as { iv: string; ciphertext: string }; const plaintext = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv: Buffer.from(item.iv, "base64url") }, await cryptoKey(), Buffer.from(item.ciphertext, "base64url")); return JSON.parse(new TextDecoder().decode(plaintext)) as T; } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return options.empty(); throw new Error("The encrypted OAuth connection store could not be read."); } },
    async save(value: T) { const iv = randomBytes(12); const ciphertext = await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, await cryptoKey(), new TextEncoder().encode(JSON.stringify(value))); await mkdir(dirname(options.path), { recursive: true }); await writeFile(`${options.path}.tmp`, JSON.stringify({ iv: iv.toString("base64url"), ciphertext: Buffer.from(ciphertext).toString("base64url") }), { mode: 0o600 }); await rename(`${options.path}.tmp`, options.path); },
    async clear() { try { await unlink(options.path); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; } },
  };
}
