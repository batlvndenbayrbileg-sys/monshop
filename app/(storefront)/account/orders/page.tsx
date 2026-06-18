import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatMNT } from "@/lib/utils";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Хүлээгдэж буй", color: "bg-yellow-100 text-yellow-900" },
  PAID: { label: "Төлсөн", color: "bg-blue-100 text-blue-900" },
  SHIPPED: { label: "Илгээсэн", color: "bg-purple-100 text-purple-900" },
  DELIVERED: { label: "Хүргэгдсэн", color: "bg-green-100 text-green-900" },
  CANCELLED: { label: "Цуцалсан", color: "bg-gray-100 text-gray-700" },
};

export default async function OrdersPage() {
  const user = (await getCurrentUser())!;
  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-8">Захиалга</h1>
      {orders.length === 0 ? (
        <div className="bg-white border border-line rounded-3xl p-12 text-center text-ink-muted">
          Та одоогоор захиалга хийгээгүй байна.
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => {
            const s = STATUS_LABEL[o.status] || STATUS_LABEL.PENDING;
            return (
              <li key={o.id} className="bg-white border border-line rounded-3xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-ink-muted">
                      ЗАХИАЛГЫН ДУГААР
                    </div>
                    <div className="font-mono font-semibold">{o.orderNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString("mn-MN")}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${s.color}`}>
                      {s.label}
                    </div>
                  </div>
                </div>
                <ul className="space-y-1 text-sm mb-4">
                  {o.items.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>
                        {it.name} <span className="text-ink-muted">· {it.color} · {it.size} · x{it.quantity}</span>
                      </span>
                      <span>{formatMNT(it.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-baseline pt-4 border-t border-line">
                  <span className="text-sm text-ink-muted">Нийт</span>
                  <span className="text-xl font-bold">{formatMNT(o.total)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
