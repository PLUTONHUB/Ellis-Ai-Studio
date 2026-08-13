import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitAudit, auditEmailBody } from "~/lib/audit-submit";
import { auditFieldsets, type AuditField } from "~/data/audit-form";
import { emails } from "~/data/links";
import type { AuditApplication } from "~/lib/audit-intake.server";

type Tone = "success" | "error" | "notice" | undefined;

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const url = new URL(window.location.href);
    const payload = {
      ...data,
      source: url.searchParams.get("utm_source") ?? "direct",
      campaign: url.searchParams.get("utm_campaign") ?? "",
      landingPage: window.location.pathname,
    } as unknown as AuditApplication;

    setBusy(true);
    try {
      const result = await submit({ data: payload });
      if (result.delivered) {
        form.reset();
        setTone("success");
        setStatus("Thank you — your audit request was sent. We'll be in touch shortly.");
        return;
      }
      // No webhook configured: hand the completed application to the visitor's
      // mail client rather than claiming a delivery that did not happen.
      const subject = `Business Bottleneck Audit — ${data.businessName ?? ""}`.trim();
      window.location.href = `mailto:${emails.jake}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(auditEmailBody(payload as unknown as Record<string, string>))}`;
      setTone("notice");
      setStatus(`Your email app is opening with the completed application — press send and it reaches ${emails.jake}.`);
    } catch (error) {
      setTone("error");
      setStatus(error instanceof Error ? error.message : `We couldn't send that. Please email ${emails.jake} directly.`);
    } finally {
      setBusy(false);
    }
  };

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
          {busy ? "Sending…" : "Request my audit"}
        </button>
        {status && <p className="form-status" data-tone={tone} role="status" aria-live="polite">{status}</p>}
      </div>
    </form>
  );
}
