import { createFileRoute } from "@tanstack/react-router";

import { PaymentSuccessPage } from "~/components/client-conversion-flow";

export const Route = createFileRoute("/payment/success")({ component: PaymentSuccessPage });
