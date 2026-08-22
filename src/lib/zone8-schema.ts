/*
 * Structured-data PLACEHOLDERS for the Zone 8 preview.
 *
 * ⚠️  NOTHING IN THIS FILE IS INJECTED INTO ANY PAGE, BY DESIGN.
 *
 * Publishing LocalBusiness or Service markup for a business Ellis AI Studio does
 * not represent — from a domain Zone 8 does not own, carrying unverified hours,
 * coverage and service claims — would be misrepresentation in a machine-readable
 * format, and Google treats it as exactly that. So the shapes are prepared and
 * the gaps are named, and the head tags stay empty until Zone 8 confirms the
 * facts and the site is on Zone 8's own domain.
 *
 * To go live: verify every field marked VERIFY, set `siteOrigin` to Zone 8's real
 * domain, and add `jsonLd(localBusinessSchema(...))` to the relevant route heads.
 */

import { business, serviceAreas, services } from "~/data/zone8";

/** Fields that MUST be confirmed with the business before any schema is emitted. */
export const SCHEMA_BLOCKERS = [
  "Legal business name and registered address (streetAddress is absent — GBP shows a service-area business)",
  "Confirmed service-area list (currently unverified preview neighbourhoods)",
  "Confirmed service catalogue (currently inferred from the trade name)",
  "Canonical Google Business Profile URL for sameAs",
  "Licence / registration identifiers, if the business wants them published",
  "Price ranges, if the business wants priceRange published",
] as const;

/**
 * LocalBusiness (Plumber) shape. Only the publicly verifiable GBP facts are
 * populated; everything unconfirmed is intentionally left out rather than
 * guessed at.
 */
export function localBusinessSchema(siteOrigin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `${siteOrigin}/#business`,
    name: business.name,
    telephone: `+1-${business.phone}`,
    url: siteOrigin,
    // GBP-verified: 4.9 from 62 reviews. Emit only if the count is current at
    // publish time — a stale aggregateRating is worse than none.
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    },
    // GBP-verified: "Open 24 hours".
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    // VERIFY: areaServed is preview-only until the business confirms coverage.
    areaServed: [...serviceAreas.primary, ...serviceAreas.neighbourhoods].map((name) => ({
      "@type": "City",
      name: `${name}, ${business.region}`,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: "US",
      // VERIFY: streetAddress and postalCode deliberately omitted.
    },
  };
}

/** Service shape for a single service landing page. VERIFY the catalogue first. */
export function serviceSchema(siteOrigin: string, slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    provider: { "@id": `${siteOrigin}/#business` },
    areaServed: { "@type": "City", name: `${business.city}, ${business.region}` },
    description: service.blurb,
  };
}

/** Breadcrumb shape for the service landing pages. */
export function breadcrumbSchema(siteOrigin: string, trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteOrigin}${item.path}`,
    })),
  };
}
