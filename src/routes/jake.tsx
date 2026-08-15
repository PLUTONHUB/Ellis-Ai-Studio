import { createFileRoute } from "@tanstack/react-router";
import { JakePortfolioPage } from "~/components/pages/jake-portfolio";
import { pageHead } from "~/lib/seo";

/**
 * JAK3FFECT — Jacob Ellis's creator portfolio.
 *
 * Served at `/jake` on the studio app today so it can be reviewed on the
 * existing preview Worker. Once `jake.ellisaistudio.com` is attached as a
 * Custom Domain — bound outside the repo, as the apex already is; see
 * `docs/jake-subdomain-setup.md` — the subdomain resolves to this same Worker
 * and this route is what it lands on.
 */
export const Route = createFileRoute("/jake")({
  head: () => ({
    ...pageHead({
      title: "JAK3FFECT | Jacob Ellis — UGC & Short-Form Content Creator",
      description:
        "Authentic, cinematic short-form content across travel and outdoor, fitness, health and wellness, tech and AI, productivity and entrepreneurship. UGC video, product demos, app demonstrations and lifestyle content by Jacob Ellis.",
      path: "/jake",
    }),
    /*
     * Preloaded so the swap happens before first paint rather than after it.
     * `crossOrigin` is required even same-origin: font fetches are always
     * CORS-mode, and without it the preload misses and the file downloads
     * twice. Only this route pays for these — the studio pages never request
     * them.
     */
    links: [
      { rel: "preload", as: "font" as const, type: "font/woff2", href: "/fonts/geist-latin.woff2", crossOrigin: "anonymous" as const },
      { rel: "preload", as: "font" as const, type: "font/woff2", href: "/fonts/geist-mono-latin.woff2", crossOrigin: "anonymous" as const },
    ],
  }),
  component: JakePortfolioPage,
});
