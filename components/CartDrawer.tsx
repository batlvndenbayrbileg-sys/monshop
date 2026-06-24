"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, Ticket, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatMNT } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, total, coupon, setCoupon } = useCart();
  const subtotal = total();
  const shipping = subtotal >= 100000 || subtotal === 0 ? 0 : 8000;
  const progress = Math.min(100, (subtotal / 100000) * 100);
  const remaining = Math.max(0, 100000 - subtotal);

  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  const grandTotal = Math.max(0, subtotal - discount) + shipping;

  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);

  // Re-validate an applied coupon whenever the cart value changes so the UI
  // never shows a discount that no longer qualifies.
  useEffect(() => {
    if (!coupon) return;
    let cancelled = false;
    fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon.code, subtotal }),
    })
      .then(async (r) => ({ ok: r.ok, j: await r.json().catch(() => ({})) }))
      .then(({ ok, j }) => {
        if (cancelled) return;
        if (!ok) setCoupon(null);
        else if (j.data?.discount !== coupon.discount) setCoupon({ code: coupon.code, discount: j.data.discount });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setApplying(true);
    const r = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim(), subtotal }),
    });
    const j = await r.json().catch(() => ({}));
    setApplying(false);
    if (!r.ok) return toast.error(j.error || "Купон хүчингүй");
    setCoupon({ code: j.data.code, discount: j.data.discount });
    setCode("");
    toast.success("Купон амжилттай хэрэглэгдлээ");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-bg-deepest/50 backdrop-blur-sm z-[60]"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-bg-soft z-[70] flex flex-col sm:rounded-l-[28px] overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-5 flex items-center justify-between bg-white">
              <div>
                <div className="font-serif text-2xl leading-none">Таны сагс</div>
                <div className="text-xs text-ink-muted mt-1">{items.length} төрлийн бараа</div>
              </div>
              <button
                onClick={close}
                className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center hover:bg-bg-blush transition"
                aria-label="Хаах"
              >
                <X className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-line-subtle">
                {remaining > 0 ? (
                  <>
                    <div className="text-xs text-ink-muted mb-2">
                      <span className="font-semibold text-ink">{formatMNT(remaining)}</span> нэмбэл үнэгүй хүргэлт 🚚
                    </div>
                    <div className="h-1.5 bg-bg-soft rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg,#f06292,#e91e63)" }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-xs font-semibold text-brand-green flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Үнэгүй хүргэлт идэвхтэй
                  </div>
                )}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-9 h-9 text-ink-faint" strokeWidth={1.2} />
                  </div>
                  <div className="font-serif text-2xl">Сагс хоосон байна</div>
                  <div className="text-sm text-ink-muted max-w-[260px]">Дуртай бараагаа сагсалцаад үргэлжлүүлээрэй.</div>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="btn-3d text-white rounded-pill px-7 py-3 text-sm font-semibold mt-2"
                    style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
                  >
                    Дэлгүүр үзэх
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative bg-white rounded-3xl p-3 flex gap-3 shadow-[0_4px_18px_-12px_rgba(233,30,99,0.3)]"
                      >
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={close}
                          className="relative w-[74px] h-[88px] shrink-0 bg-bg-soft rounded-2xl overflow-hidden"
                        >
                          <Image src={item.image} alt={item.name} fill sizes="74px" className="object-cover" />
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start gap-2">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={close}
                              className="font-serif text-[15px] leading-tight line-clamp-2 flex-1 hover:text-brand-pink transition"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => {
                                remove(item.variantId);
                                toast.success("Сагснаас хаслаа");
                              }}
                              className="w-7 h-7 rounded-full bg-bg-soft hover:bg-state-sale hover:text-white text-ink-subtle flex items-center justify-center shrink-0 transition"
                              aria-label="Устгах"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-ink-muted mt-0.5">
                            {item.color} · {item.size}
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center bg-bg-soft rounded-full p-0.5">
                              <button
                                onClick={() => setQty(item.variantId, item.quantity - 1)}
                                className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:text-brand-pink transition"
                                aria-label="Хасах"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => setQty(item.variantId, item.quantity + 1)}
                                className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:text-brand-pink transition"
                                aria-label="Нэмэх"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-sm font-semibold">{formatMNT(item.price * item.quantity)}</div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="bg-white border-t border-line-subtle px-5 sm:px-6 pt-4 pb-6 space-y-4 rounded-t-[28px]">
                {/* Coupon */}
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-2.5">
                    <div className="flex items-center gap-2 text-sm min-w-0">
                      <Ticket className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="font-mono font-semibold truncate">{coupon.code}</span>
                      <span className="text-green-700 shrink-0">−{formatMNT(discount)}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCoupon(null);
                        toast("Купон хасагдлаа");
                      }}
                      className="w-7 h-7 rounded-full hover:bg-green-100 flex items-center justify-center shrink-0"
                      aria-label="Купон хасах"
                    >
                      <X className="w-3.5 h-3.5 text-green-700" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={applyCoupon} className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-bg-soft rounded-pill px-4">
                      <Ticket className="w-4 h-4 text-ink-subtle shrink-0" />
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Купоны код"
                        className="flex-1 bg-transparent py-2.5 text-sm font-mono outline-none placeholder:font-sans placeholder:text-ink-subtle"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={applying || !code.trim()}
                      className="bg-brand-pink text-white rounded-pill px-5 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition"
                    >
                      {applying ? "..." : "Хэрэглэх"}
                    </button>
                  </form>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Дэд дүн</span>
                    <span className="font-medium">{formatMNT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Хүргэлт</span>
                    <span className="font-medium">{shipping === 0 ? "Үнэгүй" : formatMNT(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Хямдрал ({coupon?.code})</span>
                      <span className="font-medium">−{formatMNT(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-line-subtle">
                  <span className="font-semibold">Нийт</span>
                  <span className="font-serif text-3xl">{formatMNT(grandTotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn-3d flex items-center justify-center gap-2 text-white text-center rounded-pill py-4 text-sm font-semibold transition"
                  style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
                >
                  Захиалга үргэлжлүүлэх <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
