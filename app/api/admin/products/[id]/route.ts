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
  try {
    const body = await req.json();

    await db.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: params.id },
        data: {
          name: body.name,
          description: body.description,
          basePrice: Number(body.basePrice),
          oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
          badge: body.badge || null,
          status: body.status,
          categoryId: body.categoryId || null,
          ...(Array.isArray(body.tags) ? { tags: body.tags } : {}),
        },
      });

      // Replace images if provided
      if (Array.isArray(body.images)) {
        await tx.productImage.deleteMany({ where: { productId: params.id } });
        const urls = body.images.filter((u: string) => u && u.trim());
        for (let i = 0; i < urls.length; i++) {
          await tx.productImage.create({
            data: { productId: params.id, url: urls[i], position: i },
          });
        }
      }

      // Upsert variants (stock / price / size) if provided
      if (Array.isArray(body.variants)) {
        const keepIds: string[] = body.variants.filter((v: any) => v.id).map((v: any) => v.id);
        // delete variants the admin removed
        await tx.productVariant.deleteMany({
          where: { productId: params.id, id: { notIn: keepIds.length ? keepIds : ["__none__"] } },
        });
        for (const v of body.variants) {
          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: { size: v.size, price: Number(v.price), stock: Number(v.stock) },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: params.id,
                sku: `${params.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                color: v.color || "Үндсэн",
                colorHex: v.colorHex || "#F8BBD0",
                size: v.size,
                price: Number(v.price),
                stock: Number(v.stock),
              },
            });
          }
        }
      }
    });

    const product = await db.product.findUnique({
      where: { id: params.id },
      include: { images: true, variants: true },
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("Product update failed:", err);
    return NextResponse.json({ error: "Шинэчлэхэд алдаа гарлаа" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  await db.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
