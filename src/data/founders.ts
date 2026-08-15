/**
 * Founder records for Ellis AI Studio.
 *
 * Both entries are co-founders and are treated as peers everywhere they
 * render. Order in `founders` is presentation order only and carries no
 * seniority. Professional focus only — creator/brand-partnership work is a
 * separate line of business and isn't part of the Ellis AI Studio site.
 */

export type Founder = {
  slug: string;
  name: string;
  role: string;
  /** One line used as the founder's professional positioning statement. */
  positioning: string;
  /** Disciplines this founder leads inside the business. */
  focus: string[];
  email: string;
  /** Path under /public. `null` means no authentic photograph exists yet. */
  portrait: string | null;
  portraitAlt: string | null;
};

export const founders: Founder[] = [
  {
    slug: "jacob-ellis",
    name: "Jacob Ellis",
    role: "Co-Founder",
    positioning: "Leads systems design, software and the technical infrastructure Ellis AI Studio builds on.",
    focus: ["AI systems", "Automation", "Operations", "Software & product development", "Digital infrastructure"],
    email: "jake@ellisaistudio.com",
    portrait: "/images/jacob-ellis-founder.jpg",
    portraitAlt: "Jacob Ellis, co-founder of Ellis AI Studio",
  },
  {
    // NOTE: Amber's previous bio described her creator/UGC-partnership work,
    // which is out of scope for the B2B systems positioning. Her professional
    // focus on this side of the business hasn't been specified — Jake should
    // confirm/replace this before launch rather than treat it as final copy.
    slug: "amber-dowling",
    name: "Amber Dowling",
    role: "Co-Founder",
    positioning: "Co-founder of Ellis AI Studio.",
    focus: [],
    email: "amberd@ellisaistudio.com",
    portrait: null,
    portraitAlt: null,
  },
];

/** Initials used by the portrait fallback when no photograph exists. */
export function monogram(name: string) {
  return name.split(" ").map((part) => part[0]).join("");
}
