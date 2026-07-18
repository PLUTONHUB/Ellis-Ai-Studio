import { createFileRoute } from "@tanstack/react-router";
import { AgreementFlowPage } from "~/components/client-conversion-flow";
export const Route = createFileRoute("/agreement/$proposalId")({ component: AgreementFlowPage });
