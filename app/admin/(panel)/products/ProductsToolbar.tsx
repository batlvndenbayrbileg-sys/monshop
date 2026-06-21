"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Plus, FolderPlus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Cat = { name: string; slug: string; count: number };

export function ProductsToolbar({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const activeCat = sp.get("category") ?? "";

  const apply = (next: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) v ? params.set(k, v) : params.delete(k);
    router.push(`/admin/products?${params.toString()}`);
  };

  const addCategory = async () => {
    const name = prompt("Шинэ ангиллын нэр:");
    if (!name?.trim()) return;
    const r = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const j = await r.json();
    if (!r.ok) return toast.error(j.error || "Алдаа");
    toast.success("Ангилал нэмэгдлээ");
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <form
        onSubmit={(e) => { e.preventDefault(); apply({ q }); }}
        className="flex items-center gap-2 bg-white border border-line rounded-pill px-4 py-2.5 flex-1 min-w-[200px]"
      >
        <Search className="w-4 h-4 text-ink-subtle" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Бараа хайх..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </form>

      {/* Category filter */}
      <select
        value={activeCat}
        onChange={(e) => apply({ category: e.target.value })}
        className="bg-white border border-line rounded-pill px-4 py-2.5 text-sm cursor-pointer"
      >
        <option value="">Бүх ангилал</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name} ({c.count})</option>
        ))}
      </select>

      <button
        onClick={addCategory}
        className="bg-white border border-line hover:border-brand-pink rounded-pill px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5"
      >
        <FolderPlus className="w-4 h-4" /> Ангилал
      </button>

      <Link
        href="/admin/products/new"
        className="btn-3d text-white rounded-pill px-5 py-2.5 text-sm font-semibold flex items-center gap-1.5"
        style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
      >
        <Plus className="w-4 h-4" /> Шинэ бараа
      </Link>
    </div>
  );
}
