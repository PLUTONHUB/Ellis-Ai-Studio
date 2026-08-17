/**
 * A complete, realistic AI Opportunity Audit result.
 *
 * This is the fixture the results experience is designed and built against
 * while the analysis engine is being developed. It is deliberately a whole
 * report rather than a handful of sample cards: every state the interface can
 * reach — a pillar with no opportunity in it, a Future-tier finding, an
 * `unknown` evidence class — is represented here, so those paths are designed
 * rather than discovered later in production.
 *
 * Replacing this with real data means producing the same `AuditReport` shape.
 * No component reads anything else.
 *
 * Editorial rules the copy follows, because they are product requirements and
 * not writing preferences:
 *  - Nothing claims to know what happens inside the business.
 *  - Friction is always phrased as possibility ("may", "appears to").
 *  - Benefits are directional. There are no invented percentages or dollars.
 */

import { calculatePriority, classifyPriority } from "~/lib/audit-scoring";
import type { AuditReport, Opportunity, OpportunityScores } from "~/types/audit";

/**
 * Builds an opportunity with `priority` and `tier` derived rather than typed
 * by hand, so the printed number always matches the published weighting.
 */
function opportunity(
  input: Omit<Opportunity, "priority" | "tier"> & { scores: OpportunityScores },
): Opportunity {
  const priority = calculatePriority(input.scores);
  return { ...input, priority, tier: classifyPriority(priority) };
}

