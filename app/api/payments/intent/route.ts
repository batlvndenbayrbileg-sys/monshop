import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createPaymentIntent, getPaymentIntent, createCheckoutSession } from "@/lib/wire";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Resolve the order for the request. Orders may be placed by guests
 * (userId = null); for those we match on the (unguessable) order id alone,
 * but an order that belongs to a user can only be paid by that same user.
 */
async function findOrder(orderId: string) {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: "not_found" as const };
  if (order.userId) {
    const user = await getCurrentUser();
    if (!user || user.id !== order.userId) return { error: "forbidden" as const };
  }
  return { order };
}

// ── Create payment intent + hosted checkout session ──────────────────────────
export async function POST(req: Request) {
  let orderId: string | undefined;
  try {
    ({ orderId } = await req.json());
  } catch {
    /* ignore */
  }
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const { order, error } = await findOrder(orderId);
  if (error === "not_found") return NextResponse.json({ error }, { status: 404 });
  if (error === "forbidden") return NextResponse.json({ error }, { status: 403 });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ data: { status: "succeeded", paymentStatus: "paid" } });
  }

  // A fully-discounted (free) order skips the payment gateway entirely.
  if (order.total <= 0) {
    await db.order.updateMany({
      where: { id: order.id, paymentStatus: { not: "paid" } },
      data: { paymentStatus: "paid", status: "PAID" },
    });
    return NextResponse.json({ data: { status: "succeeded", paymentStatus: "paid" } });
  }

  try {
    // Reuse an existing intent (idempotent) so retries never double-charge.
    const intent = order.paymentIntentId
      ? await getPaymentIntent(order.paymentIntentId)
      : await createPaymentIntent({
          amount: order.total,
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId: order.userId ?? "",
          },
          idempotencyKey: `order_${order.id}`,
        });

    if (!order.paymentIntentId) {
      await db.order.update({
        where: { id: order.id },
        data: { paymentIntentId: intent.id },
      });
    }

    // Build the return URL from the real request origin so the session cookie
    // (same domain) survives the round-trip back from pay.wire.mn.
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const host = req.headers.get("host");
    const origin = host ? `${proto}://${host}` : SITE_URL;
    const successUrl = `${origin}/checkout/success?order=${order.orderNumber}&orderId=${order.id}&pay=1`;

    const session = await createCheckoutSession({
      paymentIntentId: intent.id,
      successUrl,
      idempotencyKey: `sess_${order.id}`,
    });

    return NextResponse.json({
      data: { id: intent.id, status: intent.status, checkoutUrl: session.url },
    });
  } catch (err) {
    // Never leak gateway internals to the client.
    console.error("Wire intent failed:", err);
    return NextResponse.json(
      { error: "Төлбөрийн системд холбогдоход алдаа гарлаа. Дахин оролдоно уу." },
      { status: 502 }
    );
  }
}

// ── Poll status (called from the success page after redirect/return) ──────────
export async function GET(req: Request) {
  const orderId = new URL(req.url).searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const { order, error } = await findOrder(orderId);
  if (error === "not_found") return NextResponse.json({ error }, { status: 404 });
  if (error === "forbidden") return NextResponse.json({ error }, { status: 403 });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ data: { status: "succeeded", paymentStatus: "paid" } });
  }
  if (!order.paymentIntentId) {
    return NextResponse.json({ data: { status: "processing", paymentStatus: "unpaid" } });
  }

  try {
    const intent = await getPaymentIntent(order.paymentIntentId);
    if (intent.status === "succeeded" && order.paymentStatus !== "paid") {
      await db.order.updateMany({
        where: { id: order.id, paymentStatus: { not: "paid" } },
        data: { paymentStatus: "paid", status: "PAID" },
      });
    }
    return NextResponse.json({
      data: {
        status: intent.status,
        paymentStatus: intent.status === "succeeded" ? "paid" : order.paymentStatus,
      },
    });
  } catch (err) {
    console.error("Wire status check failed:", err);
    return NextResponse.json({ data: { status: "processing", paymentStatus: order.paymentStatus } });
  }
}
