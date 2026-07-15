import assert from "node:assert/strict";
import test from "node:test";

import { WebsiteExtractionService } from "~/services/website-extraction-service";

test("blocks private targets before attempting a request", async () => {
  await assert.rejects(() => new WebsiteExtractionService().extract("http://127.0.0.1/internal"), /private network/);
});

test("crawls same-site discovered pages while excluding external links", async () => {
  const requested: string[] = [];
  class StubExtractionService extends WebsiteExtractionService {
    override async extract(url: string) {
      requested.push(url);
      return {
        sourceUrl: url,
        pageTitle: null,
        fetchedAt: "2026-07-15T00:00:00.000Z",
        contentSha256: url,
        contentType: "text/html",
        httpStatus: 200,
        bodyText: "",
        metadata: {},
        facts: [],
        discoveredUrls: url.endsWith("/") ? ["https://example.com/services", "https://outside.example/about"] : [],
      };
    }
  }

  const pages = await new StubExtractionService().extractSite("https://example.com/");
  assert.deepEqual(requested, ["https://example.com/", "https://example.com/services"]);
  assert.equal(pages.length, 2);
});
