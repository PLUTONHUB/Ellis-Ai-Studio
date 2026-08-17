# Design studies (`/demos`)

Six unsolicited before-and-after redesigns of well-known sites, one per sector.
They exist to show how we read a page before anyone hires us to change one.

| Slug | Company | Sector | Before source |
|------|---------|--------|---------------|
| `berkshire-hathaway` | Berkshire Hathaway | Financial holdings | berkshirehathaway.com |
| `craigslist` | Craigslist | Online marketplace | craigslist.org |
| `ryanair` | Ryanair | Airline & travel | ryanair.com |
| `usps` | USPS | Shipping & logistics | usps.com |
| `yahoo` | Yahoo | Media & portal | yahoo.com |
| `jcpenney` | JCPenney | Retail & department store | jcpenney.com |

## Where things live

```
public/demo-pages/<slug>.html      # the concept itself — self-contained, no network
public/demo-pages/_assets/fonts/   # vendored OFL variable fonts (see NOTICE.md)
public/images/demos/<slug>-before.jpg
public/images/demos/<slug>-after.jpg
src/data/demos.ts                  # case-study copy, critique and design system
src/data/demo-captures.ts          # GENERATED — which befores are real screenshots
src/components/pages/demos.tsx     # index + case study, comparison slider
src/routes/demos/                  # /demos and /demos/$slug
src/styles/system/demos.css
```

Each concept page is a plain, self-contained HTML document. It loads no scripts
and no external resources, which is why it can be embedded in an iframe with
`sandbox="allow-same-origin"` and screenshotted deterministically offline.

## Capturing the imagery

```bash
npm run demos:capture              # both passes
node scripts/capture-demos.mjs after            # re-render our concepts
node scripts/capture-demos.mjs before           # re-shoot the live sites
node scripts/capture-demos.mjs after ryanair    # filter by slug
```

Both passes shoot the same fixed **1440×900 frame at DPR 2**. That is deliberate:
a before/after comparison is only honest if both sides are shot identically —
same viewport, same crop, same point in the page.

### The "before" pass needs real internet

It visits the live homepages, so it must run somewhere with unrestricted
outbound HTTPS. In a locked-down environment (CI, the Claude Code web runner)
every request is refused by the egress proxy; the pass then writes a labelled
placeholder, records `null` in `src/data/demo-captures.ts`, and exits non-zero.

**The placeholders are not drawings of the real sites.** Inventing a depiction of
someone else's homepage would misrepresent them. The placeholder says plainly
that the screenshot is outstanding, and the case-study page reads
`demo-captures.ts` so its caption says "pending capture" instead of claiming a
screenshot we do not have.

To finish the studies, run the before pass from a normal machine and commit the
resulting `.jpg` files together with the regenerated `demo-captures.ts`.

## Rules these pages are written under

The subjects are real companies who did not ask for this, so:

1. **No invented performance data.** No conversion lifts, no bounce rates, no
   revenue claims — we did not run the test. Every argument is a design
   argument, stated as one.
2. **Critique describes structure, not competence.** Where the fold goes, what
   the page ranks first, how many decisions sit between a visitor and their
   task. Observable and arguable.
3. **Everything inside an "after" frame is a placeholder.** Fares, tickers,
   tracking numbers, headlines. Each concept carries a ribbon saying so.
4. **Nothing implies a relationship.** Every concept page and every case study
   states that the work is unsolicited and unaffiliated, and that the marks
   belong to their owners.
5. **`reviewed` dates the critique.** Live sites change; the field records when
   we last looked, so a reader can tell whether the critique still applies.

If a company ever objects, take the study down — the goodwill is worth more than
the page.
