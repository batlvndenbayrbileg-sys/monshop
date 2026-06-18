import { db } from "@/lib/db";
import { formatMNT } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await db.product.findMany({
    include: {
      images: { take: 1, orderBy: { position: "asc" } },
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Бараа</h1>
          <p className="text-ink-muted mt-1">{products.length} нийт бараа</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink text-ink-inverse rounded-pill px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ШИНЭ БАРАА
        </Link>
      </div>

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
