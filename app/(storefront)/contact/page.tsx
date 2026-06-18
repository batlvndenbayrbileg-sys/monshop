"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Send, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Tilt3D } from "@/components/Tilt3D";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Илгээгдлээ! Бид удахгүй хариулна.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 900);
  };

  return (
    <article className="bg-white">
      {/* ===== HERO ===== */}
      <section className="relative bg-soft-pink py-20 lg:py-28 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-brand-pink/15 blur-3xl drift pointer-events-none" />
        <div className="absolute -bottom-32 right-20 w-96 h-96 rounded-full bg-brand-rose/20 blur-3xl drift pointer-events-none" style={{ animationDelay: "3s" }} />

        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative">
          <Reveal>
            <div className="eyebrow text-brand-pink mb-4 flex justify-center items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" /> Бид сонсож байна
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl tracking-tight leading-[0.95] mb-5">
              Холбоо <span className="italic text-brand-pink">барих</span>
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
              Асуулт, санал, хүсэлт — бид бүгдэд нь баяртайгаар хариулна.
              24 цагийн дотор имэйлээр буцаан холбогдоно.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== INFO CARDS + FORM ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-10">
          {/* Left — info cards */}
          <div className="lg:col-span-5 space-y-4">
            {[
              {
                icon: Phone,
                title: "Утсаар ярих",
                lines: ["+976 9911-2233", "+976 7700-1234"],
                hint: "Даваа-Бямба · 09:00 — 19:00",
              },
              {
                icon: Mail,
                title: "Имэйл",
                lines: ["hi@monshop.mn", "support@monshop.mn"],
                hint: "24 цагийн дотор хариулна",
              },
              {
                icon: MapPin,
                title: "Хаяг",
                lines: ["СБД, 1-р хороо", "Сансарын гудамж 14, 5 давхар"],
                hint: "Худалдааны төв · 2 давхар",
              },
              {
                icon: Clock,
                title: "Цагийн хуваарь",
                lines: ["Даваа-Баасан · 10:00 — 21:00", "Бямба-Ням · 11:00 — 20:00"],
                hint: "Баярын өдрүүдэд хаалттай",
              },
            ].map((info, i) => (
              <Reveal key={info.title} delay={i * 0.08}>
                <Tilt3D max={5} className="rounded-3xl">
                  <div className="bg-card-pink rounded-3xl p-6 shadow-3d edge-highlight flex gap-4">
                    <span className="w-12 h-12 rounded-full bg-white shadow-soft-pink flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-brand-pink" strokeWidth={1.8} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg mb-1">{info.title}</div>
                      {info.lines.map((l, idx) => (
                        <div key={idx} className="text-sm">{l}</div>
                      ))}
                      <div className="text-xs text-ink-muted mt-2">{info.hint}</div>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}

            {/* Social */}
            <Reveal delay={0.4}>
              <div className="bg-bg-soft rounded-3xl p-6 shadow-soft-pink">
                <div className="text-sm font-semibold mb-4">Сошиал медиад биднийг дага</div>
                <div className="flex gap-3">
                  {[Instagram, Facebook, Youtube].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-11 h-11 rounded-full bg-white hover:bg-brand-pink hover:text-white transition flex items-center justify-center shadow-sm"
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.8} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-3d edge-highlight overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-brand-pink via-brand-rose to-brand-mauve" />
              <form onSubmit={submit} className="p-8 lg:p-10">
                <h2 className="font-serif text-2xl lg:text-3xl mb-2">Бидэнд бичээрэй</h2>
                <p className="text-sm text-ink-muted mb-7">
                  Маягт бөглөөд илгээгээрэй, бид имэйлээр буцаан хариулна.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field
                    label="Таны нэр"
                    placeholder="Дорж"
                    required
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                  />
                  <Field
                    label="Имэйл"
                    type="email"
                    placeholder="example@mail.com"
                    required
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                </div>

                <Field
                  label="Сэдэв"
                  placeholder="Тухайн сэдвээ оруулна уу"
                  required
                  value={form.subject}
                  onChange={(v) => setForm({ ...form, subject: v })}
                />

                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Зурвас</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Танд ямар тусламж хэрэгтэй вэ?"
                    className="w-full bg-bg-soft border border-line-subtle rounded-2xl p-4 text-sm focus:border-brand-pink focus:bg-white outline-none transition resize-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-3d w-full mt-6 rounded-pill py-4 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
                >
                  {loading ? "Илгээж байна..." : (
                    <>
                      Илгээх <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <p className="text-[11px] text-ink-muted text-center mt-4">
                  Илгээснээр та манай{" "}
                  <a href="/privacy" className="underline">нууцлалын бодлого</a>-той зөвшөөрнө.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== QUICK FAQ TEASER ===== */}
      <section className="bg-bg-soft py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <div className="eyebrow text-brand-pink mb-3">— Хурдан хариулт</div>
            <h2 className="font-serif text-3xl lg:text-4xl tracking-tight mb-4">
              Магадгүй FAQ хэсэгт <span className="italic text-brand-pink">аль хэдийн</span> хариу нь байж магадгүй
            </h2>
            <p className="text-ink-muted mb-6">
              Хүргэлт, төлбөр, буцаалт, арьсны зөвлөгөөтэй холбоотой түгээмэл асуултуудыг харна уу.
            </p>
            <a
              href="/#faq"
              className="inline-flex items-center gap-2 text-sm font-semibold link-reveal text-brand-pink"
            >
              FAQ үзэх →
            </a>
          </Reveal>
        </div>
      </section>
    </article>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-soft border border-line-subtle rounded-pill px-5 py-3.5 text-sm focus:border-brand-pink focus:bg-white outline-none transition"
      />
    </div>
  );
}
