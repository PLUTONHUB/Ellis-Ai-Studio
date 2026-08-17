/**
 * The roadmap unlock.
 *
 * Lead-capture philosophy, made concrete: by the time this appears the visitor
 * already has their score, their business profile, the pillar read-out, the
 * customer journey and their single highest-priority opportunity in full. The
 * gate asks for two fields to continue, and the report unlocks whether or not
 * the webhook behind it is configured — the analysis is theirs either way.
 *
 * Explicitly not here: countdown timers, a fake "3 people are viewing",
 * pre-ticked consent, a dismiss button labelled to shame the visitor, or a
 * blurred-into-illegibility preview.
 */

import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { requestAuditUnlock } from "~/lib/audit-unlock";
import { emails } from "~/data/links";
import type { AuditReport } from "~/types/audit";

const INCLUDED = [
  "Every opportunity identified, scored and explained",
  "Your three-phase automation roadmap",
  "The system architecture we would propose",
  "The discovery questions to validate each finding",
];

export function RoadmapUnlock({
  report,
  remaining,
  onUnlock,
}: {
  report: AuditReport;
  /** How many opportunities are still behind the gate. */
  remaining: number;
  onUnlock: () => void;
}) {
  const submit = useServerFn(requestAuditUnlock);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    setBusy(true);
    setError("");
    try {
      await submit({
        data: {
          name: data.name ?? "",
          email: data.email ?? "",
          company: data.company,
          reportId: report.id,
          website: report.profile.website,
          automationOpportunity: report.automationOpportunity,
        },
      });
      onUnlock();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      // A validation message is the visitor's to fix. Anything else is ours,
      // and it must not stand between them and the report they were promised.
      if (message.startsWith("Please ")) setError(message);
      else onUnlock();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="unlock reveal">
      <div className="unlock-copy">
        <p className="label">Continue</p>
        <h2 className="display-m">Unlock your complete automation roadmap.</h2>
        <p className="body">
          You have seen the score, the profile and your highest-priority opportunity.{" "}
          {remaining > 0 && (
            <>
              There {remaining === 1 ? "is" : "are"} {remaining} more{" "}
              {remaining === 1 ? "opportunity" : "opportunities"} in this report.{" "}
            </>
          )}
          Add your details and the rest opens on this page.
        </p>
        <ul className="unlock-list">
          {INCLUDED.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <form className="unlock-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="unlock-name">Name</label>
          <input id="unlock-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="unlock-email">Email</label>
          <input id="unlock-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="unlock-company">Business name <span className="small">(optional)</span></label>
          <input id="unlock-company" name="company" type="text" autoComplete="organization" defaultValue={report.profile.name} />
        </div>
        <button className="button button-rust" type="submit" disabled={busy}>
          {busy ? "Opening…" : "Show me the full roadmap"}
        </button>
        {error && <p className="url-error" role="alert">{error}</p>}
        <p className="unlock-fineprint">
          No account. No newsletter. We use this to send your report and, if you want it, to
          arrange a discovery conversation. Questions go to {emails.jake}.
        </p>
      </form>
    </div>
  );
}

/** Shown once the gate has been passed, in its place. */
export function UnlockConfirmation({ name }: { name?: string }) {
  return (
    <div className="evidence-disclosure" role="status">
      <span className="label">Unlocked</span>
      <p>
        The full report is open below{name ? `, ${name}` : ""}. Use <strong>Save as PDF</strong> at
        the end of the report to keep a copy, or send the link to anyone else who should see it.
      </p>
    </div>
  );
}
