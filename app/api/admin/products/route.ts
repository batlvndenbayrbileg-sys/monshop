import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function guard() {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN") return null;
  return u;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const products = await db.product.findMany({
    include: { images: { take: 1, orderBy: { position: "asc" } }, category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  basePrice: z.number().int().min(0),
  oldPrice: z.number().int().optional().nullable(),
  badge: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  images: z.array(z.string().url()).min(1),
  variants: z
    .array(
      z.object({
        color: z.string(),
        colorHex: z.string(),
        size: z.string(),
        stock: z.number().int().min(0),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const d = parsed.data;
  const product = await db.product.create({
    data: {
      name: d.name,
      slug: d.slug,
      description: d.description,
      basePrice: d.basePrice,
      oldPrice: d.oldPrice ?? null,
      badge: d.badge ?? null,
      categoryId: d.categoryId ?? null,
      images: { create: d.images.map((url, position) => ({ url, position })) },
      variants: {
        create: d.variants.map((v) => ({
          sku: `${d.slug}-${v.color}-${v.size}`.toLowerCase().replace(/\s+/g, "-"),
          color: v.color,
          colorHex: v.colorHex,
          size: v.size,
          price: d.basePrice,
          stock: v.stock,
        })),
      },
    },
  });
  return NextResponse.json({ product });
}
