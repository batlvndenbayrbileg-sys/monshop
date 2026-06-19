"use client";

import { useWishlist } from "@/lib/wishlist-store";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingBag } from "lucide-react";
import { formatMNT } from "@/lib/utils";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const clear = useWishlist((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-12 py-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div>
          <div className="eyebrow text-brand-pink mb-2">— Миний хайр</div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Хүслийн жагсаалт
          </h1>
          <p className="text-ink-muted text-sm mt-2">
            {items.length === 0
              ? "Хүсэлтэй бараагаа энд хадгална уу"
              : `${items.length} бараа хадгалагдсан`}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => {
              clear();
              toast.success("Жагсаалт цэвэрлэгдлээ");
            }}
            className="text-sm font-semibold text-state-sale hover:underline"
          >
            Бүгдийг цэвэрлэх
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-line rounded-3xl p-12 lg:p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bg-blush flex items-center justify-center">
            <Heart className="w-10 h-10 text-brand-pink" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl mb-3">
            Хайртай юм одоохондоо алга
          </h2>
          <p className="text-ink-muted mb-8 max-w-md mx-auto">
            Дуртай бараагаа ♡ товчоор хадгалаад дараа нь хялбар олж аваарай.
          </p>
          <Link
            href="/shop"
            className="btn-3d inline-flex items-center gap-2 rounded-pill px-8 py-3.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
          >
            Худалдаа эхлэх →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl shadow-soft-pink edge-highlight overflow-hidden group"
              >
                <Link href={`/products/${item.slug}`} className="relative block aspect-square bg-bg-soft">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      remove(item.id);
                      toast.success("Хүслийн жагсаалтнаас хасагдлаа");
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-state-sale flex items-center justify-center shadow-md hover:bg-state-sale hover:text-white transition"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                </Link>
                <div className="p-4 lg:p-5">
                  {item.category && (
                    <div className="text-xs text-ink-muted mb-1">{item.category}</div>
                  )}
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-semibold text-sm mb-2 hover:text-brand-pink transition">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-semibold ${item.oldPrice ? "text-brand-pink" : ""}`}>
                        {formatMNT(item.price)}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs text-ink-subtle line-through">
                          {formatMNT(item.oldPrice)}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-9 h-9 rounded-full bg-bg-soft hover:bg-brand-pink hover:text-white flex items-center justify-center transition"
                      aria-label="View product"
                    >
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
