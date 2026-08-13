import { createFileRoute, redirect } from "@tanstack/react-router";
// Historically indexed. Merged into /solutions during the frontend reset.
export const Route = createFileRoute("/systems")({ beforeLoad: () => { throw redirect({ to: "/solutions" }); } });
