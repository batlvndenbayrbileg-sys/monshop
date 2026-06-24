"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MapPin, Home, Briefcase, Check, X, Star } from "lucide-react";

export type Address = {
  id: string;
  label: string | null;
  name: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  zip: string | null;
  isDefault: boolean;
};

const LABELS = ["Гэр", "Ажил", "Бусад"];

function labelIcon(label: string | null) {
  if (label === "Ажил") return Briefcase;
  if (label === "Гэр") return Home;
  return MapPin;
}

const empty = {
  label: "Гэр",
  name: "",
  phone: "",
  city: "Улаанбаатар",
  district: "",
  street: "",
  zip: "",
};

export function AddressManager({ initial }: { initial: Address[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.district || !form.street) {
      return toast.error("Шаардлагатай талбаруудыг бөглөнө үү");
    }
    if (!/^\d{8}$/.test(form.phone)) {
      return toast.error("8 оронтой утасны дугаар оруулна уу");
    }
    setSaving(true);
    const r = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) return toast.error(j.error || "Алдаа гарлаа");
    toast.success("Хаяг нэмэгдлээ");
    setForm(empty);
    setOpen(false);
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Энэ хаягийг устгах уу?")) return;
    const r = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (!r.ok) return toast.error("Алдаа гарлаа");
    toast.success("Устгагдлаа");
    router.refresh();
  };

  const setDefault = async (id: string) => {
    const r = await fetch(`/api/addresses/${id}`, { method: "PATCH" });
    if (!r.ok) return toast.error("Алдаа гарлаа");
    toast.success("Үндсэн хаяг болголоо");
    router.refresh();
  };

  return (
    <div>
      {/* List */}
      <div className="space-y-3">
        {initial.length === 0 && !open && (
          <div className="bg-white border border-line rounded-3xl p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-bg-soft flex items-center justify-center">
              <MapPin className="w-7 h-7 text-brand-pink" strokeWidth={1.5} />
            </div>
            <p className="text-ink-muted text-sm">Хадгалсан хаяг алга. Доороос нэмнэ үү.</p>
          </div>
        )}

        {initial.map((a) => {
          const Icon = labelIcon(a.label);
          return (
            <div key={a.id} className="bg-white border border-line rounded-2xl p-4 flex gap-3">
              <span className="w-11 h-11 rounded-full bg-bg-soft flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-pink" strokeWidth={1.7} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">{a.label || "Хаяг"}</span>
                  {a.isDefault && (
                    <span className="inline-flex items-center gap-1 bg-brand-pink/10 text-brand-pink rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      <Star className="w-2.5 h-2.5 fill-brand-pink" /> Үндсэн
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium">{a.name} · {a.phone}</div>
                <div className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  {a.city}, {a.district}, {a.street}{a.zip ? ` · ${a.zip}` : ""}
                </div>
                <div className="flex items-center gap-3 mt-2.5">
                  {!a.isDefault && (
                    <button onClick={() => setDefault(a.id)} className="text-xs font-semibold text-brand-pink">
                      Үндсэн болгох
                    </button>
                  )}
                  <button onClick={() => remove(a.id)} className="text-xs font-semibold text-state-sale flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Устгах
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add button / form */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="mt-4 w-full border-2 border-dashed border-line rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-semibold text-ink-muted hover:border-brand-pink hover:text-brand-pink transition"
        >
          <Plus className="w-4 h-4" /> Шинэ хаяг нэмэх
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={add}
            className="mt-4 bg-white border border-line rounded-2xl p-5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Шинэ хаяг</h3>
              <button type="button" onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-bg-soft flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Label chips */}
            <div className="flex gap-2 mb-4">
              {LABELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setForm({ ...form, label: l })}
                  className={`rounded-pill px-4 py-1.5 text-xs font-semibold transition ${
                    form.label === l ? "bg-brand-pink text-white" : "bg-bg-soft text-ink-muted"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Inp label="Нэр" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Inp label="Утас" value={form.phone} onChange={(v) => setForm({ ...form, phone: v.replace(/\D/g, "").slice(0, 8) })} />
              <Inp label="Хот/аймаг" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Inp label="Дүүрэг/сум" value={form.district} onChange={(v) => setForm({ ...form, district: v })} />
              <div className="col-span-2">
                <Inp label="Дэлгэрэнгүй хаяг" value={form.street} onChange={(v) => setForm({ ...form, street: v })} />
              </div>
            </div>

            <button
              disabled={saving}
              className="mt-4 w-full btn-3d text-white rounded-pill py-3 text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            >
              <Check className="w-4 h-4" /> {saving ? "Хадгалж байна..." : "Хаяг хадгалах"}
            </button>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  );
}

function Inp({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] font-semibold tracking-wider uppercase text-ink-muted mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-soft border border-line rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-pink outline-none transition"
      />
    </div>
  );
}
