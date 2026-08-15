/**
 * The Ellis AI Studio operating model.
 *
 * Ellis AI Studio is an AI systems and business-operations company: we
 * identify friction inside a business, then design and implement the
 * practical systems — AI, automation, websites, integrations, structured
 * workflows — that remove it. Tools are implementation components; the
 * product is a better business system.
 */

/** Recognisable operational friction — the problem section on the homepage. */
export type Problem = { title: string; detail: string };

export const problems: Problem[] = [
  { title: "Leads slipping through", detail: "Inquiries sit in an inbox until someone has time, and some never get a reply at all." },
  { title: "Slow follow-up", detail: "By the time a person circles back, the prospect has already booked with whoever answered first." },
  { title: "Repetitive data entry", detail: "The same information gets typed into three different systems by three different people." },
  { title: "Disconnected applications", detail: "The CRM doesn't talk to the scheduler, and the scheduler doesn't talk to the invoicing tool." },
  { title: "Manual intake", detail: "A new client fills out a form, then someone re-enters everything by hand on the other side." },
  { title: "The owner as bottleneck", detail: "Every approval, exception and judgment call routes through one person's inbox." },
  { title: "Reporting without insight", detail: "Dashboards exist, but nobody's sure what to actually do with what they show." },
  { title: "Scheduling and onboarding by memory", detail: "What happens next depends on somebody remembering it should happen at all." },
];

/**
 * Capability families, organised around business outcomes rather than a
 * service menu. Each group answers a different question a growing business
 * is asking.
 */
export type SystemGroup = { key: string; name: string; summary: string; items: string[] };

export const systemGroups: SystemGroup[] = [
  {
    key: "acquire",
    name: "Acquire",
    summary: "Get the right opportunities into the business.",
    items: ["Lead capture & intake systems", "Conversion-focused websites", "Website redesigns", "Foundational SEO / GEO", "Booking & scheduling"],
  },
  {
    key: "operate",
    name: "Operate",
    summary: "Move information without a person carrying it by hand.",
    items: ["Workflow automation", "n8n orchestration", "API integrations", "CRM operations", "Data integration", "Custom systems"],
  },
  {
    key: "understand",
    name: "Understand",
    summary: "Turn what's happening into a decision worth acting on.",
    items: ["AI-enabled business workflows", "AI consulting", "Assessments & recommendations", "Operational reporting", "Monitoring"],
  },
  {
    key: "retain",
    name: "Retain & Grow",
    summary: "Keep the customers you already earned.",
    items: ["Follow-up systems", "Onboarding systems", "Review management", "Optimization", "Maintenance"],
  },
];

/**
 * The diagnose-first method: ten steps, grouped into three stages so the
 * sequence reads as a rail rather than ten identical cards.
 */
export type MethodStep = { n: string; title: string; detail: string };
export type MethodStage = { stage: string; description: string; steps: MethodStep[] };

export const method: MethodStage[] = [
  {
    stage: "Understand",
    description: "We understand before we automate.",
    steps: [
      { n: "01", title: "Assess", detail: "What's actually happening in the business today — the process, the people, the tools involved." },
      { n: "02", title: "Research", detail: "How the constraint shows up elsewhere — in the industry, in comparable systems, in what's already been tried." },
      { n: "03", title: "Map", detail: "The current process laid out step by step: what happens, who touches it, where it breaks down." },
      { n: "04", title: "Prioritize", detail: "The friction ranked by impact and effort, so what gets solved first is what's actually worth solving first." },
    ],
  },
  {
    stage: "Build",
    description: "Then we build, connected to what already exists.",
    steps: [
      { n: "05", title: "Build", detail: "The system itself — workflows, integrations, interfaces, AI components, custom infrastructure." },
      { n: "06", title: "Integrate", detail: "Connected to the tools and data the business already runs on, instead of asking it to change its habits." },
      { n: "07", title: "Train", detail: "The people who'll use it get comfortable with it; the AI components get set up with the judgment calls that matter." },
    ],
  },
  {
    stage: "Run",
    description: "And keep it accountable once it's live.",
    steps: [
      { n: "08", title: "Optimize", detail: "Tightened against real use once it's running, not against assumptions." },
      { n: "09", title: "Monitor", detail: "Watched in production — what's working, what's quietly failing, what needs attention." },
      { n: "10", title: "Scale", detail: "Extended to the rest of the business, or to the next constraint in line." },
    ],
  },
];

/** Capture → Think → Organize → Create → Automate → Deliver — how information moves through an Ellis system. */
export type FlowStep = { title: string; detail: string };

export const operatingFlow: FlowStep[] = [
  { title: "Capture", detail: "Information enters from wherever it originates — a form, a call, an inbox, a document." },
  { title: "Think", detail: "The system interprets what came in: what it means, what it requires, what happens next." },
  { title: "Organize", detail: "Structured information finds its place — the right record, the right pipeline, the right person." },
  { title: "Create", detail: "What the moment calls for gets produced — a response, a document, a task, a recommendation." },
  { title: "Automate", detail: "Repeatable steps run without waiting on a person, with review built in where judgment still matters." },
  { title: "Deliver", detail: "The result reaches whoever needs it — a customer, a teammate, a decision-maker — on time." },
];

/**
 * Proof of real, disclosed work. No client results, testimonials or metrics
 * are included here unless verified — `pending: true` renders as an
 * honest "in development" status rather than a claim.
 */
export type ProofEntry = { name: string; tag: string; description: string; pending: boolean };

export const proof: ProofEntry[] = [
  {
    name: "Pluton",
    tag: "Internal system",
    description: "A structured business-intake and diagnostic-intelligence system. It collects company information, analyzes operational friction, and supports the recommendations behind every Business Bottleneck Audit.",
    pending: false,
  },
  {
    name: "Recon",
    tag: "In development",
    description: "A Shopify commerce-intelligence application. It analyzes store, order and inventory data to surface stockout risk, dead inventory, discount and refund leakage, and basket opportunities. Detector logic has working internal QA; it isn't a public product yet.",
    pending: true,
  },
  {
    name: "Ellis AI Studio infrastructure",
    tag: "Internal infrastructure",
    description: "The same intake, review and automation pipeline that runs this site — from audit submission through to a reviewed recommendation.",
    pending: false,
  },
];

/** The five principles behind how Ellis AI Studio operates. */
export type Principle = { title: string; detail: string };

export const principles: Principle[] = [
  { title: "Diagnose before building", detail: "Technology follows the problem, not the other way around." },
  { title: "Human-reviewed AI", detail: "Important client-facing AI output gets a person's review before it reaches a client." },
  { title: "One system at a time", detail: "Solve, test, stabilize — then move to the next constraint." },
  { title: "Built around the existing business", detail: "We integrate with what's already working rather than forcing a replacement." },
  { title: "Outcomes over tools", detail: "Value is measured in time, cost, reliability and growth — not in software installed." },
];
