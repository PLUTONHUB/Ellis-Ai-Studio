import { createFileRoute, redirect } from "@tanstack/react-router";
// Retired with the venture-studio reset; contact details live in the footer
// and the Business Bottleneck Audit is the site's one conversion path.
export const Route = createFileRoute("/contact")({ beforeLoad: () => { throw redirect({ to: "/apply" }); } });
