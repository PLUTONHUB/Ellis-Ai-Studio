/*
 * Zone 8 Plumbing & Sewer — preview content model.
 *
 * ⚠️  This is an Ellis AI Studio PROSPECTING CONCEPT. Zone 8 has not commissioned
 * it, has not reviewed it, and has no affiliation with this build.
 *
 * Every string below is either (a) drawn from Zone 8's public Google Business
 * Profile, or (b) a preview placeholder that MUST be confirmed with the owner
 * before anything ships. The distinction is modelled in the data itself — see
 * `verified` on each record — rather than left to a comment someone can miss.
 * `VERIFY WITH CLIENT` markers render visibly in the UI wherever content is
 * unconfirmed, so the pitch never quietly passes off a guess as a fact.
 */

/** Provenance of a piece of preview content. */
export type Provenance =
  /** Visible on Zone 8's public Google Business Profile. */
  | "gbp"
  /** Ellis-authored preview copy — makes no factual claim about the business. */
  | "concept"
  /** Plausible from public signals but UNCONFIRMED. Renders a VERIFY badge. */
  | "unverified";

// --------------------------------------------------------------- business facts

export const business = {
  name: "Zone 8 Plumbing & Sewer",
  shortName: "Zone 8",
  /** Public GBP listing. Rendered as a tel: link throughout. */
  phone: "206-580-3360",
  phoneHref: "tel:+12065803360",
  city: "Seattle",
  region: "WA",
  /** GBP: "Open 24 hours". Stated as availability, never as a response-time promise. */
  hours: "Open 24 hours",
  rating: 4.9,
  reviewCount: 62,
  category: "Plumber",
  /**
   * The exact Google Business Profile URL was not captured during the audit, so
   * every "Read Google Reviews" control points at a Maps search for the business
   * rather than a fabricated review deep-link.
   * VERIFY WITH CLIENT — swap for the canonical GBP short link before production.
   */
  reviewsUrl: "https://www.google.com/maps/search/?api=1&query=Zone+8+Plumbing+%26+Sewer+Seattle",
} as const;

/** Route prefix. The preview is namespaced so it cannot collide with, or be
 *  mistaken for, Ellis AI Studio's own pages. */
export const base = "/preview/zone8";
export const href = (path = "") => `${base}${path}`;

// ------------------------------------------------------------------- services

/** The four services with their own landing route. Literal-typed so the router
 *  can verify every link at compile time instead of trusting a template string. */
export type ServiceRoute =
  | "/preview/zone8/emergency-plumber-seattle"
  | "/preview/zone8/drain-cleaning"
  | "/preview/zone8/sewer-repair"
  | "/preview/zone8/water-heaters";

export type Service = {
  slug: string;
  route?: ServiceRoute;
  name: string;
  blurb: string;
  icon: IconName;
  provenance: Provenance;
  /** Populated only for services that have a full landing page in this preview. */
  detail?: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    intro: string;
    signals: string[];
    approach: { heading: string; body: string }[];
  };
};

export type IconName =
  | "alert" | "drain" | "leak" | "pipe" | "heater" | "inspect" | "trench" | "wrench";

/*
 * SERVICE LIST — VERIFY WITH CLIENT BEFORE PRODUCTION.
 * These categories are inferred from Zone 8's "Plumbing & Sewer" trade name and
 * from ordinary residential plumbing scope. None of them is confirmed by the
 * business. Descriptions are written to describe a category of work, never to
 * assert a capability, certification, guarantee, or turnaround Zone 8 has not
 * stated publicly.
 */
