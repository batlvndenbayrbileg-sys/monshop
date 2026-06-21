"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, FolderOpen } from "lucide-react";

type Cat = { id: string; name: string; slug: string; count: number };

export function CategoryManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const r = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const j = await r.json();
    setAdding(false);
    if (!r.ok) return toast.error(j.error || "Алдаа");
    toast.success("Ангилал нэмэгдлээ");
    setName("");
    router.refresh();
  };

  const remove = async (c: Cat) => {
    if (!confirm(`"${c.name}" ангиллыг устгах уу?`)) return;
    const r = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return toast.error(j.error || "Алдаа");
    toast.success("Устгагдлаа");
    router.refresh();
  };

  return (
    <div className="max-w-2xl">
      {/* Add form — inline, no ugly prompt */}
      <form onSubmit={add} className="bg-white rounded-3xl border border-line p-5 mb-6 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Шинэ ангиллын нэр (жнь: Шампунь)"
          className="flex-1 bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm focus:border-brand-pink outline-none"
        />
        <button
          disabled={adding}
          className="btn-3d text-white rounded-pill px-6 py-3 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 shrink-0"
          style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
        >
          <Plus className="w-4 h-4" /> Нэмэх
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-3xl border border-line divide-y divide-line-subtle overflow-hidden">
        {initial.length === 0 ? (
          <div className="p-10 text-center text-ink-muted text-sm">Ангилал байхгүй. Дээрээс нэмнэ үү.</div>
        ) : (
          initial.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-soft transition">
              <span className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center shrink-0">
                <FolderOpen className="w-[18px] h-[18px] text-brand-pink" strokeWidth={1.8} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-[11px] text-ink-muted font-mono">{c.slug}</div>
              </div>
              <span className="text-xs text-ink-muted shrink-0">{c.count} бараа</span>
              <button
                onClick={() => remove(c)}
                className="w-9 h-9 rounded-full hover:bg-state-sale/10 text-ink-subtle hover:text-state-sale flex items-center justify-center transition shrink-0"
                aria-label="Устгах"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
