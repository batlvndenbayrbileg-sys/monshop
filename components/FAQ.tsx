"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "Хэрхэн захиалга өгөх вэ?",
    a: "Дуртай бараагаа сагсанд нэмээд, сагсан дотроо орж «Захиалга өгөх» товчийг дарна. Үргэлжлүүлэн холбоо барих мэдээлэл, хүргэлтийн хаяг, төлбөрийн төрлөө сонгох болно. Бүх алхамыг 2-3 минутад дуусгана.",
  },
  {
    q: "Ямар төлбөрийн хэрэгсэл байдаг вэ?",
    a: "QPay, Хаан банк, банкны шилжүүлэг, мөн хүргэлтийн үед бэлнээр төлөх боломжтой. Бүх төлбөр SSL шифрлэлттэй, найдвартай.",
  },
  {
    q: "Захиалга хэр удаан хүргэгдэх вэ?",
    a: "Улаанбаатар хотод 1-2 ажлын өдрийн дотор хүргэгдэнэ. Орон нутаг руу 3-5 өдөр зарцуулна. Захиалгын хяналтын дугаараар хаана хүрснийг шалгах боломжтой.",
  },
  {
    q: "Хүргэлтийн төлбөр хэд вэ?",
    a: "100,000₮-өөс дээш захиалгад хүргэлт үнэгүй. Үүнээс бага захиалгад хотын дотор 8,000₮, орон нутагт 15,000₮.",
  },
  {
    q: "Бараагаа хэрхэн буцаах вэ?",
    a: "Бараагаа хүлээж авснаас хойш 30 хоногийн дотор асуулт асуухгүй буцаах боломжтой. hi@monshop.mn руу имэйл бичээд буцаалтын заавар хүлээн авна.",
  },
  {
    q: "Арьсны төрөлдөө тохирох арчилгаа сонгох тусламж авч болох уу?",
    a: "Тийм. Манай dermatologist-уудтай үнэгүй чатлах боломжтой. Та арьсны төрөл, асуудлаа хэлэхэд тань зориулсан арчилгааны төлөвлөгөөг боловсруулна.",
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section className="bg-bg-soft py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal>
          <h2 className="text-center font-serif text-6xl lg:text-8xl tracking-tight text-brand-pink mb-14 lg:mb-20">
            FAQ
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div
                    className={`rounded-3xl shadow-soft-pink edge-highlight transition-colors ${
                      isOpen ? "bg-white" : "bg-white/70"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-sm lg:text-base pr-4">
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="w-10 h-10 rounded-full btn-3d flex items-center justify-center text-white shrink-0"
                        style={{
                          background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)",
                        }}
                      >
                        <ChevronDown className="w-4 h-4" strokeWidth={2.2} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 -mt-1 text-sm text-ink-muted leading-relaxed max-w-xl">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Decorative side */}
          <Reveal delay={0.2} className="lg:col-span-5 hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Big pink circle backdrop */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-blush via-brand-pink/30 to-brand-blush blur-2xl drift" />

              {/* Solid pink circle */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-12 rounded-full bg-gradient-to-br from-bg-blush to-brand-blush shadow-3d"
              />

              {/* Floating product */}
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src="/banner.png"
                  alt="Skincare products"
                  width={400}
                  height={400}
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating sparkles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-6 right-12 text-brand-pink text-3xl"
              >
                ✦
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-10 left-8 text-brand-pink/70 text-2xl"
              >
                ✿
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-4 text-brand-pink/60 text-xl"
              >
                ✦
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
