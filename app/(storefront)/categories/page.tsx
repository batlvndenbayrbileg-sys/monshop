import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Tilt3D } from "@/components/Tilt3D";
import { TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";
import { formatMNT } from "@/lib/utils";
import { MobileCategories } from "@/components/MobileCategories";

export const dynamic = "force-dynamic";

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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  cleansers: "Зөөлөн цэвэрлэгчээр өдрөө эхлүүл — pH тэнцвэртэй формула.",
  moisturizers: "Hyaluronic + Ceramide-ээр чийгшил барих чийгшүүлэгч.",
  serums: "Идэвхтэй найрлагатай хүчирхэг сийрум — Vit C, Retinol, Niacinamide.",
  sunscreen: "SPF 50+, цагаан үлдэгдэлгүй, өдөр бүр өмсөх боломжтой.",
  masks: "7 хоногт 2 удаа — арьс гялалзуулах эрчимтэй арчилгаа.",
  "lip-care": "Сарнайн тостой уруулын чийгшүүлэгч, зөөлөн арчилгаа.",
};

const TRENDING_TAGS = [
  "Vitamin C",
  "Hyaluronic",
  "Retinol",
  "Niacinamide",
  "SPF 50",
  "Salicylic Acid",
  "Vegan",
  "Pregnancy-safe",
];

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    include: {
      _count: { select: { products: true } },
      products: {
        take: 3,
        include: {
          images: { take: 1, orderBy: { position: "asc" } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const featured = categories.find((c) => c.slug === "serums") || categories[0];
  const rest = categories.filter((c) => c.id !== featured?.id);

  return (
    <>
      {/* Mobile — luxury two-pane category browser */}
      <MobileCategories
        categories={categories.map((c) => ({ name: c.name, slug: c.slug, count: c._count.products }))}
      />

      {/* Desktop */}
      <article className="hidden lg:block bg-white">
      {/* ===== HERO ===== */}
      <section className="relative bg-soft-pink py-16 lg:py-24 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-brand-pink/15 blur-3xl drift pointer-events-none" />
        <div className="absolute -bottom-32 right-20 w-96 h-96 rounded-full bg-brand-rose/20 blur-3xl drift pointer-events-none" style={{ animationDelay: "3s" }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
            <Link href="/" className="hover:text-brand-pink transition">Нүүр</Link>
            <span>/</span>
            <span className="text-ink">Ангилал</span>
          </div>

          <Reveal>
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <div className="eyebrow text-brand-pink mb-4 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Бүх ангилал
                </div>
                <h1 className="font-serif text-5xl lg:text-7xl leading-[0.95] tracking-tight">
                  Юу хайж <span className="italic text-brand-pink">байгаа</span> вэ?
                </h1>
              </div>
              <div className="lg:col-span-4">
                <p className="text-ink-muted leading-relaxed">
                  Арьсныхаа төрөл, асуудалд тохирох ангиллыг сонгож{" "}
                  <span className="font-semibold text-ink">{categories.reduce((s, c) => s + c._count.products, 0)} барааны</span>{" "}
                  дотроос хайгаарай.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Trending tags */}
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-pink mr-2">
                <TrendingUp className="w-3.5 h-3.5" /> ТРЕНД:
              </div>
              {TRENDING_TAGS.map((t) => (
                <Link
                  key={t}
                  href={`/shop?q=${encodeURIComponent(t)}`}
                  className="bg-white hover:bg-brand-pink hover:text-white border border-line-subtle rounded-pill px-4 py-2 text-xs font-medium transition shadow-sm"
                >
                  {t}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FEATURED CATEGORY ===== */}
      {featured && (
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <Reveal>
              <Tilt3D max={3} glare={false} className="rounded-[2rem] lg:rounded-[2.5rem]">
                <Link
                  href={`/categories/${featured.slug}`}
                  className="block bg-rose-gradient rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative grid lg:grid-cols-12 gap-6 lg:gap-10 px-6 lg:px-12 py-10 lg:py-14 shadow-3d edge-highlight group"
                >
                  <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/40 blur-3xl pointer-events-none drift" />

                  <div className="lg:col-span-7 relative z-10">
                    <div className="eyebrow text-brand-pink mb-4">✦ Хамгийн алдартай</div>
                    <h2 className="font-serif text-4xl lg:text-6xl tracking-tight leading-[1] mb-5">
                      {featured.name}
                    </h2>
                    <p className="text-ink-muted text-base lg:text-lg max-w-md mb-6">
                      {CATEGORY_DESCRIPTIONS[featured.slug] ?? "Өндөр чанартай арьс арчилгааны бараа."}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="bg-white text-ink rounded-pill px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2">
                        {featured._count.products} бараа
                      </span>
                      <span className="text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Үзэх <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative h-[200px] lg:h-[280px]">
                    {CATEGORY_IMAGES[featured.slug] && (
                      <Image
                        src={CATEGORY_IMAGES[featured.slug]}
                        alt={featured.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-contain drop-shadow-2xl float-slow"
                      />
                    )}
                  </div>
                </Link>
              </Tilt3D>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== ALL CATEGORIES GRID ===== */}
      <section className="bg-bg-soft py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-10">
              <h2 className="font-serif text-3xl lg:text-5xl tracking-tight">
                Бүх <span className="italic text-brand-pink">ангилал</span>
              </h2>
              <Link href="/shop" className="text-sm font-semibold link-reveal text-brand-pink">
                Шууд бүх бараа →
              </Link>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {rest.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06}>
                <Tilt3D max={6} className="rounded-3xl card-3d">
                  <Link
                    href={`/categories/${c.slug}`}
                    className="block bg-white rounded-3xl overflow-hidden shadow-3d edge-highlight group h-full"
                  >
                    <div className="relative aspect-[5/3] bg-card-pink overflow-hidden">
                      {CATEGORY_IMAGES[c.slug] && (
                        <Image
                          src={CATEGORY_IMAGES[c.slug]}
                          alt={c.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest shadow-sm">
                        {c._count.products} БАРАА
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-serif text-xl">{c.name}</h3>
                        <ArrowUpRight className="w-5 h-5 text-brand-pink shrink-0 group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                      <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                        {CATEGORY_DESCRIPTIONS[c.slug] ?? "Premium арьс арчилгааны бараа."}
                      </p>

                      {c.products.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-line-subtle flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {c.products.slice(0, 3).map((p) => (
                              <div
                                key={p.id}
                                className="w-9 h-9 rounded-full bg-bg-soft border-2 border-white overflow-hidden relative"
                              >
                                {p.images[0] && (
                                  <Image src={p.images[0].url} alt="" fill sizes="36px" className="object-cover" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-ink-muted ml-2">
                            {formatMNT(Math.min(...c.products.map((p) => p.basePrice)))}-аас
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HELP CTA ===== */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h3 className="font-serif text-3xl lg:text-4xl tracking-tight mb-3">
              Юу авах <span className="italic text-brand-pink">сонгоход</span> хэцүү байна уу?
            </h3>
            <p className="text-ink-muted mb-7">
              Манай dermatologist-ууд танай арьсны төрөлд тохирох арчилгааг үнэгүй санал болгоно.
            </p>
            <Link
              href="/contact"
              className="btn-3d inline-flex items-center gap-2 rounded-pill px-7 py-3.5 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            >
              Зөвлөгөө авах →
            </Link>
          </Reveal>
        </div>
      </section>
      </article>
    </>
  );
}
