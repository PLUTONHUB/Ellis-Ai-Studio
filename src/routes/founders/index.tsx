import { createFileRoute, redirect } from "@tanstack/react-router";
// Retired with the venture-studio reset; the team now lives on /about.
export const Route = createFileRoute("/founders/")({ beforeLoad: () => { throw redirect({ to: "/about" }); } });
