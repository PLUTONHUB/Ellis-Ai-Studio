import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ellis AI Studio - Friction Framework Systems Partner" },
      {
        name: "description",
        content:
          "Ellis AI Studio identifies, quantifies, and removes revenue friction across acquisition, response, conversion, and retention for service businesses.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;1,400&display=swap",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/logo/ellis-favicon-32.svg",
      },
      {
        rel: "alternate icon",
        type: "image/svg+xml",
        href: "/logo/ellis-favicon-16.svg",
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center md:p-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-400">
          404 · Route Not Found
        </p>
        <h1 className="mb-3 text-3xl font-black">This page does not exist yet.</h1>
        <p className="mb-8 text-sm text-zinc-400">
          Use the links below to get back to active conversion flows.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <a
            href="/"
            className="rounded-xl border border-zinc-800 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-200 transition hover:bg-zinc-900"
          >
            Homepage
          </a>
          <a
            href="/proposal"
            className="rounded-xl border border-zinc-800 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-200 transition hover:bg-zinc-900"
          >
            Proposal
          </a>
          <a
            href="/onboarding"
            className="rounded-xl border border-zinc-800 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-200 transition hover:bg-zinc-900"
          >
            Onboarding
          </a>
        </div>
      </div>
    </main>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased selection:bg-blue-600 selection:text-white min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}