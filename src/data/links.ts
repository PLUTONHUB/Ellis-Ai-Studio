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
  systems: "/systems",
  /** The AI Opportunity Audit — the site's interactive product. */
  audit: "/audit",
  apply: "/apply",
  founding: "/founding",
  howItWorks: "/how-it-works",
  about: "/about",
} as const;

/** Persistent report URL for a completed audit: /audit/[report-id]. */
export function auditReport(reportId: string) {
  return `${routes.audit}/${reportId}`;
}

/** Primary navigation, in order. The audit is the CTA button, not a nav link. */
export const primaryNav = [
  ["How It Works", routes.howItWorks],
  ["Systems", routes.systems],
  ["About", routes.about],
  ["Founding Program", routes.founding],
] as const;

/** Secondary destinations, reached from the footer. */
export const secondaryNav = [
  ["AI Opportunity Audit", routes.audit],
  ["Business Bottleneck Audit", routes.apply],
] as const;

export function mailto(address: string, subject?: string) {
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;
}
