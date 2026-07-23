import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" }, { name: "application-name", content: "Ellis AI Studio" }, { name: "robots", content: "index, follow" },
      { title: "AI-Powered Growth Systems for Service Businesses | Ellis AI Studio" },
      { name: "description", content: "Ellis AI Studio designs growth systems that help service businesses acquire more customers, convert more leads, and operate more efficiently." },
      { property: "og:type", content: "website" }, { property: "og:locale", content: "en_US" }, { property: "og:site_name", content: "Ellis AI Studio" },
      { property: "og:title", content: "AI-Powered Growth Systems for Service Businesses | Ellis AI Studio" },
      { property: "og:description", content: "Acquire more customers, convert more leads, and operate more efficiently." }, { property: "og:image", content: "https://ellisaistudio.com/logo/ellis-og.png" }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:image", content: "https://ellisaistudio.com/logo/ellis-og.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/logo/ellis-favicon-32.png" }, { rel: "apple-touch-icon", sizes: "180x180", href: "/logo/ellis-apple-touch-icon.png" },
    ],
  }),
  notFoundComponent: () => <main className="wrap" style={{ padding: "120px 0" }}><p className="eyebrow">Page not found</p><h1>Let’s get you back to Ellis AI Studio.</h1><a className="button" href="/">Go to Home</a></main>,
  component: () => <RootDocument><Outlet /></RootDocument>,
});

function RootDocument({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body className="antialiased min-h-screen">{children}<Scripts /></body></html>; }