const opportunities: readonly Opportunity[] = [
  opportunity({
    id: "lead-response",
    name: "Lead Response Automation",
    pillar: "lead-management",
    type: "Lead Response",
    scores: { impact: 95, confidence: 88, fit: 95, implementationEase: 80 },
    evidence: ["observed", "inferred"],
    confidence: "high",
    observed: [
      { evidence: "observed", statement: "A contact form is published on the site and submits to a generic enquiry endpoint.", source: "Contact page" },
      { evidence: "observed", statement: "A phone number is listed as the primary way to reach the business.", source: "Site header, footer" },
      { evidence: "observed", statement: "No automated acknowledgement is described anywhere in the enquiry flow.", source: "Contact page" },
      { evidence: "inferred", statement: "Form submissions likely arrive in a shared inbox for someone to read and answer.", source: "Absence of any stated response process" },
    ],
    friction: "Enquiries may wait until someone is free to review the inbox, which can mean evenings, weekends and busy job days go uncovered.",
    whyItMatters:
      "In home services the first business to reply is frequently the one that gets the job. Slower replies can increase administrative chasing and may reduce the share of enquiries that convert.",
    proposedSystem: [
      { label: "Contact Form" },
      { label: "AI Qualification", emphasis: true },
      { label: "CRM" },
      { label: "Immediate Response" },
      { label: "Team Notification" },
      { label: "Follow-Up" },
    ],
    benefits: ["Every enquiry answered immediately, at any hour", "Less manual chasing and inbox triage", "Consistent handling regardless of who is on shift"],
    discoveryQuestion: "How are new website enquiries currently handled after submission, and who picks them up out of hours?",
  }),

  opportunity({
    id: "smart-intake",
    name: "Smart Intake & Lead Qualification",
    pillar: "conversion",
    type: "Lead Intake Automation",
    scores: { impact: 90, confidence: 84, fit: 92, implementationEase: 76 },
    evidence: ["observed", "inferred"],
    confidence: "high",
    observed: [
      { evidence: "observed", statement: "The contact form collects name, email, phone and a free-text message.", source: "Contact page" },
      { evidence: "observed", statement: "Six distinct services are listed, each with different qualifying information.", source: "Services pages" },
      { evidence: "inferred", statement: "Job type, property details and urgency are probably established later, by phone.", source: "Form fields vs. services offered" },
    ],
    friction:
      "A single free-text field means most enquiries likely arrive incomplete, and the qualifying conversation may have to happen before anything can be scheduled or quoted.",
    whyItMatters:
      "Incomplete enquiries create a round trip before work can start. Structured intake can let an estimator arrive at the first call already knowing the job type, roof age and urgency.",
    proposedSystem: [
      { label: "Service-Aware Form" },
      { label: "Conditional Questions" },
      { label: "AI Summary", emphasis: true },
      { label: "Scored Lead" },
      { label: "CRM" },
    ],
    benefits: ["Enquiries arrive complete and comparable", "Urgent work identifiable on arrival", "Less back-and-forth before an estimate"],
    discoveryQuestion: "What do you need to know about a job before you can quote it, and how do you find that out today?",
  }),

  opportunity({
    id: "review-generation",
    name: "Review Generation",
    pillar: "growth",
    type: "Review Generation",
    scores: { impact: 78, confidence: 80, fit: 88, implementationEase: 84 },
    evidence: ["observed", "inferred"],
    confidence: "high",
    observed: [
      { evidence: "observed", statement: "A Google Business Profile is active with a strong rating but a modest review count relative to years in business.", source: "Google Business Profile" },
      { evidence: "observed", statement: "Reviews arrive in irregular clusters rather than steadily.", source: "Google Business Profile" },
      { evidence: "inferred", statement: "Review requests are likely made informally, when someone remembers to ask.", source: "Clustered review timing" },
    ],
    friction: "Asking for reviews appears to depend on someone remembering at the end of a job, so completed work may not translate into visible reputation.",
    whyItMatters:
      "For local service businesses, review volume and recency influence both search visibility and the decision a homeowner makes when comparing three quotes.",
    proposedSystem: [
      { label: "Job Complete" },
      { label: "Timed Request" },
      { label: "Sentiment Check", emphasis: true },
      { label: "Review Link" },
      { label: "Internal Alert" },
    ],
    benefits: ["A steady stream of reviews rather than clusters", "Unhappy customers routed privately first", "No reliance on anyone remembering to ask"],
    discoveryQuestion: "When a job wraps up, who asks for the review — and does it happen every time?",
  }),

  opportunity({
    id: "crm-integration",
    name: "CRM & System Integration",
    pillar: "operations",
    type: "System Integration",
    scores: { impact: 78, confidence: 48, fit: 74, implementationEase: 50 },
    evidence: ["inferred", "unknown"],
    confidence: "low",
    observed: [
      { evidence: "observed", statement: "A third-party scheduling link and a separate quote request path both exist.", source: "Contact page, Services pages" },
      { evidence: "inferred", statement: "Customer records may be held in more than one place, with information re-entered between them.", source: "Two independent intake paths" },
      { evidence: "unknown", statement: "Which CRM, estimating or invoicing software the business runs internally cannot be established from public information." },
    ],
    friction: "If the intake paths write to different places, the same customer detail may be typed more than once and job history may be split across tools.",
    whyItMatters:
      "Duplicate entry is slow and quietly error-prone, and split history makes it hard to see what a customer is worth over time. This is the opportunity most likely to change shape once the internal stack is known.",
    proposedSystem: [
      { label: "All Intake Paths" },
      { label: "Single Record" },
      { label: "Two-Way Sync", emphasis: true },
      { label: "Scheduling" },
      { label: "Invoicing" },
    ],
    benefits: ["One customer record instead of several", "Less duplicate data entry", "Job history visible in one place"],
    discoveryQuestion: "Which systems hold customer information today, and where does the same detail get entered twice?",
  }),

  opportunity({
    id: "scheduling",
    name: "Scheduling & Estimate Booking",
    pillar: "customer-experience",
    type: "Scheduling Automation",
    scores: { impact: 70, confidence: 58, fit: 74, implementationEase: 62 },
    evidence: ["observed", "inferred"],
    confidence: "medium",
    observed: [
      { evidence: "observed", statement: "Estimates are requested through a form or a phone call; no self-service booking is offered.", source: "Contact page" },
      { evidence: "inferred", statement: "Estimate slots are likely arranged manually, by phone, during business hours.", source: "Absence of a booking tool" },
    ],
    friction: "A homeowner ready to book at 9pm has to wait, and arranging a slot may take several exchanges before it lands.",
    whyItMatters:
      "Self-service booking captures intent at the moment it exists. It also removes a scheduling conversation from the team's day, though crew routing may mean not every job type should be bookable.",
    proposedSystem: [
      { label: "Qualified Lead" },
      { label: "Eligible Slots" },
      { label: "Self-Booking" },
      { label: "Confirmation" },
      { label: "Reminders" },
    ],
    benefits: ["Estimates booked outside office hours", "Fewer scheduling phone calls", "Fewer missed appointments through reminders"],
    discoveryQuestion: "How do estimate appointments get scheduled today, and which job types would you never want booked without a human deciding?",
  }),

  opportunity({
    id: "faq-support",
    name: "FAQ & Customer Support Automation",
    pillar: "customer-experience",
    type: "FAQ Automation",
    scores: { impact: 62, confidence: 66, fit: 64, implementationEase: 78 },
    evidence: ["observed", "inferred"],
    confidence: "medium",
    observed: [
      { evidence: "observed", statement: "The site answers common questions about warranties, materials and insurance claims across several pages.", source: "Services, About pages" },
      { evidence: "inferred", statement: "The same questions are probably repeated to the team by phone before an enquiry is placed.", source: "Question depth on public pages" },
    ],
    friction: "Answers exist but are spread across the site, so people may call to ask what is already written down.",
    whyItMatters:
      "Answering repeat questions instantly frees the team for work only they can do, and gives a homeowner comparing contractors an answer before they leave the page.",
    proposedSystem: [
      { label: "Site Question" },
      { label: "Answer From Your Content", emphasis: true },
      { label: "Resolved or Escalated" },
      { label: "Logged Themes" },
    ],
    benefits: ["Instant answers to routine questions", "Fewer interruptions for the team", "Visibility into what customers actually ask"],
    discoveryQuestion: "What are the three questions your team answers most often before a job is even quoted?",
  }),

  opportunity({
    id: "executive-intelligence",
    name: "Executive Intelligence & Reporting",
    pillar: "intelligence",
    type: "Executive Intelligence",
    scores: { impact: 58, confidence: 26, fit: 52, implementationEase: 38 },
    evidence: ["inferred", "unknown"],
    confidence: "low",
    observed: [
      { evidence: "inferred", statement: "With intake spread across form, phone and profile, a single view of enquiry volume and source may not exist.", source: "Multiple independent intake paths" },
      { evidence: "unknown", statement: "What reporting the business already has, and what it already measures, cannot be established from public information." },
    ],
    friction: "Without one place where enquiries land, questions like which service earns the most or where leads come from may be hard to answer with confidence.",
    whyItMatters:
      "This is a genuine opportunity but a later one — reporting is only worth building once the systems above it are producing clean, consistent data. It is listed for sequencing, not for immediate action.",
    proposedSystem: [
      { label: "Connected Systems" },
      { label: "Shared Definitions" },
      { label: "Weekly Digest" },
      { label: "AI Commentary", emphasis: true },
    ],
    benefits: ["One view of enquiries, sources and outcomes", "Trends visible without manual compilation", "Decisions grounded in the business's own data"],
    discoveryQuestion: "What number would you most want to see every Monday morning that you cannot easily get today?",
  }),
];

