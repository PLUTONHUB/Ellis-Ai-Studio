/**
 * The presentation layer is display-only, and these tests are what keep it
 * that way: they pin every label map to the union it claims to cover, pin the
 * qualification scale to the scoring engine that owns the thresholds, and
 * assert that nothing in the public-facing vocabulary carries an internal
 * score, class or verdict across the boundary.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import { classifyLead } from "~/lib/lead-scoring";
import { ELLIS_SYSTEMS } from "~/lib/lead-taxonomy";
import {
  ACTIVE_PIPELINE_STATUSES,
  ANALYSIS_STATUS_LABELS,
  INTERNAL_NEXT_ACTION,
  LEAD_EVIDENCE_COPY,
  PIPELINE_LABELS,
  PIPELINE_TONE,
  PROBLEM_CATEGORY_LABELS,
  QUALIFICATION_BANDS,
  QUALIFICATION_DEFINITION,
  QUALIFICATION_TONE,
  SOURCE_LABELS,
  URGENCY_CHOICES,
  URGENCY_LABELS,
  activityLabel,
  publicNextStep,
  systemDescription,
  systemFlow,
  systemName,
} from "~/lib/lead-presentation";
import {
  LEAD_ANALYSIS_STATUSES,
  LEAD_SOURCES,
  NEXT_ACTIONS,
  PIPELINE_STATUSES,
  PROBLEM_CATEGORIES,
  URGENCY_OPTIONS,
} from "~/types/lead";

/* ------------------------------------------------- scale follows the engine */

test("the qualification scale is drawn from the same thresholds the engine uses", () => {
  for (const band of QUALIFICATION_BANDS) {
    assert.equal(classifyLead(band.min), band.key, `${band.key} should start at ${band.min}`);
    assert.equal(classifyLead(band.max), band.key, `${band.key} should end at ${band.max}`);
    if (band.min > 0) {
      assert.notEqual(classifyLead(band.min - 1), band.key, `${band.key} should not extend below ${band.min}`);
    }
  }
  // The bands tile 0-100 with no gap and no overlap.
  assert.equal(QUALIFICATION_BANDS[0].min, 0);
  assert.equal(QUALIFICATION_BANDS[QUALIFICATION_BANDS.length - 1].max, 100);
  for (let i = 1; i < QUALIFICATION_BANDS.length; i += 1) {
    assert.equal(QUALIFICATION_BANDS[i].min, QUALIFICATION_BANDS[i - 1].max + 1);
  }
});

test("qualification tone stays inside the Ellis palette grammar", () => {
  // Rust is the reserved high-stakes accent and marks the top class only.
  const rust = Object.entries(QUALIFICATION_TONE).filter(([, tone]) => tone === "rust");
  assert.deepEqual(rust, [["priority_lead", "rust"]]);
  for (const band of QUALIFICATION_BANDS) {
    assert.ok(QUALIFICATION_TONE[band.key], `${band.key} has a tone`);
    assert.ok(QUALIFICATION_DEFINITION[band.key], `${band.key} has a definition`);
  }
});

/* ---------------------------------------------------- label maps are total */

test("every stored value has a label", () => {
  for (const status of PIPELINE_STATUSES) {
    assert.ok(PIPELINE_LABELS[status], `pipeline label for ${status}`);
    assert.ok(PIPELINE_TONE[status], `pipeline tone for ${status}`);
  }
  for (const urgency of URGENCY_OPTIONS) assert.ok(URGENCY_LABELS[urgency], `urgency label for ${urgency}`);
  for (const source of LEAD_SOURCES) assert.ok(SOURCE_LABELS[source], `source label for ${source}`);
  for (const category of PROBLEM_CATEGORIES) assert.ok(PROBLEM_CATEGORY_LABELS[category], `category label for ${category}`);
  for (const status of LEAD_ANALYSIS_STATUSES) assert.ok(ANALYSIS_STATUS_LABELS[status], `analysis label for ${status}`);
  for (const action of NEXT_ACTIONS) assert.ok(INTERNAL_NEXT_ACTION[action]?.label, `internal action label for ${action}`);
});

test("the urgency picker offers exactly the stored options", () => {
  assert.deepEqual(
    [...URGENCY_CHOICES.map((choice) => choice.value)].sort(),
    [...URGENCY_OPTIONS].sort(),
  );
});

test("active pipeline statuses are real pipeline statuses and exclude settled ones", () => {
  for (const status of ACTIVE_PIPELINE_STATUSES) {
    assert.ok(PIPELINE_STATUSES.includes(status), `${status} is a stored pipeline status`);
  }
  for (const settled of ["won", "lost", "nurture"] as const) {
    assert.equal(ACTIVE_PIPELINE_STATUSES.includes(settled), false, `${settled} is not an active opportunity`);
  }
});

/* -------------------------------------------------- the public/internal line */

test("public next-step copy never carries an internal score, class or verdict", () => {
  // Anything on this list is dashboard vocabulary and must not reach a prospect.
  const internal = /\b(score|scored|qualification|qualified|confidence|priority lead|strong fit|poor fit|decline|refer|nurture|pipeline|manual review)\b/i;
  for (const action of NEXT_ACTIONS) {
    const step = publicNextStep(action);
    assert.ok(step.title, `${action} has a public title`);
    assert.ok(step.detail, `${action} has public detail`);
    assert.equal(internal.test(step.title), false, `${action} title leaks internal vocabulary: ${step.title}`);
    assert.equal(internal.test(step.detail), false, `${action} detail leaks internal vocabulary: ${step.detail}`);
  }
});

test("the internal vocabulary stays distinct from the public one", () => {
  for (const action of NEXT_ACTIONS) {
    assert.notEqual(INTERNAL_NEXT_ACTION[action].label, publicNextStep(action).title);
  }
});

/* --------------------------------------------------------------- systems */

test("every Ellis system has a customer-facing flow with one AI step", () => {
  for (const key of Object.keys(ELLIS_SYSTEMS)) {
    const flow = systemFlow(key);
    assert.ok(flow.length >= 3, `${key} flow has enough steps to read as a system`);
    assert.equal(
      flow.filter((step) => step.emphasis).length,
      1,
      `${key} flow marks exactly one step as the judgement step`,
    );
    assert.equal(systemName(key), ELLIS_SYSTEMS[key as keyof typeof ELLIS_SYSTEMS].name);
    assert.ok(systemDescription(key));
  }
});

test("an unrecognized system key falls back rather than rendering nothing", () => {
  assert.deepEqual(systemFlow("not_a_system"), systemFlow("custom_system"));
  assert.equal(systemName("not_a_system"), ELLIS_SYSTEMS.custom_system.name);
});

/* -------------------------------------------------------------- evidence */

test("the three evidence classes are all describable and distinct", () => {
  const classes = ["user_confirmed", "audit_observed", "audit_inferred"] as const;
  const labels = classes.map((key) => LEAD_EVIDENCE_COPY[key].label);
  assert.equal(new Set(labels).size, classes.length);
  // An inference must never be described as a confirmed fact.
  assert.match(LEAD_EVIDENCE_COPY.audit_inferred.definition, /not a confirmed fact/i);
});

/* -------------------------------------------------------------- activity */

test("an unknown activity type degrades to readable text instead of a raw key", () => {
  assert.equal(activityLabel("lead_created"), "Lead created");
  assert.equal(activityLabel("some_future_event"), "Some future event");
});
