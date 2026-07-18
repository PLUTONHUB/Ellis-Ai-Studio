import { createServerFn } from "@tanstack/react-start";

import proposal from "~/data/mock-client-conversion.json";

type ProposalSeed = { proposalId: string };

export const startCheckout = createServerFn({ method: "POST" }).validator(validateProposal).handler(async ({ data }) => {
  const [{ ClientProposalRepository }, { StripeCheckoutService }] = await Promise.all([import("~/lib/supabase/client-proposal-repository.server"), import("~/services/stripe-checkout-service")]);
  const repository = ClientProposalRepository.fromEnvironment();
  const record = await repository.createOrGet(seed(data.proposalId));
  if (record.paymentStatus === "paid" && record.workspaceActivated) return { alreadyPaid: true, checkoutUrl: null };
  const origin = requiredOrigin();
  const stripe = StripeCheckoutService.fromEnvironment();
  const successUrl = `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/proposal/${record.proposalKey}?payment=cancelled`;
  const session = await stripe.createSession({ proposalKey: record.proposalKey, projectName: record.projectName, depositAmount: record.depositAmount, successUrl, cancelUrl });
  await repository.attachCheckoutSession(record.proposalKey, session.id);
  return { alreadyPaid: false, checkoutUrl: session.url };
});

export const confirmCheckout = createServerFn({ method: "POST" }).validator((data: { sessionId: string }) => { if (!data?.sessionId || !/^cs_/.test(data.sessionId)) throw new Error("Invalid Stripe Checkout session."); return data; }).handler(async ({ data }) => completePayment(data.sessionId));

export const getWorkspaceAccess = createServerFn({ method: "POST" }).validator(validateProposal).handler(async ({ data }) => {
  const { ClientProposalRepository } = await import("~/lib/supabase/client-proposal-repository.server");
  const record = await ClientProposalRepository.fromEnvironment().getByKey(data.proposalId);
  return { paid: record.paymentStatus === "paid" && record.workspaceActivated, clientName: record.clientName };
});

export async function completePayment(sessionId: string): Promise<{ proposalId: string; paid: boolean }> {
  const [{ ClientProposalRepository }, { StripeCheckoutService }] = await Promise.all([import("~/lib/supabase/client-proposal-repository.server"), import("~/services/stripe-checkout-service")]);
  const stripe = StripeCheckoutService.fromEnvironment();
  const session = await stripe.getPaidSession(sessionId);
  const proposalId = session.metadata?.proposal_id ?? session.client_reference_id;
  if (!proposalId) throw new Error("The paid Stripe session is missing its proposal reference.");
  const repository = ClientProposalRepository.fromEnvironment();
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
  const newlyPaid = await repository.markPaid({ proposalKey: proposalId, sessionId, paymentIntent });
  if (newlyPaid) {
    const record = await repository.getByKey(proposalId);
    try { const { GoogleService } = await import("~/services/google-service"); await GoogleService.fromEnvironment().sendClientWelcomeEmail({ to: record.clientEmail, clientName: record.clientName, projectName: record.projectName }); }
    catch (error) { console.error("Payment completed but welcome email could not be sent", error); }
  }
  return { proposalId, paid: true };
}

function validateProposal(data: ProposalSeed): ProposalSeed { if (!data?.proposalId || !/^[a-z0-9-]{3,100}$/i.test(data.proposalId)) throw new Error("Invalid proposal reference."); return data; }
function seed(proposalId: string) { return { proposalKey: proposalId, clientName: proposal.clientName, clientEmail: proposal.clientEmail, businessName: proposal.businessName, projectName: proposal.projectName, projectTotal: proposal.projectTotal * 100, depositAmount: proposal.deposit * 100 }; }
function requiredOrigin(): string { const value = process.env.PUBLIC_APP_URL; if (!value) throw new Error("PUBLIC_APP_URL must be configured as a Cloudflare Worker secret."); return value.replace(/\/$/, ""); }
