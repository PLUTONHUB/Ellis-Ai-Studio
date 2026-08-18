/**
 * The public intake.
 *
 * A guided sequence rather than one long form. Four steps, each answering a
 * single question about the business, with only the current step mounted:
 *
 *   01  Business context      — who this is
 *   02  What happens today    — the process as it actually runs
 *   03  Where you want to get to
 *   04  Timing and contact
 *
 * Only mounting the live step is a deliberate mechanism, not a rendering
 * convenience: it means native `required` validation applies to exactly the
 * fields on screen, so the browser's own error handling can do the work and
 * nothing invisible can ever block the submit button with no explanation.
 *
 * Fully controlled — both the answers and the step index are owned by the
 * page. That is what lets a failed submission come back to the exact place it
 * left, with every answer still in the field the visitor typed it into.
 *
 * Nothing here validates business rules. `validateLeadIntake` on the server
 * remains the only authority on whether a submission is acceptable.
 */

import { type FormEvent, type ReactNode } from "react";
import { URGENCY_CHOICES } from "~/lib/lead-presentation";
import type { AuditLeadContext, LeadIntake, LeadUrgency } from "~/types/lead";

const STEPS = [
  { label: "Business context", title: "First, confirm the business." },
  { label: "What happens today", title: "Now describe what actually happens." },
  { label: "Where you want to get to", title: "What should happen instead?" },
  { label: "Timing and contact", title: "Last part — timing, and where to reach you." },
] as const;

function newRequestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function initialIntake(auditContext?: AuditLeadContext): LeadIntake {
  return {
    requestId: newRequestId(),
    source: auditContext ? "audit_handoff" : "direct_intake",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: auditContext?.businessName ?? "",
    website: auditContext?.website ?? "",
    industry: auditContext?.industry ?? "",
    location: auditContext?.location ?? "",
    primaryChallenge: "",
    desiredOutcome: "",
    urgency: "exploring",
    additionalContext: "",
    approximateMonthlyLeadVolume: "",
    currentTools: "",
    currentProcess: "",
    biggestManualBottleneck: "",
    auditContext,
  };
}

/* ------------------------------------------------------------------ field */

