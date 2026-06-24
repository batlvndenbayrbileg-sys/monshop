"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-soft-pink flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-brand-pink/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-brand-rose/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        <h1 className="font-serif text-3xl lg:text-4xl tracking-tight mb-3">Алдаа гарлаа</h1>
        <p className="text-ink-muted mb-8 leading-relaxed">
          Уучлаарай, ямар нэг зүйл буруу боллоо. Дахин оролдоно уу, эсвэл нүүр хуудас руу буцаарай.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-3d rounded-pill px-7 py-3.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
          >
            Дахин оролдох
          </button>
          <Link
            href="/"
            className="border border-line bg-white rounded-pill px-7 py-3.5 text-sm font-semibold hover:border-brand-pink transition"
          >
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
