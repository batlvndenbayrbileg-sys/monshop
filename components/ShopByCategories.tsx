import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "lucide-react";

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
const FALLBACK = "/product1.png";

export async function ShopByCategories() {
  const categories = (
    await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { products: { _count: "desc" } },
    })
  ).slice(0, 5);

  if (categories.length === 0) return null;
  const [feature, ...rest] = categories;

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <div className="eyebrow text-brand-pink mb-4">— Ангилал</div>
              <h2 className="font-serif text-4xl lg:text-6xl tracking-tight leading-[1]">
                Юу хайж <span className="italic text-brand-pink">байна</span> вэ?
              </h2>
            </div>
            <Link
              href="/categories"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase link-reveal"
            >
              Бүх ангилал →
            </Link>
          </div>
        </Reveal>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Feature — large, spans 2 cols + 2 rows on desktop */}
          <Reveal className="col-span-2 lg:row-span-2">
            <Link
              href={`/categories/${feature.slug}`}
              className="group relative block h-full min-h-[280px] lg:min-h-[560px] rounded-[28px] overflow-hidden"
            >
              <Image
                src={CATEGORY_IMAGES[feature.slug] ?? FALLBACK}
                alt={feature.name}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-widest uppercase">
                Онцлох
              </div>
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-white">
                <div>
                  <div className="font-serif text-4xl lg:text-5xl tracking-tight">{feature.name}</div>
                  <div className="font-sans text-sm text-white/80 mt-2">{feature._count.products} бараа</div>
                </div>
                <span className="w-14 h-14 rounded-full bg-white text-ink flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-6 h-6" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Rest — smaller tiles */}
          {rest.map((c, i) => (
            <Reveal key={c.id} delay={0.1 + i * 0.08}>
              <Link
                href={`/categories/${c.slug}`}
                className="group relative block aspect-[4/3] lg:aspect-auto lg:h-[268px] rounded-[24px] overflow-hidden"
              >
                <Image
                  src={CATEGORY_IMAGES[c.slug] ?? FALLBACK}
                  alt={c.name}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="font-serif text-2xl tracking-tight">{c.name}</div>
                  <div className="font-sans text-[11px] text-white/75 mt-1">{c._count.products} бараа</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
