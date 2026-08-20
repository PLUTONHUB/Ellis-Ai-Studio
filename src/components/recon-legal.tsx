import type { ReactNode } from "react";

import { PageHeader, Section } from "~/components/layout/page";
import { SiteShell } from "~/components/layout/site-shell";

export type ReconLegalSection = {
  title: string;
  children: ReactNode;
};

type ReconLegalPageProps = {
  label: string;
  title: string;
  lede: string;
  sections: ReconLegalSection[];
  aside?: ReactNode;
};

export function ReconLegalPage({
  label,
  title,
  lede,
  sections,
  aside,
}: ReconLegalPageProps) {
  return (
    <SiteShell>
      <PageHeader label={label} title={title} lede={lede} />
      <Section>
        <div className="split">
          <div className="prose">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="display-s">{section.title}</h2>
                {section.children}
              </section>
            ))}
          </div>
          {aside ? <aside className="split-aside">{aside}</aside> : null}
        </div>
      </Section>
    </SiteShell>
  );
}

export function ReconContactCard() {
  return (
    <div className="aside-block">
      <p className="label">RECON SUPPORT</p>
      <p>
        Questions about RECON, privacy, or security can be sent to{" "}
        <a href="mailto:support@ellisaistudio.com">support@ellisaistudio.com</a>.
      </p>
    </div>
  );
}
