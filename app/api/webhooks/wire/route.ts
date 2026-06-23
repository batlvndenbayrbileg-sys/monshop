import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWireSignature, WIRE_WEBHOOK_IP } from "@/lib/wire";

export const dynamic = "force-dynamic";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "";
}

export async function POST(req: Request) {
  // Raw body MUST be read before JSON.parse — the signature is over raw text.
  const raw = await req.text();
  const secret = process.env.WIRE_WEBHOOK_SECRET;

  if (secret) {
    if (clientIp(req) !== WIRE_WEBHOOK_IP) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!verifyWireSignature(raw, req.headers.get("WirePayment-Signature"), secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ received: true });
  }

  if (!event?.type || event.type === "ping") {
    return NextResponse.json({ received: true });
  }

  try {
    const intent = event.data?.object ?? event.data ?? {};
    const orderId: string | undefined = intent?.metadata?.orderId;

    if (orderId) {
      if (event.type === "payment_intent.succeeded") {
        await db.order.updateMany({
          where: { id: orderId, paymentStatus: { not: "paid" } }, // idempotent
          data: { paymentStatus: "paid", status: "PAID" },
        });
      } else if (event.type === "payment_intent.canceled") {
        await db.order.updateMany({
          where: { id: orderId, paymentStatus: { not: "paid" } },
          data: { status: "CANCELLED" },
        });
      }
    }
  } catch (err) {
    // Log but still 2xx — returning 5xx makes Wire retry a handled event.
    console.error("Wire webhook handling error:", err);
  }

  return NextResponse.json({ received: true });
}
