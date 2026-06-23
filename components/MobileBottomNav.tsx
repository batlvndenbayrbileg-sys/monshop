"use client";

import Link from "next/link";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { AnimatePresence, motion } from "framer-motion";

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.count());

  // Hide the global nav during the focused checkout funnel.
  if (pathname.startsWith("/checkout")) return null;

  const items = [
    { icon: Home, label: "Нүүр", href: "/" },
    { icon: LayoutGrid, label: "Ангилал", href: "/categories" },
    { icon: Heart, label: "Хүсэл", href: "/wishlist", badge: wishlistCount },
    { icon: ShoppingBag, label: "Сагс", onClick: openCart, badge: cartCount },
    { icon: User, label: "Профайл", href: "/account" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-line-subtle pb-safe">
      <div className="flex items-stretch justify-around px-2 pt-2 pb-1.5">
        {items.map((item, i) => {
          const active =
            item.href && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
          const Inner = (
            <div className="flex flex-col items-center gap-1 py-1 px-2 relative">
              <div className="relative">
                <item.icon
                  className={`w-[22px] h-[22px] transition ${
                    active ? "text-brand-pink" : "text-ink-subtle"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                  fill={active && item.icon === Heart ? "currentColor" : "none"}
                />
                <AnimatePresence>
                  {!!item.badge && item.badge > 0 && (
                    <motion.span
                      key={item.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 18, stiffness: 380 }}
                      className="absolute -top-1.5 -right-2 bg-brand-pink text-white text-[9px] min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center font-semibold font-sans"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`font-sans text-[10px] transition ${
                  active ? "text-brand-pink font-semibold" : "text-ink-subtle font-medium"
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          return item.href ? (
            <Link key={i} href={item.href} className="flex-1 flex items-center justify-center">
              {Inner}
            </Link>
          ) : (
            <button key={i} onClick={item.onClick} className="flex-1 flex items-center justify-center">
              {Inner}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
