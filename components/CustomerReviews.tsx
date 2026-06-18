"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

const REVIEWS = [
  {
    name: "Сараа Б.",
    role: "Сэтгэл ханамжтай хэрэглэгч",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=85",
    rating: 5,
    text: "Vitamin C сийрум хэрэглээд 2 долоо хоног боллоо. Толбо нь арилж, арьс маань төрөлх гялалзалттай боллоо. Бүх найзууддаа санал болгож байна!",
  },
  {
    name: "Цэцгээ М.",
    role: "Тогтмол үйлчлүүлэгч",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=85",
    rating: 5,
    text: "Hyaluronic чийгшүүлэгч надад үнэхээр таалагдсан. Хатуурдаг байсан арьс минь зөөлөн, чийглэг болсон. Spa-д хүрсэн юм шиг сэтгэгдэлтэй.",
  },
  {
    name: "Энхтуяа Г.",
    role: "Анхны худалдан авагч",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=85",
    rating: 5,
    text: "SPF 50 нарны тос хөнгөн, цагаан үлдэгдэлгүй учир өдөр бүр хэрэглэдэг. Их сайн чанартай, үнэ ч хямд.",
  },
  {
    name: "Үүлэн О.",
    role: "Сэтгэл хангалуун",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=85",
    rating: 5,
    text: "Сарнайн шавар маск нь долоо хоногт хоёр удаа хийдэг. Том нүх багасч, арьс маань маш цэвэрхэн харагддаг болсон.",
  },
  {
    name: "Норжмаа Ч.",
    role: "Тогтмол захиалагч",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=85",
    rating: 5,
    text: "Niacinamide сийрум үргэлж сагсанд минь байдаг. Гурван сар хэрэглэхэд нүхтэй байсан хэсэг минь жижигрэв. Үнэхээр баярлалаа!",
  },
];

export function CustomerReviews() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setActive((i) => (i + 1) % REVIEWS.length);
  };
  const prev = () => {
    setDirection(-1);
    setActive((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  };

  // Auto-rotate
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const review = REVIEWS[active];

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Radial pink glow background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-pink/25 blur-[100px] pointer-events-none drift" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-rose/20 blur-[100px] pointer-events-none drift" style={{ animationDelay: "3s" }} />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative">
        {/* Headline */}
        <Reveal>
          <h2 className="text-center font-serif text-5xl lg:text-7xl tracking-tight mb-16 lg:mb-20">
            <span className="font-light">Хэрэглэгчдийн</span>{" "}
            <span className="italic text-brand-pink">сэтгэгдэл</span>
          </h2>
        </Reveal>

        {/* Stacked cards */}
        <div className="relative h-[420px] sm:h-[360px] lg:h-[340px] mx-auto max-w-3xl">
          {/* Back card 2 (offset behind) */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-3d edge-highlight"
            style={{ transform: "translate(36px, 36px) scale(0.92)", opacity: 0.6 }}
          />
          {/* Back card 1 */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-3d edge-highlight"
            style={{ transform: "translate(18px, 18px) scale(0.96)", opacity: 0.85 }}
          />

          {/* Active card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) next();
                else if (info.offset.x > 80) prev();
              }}
              className="absolute inset-0 bg-bg-blush rounded-3xl shadow-3d edge-highlight overflow-hidden flex flex-col sm:flex-row cursor-grab active:cursor-grabbing"
            >
              {/* Portrait */}
              <div className="relative w-full sm:w-[44%] h-48 sm:h-auto shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="font-semibold text-lg">{review.name}</div>
                    <div className="text-xs text-ink-muted">{review.role}</div>
                  </div>
                  <div className="text-brand-gold text-base whitespace-nowrap">
                    {"★".repeat(review.rating)}
                  </div>
                </div>
                <p className="text-sm lg:text-base text-ink-muted leading-relaxed">
                  “{review.text}”
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-12">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > active ? 1 : -1);
                setActive(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "bg-brand-pink w-8" : "bg-brand-pink/30 w-2 hover:bg-brand-pink/60"
              }`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={prev}
            className="btn-3d w-12 h-12 rounded-full text-white flex items-center justify-center"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            onClick={next}
            className="btn-3d w-12 h-12 rounded-full text-white flex items-center justify-center"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
