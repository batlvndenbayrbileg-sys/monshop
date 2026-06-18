"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/Providers";

export function LogoutButton() {
  const router = useRouter();
  const { refresh } = useAuth();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        await refresh();
        router.push("/admin/login");
      }}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-pill text-sm font-medium hover:bg-white/10 transition"
    >
      <LogOut className="w-4 h-4" /> Гарах
    </button>
  );
}
