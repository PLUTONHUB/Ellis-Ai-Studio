import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "~/components/venture-studio";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/contact")({ head: () => pageHead({ title: "Contact | Ellis AI Studio", description: "Hire Ellis AI Studio for business systems and AI infrastructure, or reach the founders directly about creator and brand-partnership work.", path: "/contact" }), component: ContactPage });
