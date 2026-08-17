/**
 * The AI Opportunity Audit domain model.
 *
 * This is the contract between the analysis engine and the entire results
 * experience. Nothing in the UI reads an untyped bag of data: every component
 * under ~/components/audit consumes one of these shapes, so when a real
 * analysis backend replaces the fixture in ~/data/audit-fixture the interface
 * does not need redesigning — only the source of the object changes.
 *
 * Two rules are encoded here rather than left to convention:
 *
 *  1. Every material finding carries an `evidence` class. There is no way to
 *     state a finding without declaring how well it is supported.
 *  2. The headline number is `automationOpportunity` — how much apparent room
 *     to improve exists, NOT how well the business is performing. `maturity`
 *     is the separate axis that describes where its systems stand today.
 */

/* ------------------------------------------------------------------ pillars
 * The seven permanent business pillars. This list is the spine of the Ellis
 * methodology: opportunities, pillar signals and roadmap phases all key off
 * it, so it is a closed union rather than a free string.
 */

export type PillarId =
  | "acquisition"
  | "conversion"
  | "lead-management"
  | "customer-experience"
  | "operations"
  | "growth"
  | "intelligence";

export type Pillar = {
  id: PillarId;
  /** Display name, e.g. "Lead Management". */
  name: string;
  /** One line explaining what this pillar covers, in business language. */
  summary: string;
};

/** Per-pillar read-out on a single audited business. */
export type PillarSignal = {
  pillar: PillarId;
  /** How many opportunities were detected inside this pillar. */
  opportunityCount: number;
  /**
   * Apparent room to improve within the pillar, 0-100, on the same polarity
   * as the headline score: higher means more opportunity, not better health.
   */
  opportunity: number;
  /** Short, evidence-grounded note on what drove the reading. */
  note: string;
};

/* ----------------------------------------------------------------- evidence
 * The evidence class is a first-class part of every finding. The UI renders
 * `inferred` and `unknown` with deliberately different, weaker treatments so
 * an inference can never be mistaken for a confirmed internal fact.
 */

export type EvidenceClass = "observed" | "inferred" | "unknown";

export type ConfidenceLevel = "high" | "medium" | "low";

/** A single supported statement about the business. */
export type Finding = {
  evidence: EvidenceClass;
  /** The statement itself, written in plain business language. */
  statement: string;
  /**
   * Where this came from — e.g. "Homepage", "Contact page", "Google Business
   * Profile". Omitted for `unknown`, which by definition has no source.
   */
  source?: string;
};

/* ------------------------------------------------------------------ profile */

export type BusinessProfile = {
  name: string;
  /** e.g. "Seattle, WA". */
  location: string;
  /** e.g. "Home Services". */
  category: string;
  /** The audited URL, displayed as typed by the visitor. */
  website: string;
  /** Two or three sentences describing what the business appears to do. */
  summary: string;
  /** Primary services detected on the site. */
  services: readonly string[];
  /** Who the business appears to sell to. */
  audience: string;
  /** Digital surfaces found — website, booking tool, review profiles, etc. */
  digitalSurface: readonly Finding[];
  /** How a customer appears to move from first contact to job complete. */
  customerJourney: readonly JourneyStage[];
};

export type JourneyStage = {
  /** e.g. "Discover", "Enquire", "Qualify". */
  name: string;
  /** What appears to happen at this stage. */
  detail: string;
  evidence: EvidenceClass;
  /** Set when this stage looks like it depends on manual effort. */
  frictionNote?: string;
};

/* ------------------------------------------------------- opportunity scoring
 * The four sub-scores are the raw inputs. `priority` is always derived from
 * them by `calculatePriority` in ~/lib/audit-scoring — it is stored on the
 * opportunity for display convenience, never hand-authored, and the fixture
 * asserts the two agree.
 */

