import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function guard() {
  const u = await getCurrentUser();
  return u && u.role === "ADMIN" ? u : null;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  try {
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Нэр оруулна уу" }, { status: 400 });
    }
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 32) ||
      "cat-" + Date.now();
    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Ийм ангилал бий" }, { status: 400 });
    const category = await db.category.create({ data: { name: name.trim(), slug } });
    return NextResponse.json({ category });
  } catch (err) {
    console.error("Category create failed:", err);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
