"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // No public reset endpoint yet — acknowledge without leaking whether the
    // email exists (standard practice).
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-soft-pink flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-pink/20 blur-3xl drift pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-rose/25 blur-3xl drift pointer-events-none" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="block text-center mb-8">
          <Image src="/logo.png" alt="monshop" width={180} height={64} priority className="h-16 w-auto mx-auto object-contain" />
        </Link>

        <div className="bg-white rounded-3xl shadow-3d edge-highlight overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-brand-pink via-brand-rose to-brand-mauve" />
          <div className="p-8 lg:p-10">
            {sent ? (
              <div className="text-center">
                <CheckCircle2 className="w-14 h-14 text-brand-green mx-auto mb-4" strokeWidth={1.5} />
                <h1 className="font-semibold text-2xl mb-3">Шалгана уу</h1>
                <p className="text-sm text-ink-muted mb-8 leading-relaxed">
                  Хэрэв <span className="font-semibold text-ink">{email}</span> бүртгэлтэй бол нууц үг сэргээх
                  зааврыг имэйлээр илгээлээ.
                </p>
                <Link
                  href="/auth/login"
                  className="btn-3d inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3.5 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
                >
                  Нэвтрэх рүү буцах
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-center font-semibold text-2xl mb-2">Нууц үг мартсан уу?</h1>
                <p className="text-center text-sm text-ink-muted mb-7">
                  Имэйл хаягаа оруулбал сэргээх зааврыг илгээнэ.
                </p>

                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">И-мэйл</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" strokeWidth={1.8} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-bg-soft border border-line-subtle rounded-pill pl-11 pr-5 py-3.5 text-sm focus:border-brand-pink focus:bg-white outline-none transition"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="btn-3d w-full rounded-pill py-3.5 text-sm font-semibold text-white disabled:opacity-50"
                    style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
                  >
                    {loading ? "Илгээж байна..." : "Заавар илгээх"}
                  </motion.button>
                </form>

                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-1.5 text-sm text-ink-muted hover:text-brand-pink transition mt-6"
                >
                  <ArrowLeft className="w-4 h-4" /> Нэвтрэх рүү буцах
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
