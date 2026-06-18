import { db } from "@/lib/db";
import { HomeScroll } from "@/components/HomeScroll";
import { ShopByCategories } from "@/components/ShopByCategories";
import { PromoBanner } from "@/components/PromoBanner";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CustomerReviews } from "@/components/CustomerReviews";
import { FAQ } from "@/components/FAQ";
import { PerksBar } from "@/components/PerksBar";
import { SustainabilityStory } from "@/components/SustainabilityStory";

export const dynamic = "force-dynamic";

async function getFeatured() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    take: 8,
    orderBy: { reviewCount: "desc" },
    include: {
      images: { take: 2, orderBy: { position: "asc" } },
      variants: { select: { color: true, colorHex: true } },
      category: true,
    },
  });
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
    images: p.images.map((i) => i.url),
    colors: Array.from(
      new Map(p.variants.map((v) => [v.colorHex, { name: v.color, hex: v.colorHex }])).values()
    ),
  }));
}

export default async function HomePage() {
  const products = await getFeatured();
  return (
    <HomeScroll>
      <ShopByCategories />
      <PromoBanner />
      <FeaturedProducts products={products} />
      <CustomerReviews />
      <FAQ />
      <SustainabilityStory />
      <PerksBar />
    </HomeScroll>
  );
}
