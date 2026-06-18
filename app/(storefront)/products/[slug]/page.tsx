import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetail } from "./ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: true,
      category: true,
    },
  });
  if (!p) notFound();

  const colors = Array.from(
    new Map(p.variants.map((v) => [v.colorHex, { name: v.color, hex: v.colorHex }])).values()
  );
  const sizes = Array.from(new Set(p.variants.map((v) => v.size)));

  return (
    <ProductDetail
      product={{
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.basePrice,
        oldPrice: p.oldPrice,
        badge: p.badge,
        rating: p.rating,
        reviewCount: p.reviewCount,
        category: p.category?.name,
        images: p.images.map((i) => i.url),
        colors,
        sizes,
        variants: p.variants.map((v) => ({
          id: v.id,
          color: v.color,
          colorHex: v.colorHex,
          size: v.size,
          stock: v.stock,
          price: v.price,
        })),
      }}
    />
  );
}
