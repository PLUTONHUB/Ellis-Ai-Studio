import { createFileRoute } from "@tanstack/react-router";

import { ClientOnboardingPage } from "~/components/client-onboarding";

export const Route = createFileRoute("/onboarding")({ component: ClientOnboardingPage });
