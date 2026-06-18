import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getProducts(search?: { sort?: string; q?: string }) {
  const orderBy: any =
    search?.sort === "price-asc"
      ? { basePrice: "asc" }
      : search?.sort === "price-desc"
        ? { basePrice: "desc" }
        : search?.sort === "popular"
          ? { reviewCount: "desc" }
          : { createdAt: "desc" };
  const where: any = { status: "ACTIVE" };
  if (search?.q) {
    where.OR = [{ name: { contains: search.q } }, { description: { contains: search.q } }];
  }
  const products = await db.product.findMany({
    where,
    orderBy,
    include: {
      images: { take: 2, orderBy: { position: "asc" } },
      variants: { select: { color: true, colorHex: true } },
      category: true,
    },
  });
  return products.map((p) => ({
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
  }));
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { sort?: string; q?: string };
}) {
  const products = await getProducts(searchParams);

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="text-center mb-12 lg:mb-16">
        <div className="eyebrow text-brand-pink mb-4">— Бүх бараа</div>
        <h1 className="font-serif text-5xl lg:text-7xl tracking-tight leading-[0.95]">
          Дэлгүүр<span className="italic text-brand-pink">.</span>
        </h1>
        <p className="text-ink-muted leading-relaxed mt-4 max-w-md mx-auto">
          {products.length} бараа · байгальд ээлтэй, dermatologist шалгасан арчилгаа.
        </p>
      </div>

      <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-12 lg:mb-16">
        <div className="relative flex-1 min-w-[200px]">
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Хайх..."
            className="w-full bg-bg-soft border border-line-subtle rounded-pill px-6 py-3 text-sm focus:border-brand-pink focus:bg-white outline-none transition"
          />
        </div>
        <select
          name="sort"
          defaultValue={searchParams.sort}
          className="bg-bg-soft border border-line-subtle rounded-pill px-5 py-3 text-sm focus:border-brand-pink outline-none transition cursor-pointer"
        >
          <option value="">Шинээр</option>
          <option value="popular">Алдартай</option>
          <option value="price-asc">Үнэ ↑</option>
          <option value="price-desc">Үнэ ↓</option>
        </select>
        <button
          className="btn-3d rounded-pill px-7 py-3 text-sm font-semibold text-white shrink-0"
          style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
        >
          Хэрэглэх
        </button>
      </form>

      {products.length === 0 ? (
        <div className="py-24 text-center text-ink-muted">Бараа олдсонгүй.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-14 lg:gap-x-8 lg:gap-y-20">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
