import { createFileRoute } from "@tanstack/react-router";

import { ProposalFlowPage } from "~/components/client-conversion-flow";

// Keep the historical entry point aligned with the current client activation flow.
// This prevents a second, incompatible proposal and scoring experience from reaching clients.
export const Route = createFileRoute("/proposal")({ component: ProposalFlowPage });
