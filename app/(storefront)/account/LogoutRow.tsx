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
      className="w-full flex items-center justify-center gap-2 bg-white border border-line-subtle rounded-pill py-3.5 text-sm font-semibold text-state-sale hover:bg-bg-soft transition"
    >
      <LogOut className="w-4 h-4" /> Гарах
    </button>
  );
}
