"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/Providers";

export default function AdminLogin() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("admin@monshop.mn");
  const [password, setPassword] = useState("");
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
    if (!r.ok) return toast.error(j.error || "Алдаа");
    if (j.user.role !== "ADMIN") return toast.error("Админ эрх байхгүй");
    await refresh();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold tracking-tight text-white mb-2">monshop</div>
          <div className="text-xs font-semibold tracking-widest text-white/60">АДМИН ПАНЕЛЬ</div>
        </div>
        <form onSubmit={submit} className="bg-white rounded-3xl p-8 space-y-4">
          <div>
            <label className="text-xs font-semibold tracking-widest mb-2 block">ИМЭЙЛ</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm focus:border-ink outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-widest mb-2 block">НУУЦ ҮГ</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm focus:border-ink outline-none"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-ink text-ink-inverse rounded-pill py-3.5 text-sm font-semibold tracking-wide disabled:opacity-50"
          >
            {loading ? "..." : "НЭВТРЭХ"}
          </button>
          <p className="text-xs text-ink-muted text-center pt-2">admin@monshop.mn / admin123</p>
        </form>
      </div>
    </div>
  );
}
