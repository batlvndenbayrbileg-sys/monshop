import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function guard() {
  const u = await getCurrentUser();
  return u && u.role === "ADMIN" ? u : null;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

const schema = z.object({
  code: z.string().min(2),
  discount: z.number().int().min(1),
  minSubtotal: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  try {
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Код болон хямдрах дүнг зөв оруулна уу" }, { status: 400 });
    }
    const code = parsed.data.code.trim().toUpperCase().replace(/\s+/g, "");
    if (await db.coupon.findUnique({ where: { code } })) {
      return NextResponse.json({ error: "Ийм код бүртгэлтэй байна" }, { status: 400 });
    }
    const coupon = await db.coupon.create({
      data: {
        code,
        discount: parsed.data.discount,
        minSubtotal: parsed.data.minSubtotal ?? 0,
      },
    });
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("Create coupon failed:", err);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
