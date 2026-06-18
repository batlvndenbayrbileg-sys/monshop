import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

export function EditorialBlock() {
  return (
    <section className="bg-bg-secondary py-20 lg:py-32 overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Asymmetric image cluster */}
          <div className="lg:col-span-7 relative">
            <Reveal>
              <div className="relative aspect-[5/6] lg:aspect-[5/6] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85"
                  alt="Editorial"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="absolute -bottom-12 -right-4 lg:-right-16 w-1/2 lg:w-2/5 aspect-[3/4] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=900&q=85"
                  alt="Detail"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 lg:pl-12">
            <Reveal>
              <div className="eyebrow text-brand-champagne mb-6">— Сэтгүүл №01</div>
              <h2 className="font-serif text-5xl lg:text-7xl tracking-tight leading-[0.95] mb-8">
                Жирийн өдөр
                <br />
                <em className="italic font-light">тансаг</em> мэдрэмж.
              </h2>
              <p className="text-ink-muted text-base lg:text-lg leading-relaxed mb-10 max-w-md">
                Бид гутал, хувцасыг "бараа" гэж үздэггүй. Тэр бол өдөр бүрийн чинь
                амьдралд ордог нөхөр. Тэгэхээр чанартай нөхөр сонгоё.
              </p>
              <Link
                href="/story"
                className="inline-flex items-center gap-3 text-sm font-semibold tracking-widest uppercase link-reveal"
              >
                <span>Бүхэл түүх унших</span>
                <span>→</span>
              </Link>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-16 grid grid-cols-2 gap-8 pt-10 border-t border-line">
                <div>
                  <div className="font-serif text-4xl mb-1">100<span className="text-ink-subtle text-2xl">%</span></div>
                  <div className="eyebrow text-ink-subtle">Байгалийн материал</div>
                </div>
                <div>
                  <div className="font-serif text-4xl mb-1">7.1<span className="text-ink-subtle text-2xl">кг</span></div>
                  <div className="eyebrow text-ink-subtle">CO₂ нэгж бүтэн</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
