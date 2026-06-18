"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { Tilt3D } from "./Tilt3D";

export function PromoBanner() {
  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <Tilt3D max={3} glare={false} className="rounded-[2rem] lg:rounded-[2.5rem]">
          <div className="bg-rose-gradient rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative grid lg:grid-cols-12 items-center gap-6 lg:gap-8 px-6 lg:px-12 py-8 lg:py-14 shadow-3d edge-highlight">
            {/* Decorative blurs */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/50 blur-3xl pointer-events-none drift" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-brand-pink/20 blur-3xl pointer-events-none drift" style={{ animationDelay: "3s" }} />

            <Reveal className="lg:col-span-5 relative z-10">
              <div
                className="eyebrow text-brand-pink mb-4 flex items-center gap-2"
                style={{ transform: "translateZ(20px)" }}
              >
                <span>Өдөр бүр гэрэлтэй</span>
                <span>✦</span>
              </div>
              <h2
                className="font-serif text-4xl lg:text-5xl tracking-tight leading-[1.05] mb-4"
                style={{ transform: "translateZ(30px)" }}
              >
                Арьс чинь
                <br />
                чамайг <span className="italic text-brand-pink">хайрладаг.</span>
              </h2>
              <p className="text-ink-muted text-sm lg:text-base mb-6 max-w-md">
                Хамгийн их зарагдсан бараанд өнөөдөр 20% хямдрал.
                Хязгаарлагдмал хугацаатай.
              </p>
              <Link
                href="/sale"
                className="btn-3d inline-flex items-center gap-3 rounded-pill pl-6 pr-2 py-1.5 text-sm font-semibold group text-white"
                style={{
                  background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)",
                  transform: "translateZ(40px)",
                }}
              >
                <span>Худалдан авах</span>
                <span className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center transition group-hover:bg-brand-pink group-hover:text-white shadow-inner">
                  →
                </span>
              </Link>
            </Reveal>

            <div
              className="lg:col-span-5 relative h-[240px] lg:h-[340px] order-first lg:order-none"
              style={{ transform: "translateZ(50px)" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center float-slow"
              >
                <Image
                  src="/banner.png"
                  alt="Skincare products"
                  width={520}
                  height={520}
                  className="object-contain max-h-full drop-shadow-2xl"
                />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                className="absolute top-2 left-4 text-brand-pink/60 text-2xl"
              >
                ✦
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-4 right-2 text-brand-pink/60 text-xl"
              >
                ✿
              </motion.div>
            </div>

            {/* Stats column */}
            <Reveal className="lg:col-span-2 relative z-10 flex lg:flex-col gap-6 lg:gap-8 lg:items-start justify-around">
              <div
                className="bg-white/60 backdrop-blur rounded-2xl px-4 py-3 shadow-soft-pink"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="font-serif text-3xl lg:text-4xl text-brand-pink leading-none">
                  10K<span className="text-xl">+</span>
                </div>
                <div className="text-[11px] text-ink-muted mt-1.5 leading-tight">
                  Сэтгэл ханамжтай
                  <br />
                  хэрэглэгчид
                </div>
              </div>
              <div
                className="bg-white/60 backdrop-blur rounded-2xl px-4 py-3 shadow-soft-pink"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="font-serif text-3xl lg:text-4xl text-brand-pink leading-none">
                  4.8
                </div>
                <div className="text-[11px] text-ink-muted mt-1.5 leading-tight">
                  Дундаж үнэлгээ
                </div>
                <div className="text-brand-pink text-xs mt-1">★ ★ ★ ★ ★</div>
              </div>
            </Reveal>
          </div>
        </Tilt3D>
      </div>
    </section>
  );
}
