/**
 * What businesses can hire the studio to build.
 *
 * Capability copy carried over from the legacy systems page — it was accurate
 * and hard-won, so the reset keeps the substance and drops the presentation.
 */

export type Capability = {
  name: string;
  summary: string;
  includes: string[];
  outcome: string;
};

export const capabilities: Capability[] = [
  {
    name: "AI & intelligence systems",
    summary: "AI as one governed component inside a business process — not an uncontrolled replacement for judgment.",
    includes: ["AI assistants", "Document analysis", "Knowledge retrieval", "Summarisation", "Classification", "Structured data extraction", "Decision support"],
    outcome: "Interpretation and reasoning happen where they earn their place, with a human still in the loop where it matters.",
  },
  {
    name: "Workflow automation",
    summary: "The repetitive movement of information, handled by the system instead of a person.",
    includes: ["Data synchronisation", "Document creation", "Notifications", "Task creation", "Internal handoffs", "Scheduling workflows"],
    outcome: "People spend less time moving information and more time using it.",
  },
  {
    name: "Operational infrastructure",
    summary: "The connective layer that decides whether the rest of the business runs or stalls.",
    includes: ["Lead intake and routing", "CRM workflows", "Onboarding", "Follow-up sequences", "Pipeline organisation", "Reporting"],
    outcome: "Fewer opportunities depend on somebody remembering what happens next.",
  },
  {
    name: "Intelligent websites",
    summary: "A site that is part of the operating system rather than an isolated brochure.",
    includes: ["Web experiences", "Landing pages", "Lead capture", "Quote and intake forms", "Booking", "Customer portals", "Conversion paths"],
    outcome: "The front door feeds the business instead of collecting submissions nobody actions.",
  },
  {
    name: "Digital products",
    summary: "Custom software built around how the business actually needs to operate.",
    includes: ["Internal dashboards", "Custom interfaces", "API integrations", "Custom databases", "AI-enabled applications", "Specialised workflow systems"],
    outcome: "The business stops bending itself to fit a generic application.",
  },
];

/** How the studio works. Sequence matters here, so it is numbered. */
export const method: Array<{ phase: string; title: string; detail: string }> = [
  { phase: "Discover", title: "What is actually happening?", detail: "We map how work moves through the business today — where it starts, who touches it, which tools are involved, and what requires manual attention." },
  { phase: "Diagnose", title: "Find the constraint.", detail: "Delay, repetition, manual handoffs, follow-up risk, customer friction. We are looking for friction, not for places to force AI." },
  { phase: "Design", title: "Decide what the better process looks like.", detail: "What initiates it, what information it needs, which decisions stay human, which tools need to talk, and how it should behave when something fails." },
  { phase: "Build", title: "Connect the pieces.", detail: "Workflows, integrations, interfaces, databases, AI systems and custom infrastructure. The implementation follows the process, not the other way around." },
  { phase: "Validate", title: "Test outside the happy path.", detail: "Missing information, duplicate actions, failed connections, approval requirements, error conditions and security boundaries." },
  { phase: "Improve", title: "Systems evolve with the business.", detail: "Review what works, identify new friction, and strengthen the operating foundation as things change." },
];
