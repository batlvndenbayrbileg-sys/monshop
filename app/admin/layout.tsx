import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, ExternalLink, LogOut } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 h-screen sticky top-0 bg-bg-dark text-white flex-col">
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="block">
              <div className="text-xl font-bold tracking-tight">monshop</div>
              <div className="text-xs text-white/60 tracking-widest mt-0.5">АДМИН</div>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { href: "/admin", icon: LayoutDashboard, label: "Тойм" },
              { href: "/admin/products", icon: Package, label: "Бараа" },
              { href: "/admin/orders", icon: ShoppingBag, label: "Захиалга" },
              { href: "/admin/users", icon: Users, label: "Хэрэглэгч" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-pill text-sm font-medium hover:bg-white/10 transition"
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-pill text-sm font-medium hover:bg-white/10 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Сайт үзэх
            </Link>
            <LogoutButton />
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-bg-dark text-white z-40 flex items-center justify-between px-4 h-14">
          <Link href="/admin" className="font-bold tracking-tight">monshop · АДМИН</Link>
          <div className="flex gap-1 text-xs">
            <Link href="/admin/products" className="px-2 py-1 hover:bg-white/10 rounded">Бараа</Link>
            <Link href="/admin/orders" className="px-2 py-1 hover:bg-white/10 rounded">Захиалга</Link>
            <Link href="/admin/users" className="px-2 py-1 hover:bg-white/10 rounded">Хэрэглэгч</Link>
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-10 mt-14 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
