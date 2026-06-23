"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/lib/cart-store";
import { useAuth } from "@/components/Providers";
import { formatMNT } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  User as UserIcon,
  MapPin,
  ShoppingBag,
  ChevronDown,
  AlertCircle,
  Loader2,
  Truck,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

type Form = {
  email: string;
  phone: string;
  shippingName: string;
  shippingPhone: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingStreet: string;
  notes: string;
};

const phoneRe = /^\d{8}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (!f.email.trim()) e.email = "Имэйл хаягаа оруулна уу";
  else if (!emailRe.test(f.email.trim())) e.email = "Имэйл хаяг буруу байна";

  if (!f.phone.trim()) e.phone = "Утасны дугаараа оруулна уу";
  else if (!phoneRe.test(f.phone.trim())) e.phone = "8 оронтой дугаар оруулна уу";

  if (!f.shippingName.trim()) e.shippingName = "Хүлээн авагчийн нэрээ оруулна уу";

  if (!f.shippingPhone.trim()) e.shippingPhone = "Утасны дугаар оруулна уу";
  else if (!phoneRe.test(f.shippingPhone.trim())) e.shippingPhone = "8 оронтой дугаар оруулна уу";

  if (!f.shippingCity.trim()) e.shippingCity = "Хот / аймгаа оруулна уу";
  if (!f.shippingDistrict.trim()) e.shippingDistrict = "Дүүрэг / сумаа оруулна уу";
  if (!f.shippingStreet.trim()) e.shippingStreet = "Дэлгэрэнгүй хаягаа оруулна уу";
  return e;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const { user } = useAuth();

  const subtotal = total();
  const shipping = subtotal >= 100000 ? 0 : 8000;
  const grandTotal = subtotal + shipping;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const freeShipGap = Math.max(0, 100000 - subtotal);

  const [form, setForm] = useState<Form>({
    email: "",
    phone: "",
    shippingName: "",
    shippingPhone: "",
    shippingCity: "Улаанбаатар",
    shippingDistrict: "",
    shippingStreet: "",
    notes: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const errors = useMemo(() => validate(form), [form]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, email: f.email || user.email, shippingName: f.shippingName || user.name || "" }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && !loading) router.replace("/shop");
  }, [items.length, loading, router]);

  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const blur = (k: keyof Form) => () => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k: keyof Form) => (touched[k] ? errors[k] : undefined);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setTouched({
        email: true,
        phone: true,
        shippingName: true,
        shippingPhone: true,
        shippingCity: true,
        shippingDistrict: true,
        shippingStreet: true,
      });
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      toast.error("Талбаруудыг зөв бөглөнө үү");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: "QPAY",
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        setLoading(false);
        toast.error(j.error || "Захиалга үүсгэхэд алдаа гарлаа");
        return;
      }

      const order = j.order;
      const pr = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const pj = await pr.json();
      if (!pr.ok) {
        setLoading(false);
        toast.error(pj.error || "Төлбөрийн системд холбогдоход алдаа гарлаа");
        return;
      }

      clear();
      if (pj.data?.checkoutUrl) {
        window.location.href = pj.data.checkoutUrl; // → pay.wire.mn
        return;
      }
      router.push(`/checkout/success?order=${order.orderNumber}&orderId=${order.id}&pay=1`);
    } catch {
      setLoading(false);
      toast.error("Сүлжээний алдаа. Дахин оролдоно уу.");
    }
  };

  if (items.length === 0) return <div className="min-h-[60vh]" />;

  return (
    <form onSubmit={submit} className="bg-bg-soft min-h-screen">
      {/* Redirect overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
            <p className="text-sm font-medium text-ink">Төлбөрийн хуудас руу шилжиж байна…</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 lg:px-12 py-5 lg:py-10 pb-32 lg:pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 lg:mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center shrink-0 hover:bg-bg-soft transition"
              aria-label="Буцах"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-serif text-2xl lg:text-4xl tracking-tight">Төлбөр хийх</h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-ink-muted">
            <Lock className="w-3.5 h-3.5 text-brand-green" /> Аюулгүй төлбөр
          </div>
        </div>

        {/* Stepper */}
        <Stepper />

        {/* Mobile collapsible order summary */}
        <div className="lg:hidden mb-5">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            className="w-full bg-white rounded-2xl border border-line px-4 py-3.5 flex items-center justify-between"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingBag className="w-4 h-4 text-brand-pink" />
              Захиалга ({itemCount})
              <ChevronDown
                className={`w-4 h-4 text-ink-muted transition-transform ${summaryOpen ? "rotate-180" : ""}`}
              />
            </span>
            <span className="font-bold">{formatMNT(grandTotal)}</span>
          </button>
          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl border border-line mt-2 p-4">
                  <ItemList items={items} />
                  <Totals subtotal={subtotal} shipping={shipping} grandTotal={grandTotal} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT — form */}
          <div className="lg:col-span-2 space-y-5 lg:space-y-6">
            {/* Contact */}
            <Card icon={<UserIcon className="w-4 h-4" />} step={1} title="Холбоо барих мэдээлэл">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field
                  label="Имэйл" name="email" type="email" inputMode="email" autoComplete="email"
                  placeholder="name@email.com"
                  value={form.email} onChange={set("email")} onBlur={blur("email")} error={err("email")}
                />
                <Field
                  label="Утас" name="phone" type="tel" inputMode="numeric" maxLength={8} autoComplete="tel"
                  placeholder="99112233" digitsOnly
                  value={form.phone} onChange={set("phone")} onBlur={blur("phone")} error={err("phone")}
                />
              </div>
            </Card>

            {/* Shipping */}
            <Card icon={<MapPin className="w-4 h-4" />} step={2} title="Хүргэлтийн хаяг">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field
                  label="Хүлээн авагчийн нэр" name="shippingName" autoComplete="name"
                  placeholder="Овог нэр"
                  value={form.shippingName} onChange={set("shippingName")} onBlur={blur("shippingName")} error={err("shippingName")}
                />
                <Field
                  label="Утас" name="shippingPhone" type="tel" inputMode="numeric" maxLength={8} digitsOnly
                  placeholder="99112233"
                  value={form.shippingPhone} onChange={set("shippingPhone")} onBlur={blur("shippingPhone")} error={err("shippingPhone")}
                />
                <Field
                  label="Хот / аймаг" name="shippingCity"
                  value={form.shippingCity} onChange={set("shippingCity")} onBlur={blur("shippingCity")} error={err("shippingCity")}
                />
                <Field
                  label="Дүүрэг / сум" name="shippingDistrict"
                  placeholder="ж: Сүхбаатар"
                  value={form.shippingDistrict} onChange={set("shippingDistrict")} onBlur={blur("shippingDistrict")} error={err("shippingDistrict")}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Дэлгэрэнгүй хаяг" name="shippingStreet"
                    placeholder="Хороо, гудамж, байр, тоот"
                    value={form.shippingStreet} onChange={set("shippingStreet")} onBlur={blur("shippingStreet")} error={err("shippingStreet")}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-ink-muted mb-1.5">
                    Нэмэлт тэмдэглэл (сонголтоор)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => set("notes")(e.target.value)}
                    rows={2}
                    placeholder="Хүргэлтийн талаар тусгай хүсэлт…"
                    className="w-full bg-white border border-line rounded-2xl px-4 py-3 text-[15px] focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/10 outline-none transition resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Payment method (informational) */}
            <Card icon={<ShieldCheck className="w-4 h-4" />} step={3} title="Төлбөрийн хэлбэр">
              <div className="rounded-2xl border-2 border-brand-pink bg-soft-pink p-4 flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm font-bold text-brand-pink text-sm">
                  QPay
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    QPay-ээр төлөх
                    <CheckCircle2 className="w-4 h-4 text-brand-green" />
                  </div>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Захиалга баталгаажуулсны дараа QR код үүснэ. Бүх банкны аппликейшнаар
                    (Хаан, Голомт, ХХБ, TDB, Төрийн банк г.м) уншуулан төлнө.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT — desktop summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-white rounded-3xl border border-line p-6">
              <h2 className="font-semibold text-lg mb-4">Захиалгын дүн</h2>
              <ItemList items={items} />
              <Totals subtotal={subtotal} shipping={shipping} grandTotal={grandTotal} />

              {freeShipGap > 0 && (
                <div className="mt-4 text-xs text-ink-muted bg-soft-pink rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                  Дахин {formatMNT(freeShipGap)} нэмбэл хүргэлт үнэгүй
                </div>
              )}

              <PayButton loading={loading} total={grandTotal} className="mt-5" />
              <TrustRow />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky pay bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-line px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
        {freeShipGap > 0 && (
          <div className="text-[11px] text-ink-muted mb-2 flex items-center justify-center gap-1.5">
            <Truck className="w-3 h-3 text-brand-pink" />
            Дахин {formatMNT(freeShipGap)} → хүргэлт үнэгүй
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <div className="text-[10px] text-ink-muted uppercase tracking-wider">Нийт</div>
            <div className="text-lg font-bold leading-tight">{formatMNT(grandTotal)}</div>
          </div>
          <PayButton loading={loading} total={grandTotal} className="flex-1" compact />
        </div>
      </div>
    </form>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Stepper() {
  const steps = ["Мэдээлэл", "Төлбөр", "Баталгаажуулалт"];
  return (
    <div className="flex items-center gap-2 mb-6 lg:mb-8 text-[11px] lg:text-xs">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 font-medium ${
              i === 0 ? "text-brand-pink" : "text-ink-subtle"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === 0 ? "bg-brand-pink text-white" : "bg-line-subtle text-ink-subtle"
              }`}
            >
              {i + 1}
            </span>
            {s}
          </span>
          {i < steps.length - 1 && <span className="w-4 lg:w-8 h-px bg-line" />}
        </div>
      ))}
    </div>
  );
}

function Card({
  icon,
  step,
  title,
  children,
}: {
  icon: React.ReactNode;
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: step * 0.06 }}
      className="bg-white rounded-3xl border border-line p-5 lg:p-7"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-8 h-8 rounded-full bg-soft-pink text-brand-pink flex items-center justify-center shrink-0">
          {icon}
        </span>
        <h2 className="font-semibold text-base lg:text-lg">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  placeholder,
  inputMode,
  autoComplete,
  maxLength,
  digitsOnly,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "email" | "numeric" | "tel";
  autoComplete?: string;
  maxLength?: number;
  digitsOnly?: boolean;
}) {
  const invalid = !!error;
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-wider uppercase text-ink-muted mb-1.5">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onChange={(e) => onChange(digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value)}
        onBlur={onBlur}
        className={`w-full bg-white rounded-2xl px-4 py-3.5 text-[15px] outline-none transition border ${
          invalid
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-line focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/10"
        }`}
      />
      <AnimatePresence>
        {invalid && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1 overflow-hidden"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ItemList({ items }: { items: CartItem[] }) {
  return (
    <ul className="space-y-3.5 mb-4 max-h-[40vh] lg:max-h-72 overflow-y-auto pr-1">
      {items.map((i) => (
        <li key={i.variantId} className="flex gap-3 items-center">
          <div className="relative w-14 h-16 shrink-0 bg-line-subtle rounded-xl overflow-hidden">
            <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-white text-[10px] font-bold flex items-center justify-center">
              {i.quantity}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{i.name}</div>
            <div className="text-xs text-ink-muted">
              {i.color} · {i.size}
            </div>
          </div>
          <div className="text-sm font-semibold whitespace-nowrap">{formatMNT(i.price * i.quantity)}</div>
        </li>
      ))}
    </ul>
  );
}

function Totals({
  subtotal,
  shipping,
  grandTotal,
}: {
  subtotal: number;
  shipping: number;
  grandTotal: number;
}) {
  return (
    <>
      <div className="space-y-2 pt-4 border-t border-line text-sm">
        <div className="flex justify-between">
          <span className="text-ink-muted">Дэд дүн</span>
          <span className="font-medium">{formatMNT(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">Хүргэлт</span>
          <span className="font-medium">{shipping === 0 ? "Үнэгүй" : formatMNT(shipping)}</span>
        </div>
      </div>
      <div className="flex justify-between items-baseline pt-3 mt-3 border-t border-line">
        <span className="font-semibold">Нийт</span>
        <span className="text-xl font-bold">{formatMNT(grandTotal)}</span>
      </div>
    </>
  );
}

function PayButton({
  loading,
  total,
  className = "",
  compact,
}: {
  loading: boolean;
  total: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`btn-3d text-white rounded-pill py-3.5 px-5 text-sm font-semibold tracking-wide transition disabled:opacity-60 flex items-center justify-center gap-2 ${className}`}
      style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Боловсруулж байна…
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          {compact ? "Төлөх" : `Төлбөр төлөх · ${formatMNT(total)}`}
        </>
      )}
    </button>
  );
}

function TrustRow() {
  return (
    <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-ink-muted">
      <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
      256-bit шифрлэгдсэн · QPay-ээр аюулгүй төлбөр
    </div>
  );
}
