/**
 * Six before/after design studies.
 *
 * Ground rules these entries are written under, because the subjects are real
 * companies who did not ask for this:
 *
 * 1. No invented performance data. There are no conversion lifts, bounce-rate
 *    figures or revenue claims anywhere in this file, because we did not run
 *    the test. Every "after" argument is a design argument, stated as one.
 * 2. Critique describes structure, not competence — where the fold goes, what
 *    the page ranks first, how many decisions sit between a visitor and the
 *    task. Those are observable and arguable.
 * 3. Live sites change. `reviewed` records when we last looked, so a reader
 *    can tell whether the critique still describes what they see today.
 * 4. Nothing here implies a relationship. These are unsolicited studies and
 *    every page says so, in the ribbon and in the footer.
 */

export type Demo = {
  slug: string;
  company: string;
  sector: string;
  /** The live homepage the "before" screenshot is taken from. */
  url: string;
  /** Display form of the URL. */
  host: string;
  /** When we last reviewed the live site for the critique below. */
  reviewed: string;
  /** One line: the whole redesign argument. */
  thesis: string;
  /** Opening paragraph on the case-study page. */
  intro: string;
  /** Observations about the current design. Structural, not editorial. */
  before: readonly string[];
  /** What the concept does differently, and why. */
  moves: readonly { title: string; detail: string }[];
  /** The design system the concept was built on. */
  system: { style: string; type: string; palette: string };
};

