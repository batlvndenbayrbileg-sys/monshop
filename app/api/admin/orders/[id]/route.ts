import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  try {
    const { status } = await req.json().catch(() => ({}));
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: "Төлөв буруу байна" }, { status: 400 });
    }
    const order = await db.order.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Order status update failed:", err);
    return NextResponse.json({ error: "Шинэчлэхэд алдаа гарлаа" }, { status: 500 });
  }
}
