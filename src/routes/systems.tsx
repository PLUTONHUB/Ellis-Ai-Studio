import { createFileRoute, redirect } from "@tanstack/react-router";
// Merged into /solutions during the venture-studio restructure. Kept as a
// redirect so existing links and indexed URLs continue to resolve.
export const Route = createFileRoute("/systems")({ beforeLoad: () => { throw redirect({ to: "/solutions" }); } });
