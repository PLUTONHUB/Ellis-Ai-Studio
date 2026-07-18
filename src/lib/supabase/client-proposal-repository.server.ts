import "@tanstack/react-start/server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type ClientProposal = {
  proposalKey: string;
  clientName: string;
  clientEmail: string;
  businessName: string;
  projectName: string;
  projectTotal: number;
  depositAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  stripeCheckoutSession: string | null;
  stripePaymentIntent: string | null;
  paidAt: string | null;
  workspaceActivated: boolean;
};

type ProposalSeed = Omit<ClientProposal, "paymentStatus" | "stripeCheckoutSession" | "stripePaymentIntent" | "paidAt" | "workspaceActivated">;

export class ClientProposalRepository {
  constructor(private readonly client: SupabaseClient) {}

  static fromEnvironment(): ClientProposalRepository {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for client payments.");
    return new ClientProposalRepository(createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } }));
  }

  async createOrGet(seed: ProposalSeed): Promise<ClientProposal> {
    const { data, error } = await this.client.from("client_proposals").upsert({
      proposal_key: seed.proposalKey,
      client_name: seed.clientName,
      client_email: seed.clientEmail,
      business_name: seed.businessName,
      project_name: seed.projectName,
      project_total: seed.projectTotal,
      deposit_amount: seed.depositAmount,
    }, { onConflict: "proposal_key", ignoreDuplicates: true }).select().single();
    if (!error && data) return mapProposal(data);
    if (error && error.code !== "PGRST116") throw error;
    return this.getByKey(seed.proposalKey);
  }

  async getByKey(proposalKey: string): Promise<ClientProposal> {
    const { data, error } = await this.client.from("client_proposals").select().eq("proposal_key", proposalKey).single();
    if (error) throw error;
    return mapProposal(data);
  }

  async attachCheckoutSession(proposalKey: string, sessionId: string): Promise<void> {
    const { error } = await this.client.from("client_proposals").update({ stripe_checkout_session: sessionId }).eq("proposal_key", proposalKey);
    if (error) throw error;
  }

  async markPaid(input: { proposalKey: string; sessionId: string; paymentIntent: string | null }): Promise<boolean> {
    const { data, error } = await this.client.from("client_proposals").update({
      payment_status: "paid",
      stripe_checkout_session: input.sessionId,
      stripe_payment_intent: input.paymentIntent,
      paid_at: new Date().toISOString(),
      workspace_activated: true,
    }).eq("proposal_key", input.proposalKey).neq("payment_status", "paid").select("proposal_key");
    if (error) throw error;
    return Boolean(data?.length);
  }
}

function mapProposal(row: Record<string, unknown>): ClientProposal {
  return {
    proposalKey: String(row.proposal_key), clientName: String(row.client_name), clientEmail: String(row.client_email), businessName: String(row.business_name), projectName: String(row.project_name),
    projectTotal: Number(row.project_total), depositAmount: Number(row.deposit_amount), paymentStatus: row.payment_status as ClientProposal["paymentStatus"],
    stripeCheckoutSession: row.stripe_checkout_session as string | null, stripePaymentIntent: row.stripe_payment_intent as string | null,
    paidAt: row.paid_at as string | null, workspaceActivated: Boolean(row.workspace_activated),
  };
}
