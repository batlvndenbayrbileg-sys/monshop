"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { formatMNT } from "@/lib/utils";
import { Tilt3D } from "./Tilt3D";
import { useWishlist } from "@/lib/wishlist-store";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category?: string | null;
  price: number;
  oldPrice?: number | null;
  image?: string;
  images?: string[];
  colors: { name: string; hex: string }[];
  badge?: string | null;
  rating?: number | null;
  reviewCount?: number;
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const toggle = useWishlist((s) => s.toggle);
  const liked = useWishlist((s) => s.has(product.id));
  const imgs = product.images?.length ? product.images : product.image ? [product.image] : [];
  const primary = imgs[0];
  const secondary = imgs[1] ?? imgs[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="product-card card-3d group"
    >
      <Tilt3D max={6} className="rounded-3xl">
        <Link href={`/products/${product.slug}`} className="block">
          {/* Image card with 3D depth */}
          <div className="relative aspect-square bg-card-pink rounded-3xl overflow-hidden mb-5 shadow-3d edge-highlight">
            {/* Badge */}
            {product.badge && (
              <div
                style={{ transform: "translateZ(40px)" }}
                className={`absolute top-4 left-4 z-20 text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md ${
                  product.badge === "ХЯМДРАЛ"
                    ? "bg-gradient-to-b from-rose-400 to-brand-pink text-white"
                    : product.badge === "ШИНЭ"
                      ? "bg-gradient-to-b from-zinc-700 to-ink text-white"
                      : "bg-white text-ink"
                }`}
              >
                {product.badge}
              </div>
            )}

            {/* Heart button - floats above */}
            <button
              onClick={(e) => {
                e.preventDefault();
                const added = toggle({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  category: product.category,
                  price: product.price,
                  oldPrice: product.oldPrice,
                  image: primary,
                });
                toast.success(added ? "Хүслийн жагсаалтанд нэмэгдлээ" : "Хүслийн жагсаалтнаас хасагдлаа");
              }}
              style={{ transform: "translateZ(50px)" }}
              className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition shadow-soft-pink ${
                liked ? "bg-brand-pink text-white" : "bg-white text-ink hover:bg-brand-blush"
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} strokeWidth={1.8} />
            </button>

            {primary && (
              <Image
                src={primary}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="product-image product-image-primary object-cover absolute inset-0"
              />
            )}
            {secondary && secondary !== primary && (
              <Image
                src={secondary}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="product-image product-image-secondary object-cover absolute inset-0"
              />
            )}
          </div>

          <div className="px-1" style={{ transform: "translateZ(20px)" }}>
            {product.category && (
              <div className="text-[11px] text-ink-muted mb-1">{product.category}</div>
            )}
            <h3 className="font-semibold text-sm mb-1.5 truncate">{product.name}</h3>

            {product.rating && (
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-brand-pink text-xs">★★★★★</span>
                <span className="text-xs text-ink-subtle">
                  ({product.reviewCount ?? product.rating.toFixed(1)})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-baseline gap-2">
                <span className={`font-semibold ${product.oldPrice ? "text-brand-pink" : ""}`}>
                  {formatMNT(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-ink-subtle line-through">
                    {formatMNT(product.oldPrice)}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toast.error("Хэмжээ сонгохоор нэг бүтээгдэхүүн рүү орно уу");
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-b from-bg-soft to-bg-blush hover:from-brand-pink hover:to-brand-pink hover:text-white flex items-center justify-center transition shadow-soft-pink"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </Link>
      </Tilt3D>
    </motion.div>
  );
}
