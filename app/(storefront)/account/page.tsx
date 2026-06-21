import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatMNT } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, MapPin, Settings, ChevronRight, ShieldCheck } from "lucide-react";
import { LogoutRow } from "./LogoutRow";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = (await getCurrentUser())!;
  const [orderCount, totalSpent] = await Promise.all([
    db.order.count({ where: { userId: user.id } }),
    db.order.aggregate({
      where: { userId: user.id, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    }),
  ]);

  const initial = (user.name || user.email)[0]?.toUpperCase();
  const menu = [
    { href: "/account/orders", label: "Миний захиалга", desc: `${orderCount} захиалга`, icon: ShoppingBag },
    { href: "/wishlist", label: "Хүслийн жагсаалт", desc: "Хадгалсан бараа", icon: Heart },
    { href: "/account/addresses", label: "Хүргэлтийн хаяг", desc: "Хаягаа удирдах", icon: MapPin },
    { href: "/account/settings", label: "Тохиргоо", desc: "Профайл, аюулгүй байдал", icon: Settings },
  ];

  return (
    <div>
      {/* ===== Profile header card ===== */}
      <div className="relative rounded-[26px] overflow-hidden p-6 mb-5"
        style={{ background: "linear-gradient(135deg, #EBDDD2 0%, #F2E7DD 55%, #EFE0E0 100%)" }}>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-md shrink-0 flex items-center justify-center">
            {user.image ? (
              <Image src={user.image} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <span className="font-serif text-2xl text-brand-pink">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-serif text-2xl leading-tight truncate">{user.name || "Хэрэглэгч"}</div>
            <div className="font-sans text-sm text-ink-muted truncate">{user.email}</div>
            {user.role === "ADMIN" && (
              <span className="inline-flex items-center gap-1 mt-1.5 bg-ink text-white rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3" /> Админ
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-white/70 backdrop-blur rounded-2xl px-4 py-3">
            <div className="font-sans text-[11px] text-ink-muted">Захиалга</div>
            <div className="font-serif text-2xl">{orderCount}</div>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-2xl px-4 py-3">
            <div className="font-sans text-[11px] text-ink-muted">Нийт зарцуулсан</div>
            <div className="font-serif text-2xl">{formatMNT(totalSpent._sum.total ?? 0)}</div>
          </div>
        </div>
      </div>

      {/* ===== Menu list ===== */}
      <div className="bg-white rounded-[22px] border border-line-subtle overflow-hidden divide-y divide-line-subtle">
        {menu.map((m) => (
          <Link key={m.href} href={m.href} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-soft transition">
            <span className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center shrink-0">
              <m.icon className="w-[18px] h-[18px] text-brand-pink" strokeWidth={1.8} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-semibold">{m.label}</div>
              <div className="font-sans text-[11px] text-ink-muted">{m.desc}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-subtle shrink-0" />
          </Link>
        ))}
        {user.role === "ADMIN" && (
          <Link href="/admin" className="flex items-center gap-4 px-5 py-4 hover:bg-bg-soft transition">
            <span className="w-10 h-10 rounded-full bg-ink flex items-center justify-center shrink-0">
              <ShieldCheck className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
            </span>
            <div className="flex-1">
              <div className="font-sans text-sm font-semibold text-brand-pink">Админ панель</div>
              <div className="font-sans text-[11px] text-ink-muted">Дэлгүүр удирдах</div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-subtle" />
          </Link>
        )}
      </div>

      {/* Logout */}
      <div className="mt-4">
        <LogoutRow />
      </div>

      {/* Promo (desktop has more room) */}
      <div className="hidden lg:block mt-6 bg-white border border-line rounded-3xl p-8">
        <h2 className="font-serif text-2xl mb-2">Шинэ ирэлт</h2>
        <p className="text-sm text-ink-muted mb-5">Хавар 2026 коллекц — шинэ загвар, шинэ найрлага.</p>
        <Link href="/shop" className="inline-block bg-ink text-white rounded-pill px-6 py-3 text-sm font-semibold">
          Үзэх →
        </Link>
      </div>
    </div>
  );
}
