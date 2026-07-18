import { createFileRoute } from "@tanstack/react-router";
import { PaymentFlowPage } from "~/components/client-conversion-flow";
export const Route = createFileRoute("/payment/$proposalId")({ component: PaymentFlowPage });
