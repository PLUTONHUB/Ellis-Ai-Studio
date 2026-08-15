import { createFileRoute } from "@tanstack/react-router";
import { JakePortfolioPage } from "~/components/pages/jake-portfolio";
import { pageHead } from "~/lib/seo";

/**
 * JAK3FFECT — Jacob Ellis's creator portfolio.
 *
 * Served at `/jake` on the studio app today so it can be reviewed on the
 * existing preview Worker. Once `jake.ellisaistudio.com` is attached as a
 * Custom Domain (see `wrangler.production.jsonc`), the subdomain resolves to
 * this same Worker and this route is what it lands on.
 */
export const Route = createFileRoute("/jake")({
  head: () =>
    pageHead({
      title: "JAK3FFECT | Jacob Ellis — UGC & Short-Form Content Creator",
      description:
        "Authentic, cinematic short-form content across travel and outdoor, fitness, health and wellness, tech and AI, productivity and entrepreneurship. UGC video, product demos, app demonstrations and lifestyle content by Jacob Ellis.",
      path: "/jake",
    }),
  component: JakePortfolioPage,
});
