/**
 * /demos — six before/after design studies of well-known sites.
 *
 * These are unsolicited concepts. Nothing here implies a client relationship,
 * and the disclaimer is rendered on every page rather than tucked into a
 * footnote, because the subjects are real companies and the "after" frames are
 * our invention.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SiteShell } from "~/components/layout/site-shell";
import { PageHeader, Section, SectionIntro } from "~/components/layout/page";
import { demos, demoBySlug, demoImages, demoPreviewUrl, type Demo } from "~/data/demos";
import { capturedBefore } from "~/data/demo-captures";
import { routes } from "~/data/links";
import "~/styles/system/demos.css";

/** useLayoutEffect warns during SSR; the measurement is client-only anyway. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Disclaimer({ company }: { company: string }) {
  return (
    <p className="demo-disclaimer">
      <strong>This is an unsolicited concept.</strong> Ellis AI Studio has no relationship with {company} and
      this work was neither commissioned nor endorsed by them. The “before” frame is an unretouched screenshot of
      their live site; the “after” frame is our own design, and every figure, headline and price inside it is an
      illustrative placeholder. All names and marks belong to their respective owners.
    </p>
  );
}

/**
 * Before/after wipe. The transparent range input is the actual control, so
 * pointer, touch and keyboard all work without bespoke event handling.
 */
function Compare({ demo }: { demo: Demo }) {
  const [pos, setPos] = useState(50);
  const { before, after } = demoImages(demo.slug);
  const captured = capturedBefore[demo.slug];

  return (
    <div>
      <figure className="cmp" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
        <img
          className="cmp-img"
          src={before}
          alt={
            captured
              ? `The ${demo.company} homepage at ${demo.host} as it appears today.`
              : `Placeholder frame — the live screenshot of ${demo.host} has not been captured.`
          }
          width={1440}
          height={900}
          loading="lazy"
          decoding="async"
        />
        <img
          className="cmp-img cmp-after"
          src={after}
          alt={`Ellis AI Studio's concept redesign of the ${demo.company} homepage.`}
          width={1440}
          height={900}
          loading="lazy"
          decoding="async"
        />
        <span className="cmp-line" aria-hidden="true" />
        <input
          className="cmp-range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(event) => setPos(Number(event.target.value))}
          aria-label={`Reveal the ${demo.company} redesign. Left shows the current site, right shows the concept.`}
        />
        <span className="cmp-handle" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6.4 4 3 8l3.4 4M9.6 4 13 8l-3.4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="cmp-tag cmp-tag-before">Before</span>
        <span className="cmp-tag cmp-tag-after">After</span>
      </figure>
      <div className="cmp-caption">
        <span>
          {captured
            ? `Before: ${demo.host}, captured ${captured}.`
            : `Before: screenshot of ${demo.host} pending capture.`}{" "}
          After: concept by Ellis AI Studio.
        </span>
        <span>Drag the handle, or focus it and use the arrow keys.</span>
      </div>
    </div>
  );
}

