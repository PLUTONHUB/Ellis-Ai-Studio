/**
 * The public result — a short consultation, not a receipt.
 *
 * By the time this renders, the prospect has described a problem and Ellis has
 * something useful to say about it. Saying "thanks, we'll be in touch" would
 * waste the only moment where their attention and the analysis coincide.
 *
 * What is deliberately NOT here, and must never be added:
 *
 *   opportunity score · problem fit · potential impact · urgency score ·
 *   implementation fit · intent · qualification class · qualification
 *   confidence · internal reasoning · pipeline status · the internal next
 *   action label
 *
 * The component's props are `LeadPublicResult` and the visitor's own intake —
 * neither of which carries any of the above. The internal routing decision
 * does arrive as `nextStep`, and it is rendered only through `publicNextStep`,
 * which restates it as a next step for the prospect rather than a verdict on
 * them.
 */

import { SystemFlow } from "~/components/audit/primitives";
import { PROBLEM_CATEGORY_LABELS, publicNextStep, systemFlow } from "~/lib/lead-presentation";
import { routes, studio } from "~/data/links";
import type { AuditLeadContext, LeadPublicResult } from "~/types/lead";

export function LeadResult({
  result,
  businessName,
  auditContext,
}: {
  result: LeadPublicResult;
  businessName: string;
  auditContext?: AuditLeadContext;
}) {
  const next = publicNextStep(result.nextStep);
  const validation = [...result.discoveryQuestions, ...result.validationNeeded].slice(0, 5);

  return (
    <div className="lead-result">
      <header className="lead-result-head">
        <p className="label enter">Ellis Lead Intelligence</p>
        <h1 className="display-l enter" style={{ "--i": 1 } as React.CSSProperties}>
          We understand the problem.
        </h1>
        <p className="lede enter" style={{ "--i": 2 } as React.CSSProperties}>{result.summary}</p>
        <ul className="inline-meta enter" style={{ "--i": 3 } as React.CSSProperties}>
          <li>{businessName}</li>
          <li>{PROBLEM_CATEGORY_LABELS[result.primaryProblemCategory]}</li>
          {auditContext && <li>Continued from your audit</li>}
        </ul>
      </header>

      <section className="lead-result-section reveal" aria-labelledby="lr-system">
        <div className="lead-result-marker" aria-hidden="true">
          <span>01</span><span className="tick" />
        </div>
        <div className="lead-result-body">
          <p className="label">What Ellis would likely build</p>
          <h2 className="display-m" id="lr-system">{result.recommendedSystem.name}</h2>
          <p className="lede">{result.recommendedSystem.description}</p>
          <div className="lead-result-flow">
            <SystemFlow steps={systemFlow(result.recommendedSystem.key)} />
          </div>
          <p className="small">
            A shape, not a quote. What gets built is decided after the workflow is mapped —
            never before.
          </p>
        </div>
      </section>

      {validation.length > 0 && (
        <section className="lead-result-section reveal" aria-labelledby="lr-validate">
          <div className="lead-result-marker" aria-hidden="true">
            <span>02</span><span className="tick" />
          </div>
          <div className="lead-result-body">
            <p className="label">What still needs validating</p>
            <h2 className="display-m" id="lr-validate">The questions worth answering next.</h2>
            <p className="lede">
              These are the parts no analysis can settle from the outside. They are the
              conversation, and the answers are what turn a recommendation into a design.
            </p>
            <ol className="lead-questions">
              {validation.map((question, i) => (
                <li className="lead-question" key={question}>
                  <span className="lead-question-index">{String(i + 1).padStart(2, "0")}</span>
                  <p>{question}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="lead-result-next reveal" aria-labelledby="lr-next">
        <div className="lead-result-next-copy">
          <p className="label">Recommended next step</p>
          <h2 className="display-m" id="lr-next">{next.title}</h2>
          <p className="lede">{next.detail}</p>
          <div className="hero-actions">
            <a className="button button-rust" href={studio.booking} target="_blank" rel="noreferrer">
              Book that conversation
            </a>
            <a className="link" href={routes.systems}>See the systems Ellis builds</a>
          </div>
        </div>
        <div className="lead-result-receipt">
          <p className="label label-quiet">Your reference</p>
          <p className="lead-result-reference">{result.id}</p>
          <p className="small">
            This submission is saved. Ellis AI Studio will use the email address you provided to
            follow up, and nothing about your business is shared outside Ellis AI Studio.
          </p>
        </div>
      </section>
    </div>
  );
}
