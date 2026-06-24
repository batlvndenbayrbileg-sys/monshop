import { db } from "./db";

/**
 * Cancel an order and return its reserved stock to inventory — exactly once.
 * Stock is decremented at order-creation time, so a cancellation (whether from
 * a Wire `payment_intent.canceled` webhook or an admin action) must add it back.
 * The status guard makes this idempotent: an already-cancelled order is skipped.
 *
 * Returns true if this call performed the cancellation.
 */
export async function cancelOrderAndRestock(orderId: string): Promise<boolean> {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order || order.status === "CANCELLED") return false;

    for (const it of order.items) {
      await tx.productVariant.updateMany({
        where: { id: it.variantId },
        data: { stock: { increment: it.quantity } },
      });
    }

    await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
    return true;
  });
}
