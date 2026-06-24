import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag, Heart, MapPin, Settings, HelpCircle,
  ChevronRight, ShieldCheck, Pencil,
} from "lucide-react";
import { LogoutRow } from "./LogoutRow";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = (await getCurrentUser())!;
  const [orderCount, addressCount] = await Promise.all([
    db.order.count({ where: { userId: user.id } }),
    db.address.count({ where: { userId: user.id } }),
  ]);

  const initial = (user.name || user.email)[0]?.toUpperCase();

  const quick = [
    { href: "/account/orders", label: "Захиалга", icon: ShoppingBag },
    { href: "/account/addresses", label: "Хаяг", icon: MapPin },
    { href: "/wishlist", label: "Хүсэл", icon: Heart },
    { href: "/account/settings", label: "Тохиргоо", icon: Settings },
    { href: "/contact", label: "Тусламж", icon: HelpCircle },
  ];

  const menu = [
    { href: "/account/settings", label: "Профайл засах", desc: "Нэр, мэдээлэл", icon: Pencil },
    { href: "/account/addresses", label: "Хүргэлтийн хаяг", desc: `${addressCount} хадгалсан`, icon: MapPin },
    { href: "/account/orders", label: "Миний захиалга", desc: `${orderCount} захиалга`, icon: ShoppingBag },
    { href: "/contact", label: "Тусламж & FAQ", desc: "Холбоо барих", icon: HelpCircle },
  ];

  return (
    <div>
      {/* ===== Coral profile header ===== */}
      <div
        className="relative rounded-[28px] overflow-hidden px-6 pt-8 pb-9 text-center"
        style={{ background: "linear-gradient(150deg, #F06292 0%, #E91E63 100%)" }}
      >
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -left-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-white ring-4 ring-white/40 shadow-lg flex items-center justify-center">
            {user.image ? (
              <Image src={user.image} alt="" fill sizes="96px" className="object-cover" />
            ) : (
              <span className="font-serif text-4xl text-brand-pink">{initial}</span>
            )}
          </div>
          <div className="font-serif text-2xl text-white mt-3 leading-tight">{user.name || "Хэрэглэгч"}</div>
          <div className="font-sans text-sm text-white/85 truncate">{user.email}</div>
          {user.role === "ADMIN" && (
            <span className="inline-flex items-center gap-1 mt-2 bg-white/20 text-white rounded-full px-3 py-0.5 text-[11px] font-semibold backdrop-blur">
              <ShieldCheck className="w-3 h-3" /> Админ
            </span>
          )}
        </div>
      </div>

      {/* ===== Quick actions row (overlaps header) ===== */}
      <div className="bg-white rounded-[22px] border border-line-subtle shadow-sm -mt-6 relative z-10 mx-3 px-1.5 py-4 grid grid-cols-5 gap-1">
        {quick.map((q) => (
          <Link key={q.href} href={q.href} className="flex flex-col items-center gap-1.5 py-1">
            <span className="w-11 h-11 rounded-full bg-bg-soft flex items-center justify-center">
              <q.icon className="w-[18px] h-[18px] text-brand-pink" strokeWidth={1.8} />
            </span>
            <span className="font-sans text-[10.5px] text-ink-muted">{q.label}</span>
          </Link>
        ))}
      </div>

      {/* ===== Menu list ===== */}
      <div className="bg-white rounded-[22px] border border-line-subtle overflow-hidden divide-y divide-line-subtle mt-5">
        {menu.map((m) => (
          <Link key={m.label} href={m.href} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-soft transition">
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

      {/* ===== Logout ===== */}
      <div className="mt-5">
        <LogoutRow />
      </div>
    </div>
  );
}