export type OpportunityScores = {
  /** Size of the business outcome if solved. 0-100. */
  impact: number;
  /** How well the evidence supports the finding. 0-100. */
  confidence: number;
  /** How well this fits the kind of business it is. 0-100. */
  fit: number;
  /** How straightforward it would be to implement. 0-100. */
  implementationEase: number;
};

export type PriorityTier = "critical" | "high" | "optimization" | "future";

/** One node in a proposed system flow, e.g. "AI Qualification". */
export type FlowStep = {
  label: string;
  /** Marks the step that carries the AI/judgement work, for emphasis. */
  emphasis?: boolean;
};

export type Opportunity = {
  id: string;
  /** e.g. "Lead Response Automation". */
  name: string;
  pillar: PillarId;
  /** Family of system, e.g. "Lead Response". Groups related opportunities. */
  type: string;
  scores: OpportunityScores;
  /** Derived: see calculatePriority. Rounded 0-100. */
  priority: number;
  /** Derived from `priority`: see classifyPriority. */
  tier: PriorityTier;
  /** Evidence classes actually present behind this opportunity. */
  evidence: readonly EvidenceClass[];
  confidence: ConfidenceLevel;
  /** What was directly seen. Each carries its own evidence class. */
  observed: readonly Finding[];
  /** The friction this may be creating. Always hedged — it is inferred. */
  friction: string;
  /** Why that friction matters to the business. */
  whyItMatters: string;
  /** The system Ellis AI Studio could build, as an ordered flow. */
  proposedSystem: readonly FlowStep[];
  /** Plain-language outcomes. Never numeric promises. */
  benefits: readonly string[];
  /** The question that would validate this during discovery. */
  discoveryQuestion: string;
};

/* -------------------------------------------------------------- roadmap */

export type RoadmapPhase = {
  /** 1-indexed phase number. */
  number: number;
  /** e.g. "Capture & Respond". */
  name: string;
  /** What this phase is trying to achieve, in one line. */
  intent: string;
  /** Opportunity ids delivered in this phase. */
  opportunityIds: readonly string[];
  /** Short chip labels for the phase, e.g. "Lead Intake". */
  items: readonly string[];
  /** Indicative sequencing language — never a delivery guarantee. */
  horizon: string;
};

/* --------------------------------------------------- recommended architecture
 * Modelled as ordered layers rather than free-positioned nodes. Layers stack
 * predictably on narrow screens, which is what keeps the diagram readable on
 * mobile instead of shrinking an SVG until the labels disappear.
 */

export type ArchitectureNodeKind = "source" | "system" | "ai" | "store" | "output";

export type ArchitectureNode = {
  id: string;
  label: string;
  kind: ArchitectureNodeKind;
  /** Optional one-line clarifier shown beneath the label. */
  detail?: string;
};

export type ArchitectureLayer = {
  /** e.g. "Capture", "Qualify", "Record", "Respond", "Learn". */
  name: string;
  nodes: readonly ArchitectureNode[];
};

export type ArchitectureDiagram = {
  title: string;
  /** One line describing what the whole system does. */
  summary: string;
  layers: readonly ArchitectureLayer[];
};

/* ------------------------------------------------------------ the report */

export type MaturityStage =
  | "foundational"
  | "developing"
  | "connected"
  | "automated"
  | "intelligent";

export type AuditReport = {
  /** Stable id, used by the persistent report URL /audit/[id]. */
  id: string;
  /** ISO timestamp of when the analysis ran. */
  generatedAt: string;
  profile: BusinessProfile;
  /**
   * 0-100. HIGHER MEANS MORE APPARENT OPPORTUNITY, not better performance.
   * Every surface that renders this must carry that clarification.
   */
  automationOpportunity: number;
  maturity: MaturityStage;
  /** One line summarising the headline read, in business language. */
  headline: string;
  pillarSignals: readonly PillarSignal[];
  opportunities: readonly Opportunity[];
  roadmap: readonly RoadmapPhase[];
  architecture: ArchitectureDiagram;
  /** What could not be established from public information. */
  unknowns: readonly string[];
};