export const auditFixture: AuditReport = {
  id: "evergreen-roofing-seattle",
  generatedAt: "2026-08-17T15:20:00.000Z",

  profile: {
    name: "Evergreen Roofing",
    location: "Seattle, WA",
    category: "Home Services",
    website: "evergreenroofing.com",
    summary:
      "A residential and light-commercial roofing contractor serving the greater Seattle area. The site presents six services, an established local footprint and an active Google Business Profile. Enquiries are handled through a contact form and a listed phone number.",
    services: ["Roof replacement", "Roof repair", "Storm & leak response", "Gutter installation", "Skylights", "Insurance claim support"],
    audience: "Homeowners and small commercial property owners in the Puget Sound region",
    digitalSurface: [
      { evidence: "observed", statement: "Marketing website with six service pages and a contact form", source: "Site crawl" },
      { evidence: "observed", statement: "Active Google Business Profile, strong rating, modest review volume", source: "Google Business Profile" },
      { evidence: "observed", statement: "Phone number published as the primary contact route", source: "Site header, footer" },
      { evidence: "inferred", statement: "A third-party scheduling link appears on one service page only", source: "Storm response page" },
      { evidence: "unknown", statement: "CRM, estimating and invoicing software used internally" },
    ],
    customerJourney: [
      { name: "Discover", detail: "Found through local search and the Google Business Profile.", evidence: "observed" },
      { name: "Evaluate", detail: "Reads service pages and compares against other local contractors.", evidence: "observed" },
      { name: "Enquire", detail: "Submits the contact form or calls the listed number.", evidence: "observed" },
      {
        name: "Response",
        detail: "Someone reviews the enquiry and replies.",
        evidence: "inferred",
        frictionNote: "No automated acknowledgement was observed, so this stage may depend on staff availability.",
      },
      {
        name: "Qualify",
        detail: "Job type, roof age and urgency established by phone.",
        evidence: "inferred",
        frictionNote: "The form collects a single free-text field, so qualifying detail likely arrives in conversation.",
      },
      {
        name: "Estimate",
        detail: "An on-site estimate is arranged.",
        evidence: "inferred",
        frictionNote: "No self-service booking was observed for most job types.",
      },
      { name: "Deliver", detail: "Work is scheduled and completed by the crew.", evidence: "unknown" },
      {
        name: "Follow-up",
        detail: "Reviews arrive irregularly after completed work.",
        evidence: "inferred",
        frictionNote: "Clustered review timing suggests requests are made ad hoc rather than as part of job close-out.",
      },
    ],
  },

  automationOpportunity: 82,
  maturity: "developing",
  headline:
    "Strong local demand signals meeting a mostly manual intake and follow-up process — the largest openings sit between an enquiry arriving and someone responding to it.",

  pillarSignals: [
    { pillar: "acquisition", opportunityCount: 0, opportunity: 24, note: "Local visibility looks healthy: an active profile, service pages and a consistent local footprint. No material opportunity detected from public information." },
    { pillar: "conversion", opportunityCount: 1, opportunity: 78, note: "A single free-text enquiry form serves six services with materially different qualifying needs." },
    { pillar: "lead-management", opportunityCount: 1, opportunity: 92, note: "No automated acknowledgement was observed on any enquiry path." },
    { pillar: "customer-experience", opportunityCount: 2, opportunity: 68, note: "Self-service booking is absent for most job types, and answers are spread across several pages." },
    { pillar: "operations", opportunityCount: 1, opportunity: 74, note: "Two independent intake paths suggest customer detail may be recorded more than once." },
    { pillar: "growth", opportunityCount: 1, opportunity: 80, note: "Review volume is modest relative to tenure, and arrives in clusters." },
    { pillar: "intelligence", opportunityCount: 1, opportunity: 71, note: "With intake spread across several routes, a single view of enquiry volume and source may not exist." },
  ],

  opportunities,

  roadmap: [
    {
      number: 1,
      name: "Capture & Respond",
      intent: "Make sure nothing arrives without being captured, qualified and answered.",
      opportunityIds: ["lead-response", "smart-intake"],
      items: ["Lead Intake", "Lead Qualification", "Instant Response"],
      horizon: "First",
    },
    {
      number: 2,
      name: "Manage & Convert",
      intent: "Give every enquiry one record, one owner and a follow-up that does not rely on memory.",
      opportunityIds: ["crm-integration", "scheduling", "faq-support"],
      items: ["CRM", "Follow-Up", "Scheduling"],
      horizon: "Next",
    },
    {
      number: 3,
      name: "Optimize & Learn",
      intent: "Turn a working system into one the business can read, measure and improve.",
      opportunityIds: ["review-generation", "executive-intelligence"],
      items: ["Review Automation", "Reporting", "AI Business Intelligence"],
      horizon: "Then",
    },
  ],

  architecture: {
    title: "What Ellis AI Studio would build",
    summary:
      "One intake path, one record, and a response that happens whether or not anyone is at a desk. Each layer only exists because an opportunity above called for it.",
    layers: [
      {
        name: "Capture",
        nodes: [
          { id: "website", label: "Website", kind: "source", detail: "Service-aware enquiry form" },
          { id: "phone", label: "Phone", kind: "source", detail: "Logged as a lead" },
          { id: "gbp", label: "Google Profile", kind: "source", detail: "Messages and calls" },
        ],
      },
      {
        name: "Qualify",
        nodes: [
          { id: "intake", label: "Smart Intake", kind: "system", detail: "Conditional questions by job type" },
          { id: "ai", label: "AI Qualification", kind: "ai", detail: "Summarises, scores, flags urgency" },
        ],
      },
      {
        name: "Record",
        nodes: [{ id: "crm", label: "CRM", kind: "store", detail: "One customer record, full history" }],
      },
      {
        name: "Respond",
        nodes: [
          { id: "customer", label: "Customer Response", kind: "output", detail: "Immediate, in your voice" },
          { id: "team", label: "Team Notification", kind: "output", detail: "Routed to whoever is on" },
          { id: "followup", label: "Follow-Up", kind: "output", detail: "Sequenced until answered" },
        ],
      },
      {
        name: "Learn",
        nodes: [
          { id: "reviews", label: "Review Requests", kind: "system", detail: "Triggered at job close-out" },
          { id: "reporting", label: "Reporting", kind: "output", detail: "Volume, source, outcome" },
        ],
      },
    ],
  },

  unknowns: [
    "Which CRM, estimating or invoicing software is used internally",
    "How enquiries are routed and who owns them after hours",
    "Actual response times, and whether any are already automated",
    "Existing reporting, and what the business already measures",
    "Crew capacity and scheduling constraints that would shape what is safe to automate",
  ],
};
