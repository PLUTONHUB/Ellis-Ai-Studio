import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";
import a11yCss from "~/styles/a11y.css?url";
import mobileNavigationCss from "~/styles/mobile-navigation.css?url";
import siteNavigationCss from "~/styles/site-navigation.css?url";
import { jsonLd, organizationSchema, siteUrl } from "~/lib/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#070707" }, { name: "application-name", content: "Ellis AI Studio" }, { name: "robots", content: "index, follow" },
      { title: "Business Systems & Automation | Ellis AI Studio" },
      { name: "description", content: "Ellis AI Studio identifies business bottlenecks and builds connected systems that help businesses operate better." },
      { property: "og:type", content: "website" }, { property: "og:locale", content: "en_US" }, { property: "og:site_name", content: "Ellis AI Studio" },
      { property: "og:title", content: "Business Systems & Automation | Ellis AI Studio" },
      { property: "og:description", content: "Find what is slowing your business down. Then build the connected system that fixes it." }, { property: "og:image", content: "https://ellisaistudio.com/logo/ellis-og-acquisition.png" }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:image", content: "https://ellisaistudio.com/logo/ellis-og-acquisition.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss }, { rel: "stylesheet", href: a11yCss }, { rel: "stylesheet", href: mobileNavigationCss }, { rel: "stylesheet", href: siteNavigationCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/logo/ellis-favicon-32.png" }, { rel: "apple-touch-icon", sizes: "180x180", href: "/logo/ellis-apple-touch-icon.png" },
    ],
    scripts: jsonLd(organizationSchema),
  }),
  notFoundComponent: () => <main className="wrap" style={{ padding: "120px 0" }}><p className="eyebrow">Page not found</p><h1>Let’s get you back to Ellis AI Studio.</h1><a className="button" href="/">Go to Home</a></main>,
  component: () => <RootDocument><Outlet /></RootDocument>,
});

function CanonicalUrl() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <link rel="canonical" href={`${siteUrl}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`} />;
}

function RootDocument({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /><CanonicalUrl /></head><body className="antialiased min-h-screen">{children}<Scripts /></body></html>; }
