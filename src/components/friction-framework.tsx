export type FrictionStatus = "High" | "Medium" | "Low";

export type FrictionPillar = {
  id:
    | "discovery"
    | "conversion"
    | "response"
    | "operations"
    | "customer-experience"
    | "intelligence"
    | "growth";
  title: string;
  measures: string;
  frictionPoints: string;
  impactWhenNeglected: string;
  score: number;
};

export type ScoreLegendItem = {
  label:
    | "Optimized"
    | "Healthy"
    | "Needs Improvement"
    | "Significant Friction"
    | "Critical";
  range: string;
};

export const sevenFrictionPillars: FrictionPillar[] = [
  {
    id: "discovery",
    title: "Discovery",
    measures: "How clearly your offer, audience, and demand signals are defined.",
    frictionPoints:
      "Unclear positioning, weak qualification criteria, and misaligned service messaging.",
    impactWhenNeglected:
      "Teams pursue low-fit leads and waste budget before pipeline momentum starts.",
    score: 52,
  },
  {
    id: "conversion",
    title: "Conversion",
    measures:
      "How effectively prospects move from interest to booked conversations.",
    frictionPoints:
      "Confusing page hierarchy, buried CTAs, and booking steps with high drop-off.",
    impactWhenNeglected:
      "Lead volume appears healthy but revenue conversion remains volatile and low.",
    score: 49,
  },
  {
    id: "response",
    title: "Response",
    measures:
      "How fast and consistently high-intent leads receive the first meaningful reply.",
    frictionPoints:
      "Missed calls, slow callbacks, and no routing logic for urgent inquiries.",
    impactWhenNeglected:
      "High-intent buyers choose competitors before your team enters the conversation.",
    score: 41,
  },
  {
    id: "operations",
    title: "Operations",
    measures:
      "How reliable handoffs are across intake, scheduling, fulfillment, and follow-up.",
    frictionPoints:
      "Manual transfer steps, siloed tools, and undocumented workflows.",
    impactWhenNeglected:
      "Execution inconsistency creates bottlenecks and lowers team throughput.",
    score: 44,
  },
  {
    id: "customer-experience",
    title: "Customer Experience",
    measures:
      "How frictionless the journey feels from first click through delivery and support.",
    frictionPoints:
      "Poor visibility, delayed updates, and inconsistent expectation setting.",
    impactWhenNeglected:
      "Trust erosion reduces close rates, reviews, referrals, and lifetime value.",
    score: 46,
  },
  {
    id: "intelligence",
    title: "Intelligence",
    measures:
      "How effectively the business captures and uses data for decision-making.",
    frictionPoints:
      "No shared KPI baseline, weak attribution, and fragmented reporting.",
    impactWhenNeglected:
      "Leaders make reactive decisions without clear evidence of what drives growth.",
    score: 39,
  },
  {
    id: "growth",
    title: "Growth",
    measures:
      "How scalable and resilient the system is as demand and complexity increase.",
    frictionPoints:
      "One-off fixes, no roadmap, and overdependence on manual intervention.",
    impactWhenNeglected:
      "Revenue plateaus and scaling introduces more operational strain than return.",
    score: 33,
  },
];

export const frictionScoreLegend: ScoreLegendItem[] = [
  { label: "Optimized", range: "90–100" },
  { label: "Healthy", range: "75–89" },
  { label: "Needs Improvement", range: "60–74" },
  { label: "Significant Friction", range: "40–59" },
  { label: "Critical", range: "<40" },
];

export function SevenFrictionPillars() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sevenFrictionPillars.map((pillar) => (
        <article
          key={pillar.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition duration-200 hover:border-blue-600/60"
        >
          <h3 className="mb-3 text-lg font-bold text-white">{pillar.title}</h3>

          <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
            <p>
              <span className="font-semibold text-zinc-100">Measures: </span>
              {pillar.measures}
            </p>
            <p>
              <span className="font-semibold text-zinc-100">
                Common friction points: 
              </span>
              {pillar.frictionPoints}
            </p>
            <p>
              <span className="font-semibold text-zinc-100">
                Business impact when neglected: 
              </span>
              {pillar.impactWhenNeglected}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function FrictionScoreDashboard({ overallScore = 43 }: { overallScore?: number }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 md:p-6">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-400">
            Ellis Friction Score
          </p>
          <h3 className="text-2xl font-black text-white md:text-3xl">{overallScore}/100</h3>
          <p className="mt-2 text-sm text-zinc-300">
            Executive baseline across all seven pillars before systems engineering begins.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-xs text-zinc-300">
          <p className="font-bold uppercase tracking-widest text-zinc-400">
            Score-range legend
          </p>
          <ul className="mt-2 space-y-1">
            {frictionScoreLegend.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-6">
                <span>{item.range}</span>
                <span className="font-semibold">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sevenFrictionPillars.map((pillar) => (
          <div
            key={pillar.id}
            className="rounded-xl border border-zinc-800 bg-black px-4 py-4"
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              {pillar.title}
            </p>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-2xl font-black text-white">{pillar.score}</span>
              <BandChip score={pillar.score} />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${pillar.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function severityFromScore(score: number): FrictionStatus {
  if (score < 40) return "High";
  if (score < 75) return "Medium";
  return "Low";
}

function getBand(score: number): ScoreLegendItem["label"] {
  if (score >= 90) return "Optimized";
  if (score >= 75) return "Healthy";
  if (score >= 60) return "Needs Improvement";
  if (score >= 40) return "Significant Friction";
  return "Critical";
}

function BandChip({ score }: { score: number }) {
  const band = getBand(score);

  const styles =
    band === "Optimized"
      ? "border-green-500/35 bg-green-500/10 text-green-300"
      : band === "Healthy"
        ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
        : band === "Needs Improvement"
          ? "border-amber-500/35 bg-amber-500/10 text-amber-300"
          : band === "Significant Friction"
            ? "border-orange-500/35 bg-orange-500/10 text-orange-300"
            : "border-red-500/35 bg-red-500/10 text-red-300";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${styles}`}
    >
      {band}
    </span>
  );
}
