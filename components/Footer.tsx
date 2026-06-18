"use client";

import Link from "next/link";
import { Sparkles, Instagram, Facebook, Twitter, Youtube, Send } from "lucide-react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Нүүр", href: "/" },
  { label: "Дэлгүүр", href: "/shop" },
  { label: "Ангилал", href: "/categories" },
  { label: "Захиалга", href: "/account/orders" },
  { label: "Хүсэл", href: "/account/favorites" },
];

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-bg-soft py-20 lg:py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <span className="w-20 h-20 rounded-full bg-white shadow-soft-pink flex items-center justify-center">
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-rose to-brand-pink flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2.2} />
              </span>
            </span>
          </Link>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm lg:text-base text-ink-muted leading-relaxed mb-10 max-w-md mx-auto"
        >
          Байгалийн найрлагатай, dermatologist шалгасан,
          <br />
          харгислалгүй premium арьс арчилгаа.
        </motion.p>

        {/* Nav links */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink hover:text-brand-pink transition"
            >
              {l.label}
            </Link>
          ))}
        </motion.nav>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-11 h-11 rounded-full bg-white hover:bg-brand-pink hover:text-white text-ink-muted shadow-soft-pink flex items-center justify-center transition"
            >
              <s.icon className="w-4 h-4" strokeWidth={1.8} />
            </a>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12"
        >
          <input
            type="email"
            placeholder="Имэйл хаягаа оруулна уу"
            className="flex-1 bg-white border border-line-subtle rounded-pill px-6 py-3 text-sm outline-none focus:border-brand-pink transition placeholder:text-ink-subtle"
          />
          <button
            type="submit"
            className="btn-3d rounded-pill px-6 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 shrink-0"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
          >
            <Send className="w-3.5 h-3.5" /> Бүртгүүлэх
          </button>
        </motion.form>

        {/* Divider */}
        <div className="h-px w-24 mx-auto bg-line mb-8" />

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs text-ink-subtle"
        >
          © 2026 monshop. Бүх эрх хуулиар хамгаалагдсан.
        </motion.p>
      </div>
    </footer>
  );
}