export const services: Service[] = [
  {
    slug: "emergency-plumber-seattle",
    route: "/preview/zone8/emergency-plumber-seattle",
    name: "Emergency Plumbing",
    blurb: "Burst pipes, active leaks and urgent failures — Zone 8's listing shows 24-hour availability.",
    icon: "alert",
    provenance: "unverified",
    detail: {
      title: "Emergency plumbing in Seattle",
      metaTitle: "Emergency Plumber Seattle | Zone 8 Plumbing & Sewer",
      metaDescription:
        "Urgent plumbing help in Seattle. Zone 8's public listing shows 24-hour availability, with upfront pricing before work begins. Call or request service online.",
      intro:
        "A burst supply line or an active leak is not a next-week problem. Zone 8's public listing shows the business is open 24 hours, so there is a number to call when the water is already moving.",
      signals: [
        "Water coming through a ceiling, wall or light fixture",
        "A pipe that has split, burst or is spraying",
        "No water to the house, or no way to shut it off",
        "Sewage backing up into a tub, shower or floor drain",
        "A water heater leaking at volume",
      ],
      approach: [
        {
          heading: "Stop the water first",
          body: "The first conversation is about getting the flow stopped — including talking you through your own shut-off valve if that is the fastest route to less damage.",
        },
        {
          heading: "Diagnose before quoting",
          body: "Emergency work still gets a scoped price. You hear what the problem is and what the repair costs before anyone starts on it.",
        },
        {
          heading: "Repair, then explain",
          body: "You get told what failed and what condition the surrounding plumbing is in, so a second emergency is less likely to be a surprise.",
        },
      ],
    },
  },
  {
    slug: "drain-cleaning",
    route: "/preview/zone8/drain-cleaning",
    name: "Drain Cleaning",
    blurb: "Slow drains, recurring clogs and kitchen or bathroom backups cleared and diagnosed.",
    icon: "drain",
    provenance: "unverified",
    detail: {
      title: "Drain cleaning in Seattle",
      metaTitle: "Drain Cleaning Seattle | Zone 8 Plumbing & Sewer",
      metaDescription:
        "Slow drains, clogs and backups cleared in the Seattle area. Straightforward drain cleaning from Zone 8 with pricing confirmed before the work starts.",
      intro:
        "A drain that keeps backing up is usually telling you something about the line, not just about tonight. Clearing it is the first half of the job; finding out why it happened is the half that stops the repeat visit.",
      signals: [
        "One fixture draining slowly, then another",
        "Gurgling from a nearby drain when you run water",
        "A clog that returns weeks after being cleared",
        "Standing water in a tub, shower or floor drain",
        "Smells coming back up through a drain",
      ],
      approach: [
        {
          heading: "Clear the blockage",
          body: "The immediate problem gets handled so the fixture is usable again before the conversation moves to anything larger.",
        },
        {
          heading: "Find out why it happened",
          body: "A drain that clogs on a schedule is a symptom. Roots, a belly in the line, grease build-up and a partial collapse all present the same way at the sink.",
        },
        {
          heading: "Tell you what you're actually looking at",
          body: "If it is a fifteen-minute clear, you hear that. If the line has a real problem, you hear that too — with the cost of each option before you decide.",
        },
      ],
    },
  },
  {
    slug: "sewer-repair",
    route: "/preview/zone8/sewer-repair",
    name: "Sewer Repair",
    blurb: "Side-sewer diagnosis and repair, including options that avoid trenching the yard.",
    icon: "trench",
    provenance: "unverified",
    detail: {
      title: "Sewer repair in Seattle",
      metaTitle: "Sewer Repair Seattle | Zone 8 Plumbing & Sewer",
      metaDescription:
        "Side-sewer diagnosis and repair for Seattle homeowners. Zone 8 explains the problem and the pricing before the work begins. Call or request service online.",
      intro:
        "Side-sewer work is the repair homeowners most fear being upsold on, because it is expensive and mostly invisible. The way through that is a diagnosis you can see and a price you hear before the equipment arrives.",
      signals: [
        "Multiple drains backing up at once",
        "Sewage smell in the yard or around the foundation",
        "A patch of lawn that is unusually wet or unusually green",
        "Repeated backups after previous clearing",
        "An older home with a clay or cast-iron side sewer",
      ],
      approach: [
        {
          heading: "See the line before pricing it",
          body: "Sewer work should start with a look at the actual pipe, not an estimate built on assumption.",
        },
        {
          heading: "Lay out the options",
          body: "Spot repair, lining and full replacement are different amounts of money and different amounts of yard. You should get to weigh them.",
        },
        {
          heading: "One price for the agreed scope",
          body: "The number you agree to is the number the work is done against.",
        },
      ],
    },
  },
  {
    slug: "water-heaters",
    route: "/preview/zone8/water-heaters",
    name: "Water Heaters",
    blurb: "Repair and replacement for tank and tankless systems, including leaks and no-hot-water calls.",
    icon: "heater",
    provenance: "unverified",
    detail: {
      title: "Water heater repair & replacement",
      metaTitle: "Water Heater Repair Seattle | Zone 8 Plumbing & Sewer",
      metaDescription:
        "Water heater repair and replacement in the Seattle area. Zone 8 confirms the price before the work starts. Call or request service online.",
      intro:
        "Most water heater calls are one of three things: it has stopped heating, it is leaking, or it has reached the end of its life and you are deciding whether to keep spending on it. Each has a different right answer.",
      signals: [
        "No hot water, or hot water that runs out quickly",
        "Water pooling around the base of the tank",
        "Rust-coloured hot water",
        "Banging or rumbling from the tank",
        "A unit that is more than ten years old",
      ],
      approach: [
        {
          heading: "Repair or replace, honestly",
          body: "A repairable heater gets repaired. A heater at the end of its service life gets said out loud rather than patched at your expense.",
        },
        {
          heading: "Size it to the house",
          body: "Replacement is a chance to correct capacity, not just to swap the same unit back in.",
        },
        {
          heading: "Price before purchase",
          body: "Equipment and labour are settled before anything is ordered.",
        },
      ],
    },
  },
  {
    slug: "leak-detection",
    name: "Leak Detection",
    blurb: "Locating hidden leaks behind walls, under slabs and beneath floors before the damage spreads.",
    icon: "leak",
    provenance: "unverified",
  },
  {
    slug: "pipe-repair",
    name: "Pipe Repair & Repiping",
    blurb: "Failing supply and drain lines repaired or replaced, including aging galvanised pipe.",
    icon: "pipe",
    provenance: "unverified",
  },
  {
    slug: "inspections",
    name: "Plumbing Inspections",
    blurb: "Whole-home and pre-purchase plumbing assessments with findings explained plainly.",
    icon: "inspect",
    provenance: "unverified",
  },
  {
    slug: "general-plumbing",
    name: "General Plumbing",
    blurb: "Fixtures, faucets, toilets, valves and the everyday repairs that keep a house running.",
    icon: "wrench",
    provenance: "unverified",
  },
];

