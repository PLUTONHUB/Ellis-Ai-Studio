export type PlutoCommandIntent =
  | "request_friction_audit"
  | "view_sample_audit"
  | "calculate_opportunity"
  | "start_onboarding"
  | "explain_friction_pillars"
  | "view_portfolio"
  | "unknown";

export type ParsedPlutoCommand = {
  intent: PlutoCommandIntent;
  confidence: number;
  summary: string;
  actionLabel: string;
  href: string | null;
  matchedTerms: string[];
};

type CommandRule = {
  intent: Exclude<PlutoCommandIntent, "unknown">;
  priority: number;
  summary: string;
  actionLabel: string;
  href: string;
  phrasePatterns: RegExp[];
  terms: string[];
};

const commandRules: CommandRule[] = [
  {
    intent: "view_sample_audit",
    priority: 100,
    summary:
      "Pluto understood that you want to inspect an example Friction Audit before requesting your own.",
    actionLabel: "Open Sample Audit",
    href: "/#audit-preview",
    phrasePatterns: [/sample audit/, /example audit/, /audit preview/, /show.*audit/],
    terms: ["sample", "example", "preview", "audit", "report"],
  },
  {
    intent: "request_friction_audit",
    priority: 90,
    summary:
      "Pluto understood that you want to request a Friction Audit and identify where revenue is leaking.",
    actionLabel: "Get My Friction Audit",
    href: "/#contact",
    phrasePatterns: [/friction audit/, /get.*audit/, /request.*audit/, /diagnose.*business/, /find.*leak/],
    terms: ["audit", "diagnose", "friction", "leak", "leaking", "bottleneck", "revenue"],
  },
  {
    intent: "calculate_opportunity",
    priority: 80,
    summary:
      "Pluto understood that you want to model revenue opportunity from missed leads and response friction.",
    actionLabel: "Open Opportunity Calculator",
    href: "/proposal",
    phrasePatterns: [/calculate.*opportunity/, /estimate.*revenue/, /model.*revenue/, /missed.*lead/, /lead.*value/],
    terms: ["calculate", "calculator", "estimate", "opportunity", "proposal", "roi", "leads", "revenue"],
  },
  {
    intent: "start_onboarding",
    priority: 70,
    summary:
      "Pluto understood that you want to begin implementation intake and move into onboarding.",
    actionLabel: "Start Onboarding",
    href: "/onboarding",
    phrasePatterns: [/start.*onboarding/, /begin.*onboarding/, /start.*project/, /implementation.*intake/, /launch.*readiness/],
    terms: ["onboarding", "start", "begin", "intake", "implementation", "launch", "project"],
  },
  {
    intent: "explain_friction_pillars",
    priority: 60,
    summary:
      "Pluto understood that you want to learn how the seven Friction Pillars diagnose growth constraints.",
    actionLabel: "View Seven Pillars",
    href: "/#pillars",
    phrasePatterns: [/friction pillars/, /seven pillars/, /explain.*framework/, /how.*framework/],
    terms: ["pillars", "framework", "discovery", "conversion", "response", "operations", "intelligence", "growth"],
  },
  {
    intent: "view_portfolio",
    priority: 50,
    summary:
      "Pluto understood that you want to see demo blueprints and examples of friction-removal systems.",
    actionLabel: "View Demo Portfolio",
    href: "/#portfolio",
    phrasePatterns: [/show.*portfolio/, /view.*portfolio/, /see.*examples/, /demo.*blueprint/, /case stud/],
    terms: ["portfolio", "examples", "demos", "demo", "blueprints", "work", "cases"],
  },
];

export const plutoCommandExamples = [
  "Find where my revenue is leaking",
  "Show me a sample audit",
  "Calculate opportunity from missed leads",
  "Start onboarding for my project",
  "Explain the seven friction pillars",
  "Show portfolio examples",
] as const;

export function parsePlutoCommand(input: string): ParsedPlutoCommand {
  const normalized = normalizeCommand(input);

  if (!normalized) return unknownCommand([]);

  const candidates = commandRules
    .map((rule) => {
      const phraseMatches = rule.phrasePatterns.filter((pattern) =>
        pattern.test(normalized),
      ).length;
      const matchedTerms = rule.terms.filter((term) => hasTerm(normalized, term));
      const score = phraseMatches * 3 + matchedTerms.length;

      return { rule, score, matchedTerms };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || b.rule.priority - a.rule.priority);

  const best = candidates[0];

  if (!best || best.score < 2) {
    const matchedTerms = candidates.flatMap((candidate) => candidate.matchedTerms);
    return unknownCommand([...new Set(matchedTerms)]);
  }

  return {
    intent: best.rule.intent,
    confidence: Math.min(0.98, 0.58 + best.score * 0.08),
    summary: best.rule.summary,
    actionLabel: best.rule.actionLabel,
    href: best.rule.href,
    matchedTerms: best.matchedTerms,
  };
}

function normalizeCommand(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasTerm(normalized: string, term: string) {
  return new RegExp(`(^|\\s)${escapeRegExp(term)}(\\s|$)`).test(normalized);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unknownCommand(matchedTerms: string[]): ParsedPlutoCommand {
  return {
    intent: "unknown",
    confidence: matchedTerms.length > 0 ? 0.35 : 0,
    summary:
      "Pluto could not confidently map that command yet. Try asking for an audit, sample audit, calculator, onboarding, friction pillars, or portfolio examples.",
    actionLabel: "Try a Suggested Command",
    href: null,
    matchedTerms,
  };
}
