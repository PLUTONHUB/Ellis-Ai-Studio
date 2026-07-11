import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { BrandLogo } from "~/components/brand-logo";
import {
  frictionScoreLegend,
  severityFromScore,
  sevenFrictionPillars,
  type FrictionStatus,
} from "~/components/friction-framework";

export const Route = createFileRoute("/proposal")({
  component: ProposalPage,
});

type OpportunityInputs = {
  monthlyLeads: number;
  leadToCloseRate: number;
  averageJobValue: number;
  missedLeadPercent: number;
  speedToLeadMinutes: number;
};

type ScorecardMetric = {
  title: string;
  score: number;
  status: FrictionStatus;
  recommendation: string;
};

const initialInputs: OpportunityInputs = {
  monthlyLeads: 120,
  leadToCloseRate: 32,
  averageJobValue: 1800,
  missedLeadPercent: 22,
  speedToLeadMinutes: 18,
};

function ProposalPage() {
  const [inputs, setInputs] = useState<OpportunityInputs>(initialInputs);
  const [signatureName, setSignatureName] = useState("");
  const [signedAt, setSignedAt] = useState<string | null>(null);

  const calculations = useMemo(() => {
    const closeRate = inputs.leadToCloseRate / 100;
    const missedLeadRate = inputs.missedLeadPercent / 100;

    const recaptureRate =
      inputs.speedToLeadMinutes > 30
        ? 0.4
        : inputs.speedToLeadMinutes > 10
          ? 0.3
          : 0.2;

    const baselineRevenue =
      inputs.monthlyLeads * closeRate * inputs.averageJobValue;
    const recoverableLeads = inputs.monthlyLeads * missedLeadRate;
    const recoveredJobs = recoverableLeads * closeRate * recaptureRate;
    const recoveredRevenue = recoveredJobs * inputs.averageJobValue;
    const annualOpportunity = recoveredRevenue * 12;
    const monthOneNetGain = recoveredRevenue - 3495;

    return {
      closeRate,
      baselineRevenue,
      recoverableLeads,
      recaptureRate,
      recoveredJobs,
      recoveredRevenue,
      annualOpportunity,
      monthOneNetGain,
    };
  }, [inputs]);

  const scorecard = useMemo<ScorecardMetric[]>(() => {
    const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

    const discovery = clamp(35 + inputs.monthlyLeads / 3 - inputs.missedLeadPercent / 2);
    const conversion = clamp(25 + inputs.leadToCloseRate * 1.4 - inputs.missedLeadPercent / 3);
    const response = clamp(78 - inputs.speedToLeadMinutes * 1.6);
    const operations = clamp(68 - inputs.missedLeadPercent * 1.1);
    const customerExperience = clamp(
      42 + inputs.leadToCloseRate * 0.8 - inputs.speedToLeadMinutes * 0.5,
    );
    const intelligence = clamp(30 + inputs.monthlyLeads / 6 - inputs.missedLeadPercent * 0.7);
    const growth = clamp(28 + calculations.recoveredRevenue / 350 - inputs.speedToLeadMinutes / 2);

    const scoreById: Record<(typeof sevenFrictionPillars)[number]["id"], number> = {
      discovery,
      conversion,
      response,
      operations,
      "customer-experience": customerExperience,
      intelligence,
      growth,
    };

    const recommendationById: Record<(typeof sevenFrictionPillars)[number]["id"], string> = {
      discovery: "Clarify offer positioning and qualification standards.",
      conversion: "Reduce booking steps and improve CTA sequencing.",
      response: "Deploy immediate callback automation and routing rules.",
      operations: "Remove manual handoff gaps with workflow orchestration.",
      "customer-experience": "Improve communication cadence from inquiry to fulfillment.",
      intelligence: "Implement shared score tracking and attribution visibility.",
      growth: "Sequence expansion only after critical bottlenecks are stabilized.",
    };

    return sevenFrictionPillars.map((pillar) => {
      const score = scoreById[pillar.id];
      return {
        title: pillar.title,
        score,
        status: severityFromScore(score),
        recommendation: recommendationById[pillar.id],
      };
    });
  }, [calculations.recoveredRevenue, inputs]);

  const overallScore = Math.round(
    scorecard.reduce((acc, item) => acc + item.score, 0) / scorecard.length,
  );

  const updateField = <K extends keyof OpportunityInputs>(
    key: K,
    value: number,
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: Number.isFinite(value) ? value : prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="inline-flex items-center py-1 text-sm font-semibold uppercase tracking-[0.18em] text-white"
          >
            <BrandLogo variant="icon" className="h-7 w-7 md:hidden" />
            <BrandLogo
              variant="lockup"
              className="hidden h-7 w-auto min-w-[132px] md:block"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              hash="audit-preview"
              className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-200 transition hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Sample Audit
            </Link>
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Start Friction Plan
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <section className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-blue-500">
            Friction Audit Proposal
          </p>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">
            See where revenue is leaking and what to fix first.
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
            This proposal quantifies friction impact and converts findings into a
            diagnosis-first implementation roadmap.
          </p>
          <p className="mt-4 text-sm font-semibold text-blue-300">
            Meet Pluto, your AI Systems Engineer.
          </p>
          <div className="mt-6 max-w-4xl rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-100">
            Demo projections are illustrative, not guarantees.
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 md:p-8">
            <h2 className="mb-6 text-lg font-semibold uppercase tracking-widest text-zinc-300">
              Friction Inputs
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <NumberField
                label="Monthly Leads"
                value={inputs.monthlyLeads}
                onChange={(v) => updateField("monthlyLeads", v)}
              />
              <NumberField
                label="Lead-to-Close Rate (%)"
                value={inputs.leadToCloseRate}
                onChange={(v) => updateField("leadToCloseRate", v)}
              />
              <NumberField
                label="Average Job Value ($)"
                value={inputs.averageJobValue}
                onChange={(v) => updateField("averageJobValue", v)}
              />
              <NumberField
                label="Missed/Unanswered Leads (%)"
                value={inputs.missedLeadPercent}
                onChange={(v) => updateField("missedLeadPercent", v)}
              />
              <div className="md:col-span-2">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Average Speed-to-Lead (minutes)
                </label>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={inputs.speedToLeadMinutes}
                  onChange={(e) =>
                    updateField("speedToLeadMinutes", Number(e.target.value))
                  }
                  className="w-full accent-blue-500"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>1 min</span>
                  <span className="text-zinc-200">
                    {inputs.speedToLeadMinutes} min
                  </span>
                  <span>60 min</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-blue-600/40 bg-gradient-to-b from-blue-950/40 to-zinc-950 p-6 md:p-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-400">
              Estimated 30-Day Impact
            </p>
            <div className="mb-5 text-4xl font-black text-white">
              ${Math.round(calculations.recoveredRevenue).toLocaleString()}
            </div>
            <p className="mb-3 text-sm leading-relaxed text-zinc-300">
              Projected monthly revenue recovered from faster follow-up and
              conversion improvements.
            </p>
            <p className="mb-8 text-sm text-zinc-400">
              Illustrative projection only — not a guarantee.
            </p>

            <dl className="space-y-4 text-sm text-zinc-300">
              <Metric
                label="Current Monthly Revenue (modeled)"
                value={`$${Math.round(calculations.baselineRevenue).toLocaleString()}`}
              />
              <Metric
                label="Potentially Recoverable Leads"
                value={`${Math.round(calculations.recoverableLeads)} leads/mo`}
              />
              <Metric
                label="Recapture Rate from Automation"
                value={`${Math.round(calculations.recaptureRate * 100)}%`}
              />
              <Metric
                label="Annualized Opportunity"
                value={`$${Math.round(calculations.annualOpportunity).toLocaleString()}`}
              />
              <Metric
                label="Month-One Net Gain Estimate"
                value={`$${Math.round(calculations.monthOneNetGain).toLocaleString()}`}
              />
            </dl>

            <div className="mt-8">
              <Link
                to="/onboarding"
                className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Start Friction Removal Plan
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-zinc-200">
                Ellis Friction Score Dashboard
              </h2>
              <p className="text-sm text-zinc-400">
                Overall score preview based on current audit inputs.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Overall score
              </p>
              <p className="text-2xl font-black text-white">{overallScore}/100</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {scorecard.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-800 bg-black p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                    {item.title}
                  </p>
                  <StatusChip status={item.status} />
                </div>
                <p className="text-2xl font-black text-white">{item.score}</p>
                <p className="mt-2 text-sm text-zinc-400">{item.recommendation}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-black px-4 py-4 text-sm text-zinc-300">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
              Score ranges
            </p>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {frictionScoreLegend.map((item) => (
                <div key={item.label} className="rounded-lg border border-zinc-800 px-3 py-2">
                  <p className="font-semibold text-white">{item.range}</p>
                  <p className="text-xs text-zinc-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 md:p-8">
            <h2 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-zinc-300">
              What Pluto Prescribes in 30 Days
            </h2>
            <ul className="space-y-3 text-sm text-zinc-300">
              {scorecard.map((item) => (
                <li
                  key={item.title}
                  className="rounded-lg border border-zinc-800 bg-black p-3"
                >
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-zinc-400">{item.recommendation}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 md:p-8">
            <h2 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-zinc-300">
              Delivery Timeline
            </h2>
            <ol className="space-y-3 text-xs text-zinc-300">
              <TimelineItem
                phase="Day 1"
                detail="Friction audit kickoff + intake confirmation"
              />
              <TimelineItem
                phase="Days 2–4"
                detail="Root-cause diagnosis + systems prescription"
              />
              <TimelineItem
                phase="Days 5–7"
                detail="Response + conversion system implementation"
              />
              <TimelineItem
                phase="Days 8–14"
                detail="Optimization sprint, QA, and launch handoff"
              />
            </ol>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <PhaseCard
            title="Phase 1 · Friction Audit"
            points={[
              "Executive friction score baseline",
              "Top bottlenecks and root causes",
              "Prioritized roadmap",
            ]}
          />
          <PhaseCard
            title="Phase 2 · Systems Engineering"
            featured
            points={[
              "Workflow and funnel engineering",
              "Automation deployment",
              "Launch-ready execution",
            ]}
          />
          <PhaseCard
            title="Phase 3 · Continuous Optimization"
            points={[
              "Ongoing monitoring",
              "Score trend improvements",
              "Growth iteration loops",
            ]}
          />
        </section>

        <section className="mt-10 rounded-2xl border border-blue-600/40 bg-blue-950/15 p-6 md:p-8">
          <h2 className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-blue-300">
            Interactive Signature Simulation
          </h2>
          <p className="mb-6 text-xs text-zinc-300">
            This simulation records intent in-browser only. It does not create a
            legal agreement.
          </p>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Authorized Signer Name
              </label>
              <input
                value={signatureName}
                onChange={(e) => {
                  setSignatureName(e.target.value);
                  setSignedAt(null);
                }}
                placeholder="Jane Owner"
                className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (signatureName.trim().length > 2) {
                  setSignedAt(new Date().toISOString());
                }
              }}
              className="rounded-xl bg-blue-600 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-blue-700"
            >
              Simulate Signature
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-black px-4 py-3 text-xs text-zinc-300">
            {signedAt ? (
              <>
                Signature captured for <strong>{signatureName.trim()}</strong> on{" "}
                {new Date(signedAt).toLocaleString()}.
              </>
            ) : (
              <>Signature pending — enter signer name and click “Simulate Signature”.</>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400/40"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-right font-semibold text-white">{value}</dd>
    </div>
  );
}

function TimelineItem({ phase, detail }: { phase: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-black p-3">
      <span className="min-w-[72px] rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-blue-300">
        {phase}
      </span>
      <span className="text-zinc-300">{detail}</span>
    </li>
  );
}

function PhaseCard({
  title,
  points,
  featured = false,
}: {
  title: string;
  points: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        featured ? "border-blue-600 bg-blue-950/15" : "border-zinc-900 bg-zinc-950"
      }`}
    >
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-white">
        {title}
      </h3>
      <ul className="space-y-3 text-xs text-zinc-300">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 flex-shrink-0 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusChip({ status }: { status: FrictionStatus }) {
  const styles =
    status === "High"
      ? "border-red-500/35 bg-red-500/10 text-red-300"
      : status === "Medium"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-300"
        : "border-green-500/35 bg-green-500/10 text-green-300";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${styles}`}
    >
      {status}
    </span>
  );
}
