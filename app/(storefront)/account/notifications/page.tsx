import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Bell, Package, CheckCircle2, Truck, XCircle, Clock, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_NOTE: Record<string, { msg: string; icon: any; color: string }> = {
  PENDING: { msg: "захиалга баталгаажихыг хүлээж байна", icon: Clock, color: "text-amber-500" },
  PAID: { msg: "захиалгын төлбөр амжилттай хийгдлээ", icon: CheckCircle2, color: "text-brand-green" },
  SHIPPED: { msg: "захиалга хүргэлтэд гарлаа", icon: Truck, color: "text-purple-500" },
  DELIVERED: { msg: "захиалга амжилттай хүргэгдлээ", icon: Package, color: "text-brand-green" },
  CANCELLED: { msg: "захиалга цуцлагдсан", icon: XCircle, color: "text-state-sale" },
};

function timeAgo(d: Date): string {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Дөнгөж сая";
  if (m < 60) return `${m} минутын өмнө`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} цагийн өмнө`;
  const days = Math.floor(h / 24);
  return `${days} өдрийн өмнө`;
}

export default async function NotificationsPage() {
  const user = (await getCurrentUser())!;
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const notes = orders.map((o) => {
    const s = STATUS_NOTE[o.status] ?? STATUS_NOTE.PENDING;
    return {
      id: o.id,
      icon: s.icon,
      color: s.color,
      title: `Захиалга #${o.orderNumber}`,
      body: `Таны ${s.msg}.`,
      time: timeAgo(o.updatedAt),
    };
  });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Мэдэгдэл</h1>
      <p className="text-ink-muted mb-6 text-sm">Захиалга, урамшууллын мэдээллүүд.</p>

      <div className="space-y-3">
        {/* Welcome notification */}
        <div className="bg-white border border-line rounded-2xl p-4 flex gap-3">
          <span className="w-11 h-11 rounded-full bg-soft-pink flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-brand-pink" strokeWidth={1.7} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">monshop-д тавтай морилно уу 💗</div>
            <div className="text-sm text-ink-muted mt-0.5">Шинэ бараа, онцгой хямдралыг хамгийн түрүүнд аваарай.</div>
          </div>
        </div>

        {notes.map((n) => (
          <div key={n.id} className="bg-white border border-line rounded-2xl p-4 flex gap-3">
            <span className="w-11 h-11 rounded-full bg-bg-soft flex items-center justify-center shrink-0">
              <n.icon className={`w-5 h-5 ${n.color}`} strokeWidth={1.7} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-sm truncate">{n.title}</div>
                <span className="text-[11px] text-ink-subtle shrink-0">{n.time}</span>
              </div>
              <div className="text-sm text-ink-muted mt-0.5">{n.body}</div>
            </div>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="bg-white border border-line rounded-2xl p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-bg-soft flex items-center justify-center">
              <Bell className="w-7 h-7 text-brand-pink" strokeWidth={1.5} />
            </div>
            <p className="text-ink-muted text-sm">Одоогоор шинэ мэдэгдэл алга.</p>
          </div>
        )}
      </div>
    </div>
  );
}
