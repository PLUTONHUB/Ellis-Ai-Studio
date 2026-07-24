import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createEncryptedJsonStore, createSignedState, validateSignedState } from "../src/lib/oauth-framework.server";

test("signed OAuth state validates and rejects tampering", () => {
  const state = createSignedState("state-secret", 60_000);
  assert.ok(validateSignedState(state, "state-secret").expiresAt);
  assert.throws(() => validateSignedState(`${state}x`, "state-secret"), /state validation/i);
});

test("encrypted connection store survives reload without plaintext tokens", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ellis-oauth-"));
  const path = join(directory, "connection.json");
  try {
    const store = createEncryptedJsonStore<{ accessToken: string; name: string }>({ path, encryptionSecret: () => "encryption-secret", empty: () => ({ accessToken: "", name: "" }) });
    await store.save({ accessToken: "secret-token", name: "Member" });
    assert.deepEqual(await store.load(), { accessToken: "secret-token", name: "Member" });
    assert.ok(!(await readFile(path, "utf8")).includes("secret-token"));
    await store.clear();
    assert.deepEqual(await store.load(), { accessToken: "", name: "" });
  } finally { await rm(directory, { recursive: true, force: true }); }
});
