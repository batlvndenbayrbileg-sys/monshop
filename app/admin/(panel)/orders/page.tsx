import { db } from "@/lib/db";
import { formatMNT } from "@/lib/utils";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { OrdersToolbar } from "./OrdersToolbar";

export const dynamic = "force-dynamic";

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const where: any = {};
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { orderNumber: { contains: searchParams.q } },
      { shippingName: { contains: searchParams.q, mode: "insensitive" } },
      { shippingPhone: { contains: searchParams.q } },
    ];
  }

  const orders = await db.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Захиалга</h1>
      <p className="text-ink-muted mb-6">{orders.length} захиалга харагдаж байна</p>

      <OrdersToolbar />

      <div className="bg-white rounded-3xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-ink-muted text-xs bg-bg-secondary">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-widest">ДУГААР</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ХҮЛЭЭН АВАГЧ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">УТАС</th>
                <th className="px-6 py-3 font-semibold tracking-widest">БАРАА</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ДҮН</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ТӨЛБӨР</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ТӨЛӨВ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ОГНОО</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-line hover:bg-bg-secondary/50">
                  <td className="px-6 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-6 py-3">{o.shippingName}</td>
                  <td className="px-6 py-3 text-ink-muted">{o.shippingPhone}</td>
                  <td className="px-6 py-3">{o.items.length}</td>
                  <td className="px-6 py-3 font-semibold">{formatMNT(o.total)}</td>
                  <td className="px-6 py-3 text-xs">{o.paymentMethod}</td>
                  <td className="px-6 py-3">
                    <OrderStatusSelect id={o.id} status={o.status} />
                  </td>
                  <td className="px-6 py-3 text-ink-muted text-xs">
                    {new Date(o.createdAt).toLocaleString("mn-MN")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-ink-muted">
                    Захиалга байхгүй.
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
