"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function UsersToolbar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const filter = sp.get("filter") ?? "";

  const apply = (next: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) v ? params.set(k, v) : params.delete(k);
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <form
        onSubmit={(e) => { e.preventDefault(); apply({ q }); }}
        className="flex items-center gap-2 bg-white border border-line rounded-pill px-4 py-2.5 flex-1 min-w-[200px]"
      >
        <Search className="w-4 h-4 text-ink-subtle" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Нэр, имэйлээр хайх..."
          className="flex-1 bg-transparent text-sm outline-none" />
      </form>

      <select value={filter} onChange={(e) => apply({ filter: e.target.value })}
        className="bg-white border border-line rounded-pill px-4 py-2.5 text-sm cursor-pointer">
        <option value="">Бүх хэрэглэгч</option>
        <option value="buyers">Захиалгатай</option>
        <option value="noorders">Захиалгагүй</option>
        <option value="admins">Админ</option>
      </select>
    </div>
  );
}
