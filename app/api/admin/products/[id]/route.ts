import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function guard() {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN") return null;
  return u;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { images: true, variants: true, category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const body = await req.json();
  const product = await db.product.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description,
      basePrice: body.basePrice,
      oldPrice: body.oldPrice ?? null,
      badge: body.badge ?? null,
      status: body.status,
    },
  });
  return NextResponse.json({ product });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  await db.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
