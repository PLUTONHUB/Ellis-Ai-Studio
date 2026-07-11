import { useMemo, useState, type FormEvent } from "react";

import {
  parsePlutoCommand,
  plutoCommandExamples,
  type ParsedPlutoCommand,
} from "~/lib/pluto/nl-command";

export function PlutoCommandConsole() {
  const [command, setCommand] = useState<string>(plutoCommandExamples[0]);
  const [submittedCommand, setSubmittedCommand] = useState<string>(command);

  const parsedCommand = useMemo<ParsedPlutoCommand>(
    () => parsePlutoCommand(submittedCommand),
    [submittedCommand],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedCommand(command);
  };

  return (
    <section className="mx-auto mt-10 max-w-4xl rounded-2xl border border-blue-500/25 bg-black/70 p-4 text-left shadow-2xl shadow-blue-950/20 backdrop-blur md:p-5">
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
          Deterministic · No memory
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
            V1 maps defined commands to existing Ellis routes only — it does not store
            conversation history or trigger automation.
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
    </section>
  );
}

function formatIntent(intent: ParsedPlutoCommand["intent"]) {
  return intent
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
