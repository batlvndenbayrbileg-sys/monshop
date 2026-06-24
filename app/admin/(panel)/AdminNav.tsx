"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, FolderTree, Ticket } from "lucide-react";

const LINKS = [
  { href: "/admin", icon: LayoutDashboard, label: "Тойм" },
  { href: "/admin/products", icon: Package, label: "Бараа" },
  { href: "/admin/categories", icon: FolderTree, label: "Ангилал" },
  { href: "/admin/coupons", icon: Ticket, label: "Купон" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Захиалга" },
  { href: "/admin/users", icon: Users, label: "Хэрэглэгч" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              active ? "bg-brand-pink text-white shadow-sm" : "text-ink-muted hover:bg-bg-soft hover:text-ink"
            }`}
          >
            <l.icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminNavMobile() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium ${
              active ? "text-brand-pink" : "text-ink-subtle"
            }`}
          >
            <l.icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
