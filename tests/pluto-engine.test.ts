import assert from "node:assert/strict";
import test from "node:test";

import { processCommand } from "~/services/plutoEngine";
import type { PlutoRuntimeResponse } from "~/types/pluto-runtime";

test("routes Research commands to the research runner and returns a structured summary", async () => {
  let request: unknown;
  const response = (await processCommand("Research example.com", {
    runResearch: async (input: unknown) => {
      request = input;
      return {
        businessName: "example.com",
        websiteUrl: "https://example.com/",
        researchRunId: "run-123",
        status: "completed",
        pageTitle: "Example Domain",
        sourceUrl: "https://example.com/",
        pageDescription: "An example business.",
        fetchedAt: "2026-07-15T00:00:00.000Z",
        factCount: 4,
        facts: [{ factType: "service", predicate: "page_heading", value: "Business consulting", sourceUrl: "https://example.com/", confidence: 0.72 }],
        sources: ["https://example.com/"],
        findings: [{ title: "No phone number found", summary: "No phone fact was extracted.", confidence: 0.86 }],
        recommendations: [{ priority: 2, title: "Add a prominent call path", rationale: "Phone-first prospects need a contact route.", action: "Publish a clickable phone number." }],
      };
    },
  })) as PlutoRuntimeResponse;

  assert.deepEqual(request && { ...(request as { data: { name: string; websiteUrl: string; idempotencyKey: string } }).data, idempotencyKey: Boolean((request as { data: { idempotencyKey: string } }).data.idempotencyKey) }, {
    name: "example.com",
    websiteUrl: "https://example.com/",
    idempotencyKey: true,
  });
  assert.equal(response.kind, "research");
  if (response.kind === "research") {
    assert.equal(response.research.factCount, 4);
    assert.equal(response.research.recommendations[0]?.priority, 2);
    assert.equal(response.research.facts[0]?.value, "Business consulting");
    assert.equal(response.research.sources[0], "https://example.com/");
  }
});

test("preserves existing memory and task commands", async () => {
  assert.deepEqual(await processCommand("remember favorite color blue"), { kind: "message", message: "I'll remember that favorite is color blue." });
  assert.deepEqual(await processCommand("what is my favorite"), { kind: "message", message: "Your favorite is color blue." });
  assert.deepEqual(await processCommand("create task follow up with new lead"), { kind: "message", message: "Task created: follow up with new lead" });
});