export const demos: readonly Demo[] = [
  {
    slug: "berkshire-hathaway",
    company: "Berkshire Hathaway",
    sector: "Financial holdings",
    url: "https://www.berkshirehathaway.com/",
    host: "berkshirehathaway.com",
    reviewed: "August 2026",
    thesis: "Make sixty years of compounding legible without pretending to be a startup.",
    intro:
      "Berkshire's homepage is the most famous plain page on the internet, and its plainness is not an accident — it signals that the company spends nothing on things that do not compound. The redesign takes that seriously. It does not add motion, gradients or stock photography. It adds a type scale, a grid and a hierarchy, so the documents shareholders actually come for stop competing with the directory around them.",
    before: [
      "The page is an undifferentiated list of links: annual reports, letters, subsidiary sites and governance notices all render at the same size and weight, so nothing is ranked.",
      "The shareholder letters — the single most-requested document the company publishes — sit in the same visual register as the news releases and the sitemap.",
      "There is no responsive layout, so the line length on a wide desktop runs far past a comfortable measure, and mobile renders as a zoomed-out desktop page.",
      "Link text carries the entire information scent. Without headings or grouping, finding a specific year's report means reading the whole page.",
    ],
    moves: [
      {
        title: "Rank the letters first",
        detail:
          "The archive gets its own section with the year set large and the whole row as the target, because the year is what a reader is scanning for.",
      },
      {
        title: "Organise by business, not by department",
        detail:
          "Wholly-owned subsidiaries run autonomously, so the operating companies get a grid of their own with the sector as the label — matching how the company is actually structured.",
      },
      {
        title: "Keep numbers in one quiet place",
        detail:
          "Share information sits in a single ledger card in the hero rather than scattered through the page, and it is explicitly marked as delayed with an “as of” line.",
      },
      {
        title: "Serif at scale, nothing decorative",
        detail:
          "One serif carries every statement and the accent gold is used perhaps four times on the page. No section needs an illustration to justify itself.",
      },
    ],
    system: {
      style: "Institutional Clarity — restrained, high-contrast, editorial",
      type: "Source Serif 4 + Inter",
      palette: "Parchment canvas, charcoal ink, one structural navy, gold accent",
    },
  },

  {
    slug: "craigslist",
    company: "Craigslist",
    sector: "Online marketplace",
    url: "https://www.craigslist.org/about/sites",
    host: "craigslist.org",
    reviewed: "August 2026",
    thesis: "Keep the speed and the absence of tracking. Fix the density.",
    intro:
      "Every craigslist redesign concept on the internet makes the same mistake: it treats plainness as the problem and returns a marketplace that looks like every other marketplace. Plainness is the product here — no banner ads, no recommendation engine, no behavioural tracking, and a homepage that ships in a fraction of a second. What is genuinely broken is density: several hundred links at near-identical size, with touch targets well under the 44px minimum.",
    before: [
      "The category list presents hundreds of links at nearly uniform size and weight, with no grouping headers doing visual work.",
      "Link targets are small and tightly packed, which fails the 44×44px minimum touch target and makes mis-taps routine on a phone.",
      "Colour is used almost exclusively for link state, so it carries no grouping or priority information.",
      "Search is present but visually subordinate to the category wall, even though search is the faster path for anyone who knows what they want.",
    ],
    moves: [
      {
        title: "Search becomes the call to action",
        detail:
          "A single large field on the fold with category scoping and popular queries beneath it — the marketplace pattern, applied without adding a feed.",
      },
      {
        title: "The link wall becomes a card grid",
        detail:
          "The same categories, grouped into eight cards with headers, icons and generous row height. Nothing was removed; it was ranked.",
      },
      {
        title: "Touch targets that clear the minimum",
        detail:
          "Every row is at least 44px tall with real spacing between, which is the whole difference between usable and infuriating on a phone.",
      },
      {
        title: "Safety guidance moved out of the help centre",
        detail:
          "“Deal locally, face to face” prevents most scams and has lived in a help article for twenty years. It gets a section on the homepage.",
      },
    ],
    system: {
      style: "Utility-first, quiet colour, card-grouped density",
      type: "Lexend + Source Sans 3",
      palette: "Near-white canvas, the familiar purple, green reserved for posting",
    },
  },

  {
    slug: "ryanair",
    company: "Ryanair",
    sector: "Airline & travel",
    url: "https://www.ryanair.com/gb/en",
    host: "ryanair.com",
    reviewed: "August 2026",
    thesis: "One search widget, and a fare that tells the truth on the first screen.",
    intro:
      "A low-fare airline's homepage has exactly one job: get two airports and two dates into the funnel. Everything competing with that widget is friction, and the friction that costs most is not visual — it is the gap between the fare a passenger compares and the total they eventually pay. This concept puts the widget on the fold and answers the bag question before the funnel starts, not at step four.",
    before: [
      "The booking widget shares the fold with rotating promotional panels, so the one interactive element on the page competes with decoration.",
      "The headline fare is quoted before bags, seat selection and payment charges, which means the number used to compare carriers is not the number paid.",
      "Extras appear across several sequential upsell screens after the fare is chosen, with the decline option consistently lower-contrast than the accept.",
      "Countdown timers and scarcity messaging apply time pressure to a decision the customer has not been given complete information for.",
    ],
    moves: [
      {
        title: "The widget owns the fold",
        detail:
          "Five fields, one green search button, and a checked “include a 10 kg bag” option that changes every price shown downstream.",
      },
      {
        title: "State the total, once",
        detail:
          "Fares in the finder grid carry a “bag included” badge. The comparison number and the payment number are the same number.",
      },
      {
        title: "Extras opt-in on one screen",
        detail:
          "Seats, priority and insurance are offered together with a visible decline of equal weight, and nothing is pre-ticked.",
      },
      {
        title: "No manufactured urgency",
        detail:
          "The countdown comes out. Abandoned baskets cost more than the timers win, and a fare that holds while you decide is a reason to book direct.",
      },
    ],
    system: {
      style: "Conversion funnel — progressive disclosure, single primary action",
      type: "Rubik + Nunito Sans",
      palette: "Airline navy, yellow demoted to accent, one green reserved for the CTA",
    },
  },

  {
    slug: "usps",
    company: "USPS",
    sector: "Shipping & logistics",
    url: "https://www.usps.com/",
    host: "usps.com",
    reviewed: "August 2026",
    thesis: "Tracking is not a feature of the homepage. Tracking is the homepage.",
    intro:
      "People arrive at a postal site with a package number in their clipboard and one question in their head. The current front door acknowledges this — there is a tracking field — but it shares the fold with promotional panels and a full navigation system, so the primary task gets a fraction of the space and none of the emphasis. This concept inverts the ratio and treats everything else as secondary, because it is.",
    before: [
      "The tracking field occupies a small portion of the fold while promotional panels and seasonal messaging take the majority of it.",
      "Primary tasks — track, ship, buy stamps, hold mail, change address, find a location — are distributed across a mega-menu rather than presented directly.",
      "Tracking results are written as a raw scan log in network vocabulary, without a plain-language headline answering “when will it arrive”.",
      "Several parallel navigation systems (utility bar, main nav, mega-menu, in-page tiles) offer overlapping routes to the same destinations.",
    ],
    moves: [
      {
        title: "One enormous input",
        detail:
          "The tracking field takes the fold, at a size that makes the page's purpose unmistakable, with no account required to use it.",
      },
      {
        title: "Six tasks, one row",
        detail:
          "The other things people genuinely come to do sit directly beneath the fold as six equal tiles, instead of inside a menu.",
      },
      {
        title: "A status a person can read",
        detail:
          "A plain-language headline — “Arriving tomorrow by 8:00 PM” — sits above the scan log. The log is kept; it is just no longer the answer.",
      },
      {
        title: "Signage-grade type and contrast",
        detail:
          "A squared grotesque at AA contrast throughout, because public infrastructure is read by everyone, on every device, in every condition.",
      },
    ],
    system: {
      style: "Task-first utility — one dominant action, flat task grid",
      type: "Archivo + Inter",
      palette: "Institutional blue, red kept to the rule and urgent states only",
    },
  },

  {
    slug: "yahoo",
    company: "Yahoo",
    sector: "Media & portal",
    url: "https://www.yahoo.com/",
    host: "yahoo.com",
    reviewed: "August 2026",
    thesis: "Give one story the top of the page, and let the ads be honest.",
    intro:
      "A portal fails when every module shouts at the same volume. Twenty headlines at one size is not a front page — it is a list, and a list makes the reader do the editing. This concept re-asserts an editorial hierarchy: one lead at real scale, a readable river beneath it, and the utility modules people actually keep a portal for condensed into a single rail. Advertising is not removed. It is boxed, labelled and made to sit at the same size as everything else.",
    before: [
      "Headlines across the page run at similar sizes, so no story is ranked above another and the reader supplies the hierarchy.",
      "Sponsored units are styled closely enough to editorial cards that the distinction depends on a small label.",
      "Utility modules — markets, weather, scores — are interleaved with content modules rather than grouped, so scanning the page means re-orienting repeatedly.",
      "Image aspect ratios vary between modules, which produces uneven rhythm and layout shift as assets load.",
    ],
    moves: [
      {
        title: "One lead, at editorial scale",
        detail:
          "A single story takes the top with a serif headline large enough to state its own importance, and nothing on the fold competes with it.",
      },
      {
        title: "Utilities condensed to one rail",
        detail:
          "Markets, weather and scores share a single three-column band. They are the reason a portal survives; they should not be scattered.",
      },
      {
        title: "One card geometry everywhere",
        detail:
          "Fixed 16:9 art and one type scale across the river, so nine stories can be scanned without re-learning the layout at each one.",
      },
      {
        title: "Ads that admit what they are",
        detail:
          "Sponsored placements keep the same dimensions as editorial but are boxed and labelled, rather than camouflaged as a story.",
      },
    ],
    system: {
      style: "Editorial hierarchy — one dominant lead, consistent river",
      type: "Newsreader + Roboto",
      palette: "Near-black ink, portal purple, white; colour only for section marks",
    },
  },

  {
    slug: "jcpenney",
    company: "JCPenney",
    sector: "Retail & department store",
    url: "https://www.jcpenney.com/",
    host: "jcpenney.com",
    reviewed: "August 2026",
    thesis: "Say the value once and mean it, then show the merchandise at a size worth shopping.",
    intro:
      "Mid-market retail sites tend to bury their own product. Stacked promotional bars, four overlapping discount mechanics and a hero carousel push the merchandise into thumbnails below the fold, and the shopper's first task becomes arithmetic rather than browsing. This concept states the offer once, gives the departments real estate you can actually shop from, and puts the in-store services — the part a pure-play competitor cannot copy — where they can be seen.",
    before: [
      "Multiple promotional bars stack above the content, each carrying a different discount mechanic, so the effective price requires the shopper to reconcile them.",
      "The hero is a rotating carousel, which means the message a given visitor sees is decided by timing rather than by priority.",
      "Department entry points render small relative to the promotional furniture above them, inverting the merchandising hierarchy.",
      "Discount messaging repeats in the header, the hero, the category tiles and the product cards, which dilutes rather than reinforces it.",
    ],
    moves: [
      {
        title: "One promotional line, stated once",
        detail:
          "A single band with one offer. Repetition across four surfaces reads as noise, not as a better deal.",
      },
      {
        title: "An editorial hero instead of a carousel",
        detail:
          "One statement, one image, two actions. Every visitor sees the same thing, and the message is chosen rather than rotated.",
      },
      {
        title: "Six departments at shoppable scale",
        detail:
          "Large plates with a real headline and a sentence each, replacing a grid of small tiles competing with promotional furniture.",
      },
      {
        title: "Lead with what cannot be shipped",
        detail:
          "Salon, portraits, optical and order pickup get their own section — these are the department store's structural advantage over a pure-play retailer.",
      },
    ],
    system: {
      style: "Classic Elegant — editorial retail, warm mid-market rather than luxury",
      type: "Playfair Display + DM Sans",
      palette: "Cream canvas, soft-black ink, desaturated red used sparingly, gold rule",
    },
  },
] as const;

export const demoBySlug = (slug: string) => demos.find((demo) => demo.slug === slug);

/** Paths for the static image pair. Both are 1440×900 at DPR 2. */
export const demoImages = (slug: string) => ({
  before: `/images/demos/${slug}-before.jpg`,
  after: `/images/demos/${slug}-after.jpg`,
});

/** The live, scrollable concept page — the same document the "after" is shot from. */
export const demoPreviewUrl = (slug: string) => `/demo-pages/${slug}.html`;
