import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { BrandLogo } from "~/components/brand-logo";
import {
  sevenFrictionPillars,
  type FrictionStatus,
} from "~/components/friction-framework";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

type Phase = {
  id: string;
  title: string;
  detail: string;
  frictionDomain: string;
};

const phases: Phase[] = [
  {
    id: "research",
    title: "Research",
    detail: "Business context, goals, and baseline metrics aligned.",
    frictionDomain: "Discovery",
  },
  {
    id: "inspection",
    title: "Inspection",
    detail: "Current flow and system bottlenecks documented.",
    frictionDomain: "Operations",
  },
  {
    id: "root-cause",
    title: "Root-Cause",
    detail: "Primary leakage points isolated by pillar.",
    frictionDomain: "Intelligence",
  },
  {
    id: "prescription",
    title: "Prescription",
    detail: "Fixes sequenced by impact and effort.",
    frictionDomain: "Growth",
  },
  {
    id: "deployment",
    title: "Deployment",
    detail: "Systems changes executed and validated.",
    frictionDomain: "Response + Conversion",
  },
  {
    id: "optimization",
    title: "Optimization",
    detail: "Performance loops launched for continuous gains.",
    frictionDomain: "Customer Experience",
  },
];

const checklistSeed = [
  "Brand Assets",
  "Domain Access",
  "Questionnaire",
  "Payment Setup",
] as const;

type ChecklistKey = (typeof checklistSeed)[number];

const checklistLabels: Record<ChecklistKey, string> = {
  "Brand Assets": "Brand Assets · Discovery clarity",
  "Domain Access": "Domain Access · Response routing",
  Questionnaire: "Questionnaire · Conversion intelligence",
  "Payment Setup": "Payment Setup · Growth continuity",
};

const templateDownloads = [
  {
    label: "Friction Intake Checklist",
    filename: "ellis-friction-intake-checklist.txt",
    content: `Ellis Friction Framework Intake\n\n- Current acquisition channels\n- Speed-to-lead process\n- Booking/close workflow\n- Retention follow-up steps\n- Primary business KPI targets\n`,
  },
  {
    label: "Systems Access Worksheet",
    filename: "ellis-systems-access-worksheet.txt",
    content: `Ellis Systems Access Worksheet\n\n1) Website/CMS access\n2) Domain registrar access\n3) Calendar booking access\n4) CRM access\n5) Email/SMS platform access\n`,
  },
  {
    label: "Launch Readiness QA",
    filename: "ellis-launch-readiness-qa.txt",
    content: `Ellis Launch Readiness\n\n- Friction checkpoints marked complete\n- Forms and CTA routes tested\n- Automation handoff validated\n- Tracking and analytics confirmed\n- Stakeholder launch approval logged\n`,
  },
] as const;

