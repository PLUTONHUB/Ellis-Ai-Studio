import { createFileRoute } from "@tanstack/react-router";
import { ProposalFlowPage } from "~/components/client-conversion-flow";
export const Route = createFileRoute("/proposal/$proposalId")({ component: ProposalFlowPage });
