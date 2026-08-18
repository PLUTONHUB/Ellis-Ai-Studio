/**
 * Ellis Lead Intelligence — the public page flow.
 *
 * The second half of the AI Opportunity Audit, and built to read that way.
 * Four states behind one URL, exactly as the audit does it:
 *
 *   intake     — guided, four steps, audit context carried across the top
 *   analyzing  — one honest in-flight state
 *   result     — a short consultation the visitor can act on
 *   error      — calm, specific, and never a raw backend message
 *
 * The audit context arrives in the query string, which only exists in the
 * browser. Reading it during render would make the server and the first client
 * paint disagree, so it is read after mount and merged into the intake — the
 * handoff band and the prefilled fields then arrive together, animated in,
 * rather than flickering into place.
 *
 * The answers and the step index are owned here rather than inside the intake,
 * so a failed submission can return the visitor to exactly where they were
 * with everything they typed still in place.
 */

import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "~/components/layout/site-shell";
import { AuditHandoff } from "~/components/lead/audit-handoff";
import { LeadAnalysisState } from "~/components/lead/analysis";
import { LeadIntakeFlow, initialIntake } from "~/components/lead/intake";
import { LeadResult } from "~/components/lead/result";
import { auditContextFromSearch } from "~/lib/audit-lead-handoff";
import { routes, studio } from "~/data/links";
import type { AuditLeadContext, LeadIntake, LeadPublicResult } from "~/types/lead";
import "~/styles/system/content.css";
import "~/styles/system/audit.css";
import "~/styles/system/lead.css";

type Phase =
  | { name: "intake" }
  | { name: "analyzing"; businessName: string }
  | { name: "result"; result: LeadPublicResult; businessName: string }
  | { name: "error"; message: string };

/**
 * A submission failure is never shown as the raw thrown message. The service
 * distinguishes two kinds — something the visitor can fix, and something on
 * our side — and only the first is worth repeating back to them verbatim.
 */
function readableError(reason: unknown): string {
  const message = reason instanceof Error ? reason.message.trim() : "";
  if (!message) return "We could not send that just now. Please try again in a moment.";
  if (message.startsWith("This submission has already been received")) {
    return "We already have this submission — there is no need to send it again. Check your email for the summary.";
  }
  // Validation messages are short, end in a full stop and describe a field.
  if (message.length < 140 && !/fetch|network|undefined|null|token|api|sql|pg|http/i.test(message)) {
    return message;
  }
  return "We could not complete the analysis just now. Your details were not lost — please try again in a moment.";
}

/* --------------------------------------------------------------- opener */

function IntakeOpener({ auditContext }: { auditContext?: AuditLeadContext }) {
  if (auditContext) {
    return (
      <div className="lead-opener">
        <AuditHandoff context={auditContext} />
        <div className="lead-opener-copy">
          <h1 className="display-l enter" style={{ "--i": 1 } as React.CSSProperties}>
            Now let's validate it.
          </h1>
          <p className="lede enter" style={{ "--i": 2 } as React.CSSProperties}>
            The audit found the opportunity from the outside. These questions cover the part
            public information cannot reach — how the process actually runs, and what it costs
            when it slips.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-opener lead-opener-direct">
      <div className="lead-opener-copy">
        <p className="label enter">Ellis Lead Intelligence</p>
        <h1 className="display-l enter" style={{ "--i": 1 } as React.CSSProperties}>
          Tell us what is slowing the business down.
        </h1>
        <p className="lede enter" style={{ "--i": 2 } as React.CSSProperties}>
          Describe the problem in your own words. We will read it, place it against the systems we
          build, and come back with what we would build, what we would need to confirm first, and
          the next step worth taking.
        </p>
        <ul className="lead-opener-meta enter" style={{ "--i": 3 } as React.CSSProperties}>
          <li>Four short steps</li>
          <li>No account</li>
          <li>A useful answer either way</li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export function LeadIntelligencePage({
  submit,
}: {
  submit: (options: { data: LeadIntake }) => Promise<LeadPublicResult>;
}) {
  const send = useServerFn(submit);
  const [auditContext, setAuditContext] = useState<AuditLeadContext>();
  const [form, setForm] = useState<LeadIntake>(() => initialIntake());
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>({ name: "intake" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  // Runs once, before any interaction is possible, so `||` can never overwrite
  // something the visitor has already typed.
  useEffect(() => {
    const context = auditContextFromSearch(window.location.search);
    if (!context) return;
    setAuditContext(context);
    setForm((current) => ({
      ...current,
      source: "audit_handoff",
      auditContext: context,
      businessName: current.businessName || context.businessName || "",
      website: current.website || context.website || "",
      industry: current.industry || context.industry || "",
      location: current.location || context.location || "",
    }));
  }, []);

  const onChange = useCallback((key: keyof LeadIntake, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  }, []);

  const onSubmit = useCallback(() => {
    setBusy(true);
    setError(undefined);
    setPhase({ name: "analyzing", businessName: form.businessName });
    window.scrollTo({ top: 0, behavior: "auto" });

    void send({ data: form })
      .then((result) => setPhase({ name: "result", result, businessName: form.businessName }))
      .catch((reason) => {
        const message = readableError(reason);
        setError(message);
        setPhase({ name: "error", message });
      })
      .finally(() => setBusy(false));
  }, [form, send]);

  return (
    <SiteShell>
      <div className="lead-surface">
        <div className="container-narrow">
          {phase.name === "intake" && (
            <>
              <IntakeOpener auditContext={auditContext} />
              <LeadIntakeFlow
                form={form}
                step={step}
                auditContext={auditContext}
                busy={busy}
                error={error}
                onChange={onChange}
                onStep={setStep}
                onSubmit={onSubmit}
              />
            </>
          )}

          {phase.name === "analyzing" && <LeadAnalysisState businessName={phase.businessName} />}

          {phase.name === "result" && (
            <LeadResult
              result={phase.result}
              businessName={phase.businessName}
              auditContext={auditContext}
            />
          )}

          {phase.name === "error" && (
            <div className="lead-state">
              <p className="label">Submission paused</p>
              <h1 className="display-l">We could not finish that just now.</h1>
              <p className="lede">{phase.message}</p>
              <div className="hero-actions">
                <button
                  className="button button-solid"
                  type="button"
                  onClick={() => setPhase({ name: "intake" })}
                >
                  Go back to my answers
                </button>
                <a className="link" href={studio.booking} target="_blank" rel="noreferrer">
                  Book a conversation instead
                </a>
              </div>
              <p className="small">
                If this keeps happening, the audit at{" "}
                <a className="lead-inline-link" href={routes.audit}>ellisaistudio.com/audit</a> is
                a good place to start instead.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
