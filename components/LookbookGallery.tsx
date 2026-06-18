"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const SHOTS = [
  { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85", h: "tall" },
  { src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=85", h: "short" },
  { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85", h: "tall" },
  { src: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=900&q=85", h: "short" },
  { src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=85", h: "tall" },
  { src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=85", h: "short" },
];

export function LookbookGallery() {
  return (
    <section className="py-20 lg:py-28 bg-bg-primary overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <div className="eyebrow text-brand-champagne mb-4">— Lookbook 2026</div>
            <h2 className="font-serif text-5xl lg:text-7xl tracking-tight leading-[0.95]">
              Загвар<em className="italic font-light"> хөдөлгөөнтэй</em>
            </h2>
          </div>
          <Link
            href="/journal"
            className="text-sm font-semibold tracking-widest uppercase link-reveal"
          >
            Бүхэл цуглуулга →
          </Link>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-4 lg:gap-6 px-6 lg:px-12 pb-4">
          {SHOTS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative shrink-0 overflow-hidden group ${
                s.h === "tall"
                  ? "w-[78vw] sm:w-[40vw] lg:w-[24vw] aspect-[3/4]"
                  : "w-[78vw] sm:w-[40vw] lg:w-[24vw] aspect-[4/3] self-end"
              }`}
            >
              <Image
                src={s.src}
                alt=""
                fill
                sizes="(max-width: 768px) 78vw, 24vw"
                className="object-cover transition-transform duration-1000 ease-smooth group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 font-serif text-sm text-white mix-blend-difference">
                {String(i + 1).padStart(2, "0")} / {String(SHOTS.length).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
