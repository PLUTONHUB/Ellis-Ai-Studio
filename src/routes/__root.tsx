import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" }, { name: "application-name", content: "Ellis AI Studio" }, { name: "robots", content: "index, follow" },
      { title: "Ellis AI Studio | Technology Built for Service Businesses" },
      { name: "description", content: "Ellis AI Studio builds websites, automations, and AI-powered tools for service businesses." },
      { property: "og:type", content: "website" }, { property: "og:locale", content: "en_US" }, { property: "og:site_name", content: "Ellis AI Studio" },
      { property: "og:title", content: "Ellis AI Studio | Technology Built for Service Businesses" },
      { property: "og:description", content: "Websites, automations, and AI-powered tools for service businesses." }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
      { rel: "icon", type: "image/svg+xml", href: "/logo/ellis-favicon-32.svg" },
    ],
  }),
  notFoundComponent: () => <main className="wrap" style={{ padding: "120px 0" }}><p className="eyebrow">Page not found</p><h1>Let’s get you back to Ellis AI Studio.</h1><a className="button" href="/">Go to Home</a></main>,
  component: () => <RootDocument><Outlet /></RootDocument>,
});

function RootDocument({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body className="antialiased min-h-screen">{children}<Scripts /></body></html>; }
