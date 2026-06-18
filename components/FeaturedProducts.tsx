import { ProductCard, type Product } from "./ProductCard";
import Link from "next/link";
import { Reveal } from "./Reveal";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-10 lg:mb-12">
            <h2 className="font-serif text-3xl lg:text-5xl tracking-tight">
              Алдартай барааууд
            </h2>
            <Link
              href="/shop"
              className="bg-white border border-line hover:border-ink rounded-pill px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2 transition shadow-sm"
            >
              Бүгдийг үзэх
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
