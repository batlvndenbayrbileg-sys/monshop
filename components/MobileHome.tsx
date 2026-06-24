"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatMNT } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/components/Providers";
import {
  Search, Bell, Truck, ShieldCheck, Heart, Lock, Plus, ShoppingBag,
  Leaf, FlaskConical, Globe, Star, ChevronRight, Droplet, Sun, Clock, Sparkles,
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
  sunscreen: "/product3.png", masks: "/product4.png", toners: "/product5.png",
  "eye-care": "/product1.png", "lip-care": "/product2.png",
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

function HeroPromo({ products }: { products: P[] }) {
  const slides = [
    { eyebrow: "Онцгой санал", title: "50% хямдрал!\nГэрэлтэлтээ ав", img: products[0]?.image, bg: "linear-gradient(135deg,#E91E63 0%,#F06292 100%)", tint: "#E91E63" },
    { eyebrow: "Шинэ ирэлт", title: "Шинэ сийрум\nирлээ", img: products[1]?.image, bg: "linear-gradient(135deg,#D81B60 0%,#F8839E 100%)", tint: "#D81B60" },
    { eyebrow: "Үнэгүй хүргэлт", title: "100,000₮-аас\nдээш үнэгүй", img: products[2]?.image, bg: "linear-gradient(135deg,#AD1457 0%,#E91E63 100%)", tint: "#AD1457" },
  ].filter((s) => s.img);

  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 3000);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;
  const s = slides[i];

  return (
    <div className="relative rounded-[26px] overflow-hidden min-h-[200px]" style={{ background: s.bg }}>
      <div key={i} className="animate-fade-in">
        {/* Product image — right side, fading into the gradient */}
        {s.img && (
          <div className="absolute inset-y-0 right-0 w-[48%]">
            <Image src={s.img} alt="" fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${s.tint} 0%, ${s.tint}cc 12%, transparent 75%)` }} />
          </div>
        )}
        {/* Text */}
        <div className="relative z-10 p-6 flex flex-col justify-center min-h-[200px] max-w-[62%]">
          <div className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase text-white/80 mb-2">{s.eyebrow}</div>
          <h2 className="font-serif text-white text-[26px] leading-[1.08] mb-4 whitespace-pre-line">{s.title}</h2>
          <Link href="/shop" className="self-start bg-white text-brand-pink rounded-pill px-5 py-2 text-[13px] font-semibold shadow-sm">
            Дэлгүүр
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3.5 left-6 flex gap-1.5 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
            aria-label={`Слайд ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function MobileHome({ products, categories }: { products: P[]; categories: Cat[] }) {
  const best = products.slice(0, 6);
  const topRated = [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);

  const { user } = useAuth();
  const openCart = useCart((s) => s.open);
  const cartCount = useCart((s) => s.count());
  const [greeting, setGreeting] = useState("Тавтай морил");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Өглөөний мэнд" : h < 18 ? "Өдрийн мэнд" : "Оройн мэнд");
  }, []);

  const firstName = (user?.name || "").trim().split(" ")[0] || "Зочин";

  return (
    <div className="bg-white pb-4">
      {/* Greeting header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-rose to-brand-pink text-white flex items-center justify-center font-semibold shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-sans text-[15px] font-semibold leading-tight flex items-center gap-1">
              {greeting} <span>👋</span>
            </div>
            <div className="font-sans text-[12px] text-ink-subtle truncate">
              {user ? firstName : "Тавтай морилно уу"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button onClick={openCart} aria-label="Сагс" className="relative w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center">
            <ShoppingBag className="w-[18px] h-[18px] text-ink" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-[10px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>
          <Link href="/account/notifications" aria-label="Мэдэгдэл" className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center">
            <Bell className="w-[18px] h-[18px] text-ink" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <form action="/shop" className="flex items-center gap-3 bg-bg-soft rounded-pill px-4 py-3">
          <button type="submit" aria-label="Хайх" className="shrink-0">
            <Search className="w-[18px] h-[18px] text-ink-subtle" strokeWidth={1.8} />
          </button>
          <input
            name="q"
            placeholder="Бараа, брэнд хайх..."
            className="flex-1 bg-transparent font-sans text-sm outline-none placeholder:text-ink-subtle"
          />
        </form>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
        <Link
          href="/shop"
          className="shrink-0 rounded-pill px-4 py-2 text-[13px] font-semibold text-white"
          style={{ background: "linear-gradient(180deg,#f06292 0%,#e91e63 100%)" }}
        >
          Бүгд
        </Link>
        {categories.slice(0, 6).map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="shrink-0 rounded-pill px-4 py-2 text-[13px] font-medium bg-bg-soft text-ink-muted whitespace-nowrap"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* HERO promo carousel */}
      <div className="px-5 mt-3">
        <HeroPromo products={products} />
      </div>

      {/* Trust row */}
      <div className="px-5 mt-5">
        <div className="bg-white rounded-[22px] border border-line shadow-sm px-3 py-4 grid grid-cols-4 gap-1">
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

      {/* SHOP BY CATEGORY — circular */}
      <div className="mt-8">
        <div className="px-5">
          <SectionHead title="Ангиллаар" href="/categories" />
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-5">
          {categories.map((c) => (
            <Link key={c.slug} href={`/categories/${c.slug}`} className="shrink-0 flex flex-col items-center gap-2 w-[66px]">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-bg-soft ring-1 ring-line">
                {CAT_IMG[c.slug] && (
                  <Image src={CAT_IMG[c.slug]} alt={c.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="font-sans text-[11px] text-center font-medium leading-tight w-full truncate">{c.name}</div>
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
                <span className="w-7 h-7 rounded-full bg-brand-pink text-white flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* OUR PROMISE editorial */}
      <div className="px-5 mt-8">
        <Link href="/story" className="relative block rounded-[24px] overflow-hidden min-h-[220px]">
          <Image src="/hero.png" alt="" fill sizes="100vw" className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          <div className="relative p-6 max-w-[68%] text-white h-full flex flex-col justify-end min-h-[220px]">
            <div className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-white/70 mb-2">Бидний амлалт</div>
            <div className="font-serif text-[26px] leading-tight mb-3">Цэвэр гоо сайхан,<br />бодит үр дүн</div>
            <span className="font-sans text-[11px] font-semibold tracking-widest uppercase border-b border-white pb-0.5 self-start">Дэлгэрэнгүй →</span>
          </div>
        </Link>
      </div>

      {/* TRENDING NOW */}
      <div className="px-5 mt-8">
        <SectionHead title="Тренд" />
        <Link href="/shop" className="relative block rounded-[24px] overflow-hidden min-h-[180px]">
          <Image src="/product1.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="relative p-6 max-w-[64%] text-white h-full flex flex-col justify-end min-h-[180px]">
            <div className="font-serif text-[25px] leading-tight mb-2">Хаврын гэрэлт цуглуулга</div>
            <p className="font-sans text-[12px] text-white/80 mb-4">Хөнгөн найрлага, гэрэлтэй арьс.</p>
            <span className="font-sans text-[11px] font-semibold tracking-widest uppercase border-b border-white pb-0.5 self-start">Цуглуулга →</span>
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
              <span className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center shrink-0">
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
            <Link key={x.t} href={`/shop?tag=${encodeURIComponent(x.t)}`} className="shrink-0 flex flex-col items-center gap-2 w-[64px]">
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
            <Link key={x.t} href={`/shop?tag=${encodeURIComponent(x.t)}`} className="block">
              {/* Image tile */}
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 bg-[#F2E6DF]">
                <Image src={x.img} alt={x.t} fill sizes="120px" className="object-cover" />
              </div>
              {/* Clean text below — no overlap */}
              <div className="font-sans text-[12px] font-semibold leading-tight">{x.t}</div>
              <div className="font-sans text-[10px] text-ink-muted mt-0.5">{x.s}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS — looped carousel */}
      <div className="px-5 mt-9">
        <SectionHead title="Хэрэглэгчид" href="/story" />
        <TestimonialCarousel />
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Сараа Б.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80", text: "Арьс минь хэзээ ч ийм гэрэлтэй байгаагүй. Үнэхээр гайхалтай." },
  { name: "Цэцгээ М.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80", text: "Vitamin C сийрум 2 долоо хоногт толбыг минь арилгасан. Санал болгож байна!" },
  { name: "Энхтуяа Г.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80", text: "Чийгшүүлэгч нь хөнгөн, наалдамхай биш. Өдөр бүр хэрэглэдэг боллоо." },
  { name: "Норжмаа Ч.", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80", text: "Багц нь бэлэгт төгс. Чанар, баглаа боодол бүгд гайхалтай." },
];

function TestimonialCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <div>
      <div className="bg-[#F2EAE3] rounded-[24px] p-5 flex gap-4 items-center min-h-[132px]">
        <div className="relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 bg-white">
          <Image key={t.img} src={t.img} alt="" fill sizes="80px" className="object-cover animate-[fadeIn_0.5s_ease]" />
        </div>
        <div className="flex-1">
          <div className="text-brand-gold text-sm mb-1.5">★★★★★</div>
          <p className="font-serif text-[14px] leading-snug mb-2">“{t.text}”</p>
          <div className="font-sans text-[11px] text-ink-muted">— {t.name}</div>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-brand-pink" : "w-1.5 bg-brand-pink/30"}`}
            aria-label={`${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
