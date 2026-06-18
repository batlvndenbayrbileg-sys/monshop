"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, FlaskConical, Heart, Play, Star, TrendingUp, ShoppingBag } from "lucide-react";
import { Tilt3D } from "./Tilt3D";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yBadgeRight = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yBadgeLeft = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacityText = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative bg-bg-blush overflow-hidden h-screen"
    >
      {/* === FULL-BLEED HERO IMAGE BACKGROUND === */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Skincare hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right lg:object-center"
        />
        {/* Soft gradient overlay — left side gets readability fade on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-blush/85 via-bg-blush/30 to-transparent lg:from-bg-blush/40 lg:via-transparent lg:to-transparent" />
      </motion.div>

      {/* === CONTENT GRID === */}
      <div className="relative max-w-8xl mx-auto grid lg:grid-cols-2 h-full">
        {/* ===== LEFT — TEXT ===== */}
        <motion.div
          style={{ opacity: opacityText }}
          className="px-6 lg:px-16 xl:px-20 py-16 lg:py-24 flex flex-col justify-center relative z-10"
        >
          {/* Rating pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="self-start"
          >
            <div className="liquid-glass-pink rounded-pill px-4 py-2 flex items-center gap-3">
              <span className="font-serif text-base">
                4.9<span className="text-ink-muted text-xs">/5</span>
              </span>
              <span className="text-brand-gold text-xs tracking-wider">★★★★★</span>
              <span className="text-[11px] text-ink-muted font-medium">100+ хэрэглэгч</span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mt-8 mb-5"
          >
            <span className="h-px w-10 bg-brand-pink" />
            <span className="eyebrow text-brand-pink">Шинэ цуврал</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-tight text-ink"
          >
            <span className="block">Арьсныхаа</span>
            <span className="block">
              <span className="italic font-medium text-brand-pink">төлөө</span> гэрэлтэлтийг
            </span>
            <span className="block">нээ.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 text-base lg:text-lg text-ink-muted max-w-md leading-relaxed"
          >
            Эрдэсийн хүч, шинжлэх ухаан, байгалийн орцын төгс хослол таны
            арьсыг гэрэлтүүлнэ.
          </motion.p>

          {/* Pink accent tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-3 font-serif italic text-brand-pink text-lg"
          >
            + Хайрлуулж арчилгаа.
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="btn-3d rounded-pill pl-6 pr-2 py-1.5 text-sm font-semibold flex items-center gap-3 group text-white"
              style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            >
              <span>Худалдан авах</span>
              <span className="w-10 h-10 rounded-full bg-white text-ink flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition">
                <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
              </span>
            </Link>
            <button className="flex items-center gap-3 text-sm font-semibold group">
              <span className="w-12 h-12 rounded-full bg-white shadow-3d flex items-center justify-center transition group-hover:bg-brand-pink group-hover:text-white">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" strokeWidth={0} />
              </span>
              Видео үзэх
            </button>
          </motion.div>

          {/* Trust badges - 3 pill cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 lg:mt-16 flex flex-wrap gap-2"
          >
            {[
              { icon: Leaf, t: "Байгалийн", s: "Орцтой" },
              { icon: FlaskConical, t: "Шинжлэх ухаанд", s: "суурилсан" },
              { icon: Heart, t: "Харшилгүй", s: "Бүх төрлийн арьсанд" },
            ].map((b) => (
              <div
                key={b.t}
                className="liquid-glass-pink rounded-pill px-4 py-2.5 flex items-center gap-2.5 group hover:scale-[1.02] transition"
              >
                <span className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-3.5 h-3.5 text-brand-pink" strokeWidth={1.8} />
                </span>
                <div className="leading-tight">
                  <div className="text-[11px] font-semibold">{b.t}</div>
                  <div className="text-[10px] text-ink-muted">{b.s}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ===== RIGHT — FLOATING OVERLAYS ===== */}
        <div className="relative hidden lg:block">
          {/* 20% OFF circle badge — top right */}
          <motion.div
            style={{ y: yBadgeRight }}
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6, type: "spring", damping: 14 }}
            className="absolute top-16 right-8 xl:right-16 z-20"
          >
            <Tilt3D max={14} className="rounded-full">
              <div className="relative w-32 h-32 xl:w-36 xl:h-36 liquid-glass-pink rounded-full flex flex-col items-center justify-center text-center shadow-float">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-dashed border-brand-pink/40"
                />
                <div className="font-serif text-5xl font-light text-ink leading-none">
                  20<span className="text-brand-pink">%</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="h-px w-2 bg-brand-pink" />
                  <span className="text-[9px] font-semibold tracking-widest">ШИНЭ</span>
                  <span className="h-px w-2 bg-brand-pink" />
                </div>
                <div className="text-[9px] text-ink-muted mt-0.5 leading-tight">
                  үйлчлүүлэгчдэд
                </div>
              </div>
            </Tilt3D>
          </motion.div>

          {/* "+48% Гэрэлтэлт нэмэгдсэн" floating badge — middle */}
          <motion.div
            style={{ y: yBadgeLeft }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute top-1/2 left-2 xl:left-6 -translate-y-1/2 float-slow z-20"
          >
            <Tilt3D max={10}>
              <div className="liquid-glass-pink rounded-2xl px-4 py-3 flex items-center gap-3 shadow-float">
                <span className="w-9 h-9 rounded-full bg-brand-pink/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-brand-pink" strokeWidth={2.2} />
                </span>
                <div className="leading-tight">
                  <div className="text-brand-pink font-serif text-base">+48%</div>
                  <div className="text-[10px] text-ink-muted">Гэрэлтэлт нэмэгдсэн</div>
                </div>
              </div>
            </Tilt3D>
          </motion.div>

          {/* "★ 4.9" floating star pill — bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute bottom-20 right-8 float-delayed z-20 hidden xl:block"
          >
            <Tilt3D max={8}>
              <div className="liquid-glass-pink rounded-pill px-4 py-2 flex items-center gap-2 shadow-float">
                <Star className="w-3.5 h-3.5 text-brand-gold fill-current" />
                <div className="font-serif text-base leading-none">4.9</div>
                <span className="text-[10px] text-ink-muted">үнэлгээ</span>
              </div>
            </Tilt3D>
          </motion.div>
        </div>
      </div>

      {/* Mobile floating 20% badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.7, type: "spring", damping: 14 }}
        className="lg:hidden absolute top-6 right-4 z-20"
      >
        <Tilt3D max={12} className="rounded-full">
          <div className="w-24 h-24 liquid-glass-pink rounded-full flex flex-col items-center justify-center shadow-float">
            <div className="font-serif text-2xl font-light leading-none">
              20<span className="text-brand-pink">%</span>
            </div>
            <div className="text-[8px] font-semibold tracking-widest mt-1.5">ШИНЭ</div>
            <div className="text-[7px] text-ink-muted">үйлчлүүлэгчдэд</div>
          </div>
        </Tilt3D>
      </motion.div>
    </section>
  );
}
