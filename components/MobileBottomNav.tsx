"use client";

import Link from "next/link";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { motion, AnimatePresence } from "framer-motion";

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.count());

  const items = [
    { icon: Home, label: "Нүүр", href: "/" },
    { icon: Search, label: "Дэлгүүр", href: "/shop" },
    {
      icon: Heart,
      label: "Хүсэл",
      href: "/account/favorites",
      badge: wishlistCount,
    },
    {
      icon: ShoppingBag,
      label: "Сагс",
      onClick: openCart,
      badge: cartCount,
    },
    { icon: User, label: "Би", href: "/account" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="px-3 pt-2 pb-2">
        <div className="glass-pill rounded-3xl px-1 py-1.5 flex items-center justify-between shadow-float">
          {items.map((item, i) => {
            const active =
              item.href && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
            const Inner = (
              <div className="flex flex-col items-center gap-0.5 py-2 px-3 relative">
                <div className="relative">
                  <item.icon
                    className={`w-[20px] h-[20px] transition ${
                      active ? "text-brand-pink" : "text-ink"
                    }`}
                    strokeWidth={1.8}
                  />
                  <AnimatePresence>
                    {!!item.badge && item.badge > 0 && (
                      <motion.span
                        key={item.badge}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", damping: 18, stiffness: 380 }}
                        className="absolute -top-1.5 -right-2 bg-brand-pink text-white text-[9px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-semibold"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span
                  className={`text-[10px] font-medium transition ${
                    active ? "text-brand-pink" : "text-ink-muted"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-pink"
                  />
                )}
              </div>
            );

            return item.href ? (
              <Link key={i} href={item.href} className="flex-1 flex items-center justify-center">
                {Inner}
              </Link>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className="flex-1 flex items-center justify-center"
              >
                {Inner}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
