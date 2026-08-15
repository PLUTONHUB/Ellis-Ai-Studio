import { createFileRoute, redirect } from "@tanstack/react-router";
// Historically indexed. Portfolio/capability content now lives at /systems.
export const Route = createFileRoute("/portfolio")({ beforeLoad: () => { throw redirect({ to: "/systems" }); } });
