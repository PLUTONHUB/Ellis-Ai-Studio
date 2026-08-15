/**
 * JAK3FFECT — Jacob Ellis's creator and UGC brand.
 *
 * Everything here is positioning Jake supplied or facts already held elsewhere
 * in this repo (`founders.ts`, `ventures.ts`, `links.ts`). The same honesty
 * rules apply as the rest of the site:
 *
 * - No brand partnerships, clients, testimonials, metrics or launch dates.
 *   None exist yet, so none are written.
 * - `work` describes the categories Jake shoots, not projects he has shipped.
 *   Real projects drop into the same shape once there are some.
 * - The FAQ answers only commit to things in the services list. Nothing states
 *   a turnaround time, a price or a revision count, because none are settled.
 */

export const jake = {
  name: "Jacob Ellis",
  short: "Jake",
  brand: "JAK3FFECT",
  role: "UGC & short-form content creator",
  email: "jake@ellisaistudio.com",
  booking: "https://calendly.com/jake-ellisaistudio/30min",
} as const;

/**
 * The one-line pitch, split so the hero can set it a line at a time.
 * Reads as a claim about the work, not about an audience Jake doesn't have.
 */
export const heroLines = ["Shot in", "real life."] as const;

export const heroLede =
  "Authentic, cinematic short-form content that shows products and places being used the way people actually use them — organic enough for the feed, structured enough to convert.";

/** Primary niches. These lead the work grid and carry the larger cards. */
export const primaryNiches = [
  {
    name: "Travel & Outdoor",
    note: "On location, in motion — trails, water, road, and the gear that comes along.",
  },
  {
    name: "Fitness",
    note: "Training, progression and the equipment and apparel that hold up under it.",
  },
  {
    name: "Health & Wellness",
    note: "Recovery, nutrition, sleep and the daily inputs behind consistent output.",
  },
  {
    name: "Tech / AI / SaaS",
    note: "Apps and software demonstrated on screen and in hand, by someone who builds them.",
  },
  {
    name: "Productivity",
    note: "Systems, tools and setups shown doing real work rather than posing as a desk shot.",
  },
  {
    name: "Entrepreneurship",
    note: "Building in public — the operating side of running a studio and a creator brand.",
  },
] as const;

/** Secondary niches. Supporting categories, set smaller in the grid. */
export const secondaryNiches = [
  "Lifestyle",
  "Recovery",
  "Footwear",
  "Menswear & grooming",
  "Hospitality",
  "Local experiences",
  "Tech-on-the-go",
] as const;

/** Service groupings — the bento. Each maps to formats Jake actually shoots. */
export const services = [
  {
    title: "UGC video",
    copy: "Short-form vertical built to look native to the feed: hooks that earn the first second, a natural demonstration, and a reason to keep watching to the end.",
  },
  {
    title: "Product demos",
    copy: "The product in hand, in use, in the setting it belongs in — close enough to see how it works and honest enough to be believed.",
  },
  {
    title: "Testimonials & problem → solution",
    copy: "Talking-head and voiceover formats that frame a real problem before the product arrives, so the resolution lands as a payoff rather than a pitch.",
  },
  {
    title: "App & software demonstration",
    copy: "Screen capture paired with real-world context, from someone who builds software and can explain it without a script that reads like a manual.",
  },
] as const;

/**
 * Every deliverable, for the two counter-scrolling tickers. Split so the rows
 * read differently rather than looking like one list cut in half.
 */
export const deliverablesTop = [
  "Short-form vertical video",
  "Voiceover + B-roll",
  "Talking-head content",
  "Hook variations",
  "Scriptwriting",
  "Product demos",
] as const;

export const deliverablesBottom = [
  "Lifestyle content",
  "Travel & destination",
  "Fitness & wellness",
  "Photography",
  "Raw footage",
  "Reviews & testimonials",
] as const;

