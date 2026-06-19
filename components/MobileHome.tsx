"use client";

import Image from "next/image";
import Link from "next/link";
import { formatMNT } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-store";
import {
  Search, Mic, Truck, ShieldCheck, Heart, Lock, Plus,
  Leaf, FlaskConical, Globe, Star, ChevronRight,
  Droplet, Sun, Clock, Sparkles,
} from "lucide-react";

type P = {
  id: string;
  slug: string;
  name: string;
  category?: string | null;
  price: number;
  oldPrice?: number | null;
  image?: string;
  badge?: string | null;
  rating?: number | null;
  reviewCount?: number;
};
type Cat = { name: string; slug: string };

const CAT_IMG: Record<string, string> = {
  cleansers: "/product5.png", moisturizers: "/product2.png", serums: "/product1.png",
  sunscreen: "/product3.png", masks: "/product4.png", "lip-care": "/product2.png",
};

function SectionHead({ title, href = "/shop" }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-sans text-[13px] font-bold tracking-[0.14em] uppercase text-ink">{title}</h2>
      <Link href={href} className="font-sans text-[12px] text-ink-subtle flex items-center gap-0.5">
        Бүгд <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function HeartBtn({ p, size = "sm" }: { p: P; size?: "sm" | "md" }) {
  const toggle = useWishlist((s) => s.toggle);
  const liked = useWishlist((s) => s.has(p.id));
  const cls = size === "md" ? "w-8 h-8" : "w-7 h-7";
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle({ id: p.id, slug: p.slug, name: p.name, category: p.category, price: p.price, oldPrice: p.oldPrice, image: p.image });
      }}
      className={`${cls} rounded-full bg-white flex items-center justify-center shadow-sm shrink-0`}
      aria-label="wishlist"
    >
      <Heart className={`w-[14px] h-[14px] ${liked ? "fill-brand-pink text-brand-pink" : "text-ink"}`} strokeWidth={1.8} />
    </button>
  );
}

