"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Ticket } from "lucide-react";
import { formatMNT } from "@/lib/utils";

type Coupon = {
  id: string;
  code: string;
  discount: number;
  minSubtotal: number;
  active: boolean;
};

export function CouponManager({ initial }: { initial: Coupon[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [minSubtotal, setMinSubtotal] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !Number(discount)) return toast.error("Код болон хямдрах дүн оруулна уу");
    setSaving(true);
    const r = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.trim(),
        discount: Number(discount),
        minSubtotal: Number(minSubtotal) || 0,
      }),
    });
    const j = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) return toast.error(j.error || "Алдаа гарлаа");
    toast.success("Купон нэмэгдлээ");
    setCode("");
    setDiscount("");
    setMinSubtotal("");
    router.refresh();
  };

  const toggle = async (c: Coupon) => {
    const r = await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    if (!r.ok) return toast.error("Алдаа гарлаа");
    router.refresh();
  };

  const remove = async (c: Coupon) => {
    if (!confirm(`"${c.code}" купоныг устгах уу?`)) return;
    const r = await fetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" });
    if (!r.ok) return toast.error("Алдаа гарлаа");
    toast.success("Устгагдлаа");
    router.refresh();
  };

  return (
    <div className="max-w-2xl">
      {/* Add form */}
      <form onSubmit={add} className="bg-white rounded-3xl border border-line p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold tracking-wider uppercase text-ink-muted mb-1.5 block">Код</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="GLOW10"
              className="w-full bg-bg-secondary border border-line rounded-pill px-4 py-2.5 text-sm font-mono focus:border-brand-pink outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold tracking-wider uppercase text-ink-muted mb-1.5 block">Хямдрах дүн (₮)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="10000"
              className="w-full bg-bg-secondary border border-line rounded-pill px-4 py-2.5 text-sm focus:border-brand-pink outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold tracking-wider uppercase text-ink-muted mb-1.5 block">Доод дүн (₮)</label>
            <input
              type="number"
              value={minSubtotal}
              onChange={(e) => setMinSubtotal(e.target.value)}
              placeholder="0"
              className="w-full bg-bg-secondary border border-line rounded-pill px-4 py-2.5 text-sm focus:border-brand-pink outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn-3d mt-4 text-white rounded-pill px-6 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
        >
          <Plus className="w-4 h-4" /> {saving ? "Нэмж байна..." : "Купон нэмэх"}
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-3xl border border-line divide-y divide-line-subtle overflow-hidden">
        {initial.length === 0 ? (
          <div className="p-10 text-center text-ink-muted text-sm">Купон байхгүй. Дээрээс нэмнэ үү.</div>
        ) : (
          initial.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4">
              <span className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center shrink-0">
                <Ticket className="w-[18px] h-[18px] text-brand-pink" strokeWidth={1.8} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono font-bold text-sm">{c.code}</div>
                <div className="text-[11px] text-ink-muted">
                  {formatMNT(c.discount)} хямдрал
                  {c.minSubtotal > 0 && ` · ${formatMNT(c.minSubtotal)}-аас дээш`}
                </div>
              </div>
              <button
                onClick={() => toggle(c)}
                className={`text-xs font-semibold rounded-full px-3 py-1 shrink-0 ${
                  c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {c.active ? "Идэвхтэй" : "Идэвхгүй"}
              </button>
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
