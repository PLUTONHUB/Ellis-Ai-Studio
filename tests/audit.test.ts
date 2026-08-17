/**
 * The AI Opportunity Audit's two load-bearing invariants.
 *
 * The results experience prints a priority number next to a classification
 * and a tier-coloured indicator. If the stored number and the published
 * weighting ever disagree, the report quietly lies about its own method —
 * which is the one failure this product cannot afford. These tests pin the
 * weighting, the tier boundaries, and the fixture's agreement with both.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import { auditFixture } from "~/data/audit-fixture";
import { normalizeWebsite } from "~/lib/audit-url";
import {
  MATURITY_STAGES,
  PILLARS,
  calculatePriority,
  classifyPriority,
  highPriorityCount,
} from "~/lib/audit-scoring";

test("priority uses the published weighting", () => {
  assert.equal(calculatePriority({ impact: 100, confidence: 100, fit: 100, implementationEase: 100 }), 100);
  assert.equal(calculatePriority({ impact: 0, confidence: 0, fit: 0, implementationEase: 0 }), 0);
  // 95x0.40 + 88x0.25 + 95x0.25 + 80x0.10 = 91.75
  assert.equal(calculatePriority({ impact: 95, confidence: 88, fit: 95, implementationEase: 80 }), 92);
});

test("tier boundaries match the published classification", () => {
  assert.equal(classifyPriority(100), "critical");
  assert.equal(classifyPriority(85), "critical");
  assert.equal(classifyPriority(84), "high");
  assert.equal(classifyPriority(70), "high");
  assert.equal(classifyPriority(69), "optimization");
  assert.equal(classifyPriority(50), "optimization");
  assert.equal(classifyPriority(49), "future");
  assert.equal(classifyPriority(0), "future");
});

test("every fixture opportunity agrees with the scoring model", () => {
  for (const o of auditFixture.opportunities) {
    const expected = calculatePriority(o.scores);
    assert.equal(o.priority, expected, `${o.name}: stored priority ${o.priority} but model gives ${expected}`);
    assert.equal(o.tier, classifyPriority(expected), `${o.name}: tier does not match priority`);
    for (const [key, value] of Object.entries(o.scores)) {
      assert.ok(value >= 0 && value <= 100, `${o.name}: ${key} out of range`);
    }
  }
});

test("the fixture's headline counts are internally consistent", () => {
  assert.equal(auditFixture.opportunities.length, 7);
  assert.equal(highPriorityCount(auditFixture.opportunities), 3);
  assert.ok(
    auditFixture.automationOpportunity >= 0 && auditFixture.automationOpportunity <= 100,
    "automation opportunity score out of range",
  );
  assert.ok(MATURITY_STAGES.includes(auditFixture.maturity), "unknown maturity stage");
});

test("every pillar has a signal, and every signal maps to a pillar", () => {
  const signalled = auditFixture.pillarSignals.map((s) => s.pillar);
  assert.equal(signalled.length, PILLARS.length);
  for (const p of PILLARS) assert.ok(signalled.includes(p.id), `no signal for pillar ${p.id}`);

  // A pillar's stated opportunity count must match the opportunities in it.
  for (const signal of auditFixture.pillarSignals) {
    const actual = auditFixture.opportunities.filter((o) => o.pillar === signal.pillar).length;
    assert.equal(signal.opportunityCount, actual, `pillar ${signal.pillar}: count disagrees with opportunities`);
  }
});

test("the roadmap covers every opportunity exactly once", () => {
  const scheduled = auditFixture.roadmap.flatMap((phase) => phase.opportunityIds);
  const ids = auditFixture.opportunities.map((o) => o.id);
  assert.equal(new Set(scheduled).size, scheduled.length, "an opportunity is scheduled in two phases");
  assert.deepEqual([...scheduled].sort(), [...ids].sort(), "roadmap and opportunity list disagree");
});

test("website input accepts what people actually type", () => {
  assert.equal(normalizeWebsite("evergreenroofing.com"), "evergreenroofing.com");
  assert.equal(normalizeWebsite("  WWW.EvergreenRoofing.com  "), "evergreenroofing.com");
  assert.equal(normalizeWebsite("https://evergreenroofing.com/contact?x=1"), "evergreenroofing.com");
  assert.equal(normalizeWebsite("http://shop.example.co.uk"), "shop.example.co.uk");
  assert.equal(normalizeWebsite("my-business.com"), "my-business.com");

  assert.equal(normalizeWebsite(""), null);
  assert.equal(normalizeWebsite("not a website"), null);
  assert.equal(normalizeWebsite("com"), null);
  assert.equal(normalizeWebsite("localhost"), null);
});
