"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { TagInput } from "@/components/TagInput";

type Cat = { id: string; name: string };

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Cat[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: 0,
    badge: "",
    images: [""],
    variants: [{ color: "Black", colorHex: "#000000", size: "M", stock: 10 }],
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((j) => setCategories(j.categories ?? []))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...form,
      images: form.images.filter((i) => i.trim()),
      badge: form.badge || null,
      basePrice: Number(form.basePrice),
      categoryId: categoryId || null,
      tags,
    };
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) return toast.error(j.error || "Алдаа");
    toast.success("Бараа нэмэгдлээ");
    router.push("/admin/products");
  };

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-8">Шинэ бараа</h1>

      <div className="bg-white rounded-3xl border border-line p-6 lg:p-8 space-y-5 mb-6">
        <Field label="НЭР" required value={form.name} onChange={(v) => {
          setForm({
            ...form,
            name: v,
            slug: form.slug || v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          });
        }} />
        <Field label="SLUG (URL)" required value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
        <div>
          <Label>ТАЙЛБАР</Label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full bg-bg-secondary border border-line rounded-2xl px-5 py-3 text-sm focus:border-ink outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="ҮНЭ (₮)"
            type="number"
            required
            value={String(form.basePrice)}
            onChange={(v) => setForm({ ...form, basePrice: Number(v) })}
          />
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
        </div>
        <div>
          <Label>АНГИЛАЛ</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm"
          >
            <option value="">— Ангилалгүй —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>ТАГУУД</Label>
          <TagInput value={tags} onChange={setTags} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-line p-6 lg:p-8 mb-6">
        <div className="font-bold mb-1">Зургууд</div>
        <p className="text-xs text-ink-muted mb-4">Гар утас/компьютероос сонгож оруулна.</p>
        <ImageUploader value={form.images} onChange={(v) => setForm({ ...form, images: v })} />
      </div>

      <div className="bg-white rounded-3xl border border-line p-6 lg:p-8 space-y-3 mb-6">
        <div className="font-bold mb-2">Хувилбарууд</div>
        {form.variants.map((v, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input
              placeholder="Өнгө"
              value={v.color}
              onChange={(e) => {
                const next = [...form.variants];
                next[i] = { ...v, color: e.target.value };
                setForm({ ...form, variants: next });
              }}
              className="col-span-3 bg-bg-secondary border border-line rounded-pill px-4 py-2 text-sm"
            />
            <input
              type="color"
              value={v.colorHex}
              onChange={(e) => {
                const next = [...form.variants];
                next[i] = { ...v, colorHex: e.target.value };
                setForm({ ...form, variants: next });
              }}
              className="col-span-2 h-10 rounded-pill bg-bg-secondary border border-line"
            />
            <input
              placeholder="Хэмжээ"
              value={v.size}
              onChange={(e) => {
                const next = [...form.variants];
                next[i] = { ...v, size: e.target.value };
                setForm({ ...form, variants: next });
              }}
              className="col-span-3 bg-bg-secondary border border-line rounded-pill px-4 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) => {
                const next = [...form.variants];
                next[i] = { ...v, stock: Number(e.target.value) };
                setForm({ ...form, variants: next });
              }}
              className="col-span-3 bg-bg-secondary border border-line rounded-pill px-4 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) })}
              className="col-span-1 w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              variants: [...form.variants, { color: "", colorHex: "#000000", size: "", stock: 0 }],
            })
          }
          className="text-sm font-semibold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Хувилбар нэмэх
        </button>
      </div>

      <button
        disabled={loading}
        className="btn-3d text-white rounded-pill px-8 py-3.5 text-sm font-semibold tracking-wide disabled:opacity-50"
        style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
      >
        {loading ? "ХАДГАЛЖ БАЙНА..." : "ХАДГАЛАХ"}
      </button>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold tracking-widest mb-2 block">{children}</label>;
}
function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm focus:border-ink outline-none"
      />
    </div>
  );
}
