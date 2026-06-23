"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Tilt3D } from "@/components/Tilt3D";
import { Sparkles, Heart, Leaf, Award, Users, Smile, FlaskConical } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const STORY_ROWS = [
  {
    imageSide: "left" as const,
    eyebrow: "01 — Найрлага",
    title: "Байгалийн",
    accent: "цэвэр хүч.",
    text: "Мерино ноос, эвкалипт мод, элсний хайрс — бид зөвхөн байгалиас гаралтай, нотлогдсон найрлагуудыг сонгодог. Хор хөнөөлгүй, арьсанд ээлтэй.",
    icon: Leaf,
  },
  {
    imageSide: "right" as const,
    eyebrow: "02 — Шинжлэх ухаан",
    title: "Лабораторид",
    accent: "батлагдсан.",
    text: "Бүтээгдэхүүн бүр dermatologist-ийн хяналт дор, эмнэлзүйн туршилтаар баталгаажиж байж л дэлгүүрт ирдэг. Үр дүн нь тоогоор нотлогдсон.",
    icon: FlaskConical,
  },
  {
    imageSide: "left" as const,
    eyebrow: "03 — Хайр",
    title: "Хайраар",
    accent: "хийгдсэн.",
    text: "Бид арьс арчилгааг \"бараа\" гэж үздэггүй. Тэр бол өдөр бүрийн чинь амьдралд ордог нөхөр. Тиймээс хайраар, анхааралтай бүтээдэг.",
    icon: Heart,
  },
];

const VALUES = [
  { icon: Leaf, t: "Байгальд ээлтэй", d: "Органик найрлага, дахин боловсруулсан баглаа." },
  { icon: Heart, t: "Харгислалгүй", d: "Амьтанд хэзээ ч турших туршилт хийдэггүй." },
  { icon: Award, t: "Чанарт итгэлтэй", d: "Бүх бараа лабораторид шалгагдсан." },
  { icon: Smile, t: "Хэрэглэгч төвтэй", d: "Сэтгэгдэл бүрд хариулна." },
];

