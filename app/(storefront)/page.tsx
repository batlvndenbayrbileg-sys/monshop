import { db } from "@/lib/db";
import { HomeScroll } from "@/components/HomeScroll";
import { ShopByCategories } from "@/components/ShopByCategories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CustomerReviews } from "@/components/CustomerReviews";
import { MobileHome } from "@/components/MobileHome";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { BrandStory, WhyChooseUs } from "@/components/Editorial";

export const dynamic = "force-dynamic";

import type { Product } from "@/components/ProductCard";

function mapProducts(products: any[]): Product[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name,
    price: p.basePrice,
    oldPrice: p.oldPrice,
    badge: p.badge,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: p.images[0]?.url,
    images: p.images.map((i: any) => i.url) as string[],
    colors: Array.from(
      new Map(p.variants.map((v: any) => [v.colorHex, { name: v.color, hex: v.colorHex }])).values()
    ) as { name: string; hex: string }[],
  }));
}

async function getData() {
  const [featured, all, categories] = await Promise.all([
    db.product.findMany({
      where: { status: "ACTIVE" },
      take: 8,
      orderBy: { reviewCount: "desc" },
      include: {
        images: { take: 2, orderBy: { position: "asc" } },
        variants: { select: { color: true, colorHex: true } },
        category: true,
      },
    }),
    db.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        variants: { select: { color: true, colorHex: true } },
        category: true,
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return {
    featured: mapProducts(featured),
    all: mapProducts(all),
    categories: categories.map((c) => ({ name: c.name, slug: c.slug })),
  };
}

export default async function HomePage() {
  const { featured, all, categories } = await getData();
  return (
    <>
      {/* Mobile — clean skincare-app browse */}
      <div className="lg:hidden">
        <MobileHome products={all} categories={categories} />
      </div>

      {/* Desktop — award-winning editorial experience */}
      <div className="hidden lg:block">
        <HomeScroll>
          <ShopByCategories />
          <FeaturedProducts products={featured} />
          <BrandStory />
          <WhyChooseUs />
          <FeaturedCarousel products={all} />
          <CustomerReviews />
        </HomeScroll>
      </div>
    </>
  );
}
