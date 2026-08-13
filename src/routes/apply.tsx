import { createFileRoute } from "@tanstack/react-router";
import { ApplyPage } from "~/components/pages/studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/apply")({ head: () => pageHead({ title: "Business Bottleneck Audit | Ellis AI Studio", description: "Tell Ellis AI Studio what is slowing your business down. We assess the process before recommending technology or implementation.", path: "/apply" }), component: ApplyPage });
