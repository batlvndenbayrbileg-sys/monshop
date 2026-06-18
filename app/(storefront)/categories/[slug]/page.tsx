import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryDetail({ params }: { params: { slug: string } }) {
  const category = await db.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const products = await db.product.findMany({
    where: { status: "ACTIVE", categoryId: category.id },
    include: {
      images: { take: 2, orderBy: { position: "asc" } },
      variants: { select: { color: true, colorHex: true } },
      category: true,
    },
  });

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="text-center mb-14">
        <div className="eyebrow text-brand-pink mb-3">— Ангилал</div>
        <h1 className="font-serif text-4xl lg:text-6xl tracking-tight">{category.name}</h1>
        <p className="text-ink-muted mt-3">{products.length} бараа</p>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-ink-muted">Энэ ангилалд бараа байхгүй.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6 lg:gap-y-16">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              index={i}
              product={{
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
                images: p.images.map((i) => i.url),
                colors: Array.from(
                  new Map(p.variants.map((v) => [v.colorHex, { name: v.color, hex: v.colorHex }])).values()
                ),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
