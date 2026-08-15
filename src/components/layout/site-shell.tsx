import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { primaryNav, secondaryNav, emails, studio, routes, mailto } from "~/data/links";
import "~/styles/system/shell.css";

/** Typographic wordmark. Deliberately not an image — no logo assets this phase. */
function Wordmark() {
  return (
    <a className="wordmark" href={routes.home} aria-label="Ellis AI Studio — home">
      <span className="wordmark-name">Ellis</span>
      <span className="wordmark-suffix">AI Studio</span>
    </a>
  );
}

function Header({ pathname }: { pathname: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape, and stop the page behind the overlay from scrolling.
  useEffect(() => {
    document.body.dataset.navOpen = String(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) =>
    href === routes.home ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="header" data-scrolled={scrolled}>
        <div className="container header-inner">
          <Wordmark />
          <nav className="nav" aria-label="Primary">
            {primaryNav.map(([label, href]) => (
              <a key={href} href={href} aria-current={current(href) ? "page" : undefined}>{label}</a>
            ))}
          </nav>
          <a className="button button-solid header-cta" href={routes.apply}>Free Business Bottleneck Audit</a>
          <button
            className="nav-toggle" type="button" aria-expanded={open}
            aria-controls="site-menu" onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
            <span className="nav-toggle-bars" aria-hidden="true"><span /><span /></span>
          </button>
        </div>
      </header>

      {open && (
        <div className="nav-overlay" id="site-menu">
          <nav aria-label="Primary mobile">
            <ul>
              {primaryNav.map(([label, href], i) => (
                <li key={href} style={{ "--i": i } as React.CSSProperties}>
                  <a href={href} onClick={() => setOpen(false)}>
                    <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-overlay-secondary">
              <ul>
                <li style={{ "--i": primaryNav.length } as React.CSSProperties}>
                  <a href={studio.booking} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Book a conversation</a>
                </li>
              </ul>
            </div>
            <a className="button button-solid" href={routes.apply} onClick={() => setOpen(false)}>Free Business Bottleneck Audit</a>
          </nav>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Wordmark />
            <p>Ellis AI Studio is an AI systems and business-operations company. We identify friction inside a business and build the systems that remove it.</p>
          </div>
          <div className="footer-col">
            <p className="label">Explore</p>
            <ul>{primaryNav.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <p className="label">Get started</p>
            <ul>{secondaryNav.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <p className="label">Contact</p>
            <ul>
              <li><a href={mailto(emails.jake)}>{emails.jake}</a></li>
              <li><a href={studio.booking} target="_blank" rel="noreferrer">Book a conversation</a></li>
              <li><a href={studio.phoneHref}>{studio.phone}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <p>© 2026 Ellis AI Studio</p>
          <p>Jacob Ellis · Amber Dowling</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header pathname={pathname} />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
