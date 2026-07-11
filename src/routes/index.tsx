import { useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandLogo } from "~/components/brand-logo";
import {
  FrictionScoreDashboard,
  SevenFrictionPillars,
} from "~/components/friction-framework";
import { PortfolioShowcase } from "~/components/portfolio-showcase";

export const Route = createFileRoute("/")({
  component: Home,
});

const plutoProcess = [
  "Research",
  "Inspection",
  "Root-Cause",
  "Prescription",
  "Roadmap",
  "Deployment",
  "Optimization",
] as const;

const leakageFlow = [
  "Traffic",
  "Website",
  "Leads",
  "Missed Calls",
  "Slow Responses",
  "Manual Processes",
  "Lost Customers",
  "Lost Revenue",
] as const;

const outcomesPhases = [
  {
    title: "Phase 1 · Friction Audit",
    description:
      "Baseline diagnosis across all seven pillars to identify where revenue is leaking first.",
    outputs: [
      "Executive Friction Score",
      "Root-cause map by pillar",
      "Prioritized bottleneck report",
    ],
  },
  {
    title: "Phase 2 · Systems Engineering",
    description:
      "Design and deployment of AI-powered systems that remove friction at the highest-impact points.",
    outputs: [
      "Conversion/response architecture",
      "Workflow automation implementation",
      "Operator-ready handoff",
    ],
  },
  {
    title: "Phase 3 · Continuous Optimization",
    description:
      "Ongoing monitoring and iterative tuning to improve throughput, speed, and profitability.",
    outputs: [
      "Score trend tracking",
      "Optimization sprints",
      "Impact reporting cadence",
    ],
  },
] as const;

const businessImpactFramework = [
  {
    title: "Revenue Impact",
    detail:
      "Estimated recovered revenue from improved conversion, faster response, and lower leakage.",
  },
  {
    title: "Time Impact",
    detail:
      "Hours returned to operators through automation of repetitive lead and follow-up tasks.",
  },
  {
    title: "Customer Impact",
    detail:
      "Faster, clearer journeys that increase trust, close confidence, and retention outcomes.",
  },
  {
    title: "Implementation Effort",
    detail:
      "Execution complexity scored so teams can sequence changes without operational disruption.",
  },
] as const;

const comparisonRows = [
  {
    dimension: "Primary Model",
    typicalAgency: "Sell deliverables (sites, ads, one-off assets)",
    ellis: "Diagnose friction first, engineer systems second",
  },
  {
    dimension: "Starting Point",
    typicalAgency: "Creative output and channel activity",
    ellis: "Root-cause analysis of revenue leakage",
  },
  {
    dimension: "Success Metric",
    typicalAgency: "Launch completion",
    ellis: "Measured business impact across revenue, time, and customer outcomes",
  },
  {
    dimension: "Implementation Approach",
    typicalAgency: "Campaign-heavy with manual coordination",
    ellis: "Systems-engineering with automation and accountability loops",
  },
] as const;

