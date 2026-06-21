import { db } from "@/lib/db";
import { formatMNT } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProductsToolbar } from "./ProductsToolbar";

export const dynamic = "force-dynamic";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const where: any = {};
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { slug: { contains: searchParams.q } },
    ];
  }
  if (searchParams.category) where.category = { slug: searchParams.category };

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Бараа</h1>
        <p className="text-ink-muted mt-1">{products.length} бараа харагдаж байна</p>
      </div>

      <ProductsToolbar
        categories={categories.map((c) => ({ name: c.name, slug: c.slug, count: c._count.products }))}
      />

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line p-16 text-center text-ink-muted">
          Бараа олдсонгүй.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => {
            const stock = p.variants.reduce((s, v) => s + v.stock, 0);
            const statusMap: Record<string, { label: string; cls: string }> = {
              ACTIVE: { label: "Идэвхтэй", cls: "bg-green-100 text-green-700" },
              DRAFT: { label: "Ноорог", cls: "bg-amber-100 text-amber-700" },
              ARCHIVED: { label: "Хадгалсан", cls: "bg-gray-100 text-gray-600" },
            };
            const st = statusMap[p.status] ?? statusMap.ACTIVE;
            return (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="group bg-white rounded-3xl border border-line-subtle overflow-hidden hover:shadow-lg hover:border-brand-pink/40 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-bg-secondary overflow-hidden">
                  {p.images[0] && (
                    <Image
                      src={p.images[0].url}
                      alt={p.name}
                      fill
                      sizes="(max-width:768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* status pill */}
                  <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>
                    {st.label}
                  </span>
                  {/* stock pill */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur ${
                      stock < 10 ? "bg-state-sale/90 text-white" : "bg-white/85 text-ink"
                    }`}
                  >
                    {stock} ш
                  </span>
                  {/* edit hint */}
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition flex items-end justify-end p-3">
                    <span className="opacity-0 group-hover:opacity-100 transition bg-white text-ink text-xs font-semibold rounded-full px-3 py-1.5 shadow">
                      Засах →
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {p.category && (
                    <span className="inline-block bg-bg-soft text-ink-muted text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2">
                      {p.category.name}
                    </span>
                  )}
                  <h3 className="font-semibold text-sm leading-snug line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold">{formatMNT(p.basePrice)}</div>
                    <div className="text-[11px] text-ink-muted">{p.variants.length} хувилбар</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
