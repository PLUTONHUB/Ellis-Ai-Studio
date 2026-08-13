import { SiteShell } from "~/components/layout/site-shell";
import { PageHeader, Section, SectionIntro, InlineMeta } from "~/components/layout/page";
import { FounderRows } from "~/components/founders/founder-parts";
import { ArticleRow, DraftRow } from "~/components/insights/insight-parts";
import { findFounder } from "~/data/founders";
import { findVenture } from "~/data/ventures";
import { articlesByAuthor, draftsByAuthor } from "~/data/insights";
import { routes, mailto } from "~/data/links";

export function FoundersPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Founders"
        title={<>Ellis AI Studio <em>is</em> its founders.</>}
        lede="Jacob Ellis and Amber Dowling build the studio's client systems and its own ventures. There is no account layer between you and them."
      />
      <Section><FounderRows /></Section>
      <Section tone="warm">
        <SectionIntro index="02" label="Work together" title="Start a conversation." copy="Studio enquiries and creator enquiries go to different places — both reach a founder directly." />
        <div className="hero-actions">
          <a className="button button-solid" href={routes.contact}>Contact</a>
          <a className="link" href={routes.ventures}>See the ventures</a>
        </div>
      </Section>
    </SiteShell>
  );
}

export function FounderDetailPage({ slug }: { slug: string }) {
  const founder = findFounder(slug);
  if (!founder) {
    return (
      <SiteShell>
        <PageHeader label="Not found" title="That page doesn't exist." lede="The link may be wrong." />
        <Section><a className="button" href={routes.founders}>Back to founders</a></Section>
      </SiteShell>
    );
  }

  const venture = founder.venture ? findVenture(founder.venture) : undefined;
  const published = articlesByAuthor(founder.slug);
  const drafts = draftsByAuthor(founder.slug);

  return (
    <SiteShell>
      <PageHeader label={founder.role} title={founder.name} lede={founder.positioning} />
      <Section>
        <div className="split">
          <div className="prose">
            {founder.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside className="split-aside">
            <div className="aside-block">
              <p className="label">Focus</p>
              <InlineMeta items={founder.focus} />
            </div>
            {venture && (
              <div className="aside-block">
                <p className="label">Venture</p>
                <ul><li><a href={`/ventures/${venture.slug}`}>{venture.name}</a></li></ul>
              </div>
            )}
            <div className="aside-block">
              <p className="label">Contact</p>
              <ul><li><a href={mailto(founder.email)}>{founder.email}</a></li></ul>
            </div>
            <div className="aside-block">
              <p className="label">Elsewhere</p>
              <ul>{founder.socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ul>
            </div>
          </aside>
        </div>
      </Section>
      {(published.length > 0 || drafts.length > 0) && (
        <Section tone="cool">
          <SectionIntro index="02" label="Writing" title={`From ${founder.name}`} />
          {published.length > 0 && <ul className="rows">{published.map((a, i) => <ArticleRow key={a.slug} article={a} index={i} />)}</ul>}
          {drafts.length > 0 && <ul className="rows">{drafts.map((a, i) => <DraftRow key={a.slug} article={a} index={i} />)}</ul>}
        </Section>
      )}
    </SiteShell>
  );
}
