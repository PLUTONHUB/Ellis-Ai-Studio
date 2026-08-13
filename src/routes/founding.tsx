import { createFileRoute } from "@tanstack/react-router";
import { FoundingPage } from "~/components/pages/studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/founding")({ head: () => pageHead({ title: "Founding Client Program | Ellis AI Studio", description: "Ellis AI Studio is selecting three service businesses for hands-on systems diagnosis and implementation at preferred founding-client pricing.", path: "/founding" }), component: FoundingPage });
