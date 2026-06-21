"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Download } from "lucide-react";

const STATUSES = [
  { v: "", l: "Бүх төлөв" },
  { v: "PENDING", l: "Хүлээгдэж буй" },
  { v: "PAID", l: "Төлсөн" },
  { v: "SHIPPED", l: "Илгээсэн" },
  { v: "DELIVERED", l: "Хүргэгдсэн" },
  { v: "CANCELLED", l: "Цуцалсан" },
];

export function OrdersToolbar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const status = sp.get("status") ?? "";

  const apply = (next: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) v ? params.set(k, v) : params.delete(k);
    router.push(`/admin/orders?${params.toString()}`);
  };

  const exportUrl = `/api/admin/orders/export?${sp.toString()}`;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <form
        onSubmit={(e) => { e.preventDefault(); apply({ q }); }}
        className="flex items-center gap-2 bg-white border border-line rounded-pill px-4 py-2.5 flex-1 min-w-[200px]"
      >
        <Search className="w-4 h-4 text-ink-subtle" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Дугаар, нэр, утсаар хайх..."
          className="flex-1 bg-transparent text-sm outline-none" />
      </form>

      <select value={status} onChange={(e) => apply({ status: e.target.value })}
        className="bg-white border border-line rounded-pill px-4 py-2.5 text-sm cursor-pointer">
        {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
      </select>

      <a href={exportUrl}
        className="bg-white border border-line hover:border-brand-green text-ink rounded-pill px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5">
        <Download className="w-4 h-4 text-brand-green" /> Excel татах
      </a>
    </div>
  );
}
