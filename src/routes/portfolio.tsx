import { createFileRoute, redirect } from "@tanstack/react-router";
// The legacy demo portfolio is gone; ventures is the honest destination.
export const Route = createFileRoute("/portfolio")({ beforeLoad: () => { throw redirect({ to: "/ventures" }); } });
