import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function guard() {
  const u = await getCurrentUser();
  return u && u.role === "ADMIN" ? u : null;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Нэр оруулна уу" }, { status: 400 });
  const category = await db.category.update({ where: { id: params.id }, data: { name: name.trim() } });
  return NextResponse.json({ category });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const count = await db.product.count({ where: { categoryId: params.id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Энэ ангилалд ${count} бараа байна. Эхлээд барааг өөр ангилалд шилжүүлнэ үү.` },
      { status: 400 }
    );
  }
  await db.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
