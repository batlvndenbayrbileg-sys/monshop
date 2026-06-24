import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-soft-pink flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-brand-pink/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-brand-rose/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        <Link href="/" className="inline-block mb-8">
          <Image src="/logo.png" alt="monshop" width={160} height={48} className="h-12 w-auto mx-auto object-contain" />
        </Link>

        <div className="font-serif text-7xl lg:text-8xl tracking-tight text-brand-pink leading-none mb-4">404</div>
        <h1 className="font-serif text-2xl lg:text-3xl tracking-tight mb-3">Хуудас олдсонгүй</h1>
        <p className="text-ink-muted mb-8 leading-relaxed">
          Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна. Нүүр хуудас руу буцаж үргэлжлүүлээрэй.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="btn-3d rounded-pill px-7 py-3.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(180deg, #f06292 0%, #e91e63 100%)" }}
          >
            Нүүр хуудас
          </Link>
          <Link
            href="/shop"
            className="border border-line bg-white rounded-pill px-7 py-3.5 text-sm font-semibold hover:border-brand-pink transition"
          >
            Дэлгүүр үзэх
          </Link>
        </div>
      </div>
    </div>
  );
}
