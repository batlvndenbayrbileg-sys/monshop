import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupon";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "");
  const subtotal = Number(body?.subtotal ?? 0);

  const result = await validateCoupon(code, subtotal);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: { code: result.code, discount: result.discount } });
}
