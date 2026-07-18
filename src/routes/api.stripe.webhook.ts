import { createFileRoute } from "@tanstack/react-router";

import { completePayment } from "~/server/client-payments";
import { verifyStripeWebhook } from "~/services/stripe-checkout-service";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return new Response("Stripe webhook is not configured.", { status: 503 });
    const body = await request.text();
    const valid = await verifyStripeWebhook(body, request.headers.get("stripe-signature"), secret);
    if (!valid) return new Response("Invalid Stripe signature.", { status: 400 });
    const event = JSON.parse(body) as { type?: string; data?: { object?: { id?: string } } };
    if (event.type === "checkout.session.completed" && event.data?.object?.id) await completePayment(event.data.object.id);
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      },
    },
  },
});
