import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Set as default
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  try {
    const owned = await db.address.findFirst({ where: { id: params.id, userId: user.id } });
    if (!owned) return NextResponse.json({ error: "not_found" }, { status: 404 });

    await db.$transaction([
      db.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }),
      db.address.update({ where: { id: params.id }, data: { isDefault: true } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Set default address failed:", err);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  try {
    const owned = await db.address.findFirst({ where: { id: params.id, userId: user.id } });
    if (!owned) return NextResponse.json({ error: "not_found" }, { status: 404 });
    await db.address.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete address failed:", err);
    return NextResponse.json({ error: "Устгахад алдаа гарлаа" }, { status: 500 });
  }
}