function Field({
  id,
  label,
  hint,
  optional,
  wide,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`field lead-field${wide ? " field-wide" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="lead-field-optional"> optional</span>}
      </label>
      {children}
      {hint && <p className="lead-field-hint" id={`${id}-hint`}>{hint}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------- steps */

type StepProps = {
  form: LeadIntake;
  update: (key: keyof LeadIntake, value: string) => void;
  auditContext?: AuditLeadContext;
};

function BusinessStep({ form, update, auditContext }: StepProps) {
  return (
    <>
      {auditContext && (
        <p className="lead-step-note">
          Carried over from your audit. Correct anything that is not quite right.
        </p>
      )}
      <div className="lead-field-grid">
        <Field id="li-business" label="Business name" wide>
          <input
            id="li-business" name="businessName" type="text" required
            autoComplete="organization" value={form.businessName}
            onChange={(e) => update("businessName", e.target.value)}
          />
        </Field>
        <Field id="li-website" label="Website" optional hint="So we can see what a customer sees.">
          <input
            id="li-website" name="website" type="text" inputMode="url" spellCheck={false}
            autoComplete="url" placeholder="yourbusiness.com" value={form.website ?? ""}
            onChange={(e) => update("website", e.target.value)}
          />
        </Field>
        <Field id="li-industry" label="Industry" optional hint="For example: roofing, dental, legal services.">
          <input
            id="li-industry" name="industry" type="text" value={form.industry ?? ""}
            onChange={(e) => update("industry", e.target.value)}
          />
        </Field>
        <Field id="li-location" label="Location" optional wide hint="City and state is enough.">
          <input
            id="li-location" name="location" type="text" value={form.location ?? ""}
            onChange={(e) => update("location", e.target.value)}
          />
        </Field>
      </div>
    </>
  );
}

function TodayStep({ form, update }: StepProps) {
  return (
    <div className="lead-field-grid">
      <Field
        id="li-challenge"
        label="What is slowing the business down?"
        wide
        hint="Plain language is best. What goes wrong, who it lands on, and how often."
      >
        <textarea
          id="li-challenge" name="primaryChallenge" required rows={4}
          placeholder="Every estimate request lands in a shared inbox and someone has to read it, decide who should own it and reply. When we are busy, that can take most of a day."
          value={form.primaryChallenge}
          onChange={(e) => update("primaryChallenge", e.target.value)}
        />
      </Field>
      <Field
        id="li-process"
        label="How are new inquiries handled today?"
        optional
        wide
        hint="Walk through the steps as they actually happen, including the manual ones."
      >
        <textarea
          id="li-process" name="currentProcess" rows={3}
          value={form.currentProcess ?? ""}
          onChange={(e) => update("currentProcess", e.target.value)}
        />
      </Field>
      <Field id="li-bottleneck" label="The biggest manual step" optional hint="The part that always needs a person.">
        <input
          id="li-bottleneck" name="biggestManualBottleneck" type="text"
          value={form.biggestManualBottleneck ?? ""}
          onChange={(e) => update("biggestManualBottleneck", e.target.value)}
        />
      </Field>
      <Field id="li-volume" label="Inquiries per month" optional hint="An approximate number is fine.">
        <input
          id="li-volume" name="approximateMonthlyLeadVolume" type="text" inputMode="numeric"
          placeholder="60"
          value={form.approximateMonthlyLeadVolume ?? ""}
          onChange={(e) => update("approximateMonthlyLeadVolume", e.target.value)}
        />
      </Field>
    </div>
  );
}

function OutcomeStep({ form, update }: StepProps) {
  return (
    <div className="lead-field-grid">
      <Field
        id="li-outcome"
        label="What should happen instead?"
        wide
        hint="Describe the result, not the technology. We will work out what to build."
      >
        <textarea
          id="li-outcome" name="desiredOutcome" required rows={4}
          placeholder="Every inquiry gets an immediate, useful response, and only the ones worth quoting reach the estimating team."
          value={form.desiredOutcome}
          onChange={(e) => update("desiredOutcome", e.target.value)}
        />
      </Field>
      <Field id="li-tools" label="Tools already in use" optional wide hint="CRM, inbox, scheduling, spreadsheets — whatever the process runs on today.">
        <input
          id="li-tools" name="currentTools" type="text"
          value={form.currentTools ?? ""}
          onChange={(e) => update("currentTools", e.target.value)}
        />
      </Field>
      <Field id="li-context" label="Anything else worth knowing" optional wide>
        <textarea
          id="li-context" name="additionalContext" rows={3}
          value={form.additionalContext ?? ""}
          onChange={(e) => update("additionalContext", e.target.value)}
        />
      </Field>
    </div>
  );
}

function ContactStep({ form, update }: StepProps) {
  return (
    <>
      <fieldset className="urgency">
        <legend className="label">How pressing is this?</legend>
        <div className="urgency-options">
          {URGENCY_CHOICES.map((choice) => (
            <label className="urgency-option" key={choice.value} data-selected={form.urgency === choice.value}>
              <input
                type="radio" name="urgency" value={choice.value}
                checked={form.urgency === choice.value}
                onChange={() => update("urgency", choice.value satisfies LeadUrgency)}
              />
              <span className="urgency-option-label">{choice.label}</span>
              <span className="urgency-option-detail">{choice.detail}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="lead-field-grid">
        <Field id="li-first" label="First name">
          <input
            id="li-first" name="firstName" type="text" required autoComplete="given-name"
            value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
          />
        </Field>
        <Field id="li-last" label="Last name">
          <input
            id="li-last" name="lastName" type="text" required autoComplete="family-name"
            value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
          />
        </Field>
        <Field id="li-email" label="Email" wide hint="Where the summary of this conversation goes.">
          <input
            id="li-email" name="email" type="email" required autoComplete="email"
            value={form.email} onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field id="li-phone" label="Phone" optional wide>
          <input
            id="li-phone" name="phone" type="tel" autoComplete="tel"
            value={form.phone ?? ""} onChange={(e) => update("phone", e.target.value)}
          />
        </Field>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ flow */

export function LeadIntakeFlow({
  form,
  step,
  auditContext,
  busy,
  error,
  onChange,
  onStep,
  onSubmit,
}: {
  form: LeadIntake;
  step: number;
  auditContext?: AuditLeadContext;
  busy: boolean;
  error?: string;
  onChange: (key: keyof LeadIntake, value: string) => void;
  onStep: (index: number) => void;
  onSubmit: () => void;
}) {
  const last = step === STEPS.length - 1;

  const advance = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (last) {
      onSubmit();
      return;
    }
    onStep(step + 1);
  };

  const stepProps: StepProps = { form, update: onChange, auditContext };

  return (
    <div className="intake">
      <ol className="intake-progress" aria-label="Progress">
        {STEPS.map((definition, i) => {
          const state = i < step ? "done" : i === step ? "current" : "ahead";
          return (
            <li className="intake-progress-step" key={definition.label} data-state={state}>
              <span className="intake-progress-bar" aria-hidden="true" />
              <span className="intake-progress-label">
                <span className="intake-progress-index">{String(i + 1).padStart(2, "0")}</span>
                {definition.label}
                {state === "current" && <span className="visually-hidden"> — current step</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <form className="intake-form" onSubmit={advance} noValidate={false}>
        {/* Keyed so each step animates in rather than fields silently swapping. */}
        <div className="intake-step" key={step}>
          <h2 className="intake-step-title">{STEPS[step].title}</h2>

          {step === 0 && <BusinessStep {...stepProps} />}
          {step === 1 && <TodayStep {...stepProps} />}
          {step === 2 && <OutcomeStep {...stepProps} />}
          {step === 3 && <ContactStep {...stepProps} />}
        </div>

        <div className="intake-actions">
          <button className="button button-rust" type="submit" disabled={busy}>
            {busy ? "Sending…" : last ? "Understand my opportunity" : "Continue"}
          </button>
          {step > 0 && (
            <button
              className="intake-back"
              type="button"
              onClick={() => onStep(Math.max(0, step - 1))}
              disabled={busy}
            >
              Back
            </button>
          )}
          <p className="intake-count" aria-hidden="true">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        {error && <p className="lead-alert" role="alert">{error}</p>}
      </form>
    </div>
  );
}
