import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { Leaf, FlaskConical, Heart, Sparkles, Instagram } from "lucide-react";

/* ============ 1. BRAND STORY — editorial split ============ */
export function BrandStory() {
  return (
    <section className="bg-[#F5F0EC] py-28 lg:py-40 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gradient-to-br from-brand-blush to-brand-tan">
            <Image src="/banner.png" alt="" fill className="object-contain p-12 drop-shadow-2xl" />
            <div className="absolute top-8 left-8 bg-white/80 backdrop-blur rounded-full px-5 py-2 text-[11px] font-sans font-semibold tracking-[0.2em] text-brand-pink">
              EST. 2026
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <div className="eyebrow text-brand-pink mb-8">— Бидний философи</div>
            <h2 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[1.02] tracking-tight mb-10">
              Гоо сайхан бол
              <br />
              <span className="italic font-light text-brand-pink">хайрын</span> үйлдэл.
            </h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-md mb-10">
              Бид зөвхөн бүтээгдэхүүн зардаггүй — өдөр бүрийн зан үйл, өөртөө анхаарал
              тавих мөчийг бүтээдэг. Байгалийн цэвэр найрлага, шинжлэх ухааны нарийвчлал.
            </p>
            <Link
              href="/story"
              className="inline-flex items-center gap-3 font-sans text-sm font-semibold tracking-widest uppercase link-reveal"
            >
              Бидний түүх <span>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ 2. RESULTS / BEFORE & AFTER ============ */
export function Results() {
  const stats = [
    { n: "92%", t: "арьс нь илүү гэрэлтэй болсон гэж хариулсан", w: "4 долоо хоногийн дараа" },
    { n: "97%", t: "арьс зөөлөрч, чийгшсэн гэж мэдэрсэн", w: "1 долоо хоногийн дараа" },
    { n: "10K+", t: "сэтгэл ханамжтай хэрэглэгчид", w: "Монгол даяар" },
  ];
  return (
    <section className="bg-bg-deepest text-ink-inverse py-28 lg:py-40 overflow-hidden relative">
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-brand-pink/30 blur-3xl" />
      <div className="max-w-[1500px] mx-auto px-8 lg:px-16 relative">
        <Reveal>
          <div className="text-center mb-20">
            <div className="eyebrow text-brand-champagne mb-6">— Батлагдсан үр дүн</div>
            <h2 className="font-serif text-[clamp(2.5rem,4.5vw,5rem)] leading-[1] tracking-tight">
              Тоо <span className="italic font-light text-brand-champagne">өөрөө</span> ярьдаг.
            </h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="text-center border-t border-white/15 pt-10">
                <div className="font-serif text-[clamp(3.5rem,6vw,6rem)] leading-none text-brand-champagne mb-5">
                  {s.n}
                </div>
                <p className="font-sans text-white/70 leading-relaxed max-w-[260px] mx-auto mb-3">{s.t}</p>
                <div className="font-sans text-[11px] tracking-widest uppercase text-white/40">{s.w}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 3. WHY CHOOSE US ============ */
export function WhyChooseUs() {
  const items = [
    { icon: Leaf, t: "Байгалийн найрлага", d: "Органик гаралтай, нотлогдсон идэвхт бодисууд. Хор хөнөөлгүй." },
    { icon: FlaskConical, t: "Шинжлэх ухаан", d: "Dermatologist шалгасан, эмнэлзүйн туршилтаар баталгаажсан." },
    { icon: Heart, t: "Харгислалгүй", d: "Амьтанд туршдаггүй, 100% vegan, ёс зүйтэй үйлдвэрлэл." },
    { icon: Sparkles, t: "Хувийн зөвлөгөө", d: "Арьсны төрөлд тань тохирсон үнэгүй мэргэжлийн зөвлөгөө." },
  ];
  return (
    <section className="bg-white py-28 lg:py-36">
      <div className="max-w-[1500px] mx-auto px-8 lg:px-16">
        <Reveal>
          <div className="max-w-2xl mb-20">
            <div className="eyebrow text-brand-pink mb-6">— Яагаад monshop?</div>
            <h2 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[1.02] tracking-tight">
              Чанарын <span className="italic font-light text-brand-pink">амлалт.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.1}>
              <div className="border-t border-line pt-8">
                <span className="w-12 h-12 rounded-full bg-bg-soft flex items-center justify-center mb-6">
                  <it.icon className="w-5 h-5 text-brand-pink" strokeWidth={1.6} />
                </span>
                <div className="font-serif text-2xl mb-3">{it.t}</div>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 4. TRENDING EDITORIAL GRID ============ */
export function TrendingEditorial() {
  return (
    <section className="bg-[#F5F0EC] py-28 lg:py-36 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-8 lg:px-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
            <h2 className="font-serif text-[clamp(2.5rem,4.5vw,5rem)] leading-[1] tracking-tight">
              Энэ улирлын
              <br />
              <span className="italic font-light text-brand-pink">онцлох</span> цуглуулга
            </h2>
            <Link href="/shop" className="font-sans text-sm font-semibold tracking-widest uppercase link-reveal">
              Бүгдийг үзэх →
            </Link>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Large editorial tile */}
          <Reveal className="lg:col-span-7">
            <Link href="/categories/serums" className="group relative block aspect-[16/12] rounded-[28px] overflow-hidden bg-gradient-to-br from-brand-blush via-brand-tan to-brand-sand">
              <Image src="/product1.png" alt="" fill className="object-contain p-16 transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl" />
              <div className="absolute bottom-8 left-8 right-8 text-ink">
                <div className="eyebrow text-brand-pink mb-2">Идэвхт сийрум</div>
                <div className="font-serif text-3xl lg:text-4xl tracking-tight">Гэрэлтэлтийн нууц</div>
              </div>
            </Link>
          </Reveal>

          {/* Stacked right */}
          <div className="lg:col-span-5 grid gap-6 lg:gap-8">
            {[
              { img: "/product2.png", t: "Чийгшил", s: "moisturizers", from: "from-bg-peach" },
              { img: "/product4.png", t: "Эрчимт маск", s: "masks", from: "from-brand-blush" },
            ].map((c, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <Link href={`/categories/${c.s}`} className={`group relative block aspect-[16/9] rounded-[28px] overflow-hidden bg-gradient-to-br ${c.from} to-white`}>
                  <Image src={c.img} alt="" fill className="object-contain p-10 transition-transform duration-700 group-hover:scale-105 drop-shadow-xl" />
                  <div className="absolute bottom-6 left-6 font-serif text-2xl">{c.t}</div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ 5. INSTAGRAM GALLERY ============ */
export function InstagramGallery() {
  const imgs = ["/product1.png", "/product3.png", "/product5.png", "/product2.png", "/product4.png", "/banner.png"];
  return (
    <section className="bg-white py-28 lg:py-36">
      <div className="max-w-[1500px] mx-auto px-8 lg:px-16">
        <Reveal>
          <div className="text-center mb-16">
            <div className="eyebrow text-brand-pink mb-5 flex items-center justify-center gap-2">
              <Instagram className="w-3.5 h-3.5" /> @monshop
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] tracking-tight">
              Манай <span className="italic font-light text-brand-pink">нийгэмлэг</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {imgs.map((src, i) => (
            <Reveal key={i} delay={(i % 6) * 0.06}>
              <a href="#" className="group relative block aspect-square rounded-2xl overflow-hidden bg-bg-soft">
                <Image src={src} alt="" fill sizes="200px" className="object-contain p-4 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-brand-pink/0 group-hover:bg-brand-pink/10 transition flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 6. NEWSLETTER CTA ============ */
export function NewsletterCTA() {
  return (
    <section className="bg-[#F5F0EC] py-28 lg:py-40 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-pink/10 blur-3xl" />
      <div className="max-w-3xl mx-auto px-8 text-center relative">
        <Reveal>
          <div className="eyebrow text-brand-pink mb-7">— Манайхтай нэгд</div>
          <h2 className="font-serif text-[clamp(2.75rem,5vw,5.5rem)] leading-[0.98] tracking-tight mb-7">
            Эхний захиалгад
            <br />
            <span className="italic font-light text-brand-pink">15% хямдрал.</span>
          </h2>
          <p className="font-sans text-lg text-ink-muted mb-12 max-w-md mx-auto">
            Шинэ ирэлт, онцгой санал, арьс арчилгааны зөвлөгөөг хамгийн түрүүнд хүлээн авна уу.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Имэйл хаягаа оруулна уу"
              className="flex-1 bg-white border border-line-subtle rounded-pill px-7 py-4 font-sans text-sm outline-none focus:border-brand-pink transition"
            />
            <button
              className="btn-3d rounded-pill px-8 py-4 font-sans text-sm font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            >
              Бүртгүүлэх
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
