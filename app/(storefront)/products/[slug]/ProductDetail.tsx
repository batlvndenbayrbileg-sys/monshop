"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Heart, Truck, RotateCcw, Leaf } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/lib/cart-store";
import { formatMNT } from "@/lib/utils";

type Variant = { id: string; color: string; colorHex: string; size: string; stock: number; price: number };
type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  badge?: string | null;
  rating?: number | null;
  reviewCount?: number;
  category?: string | null;
  tags?: string[];
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  variants: Variant[];
};

export function ProductDetail({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [imageIdx, setImageIdx] = useState(0);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const sizeRef = useRef<HTMLDivElement>(null);

  const selectedVariant = product.variants.find(
    (v) => v.color === color.name && v.size === size
  );
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;
  const displayPrice = selectedVariant?.price ?? product.price;

  // Auto-select size when only one is in stock for the chosen colour.
  useEffect(() => {
    const inStockSizes = product.sizes.filter((s) =>
      product.variants.some((v) => v.color === color.name && v.size === s && v.stock > 0)
    );
    if (inStockSizes.length === 1) setSize(inStockSizes[0]);
  }, [color, product.sizes, product.variants]);

  const focusSize = () => {
    sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const addToCart = () => {
    if (!size) {
      focusSize();
      return toast.error("Хэмжээ сонгоно уу");
    }
    if (!selectedVariant || selectedVariant.stock <= 0) return toast.error("Үлдэгдэл байхгүй");
    add({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      name: product.name,
      color: color.name,
      colorHex: color.hex,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: product.images[0],
      quantity: 1,
    });
    toast.success("Сагсанд нэмэгдлээ");
    openCart();
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-20 pb-24 lg:pb-20">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-20">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] bg-bg-tertiary overflow-hidden mb-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={imageIdx}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[imageIdx]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            {product.badge && (
              <div className="absolute top-5 left-5 bg-bg-primary px-3 py-1.5 text-[10px] font-semibold tracking-ultra uppercase">
                {product.badge}
              </div>
            )}
            <div className="absolute top-5 right-5 font-serif text-sm text-white mix-blend-difference">
              {String(imageIdx + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`relative aspect-square overflow-hidden transition ${
                    imageIdx === i ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          {product.category && (
            <div className="eyebrow text-brand-champagne mb-4">{product.category}</div>
          )}
          <h1 className="font-serif text-4xl lg:text-6xl tracking-tight leading-[0.95] mb-5">
            {product.name}
          </h1>
          {product.rating && (
            <div className="text-sm text-ink-muted mb-6 tracking-wide">
              ★ {product.rating.toFixed(1)}{" "}
              {product.reviewCount && <span>· {product.reviewCount} сэтгэгдэл</span>}
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-10 pb-10 border-b border-line">
            <span className={`font-serif text-3xl ${product.oldPrice ? "text-state-sale" : ""}`}>
              {formatMNT(displayPrice)}
            </span>
            {product.oldPrice && (
              <span className="text-base text-ink-subtle line-through">
                {formatMNT(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-ink-muted leading-relaxed mb-8">{product.description}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {product.tags.map((t) => (
                <Link
                  key={t}
                  href={`/shop?tag=${encodeURIComponent(t)}`}
                  className="text-xs font-medium border border-line rounded-pill px-3.5 py-1.5 hover:border-brand-pink hover:text-brand-pink transition"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}

          {/* Color */}
          <div className="mb-8">
            <div className="flex justify-between items-baseline mb-4">
              <span className="eyebrow text-ink">Өнгө</span>
              <span className="text-sm text-ink-muted">{color.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c)}
                  title={c.name}
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    color.hex === c.hex ? "border-ink scale-[1.08]" : "border-line hover:border-ink-muted"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-10 scroll-mt-28" ref={sizeRef}>
            <div className="flex justify-between items-baseline mb-4">
              <span className="eyebrow text-ink">Хэмжээ</span>
              <button className="text-xs text-ink-muted link-underline">Хэмжээний заавар</button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((s) => {
                const variant = product.variants.find(
                  (v) => v.color === color.name && v.size === s
                );
                const available = variant && variant.stock > 0;
                return (
                  <button
                    key={s}
                    disabled={!available}
                    onClick={() => setSize(s)}
                    className={`py-3 border text-sm transition ${
                      size === s
                        ? "border-ink bg-ink text-ink-inverse"
                        : available
                          ? "border-line hover:border-ink"
                          : "border-line-subtle bg-bg-secondary text-ink-faint line-through cursor-not-allowed"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA - desktop only */}
          <div className="hidden lg:flex gap-3 mb-10">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={addToCart}
              disabled={!size || !inStock}
              className="btn-3d flex-1 rounded-pill py-4 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
              {size ? (inStock ? "Сагсанд нэмэх" : "Дууссан") : "Хэмжээ сонго"}
            </motion.button>
            <button className="w-14 border border-line rounded-pill flex items-center justify-center hover:bg-bg-soft transition">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Perks */}
          <div className="space-y-4 pt-8 border-t border-line">
            {[
              { icon: Truck, title: "Үнэгүй хүргэлт", desc: "100,000₮+ захиалгад" },
              { icon: RotateCcw, title: "30 хоног буцаалт", desc: "Асуултгүй" },
              { icon: Leaf, title: "Карбон саармаг", desc: "CO₂ ул мөр 7.1 кг" },
            ].map((p) => (
              <div key={p.title} className="flex items-center gap-4 text-sm">
                <p.icon className="w-4 h-4 text-brand-green shrink-0" strokeWidth={1.3} />
                <span>{p.title}</span>
                <span className="text-ink-muted">— {p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom CTA bar */}
      <div className="lg:hidden fixed bottom-[88px] left-0 right-0 z-40 px-3 pb-safe">
        <div className="glass-pill rounded-3xl px-3 py-3 flex items-center gap-3 shadow-float">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-ink-muted truncate">{product.name}</div>
            <div className="font-semibold text-base">
              {formatMNT(displayPrice)}
              {size && (
                <span className="text-xs text-ink-muted ml-2">· {color.name}/{size}</span>
              )}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={size ? addToCart : focusSize}
            disabled={!!size && !inStock}
            className="btn-3d rounded-pill px-6 py-3 text-xs font-semibold text-white flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
          >
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.8} />
            {size ? (inStock ? "Сагсанд нэмэх" : "Дууссан") : "Хэмжээ сонгох"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
