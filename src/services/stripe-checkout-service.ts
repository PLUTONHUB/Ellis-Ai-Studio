import "@tanstack/react-start/server-only";

type CheckoutSession = { id: string; url: string | null; payment_status: string; metadata?: Record<string, string>; client_reference_id?: string | null; payment_intent?: string | { id: string } | null };

export class StripeCheckoutService {
  constructor(private readonly secretKey: string) {}

  static fromEnvironment(): StripeCheckoutService {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY as a Cloudflare Worker secret.");
    return new StripeCheckoutService(secretKey);
  }

  async createSession(input: { proposalKey: string; projectName: string; depositAmount: number; successUrl: string; cancelUrl: string }): Promise<{ id: string; url: string }> {
    const session = await this.request<CheckoutSession>("/v1/checkout/sessions", new URLSearchParams({
      mode: "payment", client_reference_id: input.proposalKey, success_url: input.successUrl, cancel_url: input.cancelUrl,
      "line_items[0][price_data][currency]": "usd", "line_items[0][price_data][product_data][name]": `${input.projectName} deposit`,
      "line_items[0][price_data][unit_amount]": String(input.depositAmount), "line_items[0][quantity]": "1",
      "metadata[proposal_id]": input.proposalKey, "payment_intent_data[metadata][proposal_id]": input.proposalKey,
    }));
    if (!session.id || !session.url) throw new Error("Stripe did not return a Checkout URL.");
    return { id: session.id, url: session.url };
  }

  async getPaidSession(sessionId: string): Promise<CheckoutSession> {
    const session = await this.request<CheckoutSession>(`/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=payment_intent`);
    if (session.payment_status !== "paid") throw new Error("Stripe Checkout has not confirmed this payment yet.");
    return session;
  }

  private async request<T>(path: string, body?: URLSearchParams): Promise<T> {
    const response = await fetch(`https://api.stripe.com${path}`, { method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${this.secretKey}`, ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) }, body });
    if (!response.ok) throw new Error(`Stripe API request failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
    return response.json() as Promise<T>;
  }
}

export async function verifyStripeWebhook(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature) return false;
  const parts = Object.fromEntries(signature.split(",").map((part) => part.split("=", 2)));
  const timestamp = parts.t;
  const expected = parts.v1;
  if (!timestamp || !expected || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`)));
  const actual = Array.from(digest, (value) => value.toString(16).padStart(2, "0")).join("");
  return constantTimeEqual(actual, expected);
}

function constantTimeEqual(left: string, right: string): boolean { if (left.length !== right.length) return false; let diff = 0; for (let index = 0; index < left.length; index += 1) diff |= left.charCodeAt(index) ^ right.charCodeAt(index); return diff === 0; }
