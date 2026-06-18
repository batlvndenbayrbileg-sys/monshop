import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const PAGE_META: Record<string, { title: string; italic?: string; eyebrow: string; categoryFilter?: string[]; badge?: string }> = {
  men: {
    title: "Эрэгтэй",
    italic: "коллекц",
    eyebrow: "01 — Хавар/Зун 2026",
    categoryFilter: ["Эрэгтэй гутал", "Эрэгтэй цамц", "Эрэгтэй гадуур хувцас"],
  },
  women: {
    title: "Эмэгтэй",
    italic: "коллекц",
    eyebrow: "02 — Хавар/Зун 2026",
    categoryFilter: ["Эмэгтэй гутал", "Эмэгтэй гадуур хувцас"],
  },
  kids: {
    title: "Хүүхдийн",
    italic: "коллекц",
    eyebrow: "03 — Бүх насанд",
    categoryFilter: ["Хүүхдийн гутал"],
  },
  new: { title: "Шинэ", italic: "ирэлт", eyebrow: "— Хамгийн сүүлийн", badge: "ШИНЭ" },
  sale: { title: "Хямдрал", italic: "& онцгой", eyebrow: "— Хязгаарлагдмал", badge: "ХЯМДРАЛ" },
};

export default async function CatalogPage({ params }: { params: { gender: string } }) {
  const meta = PAGE_META[params.gender];
  if (!meta) notFound();

  const where: any = { status: "ACTIVE" };
  if (meta.categoryFilter) where.category = { name: { in: meta.categoryFilter } };
  if (meta.badge) where.badge = meta.badge;

  const products = await db.product.findMany({
    where,
    include: {
      images: { take: 2, orderBy: { position: "asc" } },
      variants: { select: { color: true, colorHex: true } },
      category: true,
    },
  });

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="grid lg:grid-cols-12 gap-8 mb-14 lg:mb-20">
        <div className="lg:col-span-8">
          <div className="eyebrow text-brand-champagne mb-5">{meta.eyebrow}</div>
          <h1 className="font-serif text-5xl lg:text-7xl tracking-tight leading-[0.95]">
            {meta.title} <em className="italic font-light">{meta.italic}</em>
          </h1>
        </div>
        <div className="lg:col-span-4 lg:pt-4">
          <p className="text-ink-muted leading-relaxed">{products.length} загвар.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center text-ink-muted">Бараа байхгүй.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-14 lg:gap-x-8 lg:gap-y-20">
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