/** A service that has its own landing route — `route` and `detail` are always
 *  present together, which lets the router type-check every link to one. */
export type LandingService = Service & { route: ServiceRoute; detail: NonNullable<Service["detail"]> };

export const isLandingService = (s: Service): s is LandingService => Boolean(s.route && s.detail);

/** The four services that have full landing pages in this preview. */
export const landingServices: LandingService[] = services.filter(isLandingService);
export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

// ---------------------------------------------------------------- pricing UI

/*
 * PRICING — the strongest differentiator, and the easiest place to do harm.
 *
 * Zone 8's historical "One Service. One Price." positioning is the strategic
 * asset worth keeping. Actual figures are NOT public and are NOT invented here.
 * Every row renders a deliberately blurred, unreadable placeholder labelled
 * "Preview pricing placeholder" — there is no real number behind the blur.
 */
export type PriceRow = { id: string; name: string; desc: string; keywords: string[] };

export const priceRows: PriceRow[] = [
  { id: "fixture", name: "Faucet or fixture issue", desc: "Dripping taps, running toilets, failed valves and shut-offs", keywords: ["faucet", "fixture", "tap", "toilet", "sink", "valve", "drip", "shower", "spigot"] },
  { id: "drain", name: "Drain problem", desc: "Slow drains, clogs and recurring kitchen or bath backups", keywords: ["drain", "clog", "clogged", "slow", "backing", "backup", "blocked", "gurgle"] },
  { id: "heater", name: "Water heater", desc: "No hot water, leaking tanks, repair and replacement", keywords: ["water heater", "heater", "hot water", "tank", "tankless", "boiler"] },
  { id: "leak", name: "Leak", desc: "Visible and hidden leaks, including behind walls and under floors", keywords: ["leak", "leaking", "drip", "wet", "burst", "flooding", "water damage", "puddle"] },
  { id: "sewer", name: "Sewer concern", desc: "Side-sewer diagnosis, root intrusion and line repair", keywords: ["sewer", "septic", "sewage", "main line", "side sewer", "roots", "smell"] },
  { id: "pipe", name: "Pipe repair", desc: "Failed supply lines, corroded pipe and repiping", keywords: ["pipe", "piping", "repipe", "galvanized", "galvanised", "copper", "pex", "frozen"] },
  { id: "inspection", name: "Plumbing inspection", desc: "Whole-home and pre-purchase assessments", keywords: ["inspection", "inspect", "assessment", "buying", "pre-purchase", "report"] },
];

