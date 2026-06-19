import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";

type Cat = { name: string; slug: string; count: number };

const CATEGORY_IMAGES: Record<string, string> = {
  cleansers: "/product5.png",
  moisturizers: "/product2.png",
  serums: "/product1.png",
  sunscreen: "/product3.png",
  masks: "/product4.png",
  "lip-care": "/product2.png",
};

export function MobileCategories({ categories }: { categories: Cat[] }) {
  return (
    <div className="lg:hidden min-h-screen bg-[#F5F0EC] px-5 pt-3 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-[26px] tracking-tight">Ангиллаар сонгох</h1>
        <Link href="/account/favorites" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </Link>
      </div>

      {/* Search */}
      <Link
        href="/shop"
        className="flex items-center gap-3 bg-white rounded-pill px-5 py-3.5 mb-5 shadow-sm"
      >
        <Search className="w-4 h-4 text-ink-subtle" strokeWidth={1.8} />
        <span className="font-sans text-sm text-ink-subtle">Ангилал хайх...</span>
      </Link>

      {/* Promo banner */}
      <Link href="/sale" className="relative block rounded-[24px] overflow-hidden mb-6 min-h-[150px]">
        <Image src="/banner.png" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative p-5 text-white h-full flex flex-col justify-center min-h-[150px] max-w-[68%]">
          <div className="font-serif text-[22px] leading-tight mb-1">30% хүртэл хямдрал</div>
          <div className="font-sans text-xs text-white/80 mb-4">сонгомол арчилгааны бараанд</div>
          <span className="inline-flex items-center gap-1.5 bg-white text-ink rounded-pill px-4 py-2 font-sans text-xs font-semibold self-start">
            Үзэх <span>→</span>
          </span>
        </div>
      </Link>

      {/* Two-pane: left list + right cards */}
      <div className="grid grid-cols-[34%_1fr] gap-3">
        {/* Left — category list */}
        <div className="space-y-1">
          <div className="bg-white rounded-2xl px-4 py-3 font-sans text-[13px] font-semibold shadow-sm">
            Бүх ангилал
          </div>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="block px-4 py-3 font-sans text-[13px] text-ink-muted"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Right — category cards */}
        <div className="space-y-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="flex items-center gap-3 rounded-[20px] overflow-hidden p-2.5 bg-white shadow-sm"
            >
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#F2E6DF]">
                {CATEGORY_IMAGES[c.slug] && (
                  <Image src={CATEGORY_IMAGES[c.slug]} alt={c.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-serif text-[16px] leading-tight truncate">{c.name}</div>
                <div className="font-sans text-[11px] text-ink-muted mt-0.5">{c.count}+ бараа</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
