/*
 * Zone 8 preview — service request form.
 *
 * ⚠️  NON-PRODUCTION BY CONSTRUCTION. This form has no action, no fetch, no
 * server function and no storage. Submitting it transitions local component
 * state and nothing else — no data leaves the browser, and nothing reaches Zone
 * 8, Ellis AI Studio or any third party. That is deliberate: capturing a real
 * homeowner's plumbing emergency into a pitch demo, with no one on the other end
 * to answer it, would be worse than the expired site this preview replaces.
 *
 * The Smart Request Routing card is the Ellis capability demo — see
 * ~/lib/zone8-routing. It runs locally on what the visitor types.
 */

import { useMemo, useState, type FormEvent } from "react";
import { business, serviceOptions, urgencyOptions } from "~/data/zone8";
import { routeRequest, urgencyTone } from "~/lib/zone8-routing";
import { Icon } from "~/components/zone8/primitives";

type Errors = Partial<Record<"name" | "phone" | "service", string>>;

export function RequestForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("");
  const [urgency, setUrgency] = useState<string>("today");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  // Runs on every keystroke; returns null until the text carries real signal.
  const routing = useMemo(() => routeRequest(details), [details]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Please tell us your name.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "A 10-digit phone number lets Zone 8 call you back.";
    if (!service) next.service = "Choose the closest match — “Other” is fine.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    // Intentionally terminal: state only. Nothing is transmitted or persisted.
    setSent(true);
  }

  if (sent) {
    const chosen = serviceOptions.find((o) => o.value === service)?.label ?? "Service request";
    const when = urgencyOptions.find((o) => o.value === urgency)?.label ?? "";
    return (
      <div className="z8-confirm z8-reveal" role="status">
        <span className="z8-confirm-mark"><Icon name="check" size={22} /></span>
        <div className="z8-stack z8-g3" style={{ justifyItems: "center" }}>
          <h2 className="z8-display-m">Thanks — your request has been received.</h2>
          <p className="z8-body z8-measure">
            Zone 8 will follow up to confirm next steps and the price for the work before anything begins.
          </p>
        </div>
        <div className="z8-confirm-summary">
          <p className="z8-label">Your request</p>
          <div className="z8-routing-row"><span className="z8-routing-key">Name</span><span className="z8-routing-val">{name}</span></div>
          <div className="z8-routing-row"><span className="z8-routing-key">Phone</span><span className="z8-routing-val">{phone}</span></div>
          <div className="z8-routing-row"><span className="z8-routing-key">Service</span><span className="z8-routing-val">{chosen}</span></div>
          <div className="z8-routing-row"><span className="z8-routing-key">Urgency</span><span className="z8-routing-val">{when}</span></div>
        </div>
        <p className="z8-xs" style={{ maxWidth: "46ch" }}>
          <strong>Preview only:</strong> this concept form does not transmit or store anything. No request
          was sent to Zone 8. For a real plumbing problem, call{" "}
          <a className="z8-textlink" href={business.phoneHref}>{business.phone}</a>.
        </p>
        <button type="button" className="z8-btn z8-btn-outline z8-btn-sm" onClick={() => setSent(false)}>
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form className="z8-form" onSubmit={submit} noValidate>
      <div className="z8-form-grid">
        <div className="z8-field">
          <label htmlFor="z8-name">Name</label>
          <input
            id="z8-name" className="z8-input" value={name} autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "z8-name-err" : undefined}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name ? <p className="z8-error" id="z8-name-err">{errors.name}</p> : null}
        </div>

        <div className="z8-field">
          <label htmlFor="z8-phone">Phone</label>
          <input
            id="z8-phone" className="z8-input" type="tel" inputMode="tel" value={phone} autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "z8-phone-err" : undefined}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone ? <p className="z8-error" id="z8-phone-err">{errors.phone}</p> : null}
        </div>

        <div className="z8-field">
          <label htmlFor="z8-email">Email <span className="z8-optional">— optional</span></label>
          <input id="z8-email" className="z8-input" type="email" inputMode="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="z8-field">
          <label htmlFor="z8-address">Service address or ZIP</label>
          <input id="z8-address" className="z8-input" value={address} autoComplete="street-address" placeholder="98116" onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="z8-field">
          <label htmlFor="z8-service">What do you need help with?</label>
          <select
            id="z8-service" className="z8-select" value={service}
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={errors.service ? "z8-service-err" : undefined}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Select a service</option>
            {serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {errors.service ? <p className="z8-error" id="z8-service-err">{errors.service}</p> : null}
        </div>

        <div className="z8-field">
          <label htmlFor="z8-urgency">How urgent is it?</label>
          <select id="z8-urgency" className="z8-select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            {urgencyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="z8-field z8-field-full">
          <label htmlFor="z8-details">Tell us what’s happening</label>
          <textarea
            id="z8-details" className="z8-textarea" value={details}
            placeholder="e.g. basement drain backing up and water coming through"
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        {routing ? (
          <div className="z8-field-full">
            <SmartRouting
              category={routing.categoryLabel}
              urgency={urgencyTone(routing.urgency)}
              action={routing.action}
              onApply={() => { setService(routing.category); setUrgency(routing.urgency); }}
              applied={service === routing.category && urgency === routing.urgency}
            />
          </div>
        ) : null}

        <div className="z8-field z8-field-full">
          {/* Presentational only — no file is read, uploaded or transmitted. */}
          <div className="z8-upload">
            <Icon name="camera" size={19} />
            <span><strong>Add a photo</strong> — optional, and it usually speeds up the quote</span>
            <span>Photo upload is shown for the concept and is not active in this preview</span>
          </div>
        </div>
      </div>

      <div className="z8-stack z8-g3">
        <button type="submit" className="z8-btn z8-btn-primary z8-btn-block">Request Service</button>
        <p className="z8-xs" style={{ textAlign: "center" }}>
          Urgent? Calling is faster — <a className="z8-textlink" href={business.phoneHref}>{business.phone}</a>
        </p>
        <p className="z8-xs" style={{ textAlign: "center" }}>
          Concept preview — this form does not send or store anything.
        </p>
      </div>
    </form>
  );
}

/*
 * The Ellis AI Studio capability demo.
 *
 * Framed as a request summary, not as "AI". A homeowner sees the site being
 * organised on their behalf; the owner watching the pitch sees a lead arriving
 * pre-triaged. The technical vocabulary stays out of the customer's way.
 */
function SmartRouting({ category, urgency, action, onApply, applied }: {
  category: string; urgency: string; action: string; onApply: () => void; applied: boolean;
}) {
  return (
    <div className="z8-routing" role="status" aria-live="polite">
      <div className="z8-routing-head">
        <span className="z8-routing-title">Request summary</span>
        <span className="z8-routing-tag">Smart Request Routing — Preview</span>
      </div>
      <div className="z8-routing-rows">
        <div className="z8-routing-row"><span className="z8-routing-key">Likely category</span><span className="z8-routing-val">{category}</span></div>
        <div className="z8-routing-row"><span className="z8-routing-key">Urgency</span><span className="z8-routing-val">{urgency}</span></div>
        <div className="z8-routing-row"><span className="z8-routing-key">Preferred action</span><span className="z8-routing-val">{action}</span></div>
      </div>
      <button type="button" className="z8-btn z8-btn-outline z8-btn-sm" onClick={onApply} disabled={applied}>
        {applied ? "Applied to your request" : "Use these answers"}
      </button>
    </div>
  );
}
