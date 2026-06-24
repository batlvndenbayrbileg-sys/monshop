"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag, ArrowUpRight } from "lucide-react";

type Cat = { name: string; slug: string; count: number };

const CATEGORY_IMAGES: Record<string, string> = {
  cleansers: "/product5.png",
  moisturizers: "/product2.png",
  serums: "/product1.png",
  sunscreen: "/product3.png",
  masks: "/product4.png",
  toners: "/product5.png",
  "eye-care": "/product1.png",
  "lip-care": "/product2.png",
};
const FALLBACK_IMG = "/product1.png";

const CAT_DESC: Record<string, string> = {
  cleansers: "Зөөлөн цэвэрлэгч",
  moisturizers: "Чийгшүүлэгч",
  serums: "Идэвхт сийрум",
  sunscreen: "Нарны хамгаалалт",
  masks: "Эрчимт маск",
  toners: "Тэнцвэржүүлэгч",
  "eye-care": "Нүдний арчилгаа",
  "lip-care": "Уруулын арчилгаа",
};

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileCategories({ categories }: { categories: Cat[] }) {
  const featured = categories[0];
  const rest = categories.slice(1);

  return (
    <div className="lg:hidden min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center justify-between px-5 pt-4 pb-3"
      >
        <div>
          <div className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-brand-pink mb-0.5">
            Цуглуулга
          </div>
          <h1 className="font-serif text-[28px] tracking-tight leading-none">Ангилал</h1>
        </div>
        <Link href="/wishlist" className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.7} />
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease }}
        className="px-5 mb-5"
      >
        <form action="/shop" className="flex items-center gap-3 bg-white rounded-pill px-5 py-3.5 shadow-sm">
          <button type="submit" aria-label="Хайх"><Search className="w-[18px] h-[18px] text-ink-subtle" strokeWidth={1.8} /></button>
          <input name="q" placeholder="Бараа хайх..." className="flex-1 bg-transparent font-sans text-sm outline-none placeholder:text-ink-subtle" />
        </form>
      </motion.div>

      {/* Featured category — large hero card */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="px-5 mb-4"
        >
          <Link href={`/categories/${featured.slug}`} className="relative block aspect-[16/10] rounded-[26px] overflow-hidden">
            <Image src={CATEGORY_IMAGES[featured.slug] ?? FALLBACK_IMG} alt={featured.name} fill sizes="100vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 font-sans text-[10px] font-semibold tracking-wide">
              ОНЦЛОХ
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <div>
                <div className="font-sans text-[11px] text-white/80 mb-1">{CAT_DESC[featured.slug]}</div>
                <div className="font-serif text-[28px] leading-none">{featured.name}</div>
                <div className="font-sans text-[11px] text-white/70 mt-1.5">{featured.count}+ бараа</div>
              </div>
              <span className="w-11 h-11 rounded-full bg-white text-ink flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Category grid — staggered reveal */}
      <div className="px-5 grid grid-cols-2 gap-4">
        {rest.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.07, ease }}
          >
            <Link href={`/categories/${c.slug}`} className="group relative block aspect-[4/5] rounded-[22px] overflow-hidden">
              <Image
                src={(CATEGORY_IMAGES[c.slug] ?? FALLBACK_IMG)}
                alt={c.name}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-700 ease-out group-active:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <div className="font-serif text-[18px] leading-tight">{c.name}</div>
                <div className="font-sans text-[10px] text-white/75 mt-0.5">{c.count}+ бараа</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* All products CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="px-5 mt-6"
      >
        <Link href="/shop" className="flex items-center justify-center gap-2 text-white rounded-pill py-4 font-sans text-xs font-semibold tracking-widest uppercase" style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}>
          Бүх барааг үзэх <ArrowUpRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
