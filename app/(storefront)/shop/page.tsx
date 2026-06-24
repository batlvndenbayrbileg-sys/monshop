import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getProducts(search?: { sort?: string; q?: string; tag?: string }) {
  const orderBy: any =
    search?.sort === "price-asc"
      ? { basePrice: "asc" }
      : search?.sort === "price-desc"
        ? { basePrice: "desc" }
        : search?.sort === "popular"
          ? { reviewCount: "desc" }
          : { createdAt: "desc" };
  const where: any = { status: "ACTIVE" };
  const and: any[] = [];
  if (search?.q) {
    and.push({
      OR: [
        { name: { contains: search.q, mode: "insensitive" } },
        { description: { contains: search.q, mode: "insensitive" } },
      ],
    });
  }
  if (search?.tag) {
    // Match the admin-assigned tag, or fall back to name/description so
    // ingredient tags (Vitamin C, Hyaluronic…) work even before tagging.
    and.push({
      OR: [
        { tags: { has: search.tag } },
        { name: { contains: search.tag, mode: "insensitive" } },
        { description: { contains: search.tag, mode: "insensitive" } },
      ],
    });
  }
  if (and.length) where.AND = and;
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
  searchParams: { sort?: string; q?: string; tag?: string };
}) {
  const products = await getProducts(searchParams);
  const activeTag = searchParams.tag;

  const chips = [
    { label: "Бүгд", sort: "" },
    { label: "Алдартай", sort: "popular" },
    { label: "Хямд эхэлсэн", sort: "price-asc" },
    { label: "Үнэтэй эхэлсэн", sort: "price-desc" },
  ];
  const activeSort = searchParams.sort ?? "";

  return (
    <div className="max-w-8xl mx-auto px-5 lg:px-12 py-8 lg:py-20">
      {/* Title — compact on mobile */}
      <div className="mb-6 lg:text-center lg:mb-12">
        <div className="eyebrow text-brand-pink mb-2 lg:mb-4">— Бүх бараа</div>
        <h1 className="font-serif text-4xl lg:text-7xl tracking-tight leading-[0.95]">
          Дэлгүүр<span className="italic text-brand-pink">.</span>
        </h1>
        <p className="font-sans text-ink-muted text-sm mt-2 lg:mt-4 lg:max-w-md lg:mx-auto">
          {products.length} бараа · dermatologist шалгасан арчилгаа.
        </p>
      </div>

      {/* Search pill (reference style) */}
      <form className="mb-5">
        <div className="flex items-center gap-2 bg-bg-soft rounded-pill p-1.5 lg:max-w-xl lg:mx-auto shadow-soft-pink">
          <button
            type="submit"
            aria-label="Хайх"
            className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Бараа хайх..."
            className="flex-1 bg-transparent font-sans px-2 py-2 text-sm outline-none placeholder:text-ink-subtle"
          />
        </div>
      </form>

      {/* Active tag filter */}
      {activeTag && (
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="text-sm text-ink-muted">Шүүлт:</span>
          <span className="inline-flex items-center gap-2 bg-brand-pink text-white rounded-pill pl-4 pr-2 py-1.5 text-sm font-medium">
            {activeTag}
            <a
              href="/shop"
              className="w-5 h-5 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center"
              aria-label="Шүүлт цэвэрлэх"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </a>
          </span>
        </div>
      )}

      {/* Category chips — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mb-7 lg:justify-center lg:mx-0 lg:px-0">
        {chips.map((c) => {
          const active = activeSort === c.sort;
          const href = c.sort ? `/shop?sort=${c.sort}` : "/shop";
          return (
            <a
              key={c.label}
              href={href}
              className={`shrink-0 font-sans text-sm font-medium px-4 py-2 rounded-pill transition ${
                active
                  ? "bg-brand-pink text-white"
                  : "bg-bg-soft text-ink-muted hover:bg-bg-blush"
              }`}
            >
              {c.label}
            </a>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center text-ink-muted">Бараа олдсонгүй.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3.5 gap-y-7 lg:gap-x-8 lg:gap-y-14">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
