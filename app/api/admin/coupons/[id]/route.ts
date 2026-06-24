import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function guard() {
  const u = await getCurrentUser();
  return u && u.role === "ADMIN" ? u : null;
}

// Toggle active
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  try {
    const { active } = await req.json().catch(() => ({}));
    const coupon = await db.coupon.update({
      where: { id: params.id },
      data: { active: Boolean(active) },
    });
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("Update coupon failed:", err);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  try {
    await db.coupon.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete coupon failed:", err);
    return NextResponse.json({ error: "Устгахад алдаа гарлаа" }, { status: 500 });
  }
}
