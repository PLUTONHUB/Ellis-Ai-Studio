import { useMemo, useState, type FormEvent } from "react";

import {
  parsePlutoCommand,
  plutoCommandExamples,
  type ParsedPlutoCommand,
} from "~/lib/pluto/nl-command";
import { processCommand } from "~/services/plutoEngine";
import type { PlutoResearchSummary, PlutoRuntimeResponse } from "~/types/pluto-runtime";

const legacyRuntimeExamples = [
  "hello",
  "time",
  "date",
  "remember favorite color blue",
  "what is my favorite",
  "create task follow up with new lead",
  "show tasks",
  "complete task 1",
  "Research example.com",
] as const;

type RuntimeMessage =
  | { speaker: "user"; text: string }
  | { speaker: "pluto"; response: PlutoRuntimeResponse };

export function PlutoCommandConsole() {
  const [command, setCommand] = useState<string>(plutoCommandExamples[0]);
  const [submittedCommand, setSubmittedCommand] = useState<string>(command);
  const [runtimeInput, setRuntimeInput] = useState<string>(legacyRuntimeExamples[0]);
  const [runtimeMessages, setRuntimeMessages] = useState<RuntimeMessage[]>([
    { speaker: "pluto", response: { kind: "message", message: "Ready for Analysis." } },
  ]);

  const parsedCommand = useMemo<ParsedPlutoCommand>(
    () => parsePlutoCommand(submittedCommand),
    [submittedCommand],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedCommand(command);
  };

  const runRuntimeCommand = async (rawCommand: string) => {
    const trimmedCommand = rawCommand.trim();

    if (!trimmedCommand) return;

    setRuntimeMessages((previousMessages) => [
      ...previousMessages,
      { speaker: "user", text: trimmedCommand },
    ]);
    setRuntimeInput("");
    const response = (await processCommand(trimmedCommand)) as PlutoRuntimeResponse;

    setRuntimeMessages((previousMessages) => [
      ...previousMessages,
      { speaker: "pluto", response },
    ]);
  };

  const handleRuntimeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runRuntimeCommand(runtimeInput);
  };

  return (
    <section className="mx-auto mt-10 grid max-w-6xl gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-blue-500/25 bg-black/70 p-4 text-left shadow-2xl shadow-blue-950/20 backdrop-blur md:p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-300">
              Analysis Workspace
            </p>
            <h2 className="text-base font-bold text-white md:text-lg">
              Ready for Analysis.
            </h2>
          </div>
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Deterministic route understanding
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="pluto-command-input">
            Natural language command
          </label>
          <input
            id="pluto-command-input"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="Example: calculate opportunity from missed leads"
            className="min-h-12 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400/40"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Understand
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Interpreted intent
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {formatIntent(parsedCommand.intent)}
              </p>
            </div>
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              {Math.round(parsedCommand.confidence * 100)}% confidence
            </span>
          </div>

          <p className="text-sm leading-relaxed text-zinc-300">{parsedCommand.summary}</p>

          {parsedCommand.matchedTerms.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {parsedCommand.matchedTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-md border border-zinc-800 bg-black px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400"
                >
                  {term}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
              V1 maps defined commands to existing Ellis routes and keeps intent
              recognition separate from the session-based utility tools.
            </p>
            {parsedCommand.href ? (
              <a
                href={parsedCommand.href}
                className="inline-flex items-center justify-center rounded-full border border-blue-500/50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-200 transition hover:bg-blue-500/10"
              >
                {parsedCommand.actionLabel}
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {plutoCommandExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setCommand(example);
                setSubmittedCommand(example);
              }}
              className="rounded-full border border-zinc-800 px-3 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 text-left shadow-2xl shadow-black/20 md:p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-300">
              Business Intelligence Console
            </p>
            <h2 className="text-base font-bold text-white md:text-lg">
              Research and utility commands are ready.
            </h2>
          </div>
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Session memory only
          </span>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <div className={`min-h-56 space-y-3 overflow-y-auto pr-1 ${runtimeMessages.some((message) => message.speaker === "pluto" && message.response.kind === "research") ? "max-h-[48rem]" : "max-h-72"}`}>
            {runtimeMessages.map((message, index) => (
              <RuntimeMessageView key={`${message.speaker}-${index}`} message={message} />
            ))}
          </div>
        </div>

        <form
          onSubmit={handleRuntimeSubmit}
          className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"
        >
          <label className="sr-only" htmlFor="pluto-runtime-input">
            Analysis command
          </label>
          <input
            id="pluto-runtime-input"
            value={runtimeInput}
            onChange={(event) => setRuntimeInput(event.target.value)}
            placeholder="Example: create task follow up with new lead"
            className="min-h-12 rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400/40"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Execute
          </button>
        </form>

        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          Research commands run server-side and persist source-backed business intelligence.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {legacyRuntimeExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => runRuntimeCommand(example)}
              className="rounded-full border border-zinc-800 px-3 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function RuntimeMessageView({ message }: { message: RuntimeMessage }) {
  if (message.speaker === "user") {
    return <p className="whitespace-pre-wrap rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">You: {message.text}</p>;
  }
  if (message.response.kind === "message") {
    return <p className="whitespace-pre-wrap rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">Ellis AI Studio: {message.response.message}</p>;
  }
  return <ResearchResultsCard message={message.response.message} research={message.response.research} />;
}

function ResearchResultsCard({ message, research }: { message: string; research: PlutoResearchSummary }) {
  const [factsExpanded, setFactsExpanded] = useState(false);
  const visibleFacts = factsExpanded ? research.facts : research.facts.slice(0, 10);
  const services = research.facts.filter((fact) => fact.factType === "service");
  const locations = research.facts.filter((fact) => fact.factType === "address");

  return <article className="overflow-hidden rounded-xl border border-blue-500/35 bg-zinc-950 text-zinc-200 shadow-xl shadow-blue-950/20">
    <header className="border-b border-blue-500/25 bg-gradient-to-br from-blue-950/60 via-zinc-950 to-zinc-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-300">Business Intelligence</p><h3 className="mt-1 text-lg font-bold text-white">{research.businessName}</h3><a className="mt-1 block break-all text-xs text-blue-200 hover:text-white" href={research.websiteUrl} target="_blank" rel="noreferrer">{research.websiteUrl}</a></div><span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200">{research.status === "completed" ? "Research Complete" : "Generating Intelligence Report"}</span></div>
      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3"><Metric label="Researched" value={formatResearchTimestamp(research.fetchedAt)} /><Metric label="Research run" value={research.researchRunId} mono /><Metric label="Extracted facts" value={String(research.factCount)} /></div>
    </header>
    <div className="space-y-5 p-4">
      <DashboardSection title="Business Intelligence"><div className="grid gap-3 sm:grid-cols-2"><IntelligenceItem label="Company description" value={research.pageDescription ?? "Not identified from the researched page."} /><IntelligenceItem label="Industry" value="Not identified from the researched data." /><IntelligenceItem label="Services discovered" value={services.length ? services.map(factValue).join(" · ") : "No services discovered."} /><IntelligenceItem label="Locations discovered" value={locations.length ? locations.map(factValue).join(" · ") : "No locations discovered."} /></div></DashboardSection>
      <DashboardSection title={`Extracted Facts (${research.factCount})`} action={research.facts.length > 10 ? <button type="button" onClick={() => setFactsExpanded((expanded) => !expanded)} className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:border-blue-400 hover:text-white">{factsExpanded ? "Show less" : `Show all ${research.facts.length}`}</button> : null}><ul className="grid gap-2">{visibleFacts.map((fact, index) => <li key={`${fact.predicate}-${index}`} className="rounded-lg border border-zinc-800 bg-black/50 p-3 text-xs"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-bold uppercase tracking-wider text-blue-200">{formatLabel(fact.factType)}</span><span className="text-zinc-500">{Math.round(fact.confidence * 100)}% confidence</span></div><p className="mt-1 break-words text-zinc-200">{factValue(fact)}</p><a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 block truncate text-[11px] text-zinc-500 hover:text-blue-200">{fact.sourceUrl}</a></li>)}</ul></DashboardSection>
      <DashboardSection title="Findings">{research.findings.length ? <div className="grid gap-2">{research.findings.map((finding) => { const severity = severityFor(finding.confidence); return <div key={finding.title} className="rounded-lg border border-zinc-800 bg-black/50 p-3"><div className="flex flex-wrap items-center gap-2"><span className={`rounded px-2 py-1 text-[10px] font-black uppercase tracking-wider ${severity.className}`}>{severity.label}</span><h4 className="text-sm font-semibold text-white">{finding.title}</h4></div><p className="mt-2 text-xs leading-relaxed text-zinc-300">{finding.summary}</p></div>; })}</div> : <EmptyState label="No findings were generated from the researched data." />}</DashboardSection>
      <DashboardSection title="Recommendations">{research.recommendations.length ? <div className="grid gap-2">{research.recommendations.map((recommendation) => <div key={recommendation.title} className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3"><div className="flex gap-3"><span className="h-fit rounded bg-blue-500/20 px-2 py-1 text-[10px] font-black text-blue-100">P{recommendation.priority}</span><div><h4 className="text-sm font-semibold text-white">{recommendation.title}</h4><p className="mt-1 text-xs text-blue-100">{recommendation.action}</p><p className="mt-2 text-xs leading-relaxed text-zinc-400"><span className="font-semibold text-zinc-300">Expected business impact: </span>{recommendation.rationale}</p></div></div></div>)}</div> : <EmptyState label="No recommendations were generated from the researched data." />}</DashboardSection>
      <DashboardSection title="Executive Summary"><IntelligenceItem label={`${research.intelligence.executiveSummary.industry} · ${Math.round(research.intelligence.executiveSummary.confidence * 100)}% confidence`} value={research.intelligence.executiveSummary.description} /></DashboardSection>
      <DashboardSection title="Business Profile"><div className="grid gap-3 sm:grid-cols-2"><IntelligenceItem label="Services" value={reportList(Object.values(research.intelligence.businessProfile.services).flat())} /><IntelligenceItem label="Products" value={reportList(research.intelligence.businessProfile.products)} /><IntelligenceItem label="Service areas" value={reportList(research.intelligence.businessProfile.serviceAreas)} /><IntelligenceItem label="Locations" value={reportList(research.intelligence.businessProfile.locations)} /><IntelligenceItem label="Contact information" value={reportList([...research.intelligence.businessProfile.contacts.phones, ...research.intelligence.businessProfile.contacts.emails])} /><IntelligenceItem label="Operating hours" value={reportList(research.intelligence.businessProfile.operatingHours)} /></div></DashboardSection>
      <DashboardSection title="Trust Signals"><div className="grid gap-3 sm:grid-cols-2"><IntelligenceItem label="Reviews and testimonials" value={reportList([...research.intelligence.trustSignals.reviews, ...research.intelligence.trustSignals.testimonials])} /><IntelligenceItem label="Credentials and awards" value={reportList([...research.intelligence.trustSignals.certifications, ...research.intelligence.trustSignals.awards])} /><IntelligenceItem label="Guarantees and tenure" value={reportList([...research.intelligence.trustSignals.guarantees, ...research.intelligence.trustSignals.yearsInBusiness])} /><IntelligenceItem label="Social links" value={reportList(research.intelligence.businessProfile.socialLinks)} /></div></DashboardSection>
      <DashboardSection title="Digital Presence"><div className="grid gap-3 sm:grid-cols-2"><IntelligenceItem label="Website quality" value={reportList(research.intelligence.digitalPresence.websiteQuality)} /><IntelligenceItem label="Mobile friendliness" value={reportList(research.intelligence.digitalPresence.mobileFriendliness)} /><IntelligenceItem label="Navigation" value={reportList(research.intelligence.digitalPresence.navigation)} /><IntelligenceItem label="Contact accessibility" value={reportList(research.intelligence.digitalPresence.contactAccessibility)} /></div></DashboardSection>
      <DashboardSection title="Conversion Opportunities">{research.intelligence.conversionOpportunities.length ? <ul className="grid gap-2">{research.intelligence.conversionOpportunities.map((opportunity) => <li key={opportunity} className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-100">{opportunity}</li>)}</ul> : <EmptyState label="No immediate conversion gaps were detected." />}</DashboardSection>
      <DashboardSection title="Friction Analysis"><div className="grid gap-2 sm:grid-cols-2">{research.intelligence.frictionAnalysis.map((pillar) => <IntelligenceItem key={pillar.pillar} label={`${pillar.pillar} · ${pillar.score}/100`} value={pillar.recommendedFix} />)}</div></DashboardSection>
      <DashboardSection title="Revenue Opportunities">{research.intelligence.priorityRecommendations.length ? <div className="grid gap-2">{research.intelligence.priorityRecommendations.map((recommendation) => <IntelligenceItem key={recommendation.title} label={`${recommendation.priority} · ${recommendation.estimatedRevenueImpact} · ${recommendation.estimatedImplementationEffort} effort`} value={recommendation.action} />)}</div> : <EmptyState label="No immediate conversion gaps were detected." />}</DashboardSection>
      <DashboardSection title="Priority Actions">{research.intelligence.priorityRecommendations.length ? <ol className="grid gap-2">{research.intelligence.priorityRecommendations.map((recommendation) => <li key={recommendation.title} className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs"><p className="font-bold text-blue-100">{recommendation.priority}: {recommendation.title}</p><p className="mt-1 text-zinc-300">{recommendation.action}</p><p className="mt-2 text-zinc-500">Evidence: {reportList(recommendation.supportingEvidence)}</p></li>)}</ol> : <EmptyState label="No priority actions were generated." />}</DashboardSection>
      <DashboardSection title="Sources"><ul className="space-y-2">{research.sources.map((source) => <li key={source}><a href={source} target="_blank" rel="noreferrer" className="block break-all rounded-lg border border-zinc-800 bg-black/50 px-3 py-2 text-xs text-blue-200 hover:border-blue-500/50 hover:text-white">{source}</a></li>)}</ul></DashboardSection>
      <div className="grid gap-2 sm:grid-cols-2"><Metric label="Friction Score" value={`${frictionScore(research.intelligence.frictionAnalysis)}/100`} /><Metric label="Research Sources" value={String(research.sources.length)} /></div>
    </div>
    <p className="border-t border-zinc-800 px-4 py-3 text-[11px] text-zinc-500">Ellis AI Studio: {message}</p>
  </article>;
}

function DashboardSection({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) { return <section><div className="mb-2 flex items-center justify-between gap-3"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{title}</h4>{action}</div>{children}</section>; }
function Metric({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) { return <div><dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</dt><dd className={`mt-1 truncate text-zinc-200 ${mono ? "font-mono text-[11px]" : ""}`}>{value}</dd></div>; }
function IntelligenceItem({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-zinc-800 bg-black/50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</p><p className="mt-1 text-xs leading-relaxed text-zinc-200">{value}</p></div>; }
function reportList(values: string[]) { return values.length ? values.join(" · ") : "Not identified from the researched data."; }
function frictionScore(pillars: Array<{ score: number }>) { return pillars.length ? Math.round(pillars.reduce((total, pillar) => total + pillar.score, 0) / pillars.length) : 0; }
function EmptyState({ label }: { label: string }) { return <p className="rounded-lg border border-zinc-800 bg-black/50 px-3 py-2 text-xs text-zinc-500">{label}</p>; }
function factValue(fact: { value: unknown }) { return typeof fact.value === "string" ? fact.value : JSON.stringify(fact.value); }
function formatLabel(value: string) { return value.replace(/_/g, " "); }
function formatResearchTimestamp(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function severityFor(confidence: number) { if (confidence >= 0.9) return { label: "Critical", className: "bg-rose-500/20 text-rose-200" }; if (confidence >= 0.8) return { label: "High", className: "bg-orange-500/20 text-orange-200" }; if (confidence >= 0.65) return { label: "Medium", className: "bg-amber-500/20 text-amber-100" }; return { label: "Low", className: "bg-sky-500/20 text-sky-200" }; }

function formatIntent(intent: ParsedPlutoCommand["intent"]) {
  return intent
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
