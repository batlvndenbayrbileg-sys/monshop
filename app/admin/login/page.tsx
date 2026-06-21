"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/Providers";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("admin@monshop.mn");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) return toast.error(j.error || "Алдаа гарлаа");
    if (j.user.role !== "ADMIN") return toast.error("Танд админ эрх байхгүй байна");
    await refresh();
    toast.success("Тавтай морил!");
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full bg-bg-deepest flex items-center justify-center px-5 relative overflow-hidden">
      {/* subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-brand-pink/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-rose to-brand-pink mb-4 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div className="font-serif text-3xl text-white tracking-tight">monshop</div>
          <div className="text-[11px] font-semibold tracking-[0.3em] text-white/40 mt-1">АДМИН ПАНЕЛЬ</div>
        </div>

        {/* Card */}
        <form onSubmit={submit} className="bg-white rounded-3xl p-7 lg:p-8 shadow-2xl">
          <h1 className="font-serif text-2xl mb-1">Нэвтрэх</h1>
          <p className="text-sm text-ink-muted mb-7">Удирдлагын самбарт нэвтэрнэ үү</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold tracking-widest mb-2 block">ИМЭЙЛ</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" strokeWidth={1.8} />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-soft border border-line-subtle rounded-pill pl-11 pr-5 py-3.5 text-sm focus:border-brand-pink focus:bg-white outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold tracking-widest mb-2 block">НУУЦ ҮГ</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" strokeWidth={1.8} />
                <input
                  type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-soft border border-line-subtle rounded-pill pl-11 pr-12 py-3.5 text-sm focus:border-brand-pink focus:bg-white outline-none transition"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-brand-pink transition">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="btn-3d w-full text-white rounded-pill py-3.5 text-sm font-semibold tracking-wide disabled:opacity-50 mt-2"
              style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            >
              {loading ? "Нэвтэрч байна..." : "НЭВТРЭХ"}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-line text-center">
            <div className="text-[11px] text-ink-subtle">Туршилт: admin@monshop.mn / admin123</div>
          </div>
        </form>
      </div>
    </div>
  );
}
