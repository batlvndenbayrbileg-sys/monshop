"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/components/Providers";
import { formatMNT } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const subtotal = total();
  const shipping = subtotal >= 100000 ? 0 : 8000;
  const grandTotal = subtotal + shipping;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    shippingName: "",
    shippingPhone: "",
    shippingCity: "Улаанбаатар",
    shippingDistrict: "",
    shippingStreet: "",
    shippingZip: "",
    notes: "",
    paymentMethod: "QPAY" as "QPAY" | "KHAN" | "TRANSFER" | "CASH",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        email: user.email,
        shippingName: user.name || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && !loading) router.push("/shop");
  }, [items.length, loading, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      }),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) {
      toast.error(j.error || "Захиалга үүсгэхэд алдаа гарлаа");
      return;
    }
    clear();
    router.push(`/checkout/success?order=${j.order.orderNumber}`);
  };

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-8">Төлбөр хийх</h1>
      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Contact */}
          <section className="bg-white rounded-3xl p-6 lg:p-8 border border-line">
            <h2 className="font-bold text-lg mb-5">1. Холбоо барих</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="ИМЭЙЛ" type="email" required value={form.email}
                onChange={(v) => setForm({ ...form, email: v })} />
              <Input label="УТАС" type="tel" required value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-white rounded-3xl p-6 lg:p-8 border border-line">
            <h2 className="font-bold text-lg mb-5">2. Хүргэлтийн хаяг</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="ХҮЛЭЭН АВАГЧИЙН НЭР" required value={form.shippingName}
                onChange={(v) => setForm({ ...form, shippingName: v })} />
              <Input label="УТАС" type="tel" required value={form.shippingPhone}
                onChange={(v) => setForm({ ...form, shippingPhone: v })} />
              <Input label="ХОТ/АЙМАГ" required value={form.shippingCity}
                onChange={(v) => setForm({ ...form, shippingCity: v })} />
              <Input label="ДҮҮРЭГ/СУМ" required value={form.shippingDistrict}
                onChange={(v) => setForm({ ...form, shippingDistrict: v })} />
              <div className="col-span-2">
                <Input label="ХАЯГ" required value={form.shippingStreet}
                  onChange={(v) => setForm({ ...form, shippingStreet: v })} />
              </div>
              <Input label="ЗИП КОД" value={form.shippingZip}
                onChange={(v) => setForm({ ...form, shippingZip: v })} />
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold tracking-widest mb-2 block">
                ТЭМДЭГЛЭЛ (СОНГОЛТЫН)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full bg-bg-secondary border border-line rounded-2xl px-5 py-3 text-sm focus:border-ink outline-none transition"
              />
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-3xl p-6 lg:p-8 border border-line">
            <h2 className="font-bold text-lg mb-5">3. Төлбөрийн хэрэгсэл</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { v: "QPAY", label: "QPay", desc: "QR код" },
                  { v: "KHAN", label: "Хаан банк", desc: "Дансаар" },
                  { v: "TRANSFER", label: "Шилжүүлэг", desc: "Гүйлгээ" },
                  { v: "CASH", label: "Бэлнээр", desc: "Хүргэлтэн дээр" },
                ] as const
              ).map((p) => (
                <button
                  type="button"
                  key={p.v}
                  onClick={() => setForm({ ...form, paymentMethod: p.v })}
                  className={`text-left p-4 rounded-2xl border-2 transition ${
                    form.paymentMethod === p.v ? "border-ink bg-bg-secondary" : "border-line hover:border-ink-muted"
                  }`}
                >
                  <div className="font-semibold text-sm">{p.label}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </section>
        </motion.div>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:sticky lg:top-28 lg:self-start bg-white rounded-3xl p-6 lg:p-8 border border-line h-fit"
        >
          <h2 className="font-bold text-lg mb-5">Захиалга</h2>
          <ul className="space-y-4 mb-5 max-h-72 overflow-y-auto pr-1">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-3">
                <div className="relative w-14 h-16 shrink-0 bg-bg-secondary rounded-lg overflow-hidden">
                  <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{i.name}</div>
                  <div className="text-xs text-ink-muted">
                    {i.color} · {i.size} · x{i.quantity}
                  </div>
                </div>
                <div className="text-sm font-semibold">{formatMNT(i.price * i.quantity)}</div>
              </li>
            ))}
          </ul>
          <div className="space-y-2 pb-4 border-b border-line text-sm">
            <Row label="Дэд дүн" value={formatMNT(subtotal)} />
            <Row label="Хүргэлт" value={shipping === 0 ? "Үнэгүй" : formatMNT(shipping)} />
          </div>
          <div className="flex justify-between items-baseline pt-4 mb-5">
            <span className="font-bold">Нийт</span>
            <span className="text-2xl font-bold">{formatMNT(grandTotal)}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full bg-ink text-ink-inverse rounded-pill py-4 text-sm font-semibold tracking-wide hover:bg-ink/85 transition disabled:opacity-50"
          >
            {loading ? "БОЛОВСРУУЛЖ БАЙНА..." : "ЗАХИАЛАХ"}
          </motion.button>
        </motion.aside>
      </form>
    </div>
  );
}

function Input({
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
      <label className="text-xs font-semibold tracking-widest mb-2 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm focus:border-ink outline-none transition"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
