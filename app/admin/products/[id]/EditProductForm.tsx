"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    oldPrice: product.oldPrice ?? "",
    badge: product.badge ?? "",
    status: product.status,
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        basePrice: Number(form.basePrice),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        badge: form.badge || null,
      }),
    });
    setLoading(false);
    if (!r.ok) return toast.error("Алдаа");
    toast.success("Хадгалагдлаа");
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    const r = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (!r.ok) return toast.error("Алдаа");
    toast.success("Устгагдлаа");
    router.push("/admin/products");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
      <p className="text-ink-muted font-mono text-sm mb-8">{product.slug}</p>

      <form onSubmit={save} className="bg-white rounded-3xl border border-line p-6 lg:p-8 space-y-5 mb-6">
        <Field label="НЭР" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <div>
          <Label>ТАЙЛБАР</Label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full bg-bg-secondary border border-line rounded-2xl px-5 py-3 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="ҮНЭ"
            type="number"
            value={String(form.basePrice)}
            onChange={(v) => setForm({ ...form, basePrice: Number(v) })}
          />
          <Field
            label="ХУУЧИН ҮНЭ (СОНГОЛТЫН)"
            type="number"
            value={String(form.oldPrice)}
            onChange={(v) => setForm({ ...form, oldPrice: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>БЭЙДЖ</Label>
            <select
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm"
            >
              <option value="">Байхгүй</option>
              <option value="ШИНЭ">ШИНЭ</option>
              <option value="ХЯМДРАЛ">ХЯМДРАЛ</option>
              <option value="ОНЦЛОХ">ОНЦЛОХ</option>
            </select>
          </div>
          <div>
            <Label>ТӨЛӨВ</Label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm"
            >
              <option value="ACTIVE">Идэвхтэй</option>
              <option value="DRAFT">Ноорог</option>
              <option value="ARCHIVED">Хадгалсан</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button disabled={loading} className="bg-ink text-ink-inverse rounded-pill px-6 py-3 text-sm font-semibold disabled:opacity-50">
            {loading ? "..." : "ХАДГАЛАХ"}
          </button>
          <button
            type="button"
            onClick={remove}
            className="border border-state-sale text-state-sale rounded-pill px-6 py-3 text-sm font-semibold"
          >
            УСТГАХ
          </button>
        </div>
      </form>

      <div className="bg-white rounded-3xl border border-line p-6">
        <h2 className="font-bold mb-3">Хувилбарууд</h2>
        <div className="space-y-2 text-sm">
          {product.variants.map((v: any) => (
            <div key={v.id} className="flex justify-between py-2 border-b border-line last:border-0">
              <span>{v.color} / {v.size} <span className="text-ink-muted font-mono">({v.sku})</span></span>
              <span>Үлд: <strong>{v.stock}</strong></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold tracking-widest mb-2 block">{children}</label>;
}
function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm"
      />
    </div>
  );
}
