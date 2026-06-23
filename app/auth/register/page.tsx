"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/Providers";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) {
      toast.error(j.error || "Алдаа гарлаа");
      return;
    }
    toast.success("Тавтай морилно уу!");
    await refresh();
    router.push("/account");
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", damping: 14 }}
            className="inline-block"
          >
            <Image
              src="/logo.png"
              alt="monshop"
              width={180}
              height={64}
              priority
              className="h-16 w-auto mx-auto object-contain"
            />
          </motion.div>
        </Link>

        <div className="bg-white rounded-3xl shadow-3d edge-highlight overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-brand-pink via-brand-rose to-brand-mauve" />
          <div className="p-8 lg:p-10">
            <h1 className="text-center font-semibold text-2xl mb-2">Манайхтай нэгдээрэй</h1>
            <p className="text-center text-sm text-ink-muted mb-7">
              Бүртгүүлснээр эхний захиалгад{" "}
              <span className="text-brand-pink font-semibold">15% хямдрал</span>
            </p>

            <form onSubmit={submit} className="space-y-4">
              <Field
                icon={User}
                label="Нэр"
                placeholder="Нэрээ оруулна уу"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Field
                icon={Mail}
                label="И-мэйл"
                type="email"
                placeholder="example@mail.com"
                required
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
              <Field
                icon={Phone}
                label="Утас"
                type="tel"
                placeholder="9911-2233"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Нууц үг</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" strokeWidth={1.8} />
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="6+ тэмдэгт"
                    className="w-full bg-bg-soft border border-line-subtle rounded-pill pl-11 pr-12 py-3.5 text-sm focus:border-brand-pink focus:bg-white outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-brand-pink transition"
                    aria-label="Toggle password"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-3d w-full rounded-pill py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
              >
                {loading ? "Бүртгэж байна..." : (
                  <>
                    Бүртгүүлэх <span>→</span>
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-ink-muted mt-6">
              Бүртгэлтэй юу?{" "}
              <Link href="/auth/login" className="font-semibold text-brand-pink hover:underline">
                Нэвтрэх
              </Link>
            </p>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-ink-subtle tracking-widest uppercase">эсвэл</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="/api/auth/google?next=/account"
                className="col-span-2 flex items-center justify-center gap-2.5 border border-line bg-white hover:bg-bg-soft rounded-pill py-3.5 text-sm font-medium transition"
              >
                <GoogleIcon /> Google-ээр бүртгүүлэх
              </a>
            </div>

            <p className="text-[11px] text-ink-muted text-center mt-6">
              Бүртгүүлснээр та{" "}
              <Link href="/terms" className="underline">үйлчилгээний нөхцөл</Link>-ийг хүлээн зөвшөөрнө.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  required,
  value,
  onChange,
}: {
  icon: any;
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
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" strokeWidth={1.8} />
        <input
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-bg-soft border border-line-subtle rounded-pill pl-11 pr-5 py-3.5 text-sm focus:border-brand-pink focus:bg-white outline-none transition"
        />
      </div>
    </div>
  );
}

function SocialBtn({ provider, icon }: { provider: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => toast("Тун удахгүй", { icon: "⚡" })}
      className="flex items-center justify-center gap-2 border border-line bg-white hover:bg-bg-soft rounded-pill py-3 text-sm font-medium transition"
    >
      {icon}
      {provider}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