function Home() {
  const [formState, setFormState] = useState({
    businessName: "",
    websiteUrl: "",
    yourName: "",
    phone: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const faqs = [
    {
      q: "What do I get in a Friction Audit?",
      a: "You receive a company snapshot, seven pillar scores, top bottlenecks, root causes, estimated impact, and a prioritized roadmap.",
    },
    {
      q: "Who runs the audit process?",
      a: "Meet Pluto, your AI Systems Engineer. Pluto supports diagnosis and recommendations while Ellis handles implementation and oversight.",
    },
    {
      q: "Are score and revenue projections guaranteed?",
      a: "No. All projections are illustrative and intended for planning and prioritization.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06070A] text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center py-1">
            <BrandLogo variant="icon" className="h-7 w-7 md:hidden" />
            <BrandLogo
              variant="lockup"
              className="hidden h-7 w-auto min-w-[132px] md:block"
            />
          </div>

          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-widest text-zinc-400 md:flex">
            <a href="#pillars" className="transition-colors hover:text-white">
              Pillars
            </a>
            <a href="#score" className="transition-colors hover:text-white">
              Friction Score
            </a>
            <a href="#pluto-process" className="transition-colors hover:text-white">
              Pluto Process
            </a>
            <a href="#audit-preview" className="transition-colors hover:text-white">
              Audit Preview
            </a>
            <a href="/proposal" className="transition-colors hover:text-white">
              Proposal
            </a>
            <a href="/onboarding" className="transition-colors hover:text-white">
              Onboarding
            </a>
          </nav>

          <a
            href="#contact"
            className="rounded-full bg-blue-600 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
          >
            Get My Friction Audit
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-zinc-900 py-24 md:py-36">
        <img
          src="/friction/executive-hero-backdrop.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-300">
            Ellis Friction Framework
          </div>

          <h1 className="mb-8 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Your Business Doesn’t Have a Marketing Problem. It Has Friction.
          </h1>

          <p className="mx-auto mb-10 max-w-4xl text-base leading-relaxed text-zinc-300 md:text-xl">
            Ellis AI Studio identifies where revenue is leaking across your business
            and engineers AI-powered systems that eliminate friction, improve
            efficiency, and increase profitability.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="w-full rounded-full bg-white px-10 py-5 text-xs font-bold uppercase tracking-widest text-black shadow-xl shadow-white/5 transition-all hover:bg-zinc-200 sm:w-auto"
            >
              Get My Friction Audit
            </a>
            <a
              href="#audit-preview"
              className="w-full rounded-full border border-zinc-700 px-10 py-5 text-xs font-semibold uppercase tracking-widest text-zinc-200 transition-all hover:bg-zinc-900/40 sm:w-auto"
            >
              See a Sample Audit
            </a>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-zinc-800 bg-black/70 px-6 py-4 text-sm text-zinc-200">
            We don’t sell websites. We engineer revenue systems.
          </div>

          <p className="mt-6 text-sm font-semibold text-blue-300">
            Meet Pluto, your AI Systems Engineer.
          </p>
        </div>
      </section>

      <section id="pillars" className="border-b border-zinc-900 bg-zinc-950/25 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Seven Friction Pillars
            </p>
            <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
              Diagnose exactly where growth is being throttled.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
              Every pillar defines what we measure, common friction points, and the
              business impact when that area is neglected.
            </p>
          </div>

          <SevenFrictionPillars />
        </div>
      </section>

      <section id="score" className="border-b border-zinc-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <FrictionScoreDashboard overallScore={43} />
        </div>
      </section>

      <section id="pluto-process" className="border-b border-zinc-900 bg-zinc-950/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Pluto Process
            </p>
            <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
              Diagnosis before recommendations.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
              Pluto leads a structured workflow so systems decisions are based on
              verified bottlenecks, not assumptions.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            {plutoProcess.map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-zinc-800 bg-black p-4 text-center"
              >
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Step {index + 1}
                </p>
                <p className="text-sm font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Revenue Leakage Visualization
            </p>
            <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
              See where revenue exits the system.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
              Ellis closes leakage points from first traffic touch through retention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {leakageFlow.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-200">
                  {step}
                </span>
                {index < leakageFlow.length - 1 ? (
                  <span className="text-blue-300">→</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-950/35 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Outcomes Phases
            </span>
            <h2 className="text-3xl font-light text-white md:text-4xl">
              Engagement is structured in three execution phases.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {outcomesPhases.map((phase) => (
              <article
                key={phase.title}
                className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8"
              >
                <h3 className="mb-3 text-lg font-bold text-white">{phase.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                  {phase.description}
                </p>
                <ul className="space-y-3 text-sm text-zinc-300">
                  {phase.outputs.map((output) => (
                    <li key={output} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <span>{output}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Business Impact Framework
            </p>
            <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
              Decisions are prioritized by impact, not opinion.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {businessImpactFramework.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <h3 className="mb-3 text-base font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="audit-preview" className="border-b border-zinc-900 bg-zinc-950/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Pluto Audit Preview
            </p>
            <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
              Sample Friction Audit structure
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-2xl border border-zinc-800 bg-black p-6">
              <p className="mb-4 text-sm font-semibold text-zinc-200">
                Company Snapshot · Sample
              </p>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>Industry: Home Services Contractor</li>
                <li>Service Region: 3 metro zones</li>
                <li>Current Lead Volume: 120/mo</li>
                <li>Average Speed-to-Lead: 18 minutes</li>
                <li>Overall Friction Score: 43/100</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="mb-4 text-sm font-semibold text-zinc-200">
                Included in every audit
              </p>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>Seven pillar scores</li>
                <li>Top bottlenecks</li>
                <li>Root causes</li>
                <li>Estimated impact</li>
                <li>Prioritized roadmap</li>
                <li>Recommended package</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Why Ellis Is Different
            </p>
            <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
              Systems engineering model vs typical agency model
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-zinc-950 text-zinc-300">
                <tr>
                  <th className="border-b border-zinc-800 px-4 py-3">Dimension</th>
                  <th className="border-b border-zinc-800 px-4 py-3">Typical Agencies</th>
                  <th className="border-b border-zinc-800 px-4 py-3">Ellis Systems Engineering</th>
                </tr>
              </thead>
              <tbody className="bg-black text-zinc-300">
                {comparisonRows.map((row) => (
                  <tr key={row.dimension}>
                    <td className="border-b border-zinc-900 px-4 py-3 font-semibold text-white">
                      {row.dimension}
                    </td>
                    <td className="border-b border-zinc-900 px-4 py-3 text-zinc-400">
                      {row.typicalAgency}
                    </td>
                    <td className="border-b border-zinc-900 px-4 py-3 text-zinc-200">
                      {row.ellis}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <PortfolioShowcase />

      <section id="faq" className="border-b border-zinc-900 bg-zinc-950/25 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              FAQ
            </span>
            <h2 className="text-3xl font-light text-white">Friction Audit Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h4 className="text-sm font-semibold text-white">{faq.q}</h4>
                  <svg
                    className={`ml-4 h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform duration-200 ${
                      openFaq === index ? "rotate-45" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                {openFaq === index ? (
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-4xl px-6 py-24">
        <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950 p-8 shadow-2xl md:p-12">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

          <div className="mx-auto mb-10 max-w-xl text-center">
            <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
              Friction Audit Intake
            </span>
            <h2 className="mb-2 mt-4 text-3xl font-light text-white">
              Get My Friction Audit
            </h2>
            <p className="text-sm text-zinc-400">
              Share your current site and contact details. We will send a diagnosis-first
              audit with bottlenecks, root causes, and prioritized actions.
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center">
              <svg
                className="mx-auto mb-6 h-16 w-16 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3 className="mb-2 text-2xl font-semibold text-white">
                Audit Request Received
              </h3>
              <p className="text-sm text-zinc-400">
                We will deliver your friction audit preview within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Business Name"
                  name="businessName"
                  value={formState.businessName}
                  onChange={handleInputChange}
                  placeholder="Apex Roofing LLC"
                  required
                />
                <FormField
                  label="Current Website URL (If Any)"
                  type="url"
                  name="websiteUrl"
                  value={formState.websiteUrl}
                  onChange={handleInputChange}
                  placeholder="https://apexroofing.com"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Your Name"
                  name="yourName"
                  value={formState.yourName}
                  onChange={handleInputChange}
                  placeholder="Jordan Rivera"
                  required
                />
                <FormField
                  label="Primary Phone Number"
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 000-0000"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-700"
              >
                Get My Friction Audit
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-900 bg-black py-12 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <BrandLogo variant="lockup" className="h-6 w-auto opacity-90" />
          <p>
            &copy; {new Date().getFullYear()} Ellis AI Studio. Diagnosis-first
            systems engineering for measurable growth.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  type?: "text" | "url" | "tel";
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}
