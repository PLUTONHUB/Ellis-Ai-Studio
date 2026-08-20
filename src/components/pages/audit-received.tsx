import { SiteShell } from "~/components/layout/site-shell";
import { PageHeader, Section, SectionIntro } from "~/components/layout/page";

export function AuditReceivedPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Business bottleneck audit"
        title="Inquiry received"
        lede="Thanks — we’ve received your bottleneck inquiry."
      />
      <Section>
        <div className="stack stack-5" style={{ maxWidth: "62ch" }}>
          <p className="lede">
            We’ll review the details you submitted and identify the strongest opportunities to improve
            the process. Someone from Ellis AI Studio will be in touch with the next steps.
          </p>
          <p className="body">There’s no need to submit the form again.</p>
        </div>
      </Section>
      <Section tone="cool">
        <SectionIntro index="01" label="What happens next" title="A considered next step, not an automated pitch." />
        <ol className="rows">
          {[
            "We review the bottleneck you described.",
            "We assess where AI, automation, or process improvements could create the most impact.",
            "We contact you with the recommended next step.",
          ].map((detail, index) => (
            <li className="row" key={detail}>
              <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="row-body"><p>{detail}</p></div>
            </li>
          ))}
        </ol>
      </Section>
    </SiteShell>
  );
}
