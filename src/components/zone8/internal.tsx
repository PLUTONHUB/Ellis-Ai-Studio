/*
 * Internal-mode gate for the Zone 8 preview.
 *
 * The preview carries two audiences with opposite needs:
 *
 *   - The PROSPECT (Zone 8's owner) should see a polished proposed website. A
 *     page dotted with amber "VERIFY WITH CLIENT" badges reads as an unfinished
 *     internal prototype and undercuts the pitch.
 *   - ELLIS must never lose track of which content is unconfirmed, because
 *     shipping an unverified service list or coverage area is a real liability.
 *
 * So the notes are hidden, not deleted. Three things keep them from being
 * forgotten:
 *   1. `?internal=1` on any preview URL re-renders every inline badge and note.
 *   2. The full checklist is always visible on /preview/zone8/pitch, which is
 *      the internal-facing route.
 *   3. `verificationItems` in ~/data/zone8 is the single source both read from,
 *      and provenance is still modelled per-record in the data.
 *
 * The footer's concept/non-affiliation disclaimer stays visible on every route
 * regardless of this flag — that one is not a presentation choice.
 */

import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

/** True when the URL carries ?internal=1 — Ellis's own review mode. */
export function useInternalMode(): boolean {
  return useRouterState({
    select: (state) => {
      const search = state.location.search as Record<string, unknown> | undefined;
      if (search && (search.internal === "1" || search.internal === 1 || search.internal === true)) return true;
      // Fall back to the raw href so the flag works regardless of how the
      // router parsed (or did not parse) the query string.
      const href = state.location.href ?? "";
      return /[?&]internal=1(?:&|$)/.test(href);
    },
  });
}

/** Renders its children only in internal mode. Nothing prospect-facing. */
export function InternalNote({ children }: { children: ReactNode }) {
  return useInternalMode() ? <>{children}</> : null;
}
