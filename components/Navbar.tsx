"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, LogOut, Sparkles, Heart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useAuth } from "./Providers";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const LINKS = [
  { label: "Нүүр", href: "/" },
  { label: "Дэлгүүр", href: "/shop" },
  { label: "Ангилал", href: "/categories" },
  { label: "Бидний тухай", href: "/story" },
  { label: "Холбоо барих", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.count());
  const { user, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Wrapper allows floating-pill animation */}
      <motion.div
        animate={{
          paddingTop: scrolled ? 14 : 0,
          paddingLeft: scrolled ? 16 : 0,
          paddingRight: scrolled ? 16 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <motion.nav
          animate={{
            borderRadius: scrolled ? 36 : 0,
            maxWidth: scrolled ? 1280 : 9999,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`relative mx-auto overflow-visible transition-colors duration-500 ${
            scrolled ? "glass-pill shimmer" : "bg-white/85 backdrop-blur-md border-b border-line-subtle"
          }`}
        >
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16 lg:h-[72px]">
            {/* Left: menu (mobile) + logo */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden glass-orb w-10 h-10 rounded-full flex items-center justify-center"
                aria-label="Menu"
              >
                <Menu className="w-4 h-4" strokeWidth={1.8} />
              </button>
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="monshop" width={160} height={48} priority className="h-9 lg:h-11 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`relative inline-flex items-center px-4 py-2 rounded-pill text-sm font-medium transition ${
                        active
                          ? "text-white"
                          : "text-ink hover:text-brand-pink"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-pill bg-gradient-to-br from-brand-rose to-brand-pink shadow-soft-pink"
                          transition={{ type: "spring", damping: 22, stiffness: 320 }}
                        />
                      )}
                      <span className="relative z-10">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
              <Link
                href="/shop"
                className="glass-orb w-10 h-10 rounded-full flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="w-[16px] h-[16px]" strokeWidth={1.8} />
              </Link>

              <Link
                href="/wishlist"
                className="glass-orb w-10 h-10 rounded-full flex items-center justify-center relative"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-[16px] h-[16px] ${wishlistCount > 0 ? "fill-brand-pink text-brand-pink" : ""}`}
                  strokeWidth={1.8}
                />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 18, stiffness: 380 }}
                      className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-semibold shadow-md"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <div className="relative">
                <button
                  onClick={() => (user ? setUserMenuOpen(!userMenuOpen) : router.push("/auth/login"))}
                  className="hidden sm:flex glass-orb w-10 h-10 rounded-full items-center justify-center"
                  aria-label="Account"
                >
                  <User className="w-[16px] h-[16px]" strokeWidth={1.8} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full mt-3 w-72 liquid-glass rounded-3xl py-2 overflow-hidden"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-5 py-3 mb-1 relative">
                        <div className="font-serif text-lg truncate">{user.name || "Хэрэглэгч"}</div>
                        <div className="text-xs text-ink-muted truncate mt-0.5">{user.email}</div>
                        <div className="absolute left-5 right-5 bottom-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
                      </div>
                      {[
                        { href: "/account", label: "Миний хуудас" },
                        { href: "/account/orders", label: "Захиалга" },
                        { href: "/wishlist", label: "Хүслийн жагсаалт" },
                        { href: "/account/addresses", label: "Хаягууд" },
                      ].map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-5 py-2.5 text-sm hover:bg-white/40 transition"
                        >
                          {l.label}
                        </Link>
                      ))}
                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-5 py-2.5 text-sm font-semibold text-brand-pink hover:bg-white/40 transition mt-1 relative"
                        >
                          <div className="absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
                          Админ панель →
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-5 py-2.5 text-sm hover:bg-white/40 flex items-center gap-2 text-state-sale mt-1 relative"
                      >
                        <div className="absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
                        <LogOut className="w-3.5 h-3.5" /> Гарах
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={openCart}
                className="glass-orb w-10 h-10 rounded-full flex items-center justify-center relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[16px] h-[16px]" strokeWidth={1.8} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 18, stiffness: 380 }}
                      className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-semibold shadow-md"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.nav>
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 top-16 bg-bg-deepest/30 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed top-0 bottom-0 left-0 w-[85%] max-w-sm z-50 p-4"
            >
              <div className="liquid-glass-pink h-full rounded-3xl p-6 overflow-y-auto relative">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-5 right-5 glass-orb w-9 h-9 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center mb-10">
                  <Image src="/logo.png" alt="monshop" width={140} height={40} className="h-9 w-auto object-contain" />
                </Link>
                <ul className="space-y-1">
                  {LINKS.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={l.href}
                        className="block py-3 font-serif text-2xl"
                        onClick={() => setMobileOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                {!user && (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-8 btn-3d block text-center rounded-pill py-3 text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
                  >
                    Нэвтрэх / Бүртгүүлэх
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
