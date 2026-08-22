/*
 * Zone 8 preview — shared primitives.
 *
 * Icons are inline SVG on a 24-box with a 1.6 stroke: no icon font, no runtime
 * dependency, and nothing that renders as a cartoon pipe or a wrench-wielding
 * mascot. They read as quiet wayfinding marks, which is why they are small,
 * monochrome and used at most once per card.
 */

import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { IconName } from "~/data/zone8";
import { business } from "~/data/zone8";
import { useInternalMode } from "~/components/zone8/internal";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function Icon({ name, size = 18 }: { name: IconName | "phone" | "check" | "arrow" | "plus" | "search" | "pin" | "camera" | "clock" | "star" | "shield"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true, ...S };
  switch (name) {
    case "alert":
      return <svg {...common}><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 10v4" /><path d="M12 17.2v.1" /></svg>;
    case "drain":
      return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7" /></svg>;
    case "leak":
      return <svg {...common}><path d="M12 3.5c3 4 5 6.6 5 9.2a5 5 0 0 1-10 0c0-2.6 2-5.2 5-9.2Z" /></svg>;
    case "pipe":
      return <svg {...common}><path d="M3 8h7a4 4 0 0 1 4 4v9" /><rect x="2" y="5.5" width="3.5" height="5" rx="1" /><rect x="11.5" y="19" width="5" height="3.5" rx="1" /></svg>;
    case "heater":
      return <svg {...common}><rect x="6" y="3" width="12" height="18" rx="3" /><path d="M9.5 8h5M9.5 12h5" /><path d="M12 16v2" /></svg>;
    case "inspect":
      return <svg {...common}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
    case "trench":
      return <svg {...common}><path d="M2 7h20" /><path d="M2 7v4c0 3 2 4 4 4h12c2 0 4 1 4 4v2" /><path d="M2 17h4" /></svg>;
    case "wrench":
      return <svg {...common}><path d="M15.5 3.8a5.2 5.2 0 0 0-6 7.4L3.6 17a2 2 0 0 0 2.8 2.8l5.8-5.9a5.2 5.2 0 0 0 7.4-6l-3 3-2.6-.6-.6-2.6 3-3Z" /></svg>;
    case "phone":
      return <svg {...common}><path d="M6.2 3.5h3l1.4 3.6-2 1.4a12 12 0 0 0 5.4 5.4l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" /></svg>;
    case "check":
      return <svg {...common}><path d="m4.5 12.5 5 5 10-11" /></svg>;
    case "arrow":
      return <svg {...common}><path d="M4.5 12h14" /><path d="m13 6.5 5.5 5.5L13 17.5" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "search":
      return <svg {...common}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
    case "pin":
      return <svg {...common}><path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10.5" r="2.5" /></svg>;
    case "camera":
      return <svg {...common}><path d="M3.5 8.5h3l1.5-2.5h8l1.5 2.5h3v10h-17v-10Z" /><circle cx="12" cy="13" r="3.2" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 5 5.8v5.4c0 4.2 2.9 7.6 7 9.3 4.1-1.7 7-5.1 7-9.3V5.8L12 3Z" /></svg>;
    case "star":
      return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9 2.9-6Z" /></svg>;
    default:
      return null;
  }
}

/** 4.9 ★ from 62 Google reviews — the single strongest asset Zone 8 already owns. */
export function Rating({ compact = false }: { compact?: boolean }) {
  return (
    <div className="z8-rating">
      <span className="z8-stars" role="img" aria-label={`${business.rating} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={15} />)}
      </span>
      <span className="z8-rating-text">
        <span className="z8-rating-score">{business.rating}</span>
        {compact ? " · " : " from "}
        {business.reviewCount} Google reviews
      </span>
    </div>
  );
}

/** The phone CTA. Always a real tel: link — the one interaction that must never
 *  be a dead preview control. */
export function CallButton({ className = "z8-btn z8-btn-call", label = "Call Now", showNumber = false }: { className?: string; label?: string; showNumber?: boolean }) {
  return (
    <a className={className} href={business.phoneHref}>
      <Icon name="phone" size={17} />
      {showNumber ? `Call ${business.phone}` : label}
    </a>
  );
}

export function RequestButton({ className = "z8-btn z8-btn-primary", label = "Request Service" }: { className?: string; label?: string }) {
  return <Link className={className} to="/preview/zone8/request-service">{label}</Link>;
}

export function SectionHead({ label, title, lede, action, id }: { label?: string; title: ReactNode; lede?: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="z8-head">
      <div className="z8-head-row">
        <div className="z8-stack z8-g3">
          {label ? <p className="z8-label">{label}</p> : null}
          <h2 className="z8-display-l" id={id}>{title}</h2>
          {lede ? <p className="z8-lede z8-measure">{lede}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}

/*
 * Marker for content Zone 8 has not confirmed.
 *
 * Hidden from the prospect-facing presentation and shown only in internal mode
 * (?internal=1). The content it marks is still tracked in `verificationItems`
 * and rendered in full on the pitch page, so hiding the badge cannot lose it.
 */
export function VerifyBadge({ children = "Verify with client" }: { children?: ReactNode }) {
  if (!useInternalMode()) return null;
  return <span className="z8-verify">{children}</span>;
}
