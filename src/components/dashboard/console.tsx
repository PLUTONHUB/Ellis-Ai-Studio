/**
 * The internal console chrome.
 *
 * Ellis's own operating surface, not a public page and not a generic admin
 * template. It shares the product's palette and type exactly, and separates
 * itself from the public site with one device: an ink bar across the top. The
 * body stays on canvas, so a lead brief reads like the audit report it came
 * from rather than like a CRM.
 *
 * The gate is the same access check the server already enforces, given a
 * surface. It states plainly that the token is server-configured, and it never
 * hints at what is behind it.
 */

import { useState, type FormEvent, type ReactNode } from "react";
import "~/styles/system/content.css";
import "~/styles/system/audit.css";
// The console reuses the public surface's field, alert and handoff-rail
// treatments, so both stylesheets load together rather than being duplicated.
import "~/styles/system/lead.css";
import "~/styles/system/console.css";

export function Console({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  /** Rendered in the top bar, right of the product name. */
  breadcrumb?: ReactNode;
}) {
  return (
    <div className="console">
      <header className="console-bar">
        <div className="console-bar-inner">
          <a className="console-mark" href="/dashboard/leads">
            <span className="console-mark-name">Ellis</span>
            <span className="console-mark-suffix">Lead Intelligence</span>
          </a>
          <span className="console-scope">Internal</span>
          {breadcrumb && <div className="console-breadcrumb">{breadcrumb}</div>}
        </div>
      </header>
      <main className="console-body" id="main">{children}</main>
    </div>
  );
}

/* ------------------------------------------------------------------ gate */

export function ConsoleGate({ onUnlock }: { onUnlock: (token: string) => Promise<void> }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    void onUnlock(token)
      .catch(() => setError("That token was not accepted."))
      .finally(() => setBusy(false));
  };

  return (
    <div className="console-gate">
      <div className="console-gate-panel">
        <p className="label">Ellis Lead Intelligence</p>
        <h1 className="display-m">Internal access required.</h1>
        <p className="body">
          This surface holds qualification intelligence on real businesses. Access is granted by a
          server-configured token and nothing behind it is reachable without one.
        </p>
        <form className="console-gate-form" onSubmit={submit}>
          <div className="field lead-field">
            <label htmlFor="console-token">Access token</label>
            <input
              id="console-token" type="password" autoComplete="off" required
              value={token} onChange={(event) => setToken(event.target.value)}
            />
          </div>
          <button className="button button-solid" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Unlock console"}
          </button>
          {error && <p className="lead-alert" role="alert">{error}</p>}
        </form>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- empty state */

export function ConsoleEmpty({
  title,
  copy,
  sources,
}: {
  title: string;
  copy: string;
  sources?: readonly { label: string; detail: string }[];
}) {
  return (
    <div className="console-empty">
      <p className="label">Nothing here yet</p>
      <h2 className="display-m">{title}</h2>
      <p className="lede">{copy}</p>
      {sources && sources.length > 0 && (
        <ul className="console-empty-sources">
          {sources.map((source) => (
            <li key={source.label}>
              <span className="console-empty-source">{source.label}</span>
              <span>{source.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------------------------------- error surface */

export function ConsoleNotice({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return (
    <div className="console-notice" role="status">
      <p className="label">{title}</p>
      <p className="body">{copy}</p>
      {action}
    </div>
  );
}
