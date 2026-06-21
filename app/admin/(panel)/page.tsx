import { db } from "@/lib/db";
import { formatMNT } from "@/lib/utils";
import Link from "next/link";
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

const PAY_LABEL: Record<string, string> = { QPAY: "QPay", KHAN: "Хаан банк", TRANSFER: "Шилжүүлэг", CASH: "Бэлэн" };
const STATUS_LABEL: Record<string, string> = {
  PENDING: "Хүлээгдэж буй", PAID: "Төлсөн", SHIPPED: "Илгээсэн", DELIVERED: "Хүргэгдсэн", CANCELLED: "Цуцалсан",
};

export default async function AdminDashboard() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidStatuses = ["PAID", "SHIPPED", "DELIVERED"];

  const [orderCount, userCount, productCount, revenueAll, revenueMonth, pendingCount, recentOrders, allOrders, lowStock] =
    await Promise.all([
      db.order.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.product.count(),
      db.order.aggregate({ _sum: { total: true }, where: { status: { in: paidStatuses } } }),
      db.order.aggregate({ _sum: { total: true }, where: { status: { in: paidStatuses }, createdAt: { gte: monthStart } } }),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { items: true } }),
      db.order.findMany({ select: { paymentMethod: true, status: true, total: true } }),
      db.productVariant.findMany({
        where: { stock: { lt: 15 } },
        orderBy: { stock: "asc" },
        take: 8,
        include: { product: { select: { name: true, slug: true, id: true } } },
      }),
    ]);

  // Payment method breakdown (paid orders)
  const payTotals: Record<string, number> = {};
  for (const o of allOrders) {
    if (paidStatuses.includes(o.status)) payTotals[o.paymentMethod] = (payTotals[o.paymentMethod] || 0) + o.total;
  }
  const payEntries = Object.entries(payTotals).sort((a, b) => b[1] - a[1]);
  const payMax = Math.max(1, ...payEntries.map(([, v]) => v));

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Тойм</h1>
      <p className="text-ink-muted mb-8">Дэлгүүрийн өнөөдрийн төлөв</p>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={TrendingUp} title="Нийт орлого" value={formatMNT(revenueAll._sum.total ?? 0)} accent />
        <Stat icon={CreditCard} title="Энэ сарын орлого" value={formatMNT(revenueMonth._sum.total ?? 0)} />
        <Stat icon={ShoppingBag} title="Захиалга" value={`${orderCount}`} sub={`${pendingCount} хүлээгдэж буй`} />
        <Stat icon={Users} title="Хэрэглэгч" value={`${userCount}`} sub={`${productCount} бараа`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Payment breakdown */}
        <div className="bg-white rounded-3xl border border-line p-6">
          <h2 className="font-bold mb-5">Төлбөрийн төрөл</h2>
          {payEntries.length === 0 ? (
            <p className="text-sm text-ink-muted">Төлсөн захиалга байхгүй.</p>
          ) : (
            <div className="space-y-4">
              {payEntries.map(([m, v]) => (
                <div key={m}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{PAY_LABEL[m] ?? m}</span>
                    <span className="font-semibold">{formatMNT(v)}</span>
                  </div>
                  <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-brand-pink rounded-full" style={{ width: `${(v / payMax) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-3xl border border-line p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-state-sale" />
            <h2 className="font-bold">Үлдэгдэл багатай</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-ink-muted">Бүх бараа хангалттай үлдэгдэлтэй ✓</p>
          ) : (
            <ul className="space-y-2.5">
              {lowStock.map((v) => (
                <li key={v.id} className="flex items-center justify-between text-sm">
                  <Link href={`/admin/products/${v.product.id}`} className="hover:underline truncate pr-3">
                    {v.product.name} <span className="text-ink-muted">· {v.size}</span>
                  </Link>
                  <span className={`font-semibold shrink-0 ${v.stock < 5 ? "text-state-sale" : "text-ink"}`}>{v.stock} ш</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-3xl border border-line">
        <div className="px-6 py-4 border-b border-line flex justify-between items-center">
          <h2 className="font-bold">Сүүлийн захиалгууд</h2>
          <Link href="/admin/orders" className="text-sm font-semibold underline">Бүгдийг үзэх →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-ink-muted text-xs">
              <tr className="border-b border-line">
                <th className="px-6 py-3 font-semibold tracking-widest">ДУГААР</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ХҮЛЭЭН АВАГЧ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ТӨЛБӨР</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ДҮН</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ТӨЛӨВ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-6 py-4 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-6 py-4">{o.shippingName}</td>
                  <td className="px-6 py-4 text-xs">{PAY_LABEL[o.paymentMethod] ?? o.paymentMethod}</td>
                  <td className="px-6 py-4 font-semibold">{formatMNT(o.total)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-bg-secondary px-2.5 py-1 rounded-full text-xs">{STATUS_LABEL[o.status] ?? o.status}</span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-ink-muted">Захиалга байхгүй.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, title, value, sub, accent }: { icon: any; title: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-3xl p-6 border ${accent ? "bg-ink text-ink-inverse border-ink" : "bg-white border-line"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-xs font-semibold tracking-widest ${accent ? "text-white/60" : "text-ink-muted"}`}>{title.toUpperCase()}</div>
        <Icon className={`w-4 h-4 ${accent ? "text-white/70" : "text-brand-pink"}`} />
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {sub && <div className={`text-xs mt-1 ${accent ? "text-white/50" : "text-ink-muted"}`}>{sub}</div>}
    </div>
  );
}
