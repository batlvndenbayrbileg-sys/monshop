"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { formatMNT } from "@/lib/utils";
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
  // first variant label (e.g. "30 мл") for the subtle subtitle
  const volume = product.colors?.[0]?.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="product-card group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-bg-soft rounded-[20px] overflow-hidden">
          {product.badge && (
            <div
              className={`absolute top-3 left-3 z-10 text-[10px] font-sans font-semibold tracking-wide px-2.5 py-1 rounded-full ${
                product.badge === "ХЯМДРАЛ"
                  ? "bg-brand-pink text-white"
                  : product.badge === "ШИНЭ"
                    ? "bg-ink text-white"
                    : "bg-white text-ink"
              }`}
            >
              {product.badge}
            </div>
          )}

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
              toast.success(added ? "Хүслийн жагсаалтанд нэмэгдлээ" : "Хасагдлаа");
            }}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm backdrop-blur ${
              liked ? "bg-brand-pink text-white" : "bg-white/85 text-ink hover:bg-white"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-[15px] h-[15px] ${liked ? "fill-current" : ""}`} strokeWidth={1.8} />
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

        {/* Name + price (clean, app-like) */}
        <div className="pt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-[15px] leading-snug line-clamp-2">{product.name}</h3>
            {volume && (
              <div className="font-sans text-[11px] text-ink-subtle mt-0.5">{volume}</div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className={`font-sans font-semibold text-[15px] ${product.oldPrice ? "text-brand-pink" : ""}`}>
              {formatMNT(product.price)}
            </div>
            {product.oldPrice && (
              <div className="font-sans text-[11px] text-ink-subtle line-through">
                {formatMNT(product.oldPrice)}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
