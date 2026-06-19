import Image from "next/image";
import Link from "next/link";
import { formatMNT } from "@/lib/utils";

type P = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image?: string;
  badge?: string | null;
};

type Cat = { name: string; slug: string };

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[5/6]"];

export function MobileHome({
  products,
  categories,
}: {
  products: P[];
  categories: Cat[];
}) {
  const chips = [{ name: "Бүгд", slug: "" }, ...categories];

  return (
    <div className="px-5 pt-3 pb-2">
      {/* Search pill */}
      <Link
        href="/shop"
        className="flex items-center gap-3 bg-bg-soft rounded-pill p-1.5 mb-5 shadow-soft-pink"
      >
        <span
          className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0"
          style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <span className="font-sans text-sm text-ink-subtle">Бараа хайх...</span>
      </Link>

      {/* Category tabs */}
      <div className="flex gap-5 overflow-x-auto no-scrollbar -mx-5 px-5 mb-6">
        {chips.map((c, i) => {
          const href = c.slug ? `/categories/${c.slug}` : "/shop";
          const active = i === 0;
          return (
            <Link key={c.slug || "all"} href={href} className="shrink-0 relative pb-1.5">
              <span
                className={`font-sans text-[15px] ${
                  active ? "font-semibold text-ink" : "font-medium text-ink-subtle"
                }`}
              >
                {c.name}
              </span>
              {active && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1.5 h-1.5 rounded-full bg-brand-pink" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Masonry product grid */}
      <div className="columns-2 gap-3.5 [&>*]:mb-5 [&>*]:break-inside-avoid">
        {products.map((p, i) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="block">
            <div className={`relative ${ASPECTS[i % ASPECTS.length]} bg-bg-soft rounded-[20px] overflow-hidden`}>
              {p.badge && (
                <div
                  className={`absolute top-2.5 left-2.5 z-10 font-sans text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded-full ${
                    p.badge === "ХЯМДРАЛ"
                      ? "bg-brand-pink text-white"
                      : p.badge === "ШИНЭ"
                        ? "bg-ink text-white"
                        : "bg-white text-ink"
                  }`}
                >
                  {p.badge}
                </div>
              )}
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="pt-2.5 flex items-start justify-between gap-2 px-0.5">
              <h3 className="font-serif text-[14px] leading-snug line-clamp-2">{p.name}</h3>
              <div
                className={`font-sans font-semibold text-[14px] shrink-0 ${
                  p.oldPrice ? "text-brand-pink" : ""
                }`}
              >
                {formatMNT(p.price)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
