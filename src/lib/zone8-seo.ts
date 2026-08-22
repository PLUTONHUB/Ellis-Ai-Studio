/*
 * Head metadata for the Zone 8 preview routes.
 *
 * TWO NON-NEGOTIABLES:
 *
 * 1. `noindex, nofollow` on every route, no exceptions. This is an unsolicited
 *    concept for a business Ellis AI Studio does not represent, served from
 *    Ellis's domain. Letting it into an index would compete with Zone 8's own
 *    listing for its own brand terms and read as impersonation. The titles and
 *    descriptions below are written as production-ready so the SEO architecture
 *    is demonstrable — the robots directive is what keeps that safe.
 *
 * 2. No structured data is emitted. The shapes live, unused, in ~/lib/zone8-schema
 *    with the blockers named. See that file for why.
 */

type Zone8Seo = { title: string; description: string };

export function zone8Head({ title, description }: Zone8Seo) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      // Overrides the site-wide "index, follow" set in __root.tsx.
      { name: "robots", content: "noindex, nofollow" },
      { name: "googlebot", content: "noindex, nofollow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    // No canonical here: __root.tsx already emits a self-referencing canonical
    // for the current pathname, and a second one is a conflicting signal. The
    // canonical deliberately stays on the Ellis preview URL — pointing it at a
    // Zone 8 domain would hand authority signals to a site Ellis does not own.
  };
}
