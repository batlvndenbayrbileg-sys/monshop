import { db } from "@/lib/db";
import { formatMNT } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orderCount, userCount, productCount, revenue, recentOrders] = await Promise.all([
    db.order.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count(),
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
    db.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ]);

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Тойм</h1>
      <p className="text-ink-muted mb-10">Дэлгүүрийн өнөөдрийн төлөв</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat title="Нийт орлого" value={formatMNT(revenue._sum.total ?? 0)} accent />
        <Stat title="Захиалга" value={String(orderCount)} />
        <Stat title="Хэрэглэгч" value={String(userCount)} />
        <Stat title="Бараа" value={String(productCount)} />
      </div>

      <div className="bg-white rounded-3xl border border-line">
        <div className="px-6 py-4 border-b border-line flex justify-between items-center">
          <h2 className="font-bold">Сүүлийн захиалгууд</h2>
          <Link href="/admin/orders" className="text-sm font-semibold underline">
            Бүгдийг үзэх →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-ink-muted text-xs">
              <tr className="border-b border-line">
                <th className="px-6 py-3 font-semibold tracking-widest">ДУГААР</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ХҮРГЭХ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">БАРАА</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ДҮН</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ТӨЛӨВ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ОГНОО</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-6 py-4 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-6 py-4">{o.shippingName}</td>
                  <td className="px-6 py-4">{o.items.length}</td>
                  <td className="px-6 py-4 font-semibold">{formatMNT(o.total)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-bg-secondary px-2.5 py-1 rounded-full text-xs">{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">
                    {new Date(o.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-ink-muted">
                    Одоогоор захиалга байхгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, accent }: { title: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-3xl p-6 border ${
        accent ? "bg-ink text-ink-inverse border-ink" : "bg-white border-line"
      }`}
    >
      <div className={`text-xs font-semibold tracking-widest mb-2 ${accent ? "text-white/60" : "text-ink-muted"}`}>
        {title.toUpperCase()}
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
