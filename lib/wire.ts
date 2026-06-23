import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Wire Payment (https://wire.mn) client.
 *
 * Mirrors the Stripe model: PaymentIntent -> Hosted Checkout -> Webhook.
 * If WIRE_SECRET_KEY is absent the whole module runs in MOCK mode so the
 * end-to-end flow is fully testable before a Wire account exists.
 */

const BASE = "https://api.wire.mn/v1";
const KEY = process.env.WIRE_SECRET_KEY;

export const WIRE_LIVE = !!KEY; // no key -> mock mode
export const WIRE_TEST_MODE = KEY?.startsWith("sk_test_") ?? false;
const ALLOWED_OPERATORS = WIRE_TEST_MODE ? ["sandbox"] : ["qpay"];

/** Only this IP is allowed to deliver Wire webhooks. */
export const WIRE_WEBHOOK_IP = "65.109.117.186";

export type PaymentIntent = {
  id: string;
  status: "processing" | "succeeded" | "canceled" | string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any>;
  qr_text?: string;
  qr_image?: string;
};

export type CheckoutSession = {
  id: string;
  url: string;
  payment_intent: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Low-level fetch
// ─────────────────────────────────────────────────────────────────────────────

async function wireFetch<T>(path: string, init: any = {}): Promise<T> {
  const headers: Record<string, string> = { Authorization: `Bearer ${KEY}` };
  let body: string | undefined;
  if (init.json) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;

  const res = await fetch(`${BASE}${path}`, {
    method: init.method,
    headers,
    body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error?.message || `Wire request failed (${res.status})`);
  }
  return data as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK helpers (used when no secret key is configured)
// ─────────────────────────────────────────────────────────────────────────────

/** Mock ids embed the creation timestamp so status is derivable statelessly. */
function mockIntent(amount: number, metadata: Record<string, any>): PaymentIntent {
  const id = `pi_mock_${Date.now()}_${randomUUID()}`;
  return {
    id,
    status: "processing",
    amount,
    currency: "MNT",
    metadata,
    qr_text: `MOCKQR-${id}`,
  };
}

/** A mock intent auto-"succeeds" 5 seconds after it was created. */
function mockStatusFromId(id: string): PaymentIntent["status"] {
  const m = id.match(/^pi_mock_(\d+)_/);
  if (!m) return "succeeded";
  return Date.now() - Number(m[1]) > 5000 ? "succeeded" : "processing";
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export async function createPaymentIntent(opts: {
  amount: number;
  metadata?: Record<string, any>;
  idempotencyKey: string;
}): Promise<PaymentIntent> {
  if (!WIRE_LIVE) return mockIntent(opts.amount, opts.metadata ?? {});
  return wireFetch<PaymentIntent>("/payment_intents", {
    method: "POST",
    idempotencyKey: opts.idempotencyKey,
    json: {
      amount: opts.amount,
      currency: "MNT",
      allowed_operators: ALLOWED_OPERATORS,
      metadata: opts.metadata ?? {},
    },
  });
}

export async function getPaymentIntent(id: string): Promise<PaymentIntent> {
  if (!WIRE_LIVE) return { id, status: mockStatusFromId(id) };
  return wireFetch<PaymentIntent>(`/payment_intents/${id}`, { method: "GET" });
}

export async function createCheckoutSession(opts: {
  paymentIntentId: string;
  successUrl?: string;
  idempotencyKey: string;
}): Promise<CheckoutSession> {
  if (!WIRE_LIVE) {
    // No hosted page in mock mode; caller falls back to the success/poll page.
    return { id: `cs_mock_${randomUUID()}`, url: "", payment_intent: opts.paymentIntentId };
  }
  return wireFetch<CheckoutSession>("/checkout/sessions", {
    method: "POST",
    idempotencyKey: opts.idempotencyKey,
    json: { payment_intent: opts.paymentIntentId, success_url: opts.successUrl },
  });
}

export async function cancelPaymentIntent(id: string): Promise<PaymentIntent> {
  if (!WIRE_LIVE) return { id, status: "canceled" };
  return wireFetch<PaymentIntent>(`/payment_intents/${id}/cancel`, { method: "POST" });
}

export async function refundPaymentIntent(opts: {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}): Promise<any> {
  if (!WIRE_LIVE) return { id: `re_mock_${randomUUID()}`, status: "succeeded" };
  return wireFetch("/refunds", {
    method: "POST",
    idempotencyKey: `refund_${opts.paymentIntentId}`,
    json: {
      payment_intent: opts.paymentIntentId,
      amount: opts.amount,
      reason: opts.reason,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook signature verification
// Header "WirePayment-Signature": "t=<unix>,v1=<hmac_sha256>"
// signed payload = `${t}.${rawBody}`
// ─────────────────────────────────────────────────────────────────────────────

export function verifyWireSignature(
  rawBody: string,
  sigHeader: string | null,
  secret?: string
): boolean {
  if (!sigHeader || !secret) return false;
  const parts = Object.fromEntries(
    sigHeader.split(",").map((kv) => kv.split("=").map((s) => s.trim()))
  ) as { t?: string; v1?: string };
  const { t, v1 } = parts;
  if (!t || !v1) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const a = Buffer.from(v1);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
