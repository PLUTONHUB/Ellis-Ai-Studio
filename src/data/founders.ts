/**
 * Founder records for Ellis AI Studio.
 *
 * Both entries are co-founders and are treated as peers everywhere they render.
 * Order in `founders` is presentation order only and carries no seniority.
 */

export type FounderSocial = {
  label: string;
  href: string;
};

export type Founder = {
  slug: string;
  name: string;
  role: string;
  /** One line used on cards and as the founder's positioning statement. */
  positioning: string;
  /** Disciplines this founder leads inside the studio. */
  focus: string[];
  /** Slug of the venture this founder leads, if any. */
  venture: string | null;
  email: string;
  socials: FounderSocial[];
  /**
   * Path under /public. `null` means no authentic photograph has been supplied
   * yet — the UI renders a monogram rather than a stock or generated face.
   */
  portrait: string | null;
  portraitAlt: string | null;
  /** Short-form biography paragraphs. Factual only. */
  bio: string[];
};

export const founders: Founder[] = [
  {
    slug: "jacob-ellis",
    name: "Jacob Ellis",
    role: "Co-Founder",
    positioning:
      "Builds the systems, software and infrastructure the studio and its ventures run on.",
    focus: [
      "AI systems",
      "Automation",
      "Operations",
      "Software & product development",
      "Digital infrastructure",
      "Creator & media",
      "Entrepreneurship",
    ],
    venture: "jak3ffect",
    email: "jake@ellisaistudio.com",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/jak3ffect?igsh=MnVzODVqOWdhMzVl&utm_source=qr" },
      { label: "TikTok", href: "https://www.tiktok.com/@jak3ffect?_r=1&_t=ZP-98r4YQec1dO" },
      { label: "YouTube", href: "https://youtube.com/@jak3ffect?si=WY9RBzhv_-VOSxZ8" },
      { label: "X", href: "https://x.com/jak3ellis?s=11" },
      { label: "Beacons", href: "https://beacons.ai/jakeslinks" },
    ],
    portrait: "/images/jacob-ellis-founder.jpg",
    portraitAlt: "Jacob Ellis, co-founder of Ellis AI Studio",
    bio: [
      "Ellis AI Studio didn’t begin as a plan to build an AI consultancy. It started with websites — helping businesses get online without needing enormous development budgets.",
      "The longer that work went on, the clearer it became that the website usually wasn’t the whole problem. The friction was everything happening around it: information copied by hand, processes spread across disconnected apps, next steps depending on somebody remembering them.",
      "That led to building systems instead of pages — automations, connected workflows, structured intake, business intelligence and AI-assisted processes. The same instinct now drives the studio’s own products and ventures.",
    ],
  },
  {
    slug: "amber-dowling",
    name: "Amber Dowling",
    role: "Co-Founder",
    positioning:
      "Leads the studio’s creator, content and brand-partnership work.",
    focus: [
      "Creator economy",
      "UGC",
      "Content strategy",
      "Lifestyle & media",
      "Brand partnerships",
      "Entrepreneurial ventures",
    ],
    venture: "organicambervibez",
    email: "amberd@ellisaistudio.com",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/organicambervibez?utm_source=qr" },
      { label: "TikTok", href: "https://www.tiktok.com/@organicambervibez?_r=1&_t=ZT-98r3nbmvNUM" },
      { label: "YouTube", href: "https://youtube.com/@organicambervibez?si=LY5JDTHQ9aQXYxEN" },
      { label: "Beacons", href: "https://beacons.ai/ambercreates.co" },
    ],
    // No founder photograph has been supplied for Amber yet. Leave this null
    // until a real portrait exists; the monogram fallback is deliberate.
    portrait: null,
    portraitAlt: null,
    bio: [
      "Amber leads the creator side of Ellis AI Studio — the work that turns a brand’s message into something a person will actually watch and believe.",
      "Her focus is content that stays recognisably human: lifestyle, motherhood and finance as a home base, extending into the categories where an honest voice does the most work for a brand.",
      "That approach carries into how the studio builds partnerships — intentional products, truthful claims and fair treatment of the creators doing the work.",
    ],
  },
];

export function findFounder(slug: string) {
  return founders.find((founder) => founder.slug === slug);
}

export function foundersOf(slugs: string[]) {
  return slugs.map((slug) => findFounder(slug)).filter((founder): founder is Founder => Boolean(founder));
}

/** Initials used by the portrait fallback when no photograph exists. */
export function monogram(name: string) {
  return name.split(" ").map((part) => part[0]).join("");
}
