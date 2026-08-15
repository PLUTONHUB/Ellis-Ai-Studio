import { createFileRoute, redirect } from "@tanstack/react-router";
// Retired with the venture-studio reset; capability/build work now lives on /systems.
export const Route = createFileRoute("/ventures/")({ beforeLoad: () => { throw redirect({ to: "/systems" }); } });
