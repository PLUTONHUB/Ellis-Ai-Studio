import { createFileRoute, redirect } from "@tanstack/react-router";
// Retired with the venture-studio reset; there is no blog on the reset site.
export const Route = createFileRoute("/insights/")({ beforeLoad: () => { throw redirect({ to: "/" }); } });
