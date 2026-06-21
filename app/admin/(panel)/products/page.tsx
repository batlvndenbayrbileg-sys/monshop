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

      <div className="bg-white rounded-3xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-ink-muted text-xs bg-bg-secondary">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-widest">БАРАА</th>
                <th className="px-6 py-3 font-semibold tracking-widest">АНГИЛАЛ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ҮНЭ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ҮЛДЭГДЭЛ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ТӨЛӨВ</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="border-t border-line hover:bg-bg-secondary/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-bg-secondary rounded-lg overflow-hidden shrink-0">
                          {p.images[0] && (
                            <Image src={p.images[0].url} alt={p.name} fill sizes="48px" className="object-cover" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs text-ink-muted">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-ink-muted">{p.category?.name ?? "—"}</td>
                    <td className="px-6 py-3 font-semibold">{formatMNT(p.basePrice)}</td>
                    <td className="px-6 py-3">
                      <span className={stock < 10 ? "text-state-sale font-semibold" : ""}>{stock}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-bg-secondary px-2.5 py-1 rounded-full text-xs">{p.status}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/admin/products/${p.id}`} className="text-sm font-semibold underline">
                        Засах
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