function OnboardingPage() {
  const [activePhase, setActivePhase] = useState(1);
  const [checklist, setChecklist] = useState<Record<ChecklistKey, boolean>>({
    "Brand Assets": true,
    "Domain Access": false,
    Questionnaire: false,
    "Payment Setup": false,
  });
  const [profile, setProfile] = useState({
    company: "",
    niche: "Home Services",
    serviceArea: "",
    primaryPhone: "",
  });

  const checklistTotal = checklistSeed.length;
  const checklistDone = checklistSeed.filter((key) => checklist[key]).length;
  const checklistPercent = Math.round((checklistDone / checklistTotal) * 100);
  const phasePercent = Math.round(((activePhase + 1) / phases.length) * 100);

  const readiness = useMemo(() => {
    const atLaunch = activePhase === phases.length - 1;
    const profileReady =
      profile.company.trim().length > 1 &&
      profile.serviceArea.trim().length > 1 &&
      profile.primaryPhone.trim().length > 6;

    return {
      atLaunch,
      checklistComplete: checklistDone === checklistTotal,
      profileReady,
      ready: atLaunch && checklistDone === checklistTotal && profileReady,
    };
  }, [
    activePhase,
    checklistDone,
    checklistTotal,
    profile.company,
    profile.primaryPhone,
    profile.serviceArea,
  ]);

  const overallPercent = Math.round((phasePercent + checklistPercent) / 2);

  const frictionCheckpoints = useMemo(
    () =>
      sevenFrictionPillars.map((pillar) => {
        let score = pillar.score;

        if (pillar.id === "discovery" && profile.company.trim().length > 1) score += 10;
        if (pillar.id === "response" && checklist["Domain Access"]) score += 12;
        if (pillar.id === "conversion" && checklist.Questionnaire) score += 10;
        if (pillar.id === "growth" && checklist["Payment Setup"]) score += 8;
        if (activePhase >= 4) score += 6;

        const clamped = Math.max(0, Math.min(score, 100));
        const status: FrictionStatus =
          clamped < 40 ? "High" : clamped < 75 ? "Medium" : "Low";

        return {
          label: pillar.title,
          status,
          detail: pillar.impactWhenNeglected,
        };
      }),
    [activePhase, checklist, profile.company],
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
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
              to="/proposal"
              className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-200 transition hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Friction Score
            </Link>
            <Link
              to="/"
              hash="contact"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Get My Friction Audit
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <section className="mb-10">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-400">
            Friction Removal Onboarding
          </p>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">
            Activate diagnosis-first execution from intake to optimization.
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
            This tracker keeps implementation transparent across all seven friction
            pillars while maintaining fast delivery and clean handoffs.
          </p>
          <p className="mt-4 text-sm font-semibold text-blue-300">
            Ellis AI Studio · Ready for Analysis.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold uppercase tracking-widest text-zinc-300">
                  Analysis Process Timeline
                </h2>
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                  {phasePercent}% Phase Progress
                </span>
              </div>

              <div className="space-y-3">
                {phases.map((phase, index) => {
                  const isDone = index < activePhase;
                  const isActive = index === activePhase;

                  return (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => setActivePhase(index)}
                      className="w-full rounded-xl border border-zinc-800 bg-black p-4 text-left transition hover:border-zinc-700"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white">
                          {phase.title}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            isDone
                              ? "border-green-500/40 text-green-400"
                              : isActive
                                ? "border-blue-600/50 text-blue-300"
                                : "border-zinc-700 text-zinc-400"
                          }`}
                        >
                          {isDone ? "Done" : isActive ? "In Progress" : "Todo"}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-zinc-400">{phase.detail}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                        {phase.frictionDomain} checkpoint
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActivePhase((prev) => Math.max(prev - 1, 0))}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-200 transition hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Previous Phase
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhase((prev) => Math.min(prev + 1, phases.length - 1))
                  }
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Advance Phase
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold uppercase tracking-widest text-zinc-300">
                  Friction Inputs Checklist
                </h2>
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                  {checklistPercent}% Complete
                </span>
              </div>

              <div className="space-y-3">
                {checklistSeed.map((label) => (
                  <label
                    key={label}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-black p-4"
                  >
                    <span className="text-sm text-zinc-200">{checklistLabels[label]}</span>
                    <input
                      type="checkbox"
                      checked={checklist[label]}
                      onChange={(e) =>
                        setChecklist((prev) => ({
                          ...prev,
                          [label]: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-zinc-700 bg-black accent-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-blue-600/40 bg-gradient-to-b from-blue-950/40 to-zinc-950 p-6 md:p-8">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-blue-300">
                Dynamic Completion Gauge
              </h2>

              <div className="flex items-center gap-5">
                <ProgressRing percent={overallPercent} />
                <div>
                  <p className="text-3xl font-black text-white">{overallPercent}%</p>
                  <p className="text-sm text-zinc-300">Overall onboarding completion</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Phase: {phasePercent}% · Inputs: {checklistPercent}%
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-zinc-300">
                Seven Pillar Checkpoints
              </h2>
              <div className="space-y-3">
                {frictionCheckpoints.map((checkpoint) => (
                  <div
                    key={checkpoint.label}
                    className="rounded-xl border border-zinc-800 bg-black p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{checkpoint.label}</p>
                      <StatusChip status={checkpoint.status} />
                    </div>
                    <p className="text-sm text-zinc-400">{checkpoint.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-zinc-300">
                Data Collection + Integration Tasks
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Company Name"
                  value={profile.company}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, company: value }))
                  }
                  placeholder="Apex Roofing"
                />

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Niche
                  </label>
                  <select
                    value={profile.niche}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, niche: e.target.value }))
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400/40"
                  >
                    <option>Home Services</option>
                    <option>Boutique Gym</option>
                    <option>Dentist</option>
                    <option>Med Spa</option>
                  </select>
                </div>

                <InputField
                  label="Primary Service Area"
                  value={profile.serviceArea}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, serviceArea: value }))
                  }
                  placeholder="Phoenix Metro"
                />

                <InputField
                  label="Primary Phone"
                  value={profile.primaryPhone}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, primaryPhone: value }))
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-zinc-300">
                Download Templates
              </h2>
              <div className="space-y-3">
                {templateDownloads.map((template) => (
                  <a
                    key={template.filename}
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(template.content)}`}
                    download={template.filename}
                    className="inline-flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-200 transition hover:border-zinc-700"
                  >
                    <span>{template.label}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
                      Download
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-5 text-sm text-zinc-300">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Launch Readiness
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between gap-3">
                  Phase at Optimization
                  <BinaryFlag good={readiness.atLaunch} />
                </li>
                <li className="flex items-center justify-between gap-3">
                  Inputs completed
                  <BinaryFlag good={readiness.checklistComplete} />
                </li>
                <li className="flex items-center justify-between gap-3">
                  Intake profile ready
                  <BinaryFlag good={readiness.profileReady} />
                </li>
              </ul>
              <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs">
                {readiness.ready
                  ? "Ready to move into final optimization sprint."
                  : "Pending items remain before final handoff."}
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400/40"
      />
    </div>
  );
}

function BinaryFlag({ good }: { good: boolean }) {
  return (
    <span
      className={`inline-flex h-6 min-w-16 items-center justify-center rounded-full px-3 text-[10px] font-black uppercase tracking-widest ${
        good ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"
      }`}
    >
      {good ? "Ready" : "Pending"}
    </span>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(percent, 100));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 110 110" className="h-28 w-28 -rotate-90">
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="rgb(39 39 42)"
          strokeWidth="10"
        />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="rgb(59 130 246)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
        {clamped}%
      </div>
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
