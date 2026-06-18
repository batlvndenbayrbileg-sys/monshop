import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatMNT } from "@/lib/utils";

export const dynamic = "force-dynamic";
import Link from "next/link";

export default async function AccountPage() {
  const user = (await getCurrentUser())!;
  const [orderCount, totalSpent, lastOrder] = await Promise.all([
    db.order.count({ where: { userId: user.id } }),
    db.order.aggregate({
      where: { userId: user.id, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    }),
    db.order.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
        Сайн уу, {user.name?.split(" ")[0] || "найз"}!
      </h1>
      <p className="text-ink-muted mb-10">
        Захиалга, хаяг, тохиргоогоо энд удирдана уу.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Stat label="Захиалга" value={String(orderCount)} />
        <Stat label="Нийт зарцуулсан" value={formatMNT(totalSpent._sum.total ?? 0)} />
        <Stat
          label="Сүүлийн захиалга"
          value={lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString("mn-MN") : "—"}
        />
      </div>

      <div className="bg-white border border-line rounded-3xl p-8">
        <h2 className="font-bold text-lg mb-2">Шинэ ирэлт</h2>
        <p className="text-sm text-ink-muted mb-5">
          Хавар 2026 коллекц яг сая ирлээ. Шинэ загвар, шинэ өнгө.
        </p>
        <Link
          href="/new"
          className="inline-block bg-ink text-ink-inverse rounded-pill px-6 py-3 text-sm font-semibold"
        >
          ҮЗЭХ →
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-line rounded-3xl p-6">
      <div className="text-xs font-semibold tracking-widest text-ink-muted mb-2">
        {label.toUpperCase()}
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
