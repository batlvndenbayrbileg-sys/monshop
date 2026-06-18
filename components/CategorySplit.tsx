import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";

const CATEGORIES = [
  {
    label: "Эрэгтэй",
    eyebrow: "01 — Коллекц",
    href: "/men",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85",
    cta: "Эрэгтэй дэлгүүр",
  },
  {
    label: "Эмэгтэй",
    eyebrow: "02 — Коллекц",
    href: "/women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85",
    cta: "Эмэгтэй дэлгүүр",
  },
];

export function CategorySplit() {
  return (
    <section className="bg-bg-primary py-20 lg:py-28">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="grid md:grid-cols-12 gap-6 lg:gap-10 items-end mb-12">
            <div className="md:col-span-8">
              <div className="eyebrow text-brand-champagne mb-5">— Хувцаслалт</div>
              <h2 className="font-serif text-5xl lg:text-7xl tracking-tight leading-[0.95]">
                Хоёр <em className="italic font-light">амт.</em>
              </h2>
            </div>
            <div className="md:col-span-4">
              <p className="text-ink-muted leading-relaxed">
                Эрэгтэй, эмэгтэй коллекцууд тус бүрдээ онцлог дизайнтай.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.15}>
              <Link
                href={c.href}
                className={`relative group block aspect-[4/5] lg:aspect-[5/6] overflow-hidden ${
                  i === 1 ? "md:translate-y-16" : ""
                }`}
              >
                <Image
                  src={c.image}
                  alt={c.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.2s] ease-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-10 text-white">
                  <div className="eyebrow text-white/80">{c.eyebrow}</div>
                  <div>
                    <h3 className="font-serif text-5xl lg:text-7xl tracking-tight italic mb-4">
                      {c.label}
                    </h3>
                    <div className="inline-flex items-center gap-3 text-xs font-semibold tracking-widest uppercase">
                      <span>{c.cta}</span>
                      <span className="transition-transform group-hover:translate-x-2">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
