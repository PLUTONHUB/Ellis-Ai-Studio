import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import tokensCss from "~/styles/system/tokens.css?url";
import baseCss from "~/styles/system/base.css?url";
import dashboardCss from "~/styles/system/dashboard.css?url";
import { jsonLd, organizationSchema, siteUrl } from "~/lib/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#FBF9F4" },
      { name: "application-name", content: "Ellis AI Studio" },
      { name: "robots", content: "index, follow" },
      { title: "Ellis AI Studio | AI Systems & Business Operations" },
      { name: "description", content: "Ellis AI Studio identifies business friction and builds AI-powered systems that save time, reduce costs, improve operations, and support growth. We diagnose the problem before recommending technology." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Ellis AI Studio" },
      { property: "og:title", content: "Ellis AI Studio | AI Systems & Business Operations" },
      { property: "og:description", content: "Your business doesn't need more tools. It needs a better system. We diagnose operational bottlenecks and build the AI-powered systems that fix them." },
      { property: "og:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` },
    ],
    links: [
      { rel: "stylesheet", href: tokensCss },
      { rel: "stylesheet", href: baseCss },
      // Utility classes the internal /dashboard tools rely on.
      { rel: "stylesheet", href: dashboardCss },
      // Self-hosted Geist — no external font request, preloaded to avoid CLS.
      { rel: "preload", href: "/fonts/geist-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" as const },
      { rel: "preload", href: "/fonts/geist-mono-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" as const },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/logo/ellis-favicon-32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/logo/ellis-apple-touch-icon.png" },
    ],
    scripts: jsonLd(organizationSchema),
  }),
  notFoundComponent: () => (
    <main className="container" style={{ paddingBlock: "clamp(120px,18vw,220px)" }}>
      <p className="label">404</p>
      <h1 className="display-l" style={{ marginBlock: "var(--space-5)" }}>That page doesn’t exist.</h1>
      <a className="button" href="/">Back to Ellis AI Studio</a>
    </main>
  ),
  component: () => <RootDocument><Outlet /></RootDocument>,
});

function CanonicalUrl() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <link rel="canonical" href={`${siteUrl}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`} />;
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /><CanonicalUrl /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
