/**
 * Canonical outbound destinations.
 *
 * Every external URL the site links to lives here. Nothing is invented: if a
 * destination does not exist yet it is absent from this file rather than
 * guessed, and the UI renders it as plain text instead of a dead link.
 */

export const studio = {
  /** Discovery conversations for studio and founder enquiries. */
  booking: "https://calendly.com/jake-ellisaistudio/30min",
  beacons: "https://beacons.ai/jakeandai",
  phone: "206-201-9383",
  phoneHref: "tel:2062019383",
} as const;

export const emails = {
  jake: "jake@ellisaistudio.com",
  amber: "amberd@ellisaistudio.com",
} as const;

/** Internal routes referenced from more than one place. */
export const routes = {
  home: "/",
  solutions: "/solutions",
  ventures: "/ventures",
  founders: "/founders",
  insights: "/insights",
  contact: "/contact",
  apply: "/apply",
  founding: "/founding",
  howItWorks: "/how-it-works",
  about: "/about",
} as const;

/** Primary navigation, in order. */
export const primaryNav = [
  ["Home", routes.home],
  ["Solutions", routes.solutions],
  ["Ventures", routes.ventures],
  ["Founders", routes.founders],
  ["Insights", routes.insights],
  ["Contact", routes.contact],
] as const;

/** Secondary destinations — real pages, reached from the footer. */
export const secondaryNav = [
  ["How We Work", routes.howItWorks],
  ["Founding Client Program", routes.founding],
  ["About", routes.about],
  ["Request an Audit", routes.apply],
] as const;

export function mailto(address: string, subject?: string) {
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;
}
