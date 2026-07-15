import assert from "node:assert/strict";
import test from "node:test";

import { WebsiteExtractionService } from "~/services/website-extraction-service";

test("blocks private targets before attempting a request", async () => {
  await assert.rejects(() => new WebsiteExtractionService().extract("http://127.0.0.1/internal"), /private network/);
});
