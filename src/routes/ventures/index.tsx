import { createFileRoute } from "@tanstack/react-router";
import { VenturesPage } from "~/components/pages/ventures";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/ventures/")({ head: () => pageHead({ title: "Ventures | Ellis AI Studio", description: "The ventures Jacob Ellis and Amber Dowling are building inside Ellis AI Studio — JAK3FFECT, organicambervibez and RECON.", path: "/ventures" }), component: VenturesPage });