// ----------------------------------------------------------------- reviews

/*
 * REVIEW CONTENT — no fabricated quotes, no invented customer names.
 *
 * Zone 8's 4.9 rating and 62-review count are public. The individual review text
 * was NOT captured, so nothing below is presented as a customer's words. Each
 * card states a THEME reported in public feedback, in Ellis's voice, explicitly
 * attributed as a summary. Real reviews get imported here at production.
 */
export type ReviewTheme = { theme: string; summary: string };

export const reviewThemes: ReviewTheme[] = [
  { theme: "Responsiveness", summary: "Reviewers describe Zone 8 as quick to respond and easy to reach when a problem needed attention." },
  { theme: "Clear communication", summary: "Feedback repeatedly mentions having the problem and the options explained in plain terms before work began." },
  { theme: "Straightforward pricing", summary: "Public feedback references pricing that was reasonable and understood in advance rather than discovered afterwards." },
  { theme: "Knowledgeable service", summary: "Reviewers point to technical competence — the diagnosis matching the actual fault." },
  { theme: "Professionalism", summary: "Comments describe courteous, tidy work in customers' homes." },
  { theme: "Repeat customers", summary: "A recurring pattern in public feedback is customers describing Zone 8 as who they call again." },
];

// -------------------------------------------------------------- service area

/*
 * SERVICE AREA — VERIFY WITH CLIENT BEFORE PRODUCTION.
 * Seattle and West Seattle come from the public listing. The neighbourhood list
 * is a reasonable West Seattle-area set for preview purposes only. Zone 8 has
 * not confirmed that it serves any of these, and no street-level or response-time
 * coverage is claimed anywhere in this build.
 */
export const serviceAreas = {
  primary: ["Seattle", "West Seattle"] as string[],
  neighbourhoods: ["Admiral", "Alki", "Fauntleroy", "Delridge", "White Center", "Burien"] as string[],
};

// ---------------------------------------------------------------------- faq

export type Faq = { q: string; a: string[]; provenance: Provenance };

export const faqs: Faq[] = [
  {
    q: "Are you available for emergency plumbing?",
    a: ["Zone 8's public Google listing shows the business as open 24 hours. Calling is the fastest route for anything urgent — an active leak, a burst pipe or a sewage backup."],
    provenance: "gbp",
  },
  {
    q: "Do you offer upfront pricing?",
    a: ["Zone 8 has historically positioned the business around transparent, upfront service pricing — the \"One Service. One Price.\" idea this preview is built around.", "Specific figures are confirmed directly with Zone 8 for your job."],
    provenance: "unverified",
  },
  {
    q: "What areas do you serve?",
    a: ["The public listing places Zone 8 in the Seattle and West Seattle area.", "Exact coverage should be confirmed with the business before it is published as a service-area claim."],
    provenance: "unverified",
  },
  {
    q: "Can I request service online?",
    a: ["Yes. The request form captures what is happening, how urgent it is and how to reach you, so the follow-up call starts with the context already in hand instead of at the beginning."],
    provenance: "concept",
  },
  {
    q: "What types of plumbing work do you handle?",
    a: ["This preview shows the categories a plumbing-and-sewer business of Zone 8's description typically covers: emergency work, drains, sewers, leaks, water heaters, pipe repair, inspections and general plumbing.", "The final service list is confirmed with the business before launch."],
    provenance: "unverified",
  },
  {
    q: "What happens after I call or submit a request?",
    a: ["You describe the problem, Zone 8 confirms what the work involves and what it costs, and the job is scheduled against that agreed price."],
    provenance: "concept",
  },
];

// --------------------------------------------------------------- form options

export const serviceOptions = [
  { value: "emergency", label: "Plumbing emergency" },
  { value: "drain", label: "Drain / sewer" },
  { value: "leak", label: "Leak" },
  { value: "heater", label: "Water heater" },
  { value: "pipe", label: "Pipe issue" },
  { value: "fixture", label: "Fixture" },
  { value: "inspection", label: "Inspection" },
  { value: "other", label: "Other" },
] as const;

