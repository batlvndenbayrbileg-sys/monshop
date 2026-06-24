"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/Providers";

export function LogoutRow() {
  const router = useRouter();
  const { refresh } = useAuth();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="btn-3d w-full flex items-center justify-center gap-2 rounded-pill py-3.5 text-sm font-semibold text-white transition"
      style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
    >
      <LogOut className="w-4 h-4" /> Гарах
    </button>
  );
}
