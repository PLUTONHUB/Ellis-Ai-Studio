import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import tokensCss from "~/styles/system/tokens.css?url";
import baseCss from "~/styles/system/base.css?url";
import dashboardCss from "~/styles/system/dashboard.css?url";
import { jsonLd, organizationSchema, siteUrl } from "~/lib/seo";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#14161a" },
      { name: "application-name", content: "Ellis AI Studio" },
      { name: "robots", content: "index, follow" },
      { title: "Ellis AI Studio | Founder-Led Venture Studio" },
      { name: "description", content: "Ellis AI Studio builds systems, products, brands and digital ventures around real problems — and builds AI systems, automation and business infrastructure for companies that need the same." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Ellis AI Studio" },
      { property: "og:title", content: "Ellis AI Studio | Founder-Led Venture Studio" },
      { property: "og:description", content: "Systems, products, brands and ventures — built around real problems and opportunities." },
      { property: "og:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` },
    ],
    links: [
      { rel: "stylesheet", href: tokensCss },
      { rel: "stylesheet", href: baseCss },
      // Utility classes the internal /dashboard tools rely on.
      { rel: "stylesheet", href: dashboardCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: FONTS },
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