/** The concept page itself, live and scrollable, scaled to fit the column. */
function LivePreview({ demo }: { demo: Demo }) {
  const shell = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useIsomorphicLayoutEffect(() => {
    const node = shell.current;
    if (!node) return;
    const measure = () => setScale(node.clientWidth / 1440);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="demo-frame-shell">
      <div className="demo-frame-bar">
        <span className="demo-frame-dots"><span /><span /><span /></span>
        <span>{demo.host} — concept</span>
      </div>
      <div className="demo-frame-viewport" ref={shell}>
        <iframe
          src={demoPreviewUrl(demo.slug)}
          title={`Live concept redesign of the ${demo.company} homepage`}
          loading="lazy"
          style={{ transform: `scale(${scale})` }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}

export function DemosIndexPage() {
  return (
    <SiteShell>
      <PageHeader
        label="Design studies"
        title={<>Six well-known sites, <em>rebuilt</em>.</>}
        lede="Unsolicited redesigns of six established companies across six sectors. Each one pairs an unretouched screenshot of the site as it stands today with a concept we designed and built. No client asked for these — they exist to show how we think about a page before we are hired to change one."
      />

      <Section>
        <ul className="demo-grid">
          {demos.map((demo) => (
            <li key={demo.slug}>
              <a className="demo-card reveal" href={`/demos/${demo.slug}`}>
                <img
                  className="demo-card-shot"
                  src={demoImages(demo.slug).after}
                  alt={`Concept redesign of the ${demo.company} homepage.`}
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
                <div className="demo-card-body">
                  <div className="demo-card-meta">
                    <p className="label">{demo.sector}</p>
                    <p className="meta">{demo.host}</p>
                  </div>
                  <h2>{demo.company}</h2>
                  <p>{demo.thesis}</p>
                  <p className="demo-card-go">See the before &amp; after →</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cool" ruled>
        <SectionIntro
          index="01"
          label="How to read these"
          title="Design arguments, not performance claims."
          copy="You will not find a conversion-lift percentage anywhere on these pages. We did not run the test, so we do not quote the number. What each study gives you instead is a specific, arguable position on what the page is for and what is standing in the way of it."
        />
        <p className="demo-disclaimer" style={{ marginTop: "var(--space-6)" }}>
          <strong>All six are unsolicited.</strong> Ellis AI Studio has no relationship with any of the companies
          featured here, and none of this work was commissioned or endorsed by them. Every “after” frame is our own
          design and every figure inside it is an illustrative placeholder. All names and marks belong to their
          respective owners.
        </p>
      </Section>

      <Section tone="deep">
        <SectionIntro
          index="02"
          label="Your site"
          title="We would rather do this with your numbers than our guesses."
          copy="These studies are built from the outside, on observation alone. On a real engagement we start with your analytics, your funnel and the calls your team is actually fielding — then diagnose before proposing anything."
        />
        <div className="hero-actions">
          <a className="button button-solid" href={routes.apply}>Request an audit</a>
          <a className="link" href={routes.howItWorks}>How we work</a>
        </div>
      </Section>
    </SiteShell>
  );
}

export function DemoCaseStudyPage({ slug }: { slug: string }) {
  const demo = demoBySlug(slug);

  if (!demo) {
    return (
      <SiteShell>
        <PageHeader label="404" title="No such design study." lede="That study does not exist — here are the ones that do." />
        <Section>
          <a className="button" href="/demos">All design studies</a>
        </Section>
      </SiteShell>
    );
  }

  const index = demos.findIndex((entry) => entry.slug === demo.slug);
  const previous = demos[(index - 1 + demos.length) % demos.length];
  const next = demos[(index + 1) % demos.length];

  return (
    <SiteShell>
      <PageHeader label={`Design study · ${demo.sector}`} title={demo.company} lede={demo.thesis} />

      <Section>
        <Compare demo={demo} />
      </Section>

      <Section tone="cool" ruled>
        <div className="demo-split">
          <div className="stack stack-5">
            <p className="label">The read</p>
            <p className="demo-thesis">{demo.thesis}</p>
            <p className="lede">{demo.intro}</p>
          </div>
          <div className="stack stack-4">
            <p className="label">What the current page does</p>
            <ul className="demo-list">
              {demo.before.map((observation) => <li key={observation}><span>{observation}</span></li>)}
            </ul>
            <p className="meta">Observed on the live site in {demo.reviewed}. Sites change; this describes what we saw.</p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionIntro index="01" label="The concept" title="What we changed, and why." />
        <ul className="demo-list demo-list-moves">
          {demo.moves.map((move) => (
            <li key={move.title}>
              <span><b>{move.title}</b>{move.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cool" ruled>
        <div className="demo-split">
          <div className="stack stack-5">
            <p className="label">Live concept</p>
            <h2 className="display-m">The whole page, not just the fold.</h2>
            <p>
              The frame beside this is the actual concept document — the same file the “after” screenshot was taken
              from. Scroll it, or open it full size.
            </p>
            <div className="hero-actions">
              <a className="button" href={demoPreviewUrl(demo.slug)} target="_blank" rel="noreferrer">
                Open the concept full size
              </a>
            </div>
            <dl className="demo-facts">
              <div className="demo-fact"><dt>Direction</dt><dd>{demo.system.style}</dd></div>
              <div className="demo-fact"><dt>Typeface pairing</dt><dd>{demo.system.type}</dd></div>
              <div className="demo-fact"><dt>Palette</dt><dd>{demo.system.palette}</dd></div>
            </dl>
          </div>
          <LivePreview demo={demo} />
        </div>
      </Section>

      <Section>
        <Disclaimer company={demo.company} />
        <div className="demo-nextprev" style={{ marginTop: "var(--space-7)" }}>
          <a className="link" href={`/demos/${previous.slug}`}>← {previous.company}</a>
          <a className="link" href="/demos">All studies</a>
          <a className="link" href={`/demos/${next.slug}`}>{next.company} →</a>
        </div>
      </Section>

      <Section tone="deep">
        <SectionIntro
          index="02"
          label="Your site"
          title="This, with your data behind it."
          copy="We built this from the outside, on observation alone. On a real engagement the diagnosis comes first — your analytics, your funnel, the questions your team keeps answering by hand."
        />
        <div className="hero-actions">
          <a className="button button-solid" href={routes.apply}>Request an audit</a>
          <a className="link" href={routes.systems}>What we build</a>
        </div>
      </Section>
    </SiteShell>
  );
}
