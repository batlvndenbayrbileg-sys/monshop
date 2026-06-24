import { db } from "./db";
import { formatMNT } from "./utils";

export type CouponResult =
  | { ok: true; code: string; discount: number }
  | { ok: false; error: string };

/**
 * Validate a coupon code against a cart subtotal. Used by both the public
 * preview endpoint and the order route (which re-validates server-side so a
 * client can never fake a discount).
 */
export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Купоны код оруулна уу" };

  let coupon;
  try {
    coupon = await db.coupon.findUnique({ where: { code } });
  } catch {
    return { ok: false, error: "Алдаа гарлаа. Дахин оролдоно уу." };
  }

  if (!coupon || !coupon.active) return { ok: false, error: "Купон олдсонгүй эсвэл идэвхгүй" };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: "Купоны хугацаа дууссан байна" };
  }
  if (subtotal < coupon.minSubtotal) {
    return { ok: false, error: `${formatMNT(coupon.minSubtotal)}-аас дээш захиалгад хүчинтэй` };
  }

  // Never discount more than the cart is worth.
  const discount = Math.max(0, Math.min(coupon.discount, subtotal));
  return { ok: true, code: coupon.code, discount };
}
