/*
 * Smart Request Routing — the Ellis AI Studio capability demo inside the Zone 8
 * preview.
 *
 * What this is: a small, deterministic, entirely client-side classifier. It reads
 * the free-text description a homeowner types into the request form and proposes
 * a category, an urgency and a preferred follow-up action.
 *
 * What this is NOT: a model call, a network request, or anything that leaves the
 * browser. The pitch point is the *behaviour* — a lead that arrives already
 * triaged instead of as an undifferentiated form fill. Keeping it deterministic
 * also means the demo cannot embarrass anyone live in front of the owner.
 *
 * Deliberately conservative: when the text carries no signal, it returns null and
 * the UI shows nothing rather than guessing at the customer in front of a
 * prospect.
 */

import { priceRows, serviceOptions, urgencyOptions } from "~/data/zone8";

export type Urgency = "emergency" | "today" | "week" | "flexible";

export type RoutingResult = {
  /** Matches a `serviceOptions` value so the form can auto-select it. */
  category: (typeof serviceOptions)[number]["value"];
  categoryLabel: string;
  urgency: Urgency;
  urgencyLabel: string;
  /** The dispatch recommendation shown on the summary card. */
  action: string;
};

/*
 * Tie-break ordering. Descriptions routinely hit two categories at equal
 * strength — "a pipe burst under the kitchen sink" matches both `pipe` and
 * `fixture` on one keyword each. Falling back to the order of `priceRows` would
 * resolve that arbitrarily, and arbitrary here means occasionally filing a burst
 * supply line as a dripping tap. Under a tie, route to the more serious
 * category: over-triaging costs a phone call, under-triaging costs the customer.
 */
const SEVERITY: Record<string, number> = {
  sewer: 6, pipe: 5, leak: 4, heater: 3, drain: 2, fixture: 1, inspection: 0,
};

/** Maps the pricing taxonomy onto the form's service dropdown values. */
const CATEGORY_BY_PRICE_ROW: Record<string, RoutingResult["category"]> = {
  fixture: "fixture",
  drain: "drain",
  heater: "heater",
  leak: "leak",
  sewer: "drain",
  pipe: "pipe",
  inspection: "inspection",
};

/*
 * Phrases that indicate active, ongoing water or sewage escape — the cases where
 * a callback rather than a scheduling email is the correct handling. Kept as
 * phrases, not single words, so "the water heater is old" does not page anyone.
 */
const EMERGENCY_SIGNALS = [
  "burst", "flooding", "flooded", "gushing", "spraying", "pouring",
  "backing up", "backed up", "overflowing", "sewage", "no water",
  "can't shut", "cant shut", "won't stop", "wont stop", "emergency",
  "urgent", "asap", "right now", "coming through", "ceiling",
];

const TODAY_SIGNALS = ["today", "tonight", "this morning", "this afternoon", "no hot water", "as soon as"];
const WEEK_SIGNALS = ["this week", "few days", "couple days", "soon"];
const FLEXIBLE_SIGNALS = ["whenever", "no rush", "not urgent", "flexible", "quote", "estimate", "planning", "thinking about"];

function label<T extends readonly { value: string; label: string }[]>(options: T, value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

function hits(text: string, needles: string[]) {
  return needles.filter((n) => text.includes(n)).length;
}

/**
 * Classify a free-text plumbing description.
 * Returns `null` when the text is too short or carries no recognisable signal.
 */
export function routeRequest(input: string): RoutingResult | null {
  const text = input.toLowerCase().trim();
  if (text.length < 12) return null;

  // --- category: score each price row by how many of its keywords appear ------
  let bestId: string | null = null;
  let bestScore = 0;
  for (const row of priceRows) {
    const score = hits(text, row.keywords);
    if (score === 0) continue;
    const better =
      score > bestScore ||
      (score === bestScore && bestId !== null && (SEVERITY[row.id] ?? 0) > (SEVERITY[bestId] ?? 0));
    if (better) {
      bestScore = score;
      bestId = row.id;
    }
  }

  // --- urgency ---------------------------------------------------------------
  let urgency: Urgency = "week";
  if (hits(text, EMERGENCY_SIGNALS) > 0) urgency = "emergency";
  else if (hits(text, TODAY_SIGNALS) > 0) urgency = "today";
  else if (hits(text, FLEXIBLE_SIGNALS) > 0) urgency = "flexible";
  else if (hits(text, WEEK_SIGNALS) > 0) urgency = "week";

  // No category signal AND no urgency signal means we genuinely do not know.
  // Say nothing rather than show the prospect a confident wrong answer.
  if (!bestId && urgency === "week") return null;

  const category = bestId ? CATEGORY_BY_PRICE_ROW[bestId] : "other";
  // A sewage backup is an emergency regardless of which keyword matched first.
  if (bestId === "sewer" && hits(text, ["backing up", "backed up", "sewage", "overflow"]) > 0) {
    urgency = "emergency";
  }

  const action =
    urgency === "emergency"
      ? "Call customer"
      : urgency === "today"
        ? "Call customer today"
        : urgency === "flexible"
          ? "Send written quote"
          : "Schedule callback";

  return {
    category,
    categoryLabel: label(serviceOptions, category),
    urgency,
    urgencyLabel: label(urgencyOptions, urgency),
    action,
  };
}

/** Human-facing urgency wording for the summary card. */
export function urgencyTone(urgency: Urgency): "High" | "Elevated" | "Standard" {
  if (urgency === "emergency") return "High";
  if (urgency === "today") return "Elevated";
  return "Standard";
}