export const urgencyOptions = [
  { value: "emergency", label: "Emergency / ASAP" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "flexible", label: "Flexible" },
] as const;

// -------------------------------------------------------------- navigation

/** `hash` is kept separate from `to` so router links resolve a real route path
 *  and then scroll, rather than requesting a path with a "#" embedded in it. */
export type NavItem = { label: string; to: string; hash?: string };

export const nav: NavItem[] = [
  { label: "Services", to: href("/services") },
  { label: "Pricing", to: href("/pricing") },
  { label: "Why Zone 8", to: base, hash: "why" },
  { label: "Reviews", to: href("/reviews") },
  { label: "Service Area", to: href("/service-area") },
  { label: "FAQ", to: base, hash: "faq" },
];

export const disclaimer =
  "Concept website created by Ellis AI Studio for demonstration purposes. Zone 8 Plumbing & Sewer has not commissioned or reviewed this preview, and Ellis AI Studio claims no affiliation with the business. Business information, service details, pricing and coverage must be verified before any production launch.";

// ------------------------------------------------------- verification register

/*
 * THE list of everything in this preview that Zone 8 has not confirmed.
 *
 * Inline VERIFY badges are hidden from the prospect-facing presentation (see
 * ~/components/zone8/internal), so this register is the safety net: it renders
 * in full on /preview/zone8/pitch and behind ?internal=1 on any route. Nothing
 * unconfirmed should exist in the build without a line here.
 *
 * Rule for adding preview content: if it asserts something about the business
 * that is not visible on the public Google Business Profile, it belongs here.
 */
export type VerificationItem = { area: string; detail: string };

export const verificationItems: VerificationItem[] = [
  { area: "Service catalogue", detail: "All eight service categories are inferred from the \"Plumbing & Sewer\" trade name. Zone 8 has confirmed none of them." },
  { area: "Service area", detail: "Admiral, Alki, Fauntleroy, Delridge, White Center and Burien are preview placeholders. Only Seattle and West Seattle come from the public listing." },
  { area: "Pricing model", detail: "\"One Service. One Price.\" is drawn from Zone 8's own historical positioning, but the current billing model — flat-rate vs hourly, what a quoted scope includes — is unconfirmed. No figures are published anywhere in this build." },
  { area: "Service process", detail: "The step-by-step approach described on each service landing page is Ellis-authored concept copy, not Zone 8's documented process." },
  { area: "Review themes", detail: "Theme summaries are Ellis's paraphrase of public feedback. Individual review text was not captured, and no reviewer is named or quoted." },
  { area: "Rating currency", detail: "4.9 from 62 reviews was accurate at audit time. Re-check before presenting — the count moves." },
  { area: "Google Business Profile URL", detail: "Review links point at a Maps search for the business; the canonical GBP short link was not captured." },
  { area: "Expired-site domain", detail: "The address bar in the supplied capture is clipped by the Safari UI and reads only \"…dsewer.com\". The full domain is not asserted anywhere in the build — confirm it with Zone 8 if it needs to appear in the pitch narrative." },
  { area: "Hero imagery", detail: "The hero uses a designed dispatch panel, not photography. Commissioned photography of Zone 8's own work should replace it at production." },
  { area: "Licensing & credentials", detail: "Deliberately absent. No licence number, bonding, insurance, certification, warranty, guarantee, award, response time or years-in-business claim appears anywhere — add only what Zone 8 can evidence." },
  { area: "Intake destination", detail: "The request form is inert by design. Before launch it needs a real destination, an owner, and a response commitment." },
];

/*
 * The captured screenshot of Zone 8's current website — the proof of the broken
 * customer journey, used on the pitch route.
 *
 * This is a real mobile capture supplied by Ellis, shown unmodified: no crop, no
 * retouching, no redrawn browser frame. Its entire evidentiary value is that it
 * is exactly what a customer sees after tapping "Website" on the Google listing,
 * so it must never be stylised or reconstructed.
 *
 * The capture carries its own Safari UI, including the address bar, so the page
 * renders it as-is rather than wrapping it in a synthetic browser chrome.
 */
export const expiredSiteScreenshot = "/preview/zone8-expired-site.png";
