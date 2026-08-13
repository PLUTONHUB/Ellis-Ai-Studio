import { createFileRoute } from "@tanstack/react-router";
import { FoundersPage } from "~/components/pages/founders";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/founders/")({ head: () => pageHead({ title: "Founders | Ellis AI Studio", description: "Jacob Ellis and Amber Dowling, co-founders of Ellis AI Studio.", path: "/founders" }), component: FoundersPage });
