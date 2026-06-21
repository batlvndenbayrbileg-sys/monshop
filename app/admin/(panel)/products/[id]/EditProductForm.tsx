"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";

type Variant = { id?: string; size: string; price: number; stock: number; color?: string; colorHex?: string };

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
  const [images, setImages] = useState<string[]>(
    product.images?.length ? product.images.map((i: any) => i.url) : [""]
  );
  const [variants, setVariants] = useState<Variant[]>(
    product.variants?.length
      ? product.variants.map((v: any) => ({ id: v.id, size: v.size, price: v.price, stock: v.stock, color: v.color, colorHex: v.colorHex }))
      : [{ size: "", price: product.basePrice, stock: 0 }]
  );

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
        images: images.filter((u) => u.trim()),
        variants,
      }),
    });
    setLoading(false);
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return toast.error(j.error || "Алдаа гарлаа");
    }
    toast.success("Хадгалагдлаа");
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Энэ барааг устгахдаа итгэлтэй байна уу?")) return;
    const r = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (!r.ok) return toast.error("Алдаа");
    toast.success("Устгагдлаа");
    router.push("/admin/products");
  };

  const totalStock = variants.reduce((s, v) => s + (Number(v.stock) || 0), 0);

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-ink-muted font-mono text-sm mt-1">{product.slug}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-ink-muted">Нийт үлдэгдэл</div>
          <div className={`text-2xl font-bold ${totalStock < 20 ? "text-state-sale" : ""}`}>{totalStock}</div>
        </div>
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* Basic info */}
        <section className="bg-white rounded-3xl border border-line p-6 lg:p-8 space-y-5">
          <h2 className="font-bold">Үндсэн мэдээлэл</h2>
          <Field label="НЭР" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <Label>ТАЙЛБАР</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-bg-secondary border border-line rounded-2xl px-5 py-3 text-sm focus:border-ink outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="ҮНЭ (₮)" type="number" value={String(form.basePrice)} onChange={(v) => setForm({ ...form, basePrice: Number(v) })} />
            <Field label="ХУУЧИН ҮНЭ (СОНГОЛТЫН)" type="number" value={String(form.oldPrice)} onChange={(v) => setForm({ ...form, oldPrice: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>БЭЙДЖ</Label>
              <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm">
                <option value="">Байхгүй</option>
                <option value="ШИНЭ">ШИНЭ</option>
                <option value="ХЯМДРАЛ">ХЯМДРАЛ</option>
                <option value="ОНЦЛОХ">ОНЦЛОХ</option>
              </select>
            </div>
            <div>
              <Label>ТӨЛӨВ</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm">
                <option value="ACTIVE">Идэвхтэй</option>
                <option value="DRAFT">Ноорог</option>
                <option value="ARCHIVED">Хадгалсан</option>
              </select>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-3xl border border-line p-6 lg:p-8">
          <h2 className="font-bold mb-1">Зургууд</h2>
          <p className="text-xs text-ink-muted mb-4">Гар утас/компьютероос сонгож оруулна. Эхний зураг үндсэн болно.</p>
          <ImageUploader value={images} onChange={setImages} />
        </section>

        {/* Variants / inventory */}
        <section className="bg-white rounded-3xl border border-line p-6 lg:p-8">
          <h2 className="font-bold mb-1">Хувилбар & үлдэгдэл</h2>
          <p className="text-xs text-ink-muted mb-4">Хэмжээ, үнэ, агуулахын үлдэгдлийг энд удирдана.</p>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-ink-muted tracking-widest px-1">
              <span className="col-span-4">ХЭМЖЭЭ</span>
              <span className="col-span-4">ҮНЭ (₮)</span>
              <span className="col-span-3">ҮЛДЭГДЭЛ</span>
              <span className="col-span-1"></span>
            </div>
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input value={v.size} placeholder="50 мл"
                  onChange={(e) => { const n = [...variants]; n[i] = { ...v, size: e.target.value }; setVariants(n); }}
                  className="col-span-4 bg-bg-secondary border border-line rounded-pill px-4 py-2 text-sm" />
                <input type="number" value={v.price}
                  onChange={(e) => { const n = [...variants]; n[i] = { ...v, price: Number(e.target.value) }; setVariants(n); }}
                  className="col-span-4 bg-bg-secondary border border-line rounded-pill px-4 py-2 text-sm" />
                <input type="number" value={v.stock}
                  onChange={(e) => { const n = [...variants]; n[i] = { ...v, stock: Number(e.target.value) }; setVariants(n); }}
                  className={`col-span-3 border rounded-pill px-4 py-2 text-sm ${Number(v.stock) < 10 ? "bg-red-50 border-state-sale" : "bg-bg-secondary border-line"}`} />
                <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                  className="col-span-1 w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setVariants([...variants, { size: "", price: form.basePrice, stock: 0 }])}
            className="mt-4 text-sm font-semibold flex items-center gap-1 text-brand-pink">
            <Plus className="w-4 h-4" /> Хувилбар нэмэх
          </button>
        </section>

        {/* Actions */}
        <div className="flex gap-3 sticky bottom-4">
          <button disabled={loading}
            className="btn-3d flex-1 text-white rounded-pill px-6 py-3.5 text-sm font-semibold disabled:opacity-50"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}>
            {loading ? "Хадгалж байна..." : "Бүгдийг хадгалах"}
          </button>
          <button type="button" onClick={remove}
            className="border border-state-sale text-state-sale bg-white rounded-pill px-6 py-3.5 text-sm font-semibold">
            Устгах
          </button>
        </div>
      </form>
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
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm focus:border-ink outline-none" />
    </div>
  );
}