const TEAM = [
  { name: "Аз Б.", role: "Үүсгэн байгуулагч", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=85" },
  { name: "Цэцгээ Г.", role: "Dermatologist", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=85" },
  { name: "Мөнхбат Д.", role: "Бүтээгдэхүүний дизайн", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=85" },
  { name: "Сараа О.", role: "Хэрэглэгчтэй харилцах", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=85" },
];

function HeroLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Decorative product circle used in hero + story rows */
function ProductOrb() {
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-6 rounded-full bg-gradient-to-br from-brand-blush to-brand-pink/40 shadow-3d"
      />
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image src="/banner.png" alt="" width={440} height={440} className="object-contain drop-shadow-2xl" />
      </motion.div>
      {[
        { top: "6%", left: "16%", delay: 0 },
        { top: "26%", right: "8%", delay: 0.6 },
        { bottom: "16%", left: "6%", delay: 1.1 },
        { bottom: "10%", right: "20%", delay: 1.6 },
      ].map((s, i) => (
        <motion.span
          key={i}
          animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 4, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          style={s as any}
          className="absolute text-brand-pink text-2xl"
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

export default function StoryPage() {
  // Scroll track for the 3 story rows — drives the traveling image
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Measure viewport width → GPU-accelerated translateX in px (no layout jank)
  const [vw, setVw] = useState(1440);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const smooth = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.7,
    restDelta: 0.0004,
  });

  // Image travels: right → left → right, pinned vertically, across the 3 rows
  const xR = vw * 0.24;
  const xL = -vw * 0.24;
  const imgX = useTransform(smooth, [0, 0.5, 1], [xR, xL, xR]);

  return (
    <article className="bg-white">
      {/* ====== HERO ====== */}
      <section className="relative bg-soft-pink min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[600px] h-[600px] rounded-full bg-brand-pink/15 blur-3xl drift pointer-events-none" />
        <div
          className="absolute -bottom-32 right-20 w-[500px] h-[500px] rounded-full bg-brand-rose/20 blur-3xl drift pointer-events-none"
          style={{ animationDelay: "3s" }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 items-center gap-12 py-20 relative z-10">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow text-brand-pink mb-7 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" /> Бидний түүх
            </motion.div>
            <h1 className="font-serif text-6xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
              <HeroLine delay={0}>Бяцхан</HeroLine>
              <HeroLine delay={0.1}>
                <em className="italic font-light text-brand-pink">мөрөөдөл</em>
              </HeroLine>
              <HeroLine delay={0.2}>том</HeroLine>
              <HeroLine delay={0.3}>
                <em className="italic font-light text-brand-pink">амьдрал.</em>
              </HeroLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-lg text-ink-muted max-w-md leading-relaxed"
            >
              monshop нь арьс арчилгааг нэг нэг хайраар бүтээдэг. Бид хайртай
              зүйлээ хайрладаг хүмүүст зориулж бүтээдэг ✨
            </motion.p>
          </div>

          {/* Hero image — premium editorial frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-3d">
              <Image
                src="/hero.png"
                alt="monshop"
                fill
                priority
                sizes="45vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
            {/* floating stat badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-5 shadow-float w-44"
            >
              <div className="font-serif text-4xl text-brand-pink leading-none">10K+</div>
              <div className="font-sans text-xs text-ink-muted mt-1.5">Сэтгэл ханамжтай хэрэглэгч</div>
            </motion.div>
            {/* est badge */}
            <div className="absolute top-6 right-6 bg-white/85 backdrop-blur rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-brand-pink">
              EST. 2026
            </div>
          </motion.div>

          {/* Mobile: orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:hidden"
          >
            <ProductOrb />
          </motion.div>
        </div>
      </section>

      {/* ====== STORY ROWS — single image travels (scroll-driven) across rows ====== */}
      <div ref={trackRef} className="relative bg-white">
        {/* Sticky traveling image overlay (desktop) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <motion.div style={{ x: imgX }} className="w-[420px] will-change-transform">
              <ProductOrb />
            </motion.div>
          </div>
        </div>

        {/* Text rows — each ~viewport tall, text on the side opposite the image */}
        {STORY_ROWS.map((row, i) => {
          // image at right on even rows → text left; image left on odd → text right
          const textLeft = i % 2 === 0;
          return (
            <section
              key={i}
              className="relative z-20 min-h-screen flex items-center"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-12">
                <div className={`${textLeft ? "lg:col-start-1" : "lg:col-start-2"} max-w-lg`}>
                  <Reveal>
                    <span className="w-14 h-14 rounded-full bg-brand-pink/10 flex items-center justify-center mb-6">
                      <row.icon className="w-6 h-6 text-brand-pink" strokeWidth={1.6} />
                    </span>
                    <div className="eyebrow text-brand-pink mb-4">{row.eyebrow}</div>
                    <h2 className="font-serif text-5xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
                      {row.title}
                      <br />
                      <em className="italic font-light text-brand-pink">{row.accent}</em>
                    </h2>
                    <p className="text-base lg:text-lg text-ink-muted leading-relaxed">
                      {row.text}
                    </p>
                  </Reveal>

                  {/* Mobile: static image per row (traveler hidden on mobile) */}
                  <div className="lg:hidden mt-10">
                    <ProductOrb />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ====== VALUES ====== */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <div className="eyebrow text-brand-pink mb-4">— Бидний үнэт зүйлс</div>
              <h2 className="font-serif text-4xl lg:text-6xl tracking-tight">
                Юунд <span className="italic text-brand-pink">итгэдэг</span> вэ?
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08}>
                <Tilt3D max={8} className="rounded-3xl card-3d">
                  <div className="bg-card-pink rounded-3xl p-6 lg:p-7 shadow-3d edge-highlight h-full">
                    <span className="w-12 h-12 rounded-full bg-white shadow-soft-pink flex items-center justify-center mb-5">
                      <v.icon className="w-5 h-5 text-brand-pink" strokeWidth={1.8} />
                    </span>
                    <div className="font-serif text-xl mb-2">{v.t}</div>
                    <div className="text-sm text-ink-muted leading-relaxed">{v.d}</div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="py-16 lg:py-20 bg-bg-blush">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: "10K+", t: "Сэтгэл ханамжтай хэрэглэгч" },
            { n: "50+", t: "Загвар бүтээсэн" },
            { n: "4.8★", t: "Дундаж үнэлгээ" },
            { n: "100%", t: "Vegan + Cruelty-free" },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <div className="text-center">
                <div className="font-serif text-4xl lg:text-5xl text-brand-pink mb-2">{s.n}</div>
                <div className="text-xs lg:text-sm text-ink-muted">{s.t}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ====== TEAM ====== */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <div className="eyebrow text-brand-pink mb-4 flex justify-center items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Манай баг
              </div>
              <h2 className="font-serif text-4xl lg:text-6xl tracking-tight">
                Чиний дэргэдэх <span className="italic text-brand-pink">найзууд</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="text-center group">
                  <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 shadow-3d edge-highlight">
                    <Image
                      src={p.avatar}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="font-serif text-lg">{p.name}</div>
                  <div className="text-xs text-ink-muted">{p.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 lg:py-32 bg-soft-pink overflow-hidden relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-pink/15 blur-3xl drift pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <Reveal>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight mb-5">
              Бидний <span className="italic text-brand-pink">аяны</span> хамтрагч болоорой
            </h2>
            <p className="text-ink-muted mb-8">
              Шинэ ирэлт, онцгой санал, арьс арчилгааны зөвлөгөөг шууд имэйлээр.
            </p>
            <Link
              href="/shop"
              className="btn-3d inline-flex items-center gap-2 rounded-pill px-8 py-4 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            >
              Худалдаа эхлэх →
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
