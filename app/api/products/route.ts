import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "newest";
  const q = searchParams.get("q") ?? "";
  const badge = searchParams.get("badge");

  const where: any = { status: "ACTIVE" };
  if (category) where.category = { slug: category };
  if (badge) where.badge = badge;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const orderBy: any =
    sort === "price-asc"
      ? { basePrice: "asc" }
      : sort === "price-desc"
        ? { basePrice: "desc" }
        : sort === "popular"
          ? { reviewCount: "desc" }
          : { createdAt: "desc" };

  const products = await db.product.findMany({
    where,
    orderBy,
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { select: { color: true, colorHex: true } },
      category: true,
    },
  });

  const result = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name,
    price: p.basePrice,
    oldPrice: p.oldPrice,
    badge: p.badge,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: p.images[0]?.url,
    colors: Array.from(
      new Map(p.variants.map((v) => [v.colorHex, { name: v.color, hex: v.colorHex }])).values()
    ),
  }));

  return NextResponse.json({ products: result });
}
