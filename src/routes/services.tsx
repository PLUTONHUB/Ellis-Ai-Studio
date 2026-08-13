import { createFileRoute, redirect } from "@tanstack/react-router";
// Legacy route. Points straight at /solutions rather than chaining through /systems.
export const Route = createFileRoute("/services")({ beforeLoad: () => { throw redirect({ to: "/solutions" }); } });