export function MobileHome({ products, categories }: { products: P[]; categories: Cat[] }) {
  const best = products.slice(0, 6);
  const topRated = [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);
  const hero = products[0];

  return (
    <div className="bg-[#FAF6F2] pb-4">
      {/* Search */}
      <div className="px-5 pt-3 pb-4">
        <Link href="/shop" className="flex items-center gap-3 bg-white rounded-pill px-4 py-3 shadow-sm">
          <Search className="w-[18px] h-[18px] text-ink-subtle" strokeWidth={1.8} />
          <span className="flex-1 font-sans text-sm text-ink-subtle">Бараа, брэнд хайх...</span>
          <Mic className="w-[18px] h-[18px] text-brand-pink" strokeWidth={1.8} />
        </Link>
      </div>

      {/* HERO */}
      <div className="px-5">
        <div className="relative rounded-[28px] overflow-hidden p-6 pt-7 min-h-[330px]"
          style={{ background: "linear-gradient(135deg, #EBDDD2 0%, #F2E7DD 55%, #EFE0E0 100%)" }}>
          <div className="relative z-10 max-w-[58%]">
            <div className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-muted mb-3">Шинэ ирэлт</div>
            <h1 className="font-serif text-[34px] leading-[1.04] tracking-tight mb-3">
              Байгалийн<br />гэрэлтэлт
            </h1>
            <p className="font-sans text-[13px] text-ink-muted leading-relaxed mb-6">
              Эмнэлзүйгээр батлагдсан, гэрэлтэй эрүүл арьсны төлөө.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-ink text-white rounded-pill pl-5 pr-2 py-1.5 font-sans text-xs font-semibold">
              Худалдан авах
              <span className="w-7 h-7 rounded-full bg-white text-ink flex items-center justify-center">→</span>
            </Link>
          </div>
          {hero?.image && (
            <div className="absolute right-0 bottom-0 w-[52%] h-[88%]">
              <Image src={hero.image} alt="" fill className="object-contain object-bottom drop-shadow-2xl" />
            </div>
          )}
        </div>

        {/* Trust row */}
        <div className="bg-white rounded-[22px] shadow-sm -mt-8 relative z-10 mx-2 px-3 py-4 grid grid-cols-4 gap-1">
          {[
            { icon: Truck, t: "Үнэгүй", s: "хүргэлт" },
            { icon: ShieldCheck, t: "Derma", s: "шалгасан" },
            { icon: Heart, t: "Cruelty", s: "free" },
            { icon: Lock, t: "Найдвартай", s: "төлбөр" },
          ].map((x) => (
            <div key={x.t} className="flex flex-col items-center text-center gap-1.5">
              <x.icon className="w-[19px] h-[19px] text-brand-pink" strokeWidth={1.5} />
              <div className="leading-tight">
                <div className="font-sans text-[10px] font-semibold">{x.t}</div>
                <div className="font-sans text-[9px] text-ink-subtle">{x.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="px-5 mt-8">
        <SectionHead title="Ангиллаар" href="/categories" />
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
          {categories.map((c) => (
            <Link key={c.slug} href={`/categories/${c.slug}`} className="shrink-0 w-[88px]">
              <div className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden mb-2"
                style={{ background: "linear-gradient(135deg, #EFE3DB, #F4E8DE)" }}>
                {CAT_IMG[c.slug] && <Image src={CAT_IMG[c.slug]} alt="" fill className="object-contain p-3" />}
              </div>
              <div className="font-sans text-[11px] text-center font-medium truncate">{c.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* BEST SELLERS */}
      <div className="px-5 mt-8">
        <SectionHead title="Шилдэг борлуулалт" />
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-5 px-5">
          {best.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="shrink-0 w-[150px]">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F2EAE3] mb-2.5">
                <div className="absolute top-2 right-2 z-10"><HeartBtn p={p} /></div>
                {p.image && <Image src={p.image} alt="" fill sizes="150px" className="object-cover" />}
              </div>
              <h3 className="font-serif text-[14px] leading-snug line-clamp-1">{p.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <div className="font-sans text-[14px] font-semibold">{formatMNT(p.price)}</div>
                  {p.rating && (
                    <div className="font-sans text-[10px] text-ink-subtle flex items-center gap-0.5 mt-0.5">
                      <Star className="w-2.5 h-2.5 fill-brand-gold text-brand-gold" /> {p.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <span className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* OUR PROMISE editorial */}
      <div className="px-5 mt-8">
        <Link href="/story" className="relative block rounded-[24px] overflow-hidden p-6 min-h-[200px]"
          style={{ background: "linear-gradient(135deg, #E7D8CE, #EFE2DA)" }}>
          <div className="absolute right-0 bottom-0 w-[42%] h-full opacity-90">
            <Image src="/banner.png" alt="" fill className="object-contain object-bottom" />
          </div>
          <div className="relative max-w-[60%]">
            <div className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-muted mb-2">Бидний амлалт</div>
            <div className="font-serif text-[24px] leading-tight mb-3">Цэвэр гоо сайхан,<br />бодит үр дүн</div>
            <p className="font-sans text-[12px] text-ink-muted leading-relaxed mb-4">
              Байгалийн хүч ба шинжлэх ухааны нэгдэлд бид итгэдэг.
            </p>
            <span className="font-sans text-[11px] font-semibold tracking-widest uppercase border-b border-ink pb-0.5">Дэлгэрэнгүй →</span>
          </div>
        </Link>
      </div>

      {/* TRENDING NOW */}
      <div className="px-5 mt-8">
        <SectionHead title="Тренд" />
        <Link href="/shop" className="relative block rounded-[24px] overflow-hidden p-6 min-h-[170px]"
          style={{ background: "linear-gradient(135deg, #ECE0D6, #F3E9E2)" }}>
          <div className="absolute right-2 bottom-0 w-[48%] h-[92%]">
            <Image src="/product3.png" alt="" fill className="object-contain object-bottom drop-shadow-xl" />
          </div>
          <div className="relative max-w-[55%]">
            <div className="font-serif text-[24px] leading-tight mb-2">Хаврын гэрэлт цуглуулга</div>
            <p className="font-sans text-[12px] text-ink-muted mb-4">Хөнгөн найрлага, гэрэлтэй арьс.</p>
            <span className="font-sans text-[11px] font-semibold tracking-widest uppercase border-b border-ink pb-0.5">Цуглуулга →</span>
          </div>
        </Link>
      </div>

      {/* WHY CHOOSE US */}
      <div className="px-5 mt-9">
        <SectionHead title="Яагаад monshop?" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Leaf, t: "Цэвэр найрлага", d: "Байгалийн, органик, хор хөнөөлгүй." },
            { icon: FlaskConical, t: "Эмнэлзүйд батлагдсан", d: "Шинжлэх ухаанд суурилсан үр дүн." },
            { icon: Heart, t: "Cruelty Free", d: "Энэрэнгүй гоо сайхан." },
            { icon: Globe, t: "Хурдан хүргэлт", d: "Найдвартай, шуурхай хүргэлт." },
          ].map((x) => (
            <div key={x.t} className="bg-[#F2EAE3] rounded-2xl p-4">
              <x.icon className="w-5 h-5 text-brand-pink mb-3" strokeWidth={1.5} />
              <div className="font-sans text-[13px] font-semibold mb-1">{x.t}</div>
              <div className="font-sans text-[11px] text-ink-subtle leading-snug">{x.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP RATED — list rows */}
      <div className="px-5 mt-9">
        <SectionHead title="Хамгийн өндөр үнэлгээ" />
        <div className="space-y-3">
          {topRated.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="flex items-center gap-3 bg-white rounded-2xl p-2.5 shadow-sm">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F2EAE3] shrink-0">
                {p.image && <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-[15px] leading-snug line-clamp-1">{p.name}</h3>
                <div className="font-sans text-[15px] font-semibold mt-0.5">{formatMNT(p.price)}</div>
                {p.rating && (
                  <div className="font-sans text-[11px] text-ink-subtle flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-brand-gold text-brand-gold" /> {p.rating.toFixed(1)}
                    {p.reviewCount ? <span>({p.reviewCount})</span> : null}
                  </div>
                )}
              </div>
              <span className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* DISCOVER BY CONCERN */}
      <div className="px-5 mt-9">
        <SectionHead title="Асуудлаар хайх" href="/shop" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5">
          {[
            { Icon: Droplet, t: "Хуурайшил" },
            { Icon: Sun, t: "Толбо" },
            { Icon: Sparkles, t: "Бүдэг" },
            { Icon: Clock, t: "Хөгшрөлт" },
            { Icon: ShieldCheck, t: "Батга" },
          ].map((x) => (
            <Link key={x.t} href="/shop" className="shrink-0 flex flex-col items-center gap-2 w-[64px]">
              <div className="w-14 h-14 rounded-full bg-[#F2E6DF] flex items-center justify-center">
                <x.Icon className="w-5 h-5 text-brand-pink" strokeWidth={1.5} />
              </div>
              <span className="font-sans text-[11px] text-center leading-tight">{x.t}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* SHOP BY INGREDIENT */}
      <div className="px-5 mt-9">
        <SectionHead title="Найрлагаар" href="/shop" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { t: "Hyaluronic", s: "Чийгшил", img: "/product2.png" },
            { t: "Niacinamide", s: "Гэрэлтэлт", img: "/product1.png" },
            { t: "Vitamin C", s: "Тод байдал", img: "/product3.png" },
          ].map((x) => (
            <Link key={x.t} href="/shop" className="block">
              {/* Image tile */}
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 bg-[#F2E6DF]">
                <Image src={x.img} alt={x.t} fill sizes="120px" className="object-contain p-3.5" />
              </div>
              {/* Clean text below — no overlap */}
              <div className="font-sans text-[12px] font-semibold leading-tight">{x.t}</div>
              <div className="font-sans text-[10px] text-ink-muted mt-0.5">{x.s}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* TESTIMONIAL */}
      <div className="px-5 mt-9">
        <SectionHead title="Хэрэглэгчид" href="/story" />
        <div className="bg-[#F2EAE3] rounded-[24px] p-5 flex gap-4 items-center">
          <div className="relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 bg-white">
            <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" alt="" fill sizes="80px" className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="text-brand-gold text-sm mb-1.5">★★★★★</div>
            <p className="font-serif text-[14px] leading-snug mb-2">“Арьс минь хэзээ ч ийм гэрэлтэй байгаагүй. Үнэхээр гайхалтай.”</p>
            <div className="font-sans text-[11px] text-ink-muted">— Сараа Б.</div>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="px-5 mt-9">
        <div className="bg-ink text-white rounded-[24px] p-6 text-center">
          <div className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-white/50 mb-3">Манайхтай нэгд</div>
          <h3 className="font-serif text-[24px] leading-tight mb-2">Онцгой санал хүлээж ав</h3>
          <p className="font-sans text-[12px] text-white/60 mb-5">Эхний захиалгад 15% хямдрал.</p>
          <form className="space-y-2.5">
            <input type="email" placeholder="Имэйл хаяг" className="w-full bg-white/10 border border-white/20 rounded-pill px-5 py-3 font-sans text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50" />
            <button className="w-full bg-white text-ink rounded-pill py-3 font-sans text-xs font-bold tracking-widest uppercase">Бүртгүүлэх</button>
          </form>
          <p className="font-sans text-[10px] text-white/40 mt-3">Спам байхгүй. Хүссэн үедээ цуцлаарай.</p>
        </div>
      </div>
    </div>
  );
}
