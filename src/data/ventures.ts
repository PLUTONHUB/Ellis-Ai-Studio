/**
 * Ventures built and operated by the Ellis AI Studio founders.
 *
 * Rules that keep this file honest:
 * - No traction metrics, customers, revenue or launch dates unless they are real.
 * - `destination` is only set when a public URL actually exists today. Planned
 *   properties live in `plannedDomain`, which renders as text, never as a link.
 * - `cover: null` means no authentic imagery exists yet; the UI shows a typographic
 *   panel instead of a placeholder photo or a generated screenshot.
 */

export type VentureStatus = "Active" | "Active / Building" | "In Development";

export type VentureLink = {
  label: string;
  href: string;
};

export type Venture = {
  slug: string;
  name: string;
  status: VentureStatus;
  /** Short category label used on cards. */
  category: string;
  /** One-sentence positioning. */
  positioning: string;
  /** Longer description paragraphs for the venture detail page. */
  description: string[];
  /** Founder slugs. */
  founders: string[];
  /** Identity areas the venture is built around. */
  identity: string[];
  /** Commercial categories the venture works in. */
  categories: string[];
  /** Words that describe how the venture should feel. Drives its accent theme. */
  feeling: string;
  /** Live public destination, or null when nothing is published yet. */
  destination: string | null;
  /** Creator property planned on Ellis AI Studio infrastructure, not yet deployed. */
  plannedDomain: string | null;
  links: VentureLink[];
  cover: string | null;
  coverAlt: string | null;
  /** Accent theme token; the venture sections shift palette using this. */
  accent: "cinematic" | "warm" | "product";
  /** Stated commitments. Only include what the venture actually holds itself to. */
  commitments?: string[];
};

export const ventures: Venture[] = [
  {
    slug: "jak3ffect",
    name: "JAK3FFECT",
    status: "Active",
    category: "Creator & media",
    positioning:
      "Jacob Ellis’s creator and media venture — cinematic content built around mindset, fitness, wellness and exploration.",
    description: [
      "JAK3FFECT is the media side of the studio: content made outdoors, in motion, and largely in the Pacific Northwest.",
      "It works commercially as a UGC and lifestyle content venture — brands in fitness, wellness, tech, travel and lifestyle hire it to produce content that looks like something a person would choose to watch rather than something they were served.",
    ],
    founders: ["jacob-ellis"],
    identity: ["Mindset", "Fitness", "Wellness", "Exploration"],
    categories: ["Fitness", "Wellness", "Tech", "Travel", "Lifestyle"],
    feeling: "Cinematic, disciplined, natural, exploratory — quiet ambition.",
    destination: null,
    plannedDomain: "jake.ellisaistudio.com",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/jak3ffect?igsh=MnVzODVqOWdhMzVl&utm_source=qr" },
      { label: "TikTok", href: "https://www.tiktok.com/@jak3ffect?_r=1&_t=ZP-98r4YQec1dO" },
      { label: "YouTube", href: "https://youtube.com/@jak3ffect?si=WY9RBzhv_-VOSxZ8" },
      { label: "Beacons", href: "https://beacons.ai/jakeslinks" },
    ],
    cover: "/images/ventures/jak3ffect-marina.jpg",
    coverAlt: "Sailboats at a Pacific Northwest marina at dusk",
    accent: "cinematic",
  },
  {
    slug: "organicambervibez",
    name: "organicambervibez",
    status: "Active / Building",
    category: "Creator & UGC",
    positioning:
      "Amber Dowling’s creator and UGC venture — polished, conversion-focused content delivered in a relatable human voice.",
    description: [
      "organicambervibez makes creator content for brands that need to sound like a person rather than a press release.",
      "Its home base is lifestyle, motherhood and finance, extending into the categories where a trusted voice carries the most weight: clean beauty, skincare, wellness, fitness, travel, hospitality, tech, apps and consumer products.",
      "The venture is actively taking brand work while its full creator portfolio is being built out.",
    ],
    founders: ["amber-dowling"],
    identity: ["Lifestyle", "Motherhood", "Finance"],
    categories: [
      "Clean beauty",
      "Skincare",
      "Wellness",
      "Fitness",
      "Travel",
      "Hospitality",
      "Tech",
      "Apps & SaaS",
      "Consumer products",
    ],
    feeling: "Warm, confident, creative, expressive — premium without being sterile.",
    destination: null,
    plannedDomain: "amber.ellisaistudio.com",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/organicambervibez?utm_source=qr" },
      { label: "TikTok", href: "https://www.tiktok.com/@organicambervibez?_r=1&_t=ZT-98r3nbmvNUM" },
      { label: "YouTube", href: "https://youtube.com/@organicambervibez?si=LY5JDTHQ9aQXYxEN" },
      { label: "Beacons", href: "https://beacons.ai/ambercreates.co" },
    ],
    cover: null,
    coverAlt: null,
    accent: "warm",
    commitments: [
      "Intentional products over volume",
      "Partnerships with responsible, eco-conscious brands",
      "Reduced plastic where it is reasonably possible",
      "Truthful claims — nothing stated that cannot be stood behind",
      "Fair treatment of creators",
    ],
  },
  {
    slug: "recon",
    name: "RECON",
    status: "In Development",
    category: "Software & product",
    positioning: "A software venture currently being built inside the studio.",
    description: [
      "RECON is an active build. It is being developed inside Ellis AI Studio alongside client work.",
      "There is nothing to demonstrate publicly yet, and this page will stay deliberately quiet until there is. No screenshots, no feature list and no launch date are published here, because none of those are settled.",
    ],
    founders: ["jacob-ellis"],
    identity: [],
    categories: [],
    feeling: "Sharp, product-oriented, deliberate.",
    destination: null,
    plannedDomain: null,
    links: [],
    cover: null,
    coverAlt: null,
    accent: "product",
  },
];

export function findVenture(slug: string) {
  return ventures.find((venture) => venture.slug === slug);
}

/** Ventures are ordered so that the ones a visitor can actually look at come first. */
export const statusOrder: Record<VentureStatus, number> = {
  Active: 0,
  "Active / Building": 1,
  "In Development": 2,
};
