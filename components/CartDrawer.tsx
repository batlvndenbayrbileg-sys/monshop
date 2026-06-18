"use client";

import { useCart } from "@/lib/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatMNT } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, setQty, total } = useCart();
  const subtotal = total();
  const shipping = subtotal >= 100000 || subtotal === 0 ? 0 : 8000;
  const progress = Math.min(100, (subtotal / 100000) * 100);
  const remaining = Math.max(0, 100000 - subtotal);

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
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-bg-primary z-[70] flex flex-col"
          >
            <div className="px-8 py-6 border-b border-line-subtle flex items-center justify-between">
              <div>
                <div className="eyebrow text-ink-subtle mb-1">Сагс</div>
                <div className="font-serif text-2xl">{items.length} бараа</div>
              </div>
              <button onClick={close} className="p-2 hover:opacity-60 transition" aria-label="Close">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-8 py-4 border-b border-line-subtle bg-bg-secondary">
                {remaining > 0 ? (
                  <>
                    <div className="text-xs text-ink-muted mb-2">
                      <span className="font-semibold text-ink">{formatMNT(remaining)}</span> үлдээд үнэгүй хүргэлт
                    </div>
                    <div className="h-1 bg-line rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-brand-champagne"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-xs font-semibold text-brand-green flex items-center gap-2">
                    <span>✓</span> Үнэгүй хүргэлт идэвхтэй
                  </div>
                )}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <ShoppingBag className="w-12 h-12 text-ink-faint mb-2" strokeWidth={1} />
                  <div className="font-serif text-2xl">Сагс хоосон</div>
                  <div className="text-sm text-ink-muted mb-4 max-w-[260px]">
                    Дуртай бараагаа сагсалцаад үргэлжлүүл.
                  </div>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="bg-ink text-ink-inverse px-8 py-3.5 text-[11px] font-semibold tracking-ultra uppercase"
                  >
                    Дэлгүүр үзэх
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-5 pb-6 border-b border-line-subtle last:border-0"
                      >
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={close}
                          className="relative w-24 h-28 shrink-0 bg-bg-tertiary overflow-hidden"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={close}
                            className="font-serif text-lg leading-tight hover:underline"
                          >
                            {item.name}
                          </Link>
                          <div className="text-xs text-ink-muted mt-1 mb-auto">
                            {item.color} · Хэмжээ {item.size}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-line">
                              <button
                                onClick={() => setQty(item.variantId, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-line/40"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => setQty(item.variantId, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-line/40"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-sm font-medium">
                              {formatMNT(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-line-subtle space-y-3 bg-bg-primary">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Дэд дүн</span>
                  <span>{formatMNT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Хүргэлт</span>
                  <span>{shipping === 0 ? "Үнэгүй" : formatMNT(shipping)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-line-subtle">
                  <span className="eyebrow text-ink-subtle">Нийт</span>
                  <span className="font-serif text-3xl">{formatMNT(subtotal + shipping)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn-3d block text-white text-center rounded-pill py-4 text-xs font-semibold tracking-widest uppercase transition mt-4"
                  style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
                >
                  Захиалга үргэлжлүүлэх →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