/** How a project runs. Describes the listed services — invents no timeline. */
export const process = [
  {
    step: "01",
    title: "Set the angle",
    copy: "We agree what the content has to do before anything is filmed — the audience, the objection it needs to clear, and the hook that gets it watched. Scripting and hook variations happen here, not in the edit.",
  },
  {
    step: "02",
    title: "Shoot it in real life",
    copy: "Filmed on location and in use, not staged against a backdrop. Travel, training, work, recovery — the product appears inside something that was going to happen anyway.",
  },
  {
    step: "03",
    title: "Deliver ready to post",
    copy: "Edited vertical cuts, alternate hooks for testing, stills where they're useful, and the raw footage so the work keeps earning after delivery.",
  },
] as const;

/**
 * Replaces the template's testimonial section. These are commitments about how
 * Jake works — not quotes from clients who don't exist yet.
 */
export const principles = [
  {
    title: "Owner-operated",
    copy: "Jake shoots, appears in, and edits the work himself. There is no account layer between the brand and the person holding the camera.",
  },
  {
    title: "Real use, or not at all",
    copy: "Products get used the way the content shows them being used. Nothing is claimed on camera that isn't true off it.",
  },
  {
    title: "Built to be tested",
    copy: "Hook variations ship alongside the main cut, so performance can be measured instead of guessed at.",
  },
  {
    title: "Raw footage included",
    copy: "The unedited files come with the delivery. What gets made from them afterwards is the brand's to decide.",
  },
] as const;

export const faqs = [
  {
    q: "What kind of content do you make?",
    a: "Short-form vertical video, mostly: UGC, product demos, testimonials, problem → solution, voiceover and B-roll, talking-head, and lifestyle or destination pieces. Photography and raw footage come with it where they're useful.",
  },
  {
    q: "Which categories do you shoot?",
    a: "Travel and outdoor, fitness, health and wellness, tech and AI software, productivity, and entrepreneurship lead the work. Lifestyle, recovery, footwear, menswear and grooming, hospitality and local experiences sit alongside them.",
  },
  {
    q: "Can you film on location or while travelling?",
    a: "Yes. Travel and outdoor is a primary category rather than an occasional one, so content shot on the move is normal rather than an exception.",
  },
  {
    q: "Do you write the script and the hooks?",
    a: "Yes. Scriptwriting and hook variations are part of the work. If there's an existing brief or brand voice to hold to, the script is built around it.",
  },
  {
    q: "Can you demonstrate software and apps?",
    a: "Yes. Jake runs Ellis AI Studio and builds AI systems, automation and software, so technical products get explained by someone who understands what they do.",
  },
  {
    q: "How do we start?",
    a: "Email jake@ellisaistudio.com with the product, the categories it sits in, and what the content needs to achieve. If it's easier to talk it through, book a call.",
  },
] as const;

/**
 * Current, accurate roles. No brand partnerships are listed because none have
 * been confirmed — `Current` is used rather than an invented start year.
 */
export const experience = [
  { role: "Founder", org: "Ellis AI Studio", period: "Current" },
  { role: "Creator", org: "JAK3FFECT", period: "Current" },
  { role: "AI systems, automation & software", org: "Ellis AI Studio", period: "Current" },
] as const;

export const aboutParagraphs = [
  "Jake is building JAK3FFECT around getting stronger — physically, mentally, financially and professionally — and documenting the process as it happens rather than after it's already worked.",
  "That's the reason the content looks the way it does. The training, the travel, the software and the business are things going on regardless of whether a camera is running, so a product placed inside them has somewhere real to sit.",
  "Alongside it he runs Ellis AI Studio, building AI-powered workflows, software, websites and business systems. It's why the technical work is credible on camera, and why the content side is run like an operation instead of a hobby.",
] as const;

/** Social destinations. Mirrors `founders.ts` — nothing invented. */
export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/jak3ffect?igsh=MnVzODVqOWdhMzVl&utm_source=qr" },
  { label: "TikTok", href: "https://www.tiktok.com/@jak3ffect?_r=1&_t=ZP-98r4YQec1dO" },
  { label: "YouTube", href: "https://youtube.com/@jak3ffect?si=WY9RBzhv_-VOSxZ8" },
  { label: "X", href: "https://x.com/jak3ellis?s=11" },
  { label: "Beacons", href: "https://beacons.ai/jakeslinks" },
] as const;
