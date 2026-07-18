import { createFileRoute } from "@tanstack/react-router";
import { WelcomeFlowPage } from "~/components/client-conversion-flow";
export const Route = createFileRoute("/welcome")({ component: WelcomeFlowPage });
