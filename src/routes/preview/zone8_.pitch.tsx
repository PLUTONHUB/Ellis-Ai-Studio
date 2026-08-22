/*
 * The Ellis AI Studio sales view, at /preview/zone8/pitch.
 *
 * The trailing underscore on the `zone8_` segment opts this route OUT of the
 * consumer layout while keeping the URL. The preview ribbon, customer nav and
 * fixed call bar are all noise in a screen share with the business owner, so the
 * pitch renders its own dark shell and loads the stylesheet itself.
 */

import { createFileRoute } from "@tanstack/react-router";
import zone8Css from "~/styles/system/zone8.css?url";
import { PitchPage } from "~/components/zone8/pitch";
import { zone8Head } from "~/lib/zone8-seo";

export const Route = createFileRoute("/preview/zone8_/pitch")({
  head: () => ({
    ...zone8Head({
      title: "Zone 8 Plumbing — Prospect Brief | Ellis AI Studio",
      description: "Ellis AI Studio prospect brief: the gap between Zone 8's 4.9-star Google listing and its expired website.",
    }),
    // This route sits outside the /preview/zone8 layout, so it loads the
    // stylesheet itself rather than inheriting it.
    links: [{ rel: "stylesheet", href: zone8Css }],
  }),
  component: PitchPage,
});
