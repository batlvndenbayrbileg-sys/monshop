import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { AdminNav, AdminNavMobile } from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <div className="flex">
        {/* Sidebar — light professional */}
        <aside className="hidden lg:flex w-64 h-screen sticky top-0 bg-white border-r border-line-subtle flex-col">
          <div className="p-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo.png" alt="monshop" width={130} height={38} className="h-8 w-auto object-contain" />
              <span className="text-[10px] text-ink-subtle tracking-[0.2em] border-l border-line pl-2">АДМИН</span>
            </Link>
          </div>
          <div className="px-4 flex-1">
            <div className="text-[10px] font-semibold tracking-widest text-ink-subtle px-4 mb-2">ЦЭС</div>
            <AdminNav />
          </div>
          <div className="p-4 border-t border-line-subtle space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:bg-bg-soft transition"
            >
              <ExternalLink className="w-[18px] h-[18px]" strokeWidth={1.8} />
              Сайт үзэх
            </Link>
            <LogoutButton />
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur border-b border-line-subtle z-40 flex items-center justify-between px-4 h-14">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.png" alt="monshop" width={100} height={28} className="h-7 w-auto object-contain" />
            <span className="text-[10px] text-ink-subtle">АДМИН</span>
          </Link>
          <AdminNavMobile />
        </div>

        <main className="flex-1 p-5 lg:p-10 mt-14 lg:mt-0 max-w-[1400px]">{children}</main>
      </div>
    </div>
  );
}
