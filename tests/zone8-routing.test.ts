/**
 * Smart Request Routing is demoed live in front of a prospect, so its failure
 * modes are commercial, not just technical. Two invariants matter:
 *
 *   1. An active-escape description ("backing up", "burst", "flooding") must
 *      classify as an emergency and recommend a call. Under-triaging that in a
 *      live demo undersells the whole capability.
 *   2. Vague or empty text must return null. A confident wrong summary in front
 *      of the business owner is worse than showing nothing at all.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import { routeRequest, urgencyTone } from "~/lib/zone8-routing";

test("the scripted demo sentence triages as a high-urgency drain call", () => {
  // This is the exact phrasing used in the pitch walkthrough.
  const result = routeRequest("basement drain backing up and water coming through");
  assert.ok(result, "the demo sentence must produce a summary");
  assert.equal(result.category, "drain");
  assert.equal(result.urgency, "emergency");
  assert.equal(result.action, "Call customer");
  assert.equal(urgencyTone(result.urgency), "High");
});

test("active water escape is an emergency regardless of category", () => {
  const burst = routeRequest("a pipe burst under the kitchen sink and it is spraying");
  assert.equal(burst?.urgency, "emergency");
  assert.equal(burst?.category, "pipe");

  const sewage = routeRequest("sewage is overflowing into the downstairs shower");
  assert.equal(sewage?.urgency, "emergency");
});

test("planning-stage requests route to a written quote, not a callout", () => {
  const result = routeRequest("thinking about replacing the water heater, no rush, just want a quote");
  assert.equal(result?.category, "heater");
  assert.equal(result?.urgency, "flexible");
  assert.equal(result?.action, "Send written quote");
});

test("no signal produces no summary", () => {
  assert.equal(routeRequest(""), null);
  assert.equal(routeRequest("hello"), null, "too short to classify");
  assert.equal(
    routeRequest("I would like to ask a question about something please"),
    null,
    "no category and no urgency signal must stay silent",
  );
});

test("a category alone is enough to summarise", () => {
  const result = routeRequest("the upstairs toilet keeps running and the faucet drips");
  assert.equal(result?.category, "fixture");
  assert.equal(result?.urgency, "week");
  assert.equal(result?.action, "Schedule callback");
});
