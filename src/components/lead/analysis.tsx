/**
 * The in-flight state, after the intake is submitted.
 *
 * Honest by construction. The server performs one round trip — interpret,
 * score, qualify, persist — and reports nothing back until it is finished, so
 * this view must not tick items off as though it were watching them complete.
 *
 * What it does instead: names the work that is happening, holds all of it in a
 * single live state, and moves one indeterminate indicator. Nothing here
 * claims a stage finished, because nothing on this side of the wire knows.
 */

export const ANALYSIS_WORK = [
  "Reading the business challenge in your own words",
  "Placing it against the problems Ellis builds systems for",
  "Matching it to the system most likely to fit",
  "Working out what still needs to be confirmed",
] as const;

export function LeadAnalysisState({ businessName }: { businessName: string }) {
  return (
    <section className="lead-analysis" aria-busy="true">
      <div className="lead-analysis-head">
        <p className="label">Analysis in progress</p>
        <h1 className="display-m">Reading what you told us.</h1>
        <p className="lead-analysis-target">{businessName}</p>
      </div>

      <div className="lead-analysis-rail" aria-hidden="true">
        <span className="lead-analysis-rail-run" />
      </div>

      <ul className="lead-analysis-work">
        {ANALYSIS_WORK.map((item) => <li key={item}>{item}</li>)}
      </ul>

      <p className="visually-hidden" role="status" aria-live="polite">
        Analyzing your submission. This usually takes a few seconds.
      </p>

      <p className="lead-analysis-foot">
        This reads only what you submitted. It does not assume anything about your tools, your
        team or your numbers — anything it cannot establish comes back as a question rather than
        a conclusion.
      </p>
    </section>
  );
}
