import { createFileRoute, redirect } from "@tanstack/react-router";
// Historically indexed. The capability page now lives at /systems.
export const Route = createFileRoute("/solutions")({ beforeLoad: () => { throw redirect({ to: "/systems" }); } });
