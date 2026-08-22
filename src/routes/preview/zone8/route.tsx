/*
 * Layout route for the Zone 8 preview.
 *
 * Everything under /preview/zone8 renders inside the Zone 8 shell and loads the
 * Zone 8 stylesheet. The stylesheet is attached here, not in __root.tsx, so its
 * (scoped) tokens are never shipped to Ellis AI Studio's own pages.
 */

import { Outlet, createFileRoute } from "@tanstack/react-router";
import zone8Css from "~/styles/system/zone8.css?url";
import { Zone8Layout } from "~/components/zone8/shell";

export const Route = createFileRoute("/preview/zone8")({
  head: () => ({ links: [{ rel: "stylesheet", href: zone8Css }] }),
  component: () => (
    <Zone8Layout>
      <Outlet />
    </Zone8Layout>
  ),
});
