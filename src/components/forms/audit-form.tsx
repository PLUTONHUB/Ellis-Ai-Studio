import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitAudit } from "~/lib/audit-submit";
import { auditFieldsets, type AuditField } from "~/data/audit-form";
import type { AuditApplication } from "~/lib/audit-intake.server";
import type { LeadPublicResult } from "~/types/lead";
import { publicLeadSubmissionMessage } from "~/lib/lead-public-errors";
import { LeadResult } from "~/components/lead/result";
import "~/styles/system/audit.css";
import "~/styles/system/lead.css";

type Tone = "success" | "error" | "notice" | undefined;

function newSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `bottleneck_${crypto.randomUUID().replace(/-/g, "")}`;
  return `bottleneck_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function Field({ field }: { field: AuditField }) {
  const id = `f-${field.name}`;
  const wide = field.kind !== "text";
  const label = (
    <label htmlFor={id}>
      {field.label}{field.required && <span className="req" aria-hidden="true"> *</span>}
    </label>
  );
  return (
    <div className={`field${wide ? " field-wide" : ""}`}>
      {label}
      {field.kind === "text" && (
        <input id={id} name={field.name} type={field.type ?? "text"} required={field.required} autoComplete={field.autoComplete} />
      )}
      {field.kind === "textarea" && <textarea id={id} name={field.name} required={field.required} />}
      {field.kind === "select" && (
        <select id={id} name={field.name} required={field.required} defaultValue="">
          <option value="" disabled>Select one</option>
          {field.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      )}
    </div>
  );
}

export function AuditForm() {
  const submit = useServerFn(submitAudit);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<Tone>();
  const [busy, setBusy] = useState(false);
  // This is created once for the mounted form. A failed or ambiguous request
  // retries with the same idempotency key; a new visit starts a new attempt.
  const [requestId] = useState(newSubmissionId);
  const [result, setResult] = useState<LeadPublicResult>();
  const [businessName, setBusinessName] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const url = new URL(window.location.href);
    const payload = {
      ...data,
      requestId,
      source: url.searchParams.get("utm_source") ?? "direct",
      campaign: url.searchParams.get("utm_campaign") ?? "",
      landingPage: window.location.pathname,
    } as unknown as AuditApplication;

    setBusy(true);
    try {
      const response = await submit({ data: payload });
      setBusinessName(data.businessName ?? "Your business");
      setResult(response);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
      setTone("error");
      setStatus(publicLeadSubmissionMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (result) return <LeadResult result={result} businessName={businessName} />;

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      {auditFieldsets.map((set) => (
        <fieldset className="fieldset" key={set.legend}>
          <legend className="label">{set.legend}</legend>
          {set.hint && <p className="small">{set.hint}</p>}
          <div className="field-grid">
            {set.fields.map((field) => <Field key={field.name} field={field} />)}
          </div>
        </fieldset>
      ))}
      <div className="form-actions">
        <button className="button button-solid" type="submit" disabled={busy}>
          {busy ? "Analyzing…" : "Understand my bottleneck"}
        </button>
        {status && <p className="form-status" data-tone={tone} role="status" aria-live="polite">{status}</p>}
      </div>
    </form>
  );
}
