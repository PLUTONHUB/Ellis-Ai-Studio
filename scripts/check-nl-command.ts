import { parsePlutoCommand, type PlutoCommandIntent } from "../src/lib/pluto/nl-command";

const cases: Array<{ input: string; intent: PlutoCommandIntent; href: string | null }> = [
  {
    input: "Find where my revenue is leaking",
    intent: "request_friction_audit",
    href: "/#contact",
  },
  {
    input: "Show me a sample audit",
    intent: "view_sample_audit",
    href: "/#audit-preview",
  },
  {
    input: "Calculate opportunity from missed leads",
    intent: "calculate_opportunity",
    href: "/proposal",
  },
  {
    input: "Start onboarding for my project",
    intent: "start_onboarding",
    href: "/onboarding",
  },
  {
    input: "Explain the seven friction pillars",
    intent: "explain_friction_pillars",
    href: "/#pillars",
  },
  {
    input: "Show portfolio examples",
    intent: "view_portfolio",
    href: "/#portfolio",
  },
  {
    input: "Make me a sandwich",
    intent: "unknown",
    href: null,
  },
];

for (const testCase of cases) {
  const parsed = parsePlutoCommand(testCase.input);

  if (parsed.intent !== testCase.intent || parsed.href !== testCase.href) {
    console.error("NL command check failed", {
      input: testCase.input,
      expected: { intent: testCase.intent, href: testCase.href },
      received: parsed,
    });
    process.exit(1);
  }
}

console.log(`NL command checks passed (${cases.length} cases).`);
