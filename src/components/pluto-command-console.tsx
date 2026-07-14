import { useMemo, useState, type FormEvent } from "react";

import {
  parsePlutoCommand,
  plutoCommandExamples,
  type ParsedPlutoCommand,
} from "~/lib/pluto/nl-command";
import { processCommand } from "~/services/plutoEngine";

const legacyRuntimeExamples = [
  "hello",
  "time",
  "date",
  "remember favorite color blue",
  "what is my favorite",
  "create task follow up with new lead",
  "show tasks",
  "complete task 1",
] as const;

export function PlutoCommandConsole() {
  const [command, setCommand] = useState<string>(plutoCommandExamples[0]);
  const [submittedCommand, setSubmittedCommand] = useState<string>(command);
  const [runtimeInput, setRuntimeInput] = useState<string>(legacyRuntimeExamples[0]);
  const [runtimeMessages, setRuntimeMessages] = useState<string[]>([
    "Pluto: Ready for your first command.",
  ]);

  const parsedCommand = useMemo<ParsedPlutoCommand>(
    () => parsePlutoCommand(submittedCommand),
    [submittedCommand],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedCommand(command);
  };

  const runRuntimeCommand = (rawCommand: string) => {
    const trimmedCommand = rawCommand.trim();

    if (!trimmedCommand) return;

    const response = processCommand(trimmedCommand);

    setRuntimeMessages((previousMessages) => [
      ...previousMessages,
      `You: ${trimmedCommand}`,
      `Pluto: ${response}`,
    ]);
    setRuntimeInput("");
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
              Pluto Command Understanding v1
            </p>
            <h2 className="text-base font-bold text-white md:text-lg">
              Tell Pluto what you want to do next.
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
              recognition separate from Pluto&apos;s classic runtime tools.
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
              Classic Pluto Runtime
            </p>
            <h2 className="text-base font-bold text-white md:text-lg">
              Memory, tasks, and utility commands still work.
            </h2>
          </div>
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Session memory only
          </span>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <div className="max-h-72 min-h-56 space-y-3 overflow-y-auto pr-1">
            {runtimeMessages.map((message, index) => (
              <p
                key={`${message}-${index}`}
                className="whitespace-pre-wrap rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
              >
                {message}
              </p>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleRuntimeSubmit}
          className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"
        >
          <label className="sr-only" htmlFor="pluto-runtime-input">
            Pluto runtime command
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
          Legacy Pluto commands are processed by the original runtime service and stored
          in memory for the current browser session.
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

function formatIntent(intent: ParsedPlutoCommand["intent"]) {
  return intent
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
