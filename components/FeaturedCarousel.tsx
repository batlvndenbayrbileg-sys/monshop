"use client";

import Image from "next/image";
import Link from "next/link";
import { formatMNT } from "@/lib/utils";
import type { Product } from "./ProductCard";
import { Reveal } from "./Reveal";

/**
 * Desktop-only 3D infinite looped product carousel.
 * Two copies of the list scroll continuously; cards pop forward in 3D on hover.
 */
export function FeaturedCarousel({ products }: { products: Product[] }) {
  if (!products.length) return null;
  const loop = [...products, ...products];

  return (
    <section className="py-24 lg:py-32 bg-[#F5F0EC] overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="flex items-end justify-between mb-14">
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight leading-[1]">
              Энэ улирлын
              <br />
              <span className="italic text-brand-pink">онцлох</span> цуглуулга
            </h2>
            <Link href="/shop" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase link-reveal">
              Бүгдийг үзэх →
            </Link>
          </div>
        </Reveal>
      </div>

      {/* 3D infinite track */}
      <div
        className="group relative"
        style={{ perspective: "1800px" }}
      >
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 lg:w-48 z-10 bg-gradient-to-r from-[#F5F0EC] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 lg:w-48 z-10 bg-gradient-to-l from-[#F5F0EC] to-transparent" />

        <div className="flex gap-6 lg:gap-8 w-max animate-marquee-slow group-hover:[animation-play-state:paused] px-6">
          {loop.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={`/products/${p.slug}`}
              className="group/card relative shrink-0 w-[260px] lg:w-[300px] transition-transform duration-500 ease-out hover:!z-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="transition-all duration-500 ease-out group-hover/card:[transform:translateZ(60px)_translateY(-10px)]">
                <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden bg-white shadow-[0_20px_50px_-20px_rgba(233,30,99,0.25)] group-hover/card:shadow-[0_40px_80px_-24px_rgba(233,30,99,0.45)] transition-shadow duration-500">
                  {p.badge && (
                    <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 text-white translate-y-3 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                    <div className="font-serif text-lg leading-tight line-clamp-1">{p.name}</div>
                    <div className="font-sans text-sm mt-0.5">{formatMNT(p.price)}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
