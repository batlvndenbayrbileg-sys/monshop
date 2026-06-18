import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { Tilt3D } from "./Tilt3D";

// Local images - place files in /public/ to override
const CATEGORY_IMAGES: Record<string, string> = {
  cleansers: "/product5.png",     // Зөөлөн хөөстэй цэвэрлэгч
  moisturizers: "/product2.png",  // Hyaluronic чийгшүүлэгч
  serums: "/product1.png",        // Vitamin C сийрум
  sunscreen: "/product3.png",     // Glow нарны тос
  masks: "/product4.png",         // Сарнайн шавар маск
  "lip-care": "/product2.png",    // placeholder
};

export async function ShopByCategories() {
  const categories = (
    await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    })
  ).slice(0, 5);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl tracking-tight">
              Ангиллаар сонгох
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <Link href={`/categories/${c.slug}`} className="card-3d block group">
                <Tilt3D max={8} className="rounded-3xl">
                  <div className="relative bg-card-pink rounded-3xl p-5 lg:p-6 text-center shadow-3d edge-highlight overflow-hidden">
                    {/* Subtle radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/60 blur-2xl pointer-events-none" />

                    <div
                      className="relative aspect-[4/3] mb-5 overflow-hidden rounded-2xl shadow-soft-pink"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {CATEGORY_IMAGES[c.slug] && (
                        <Image
                          src={CATEGORY_IMAGES[c.slug]}
                          alt={c.name}
                          fill
                          sizes="240px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div
                      className="relative"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <div className="font-semibold text-base lg:text-lg mb-1">{c.name}</div>
                      <div className="text-xs text-ink-muted">{c._count.products} бараа</div>
                    </div>
                  </div>
                </Tilt3D>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
