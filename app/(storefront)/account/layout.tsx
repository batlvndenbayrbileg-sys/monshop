import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/account");

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14 grid lg:grid-cols-[240px_1fr] gap-10">
      <aside>
        <div className="mb-8">
          <div className="text-xs font-semibold tracking-widest text-ink-muted mb-2">
            ХЭРЭГЛЭГЧ
          </div>
          <div className="font-bold text-lg truncate">{user.name || user.email}</div>
          <div className="text-sm text-ink-muted truncate">{user.email}</div>
        </div>
        <nav className="space-y-1">
          {[
            { href: "/account", label: "Тойм" },
            { href: "/account/orders", label: "Захиалга" },
            { href: "/wishlist", label: "Хүслийн жагсаалт" },
            { href: "/account/addresses", label: "Хаягууд" },
            { href: "/account/settings", label: "Тохиргоо" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-2.5 rounded-pill text-sm font-medium hover:bg-bg-secondary transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
