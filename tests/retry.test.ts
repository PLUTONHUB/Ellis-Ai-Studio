import assert from "node:assert/strict";
import test from "node:test";

import { withRetry } from "~/lib/pluto/research/retry";

test("retries transient failures with bounded attempts", async () => {
  let calls = 0;
  const result = await withRetry(async () => {
    calls += 1;
    if (calls < 3) throw new Error("temporary failure");
    return "ok";
  }, { attempts: 3, baseDelayMs: 0, sleep: async () => undefined });
  assert.equal(result, "ok");
  assert.equal(calls, 3);
});

test("does not retry errors classified as permanent", async () => {
  let calls = 0;
  await assert.rejects(() => withRetry(async () => { calls += 1; throw new Error("bad input"); }, { shouldRetry: () => false }), /bad input/);
  assert.equal(calls, 1);
});
