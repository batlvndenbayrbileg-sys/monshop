import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Цэвэрлэгч", slug: "cleansers" },
  { name: "Чийгшүүлэгч", slug: "moisturizers" },
  { name: "Сийрум", slug: "serums" },
  { name: "Нарны тос", slug: "sunscreen" },
  { name: "Маск", slug: "masks" },
  { name: "Уруулын арчилгаа", slug: "lip-care" },
];

const PRODUCTS = [
  {
    slug: "vitamin-c-serum",
    name: "Vitamin C Гялалзуулагч сийрум",
    description:
      "Арьсыг гялалзуулж, толбо арилгах 20% Витамин C найрлагатай хүчтэй идэвхтэй сийрум.",
    basePrice: 89000,
    badge: "ШИНЭ" as const,
    rating: 4.8,
    reviewCount: 128,
    category: "Сийрум",
    images: ["/product1.png", "/product2.png"],
    colors: [{ name: "30 мл", hex: "#F8BBD0" }],
    sizes: ["30 мл"],
  },
  {
    slug: "hydrating-moisturizer",
    name: "Hyaluronic чийгшүүлэгч",
    description:
      "Hyaluronic хүчил агуулсан, өдөр шөнийн чийгшүүлэгч. Бүх төрлийн арьсанд тохиромжтой.",
    basePrice: 69000,
    oldPrice: 99000,
    badge: "ХЯМДРАЛ" as const,
    rating: 4.7,
    reviewCount: 96,
    category: "Чийгшүүлэгч",
    images: ["/product2.png", "/product5.png"],
    colors: [
      { name: "50 мл", hex: "#FCE4EC" },
      { name: "100 мл", hex: "#F8BBD0" },
    ],
    sizes: ["50 мл", "100 мл"],
  },
  {
    slug: "glow-sunscreen-spf50",
    name: "Glow нарны тос SPF 50",
    description:
      "Хөнгөн, тосгүй мэдрэмж өгөх SPF 50 нарны хамгаалалт. Цагаан үлдэгдэлгүй.",
    basePrice: 59000,
    oldPrice: 79000,
    rating: 4.6,
    reviewCount: 74,
    category: "Нарны тос",
    images: ["/product3.png", "/product1.png"],
    colors: [{ name: "50 мл", hex: "#FFE9E0" }],
    sizes: ["50 мл"],
  },
  {
    slug: "rose-clay-mask",
    name: "Сарнайн шавар маск",
    description: "Каолин шавар, сарнайн ханд агуулсан гүн цэвэрлэгч маск. Долоо хоногт 2 удаа.",
    basePrice: 49000,
    oldPrice: 69000,
    rating: 4.5,
    reviewCount: 64,
    category: "Маск",
    images: ["/product4.png", "/product3.png"],
    colors: [{ name: "100 мл", hex: "#F06292" }],
    sizes: ["100 мл"],
  },
  {
    slug: "gentle-foam-cleanser",
    name: "Зөөлөн хөөстэй цэвэрлэгч",
    description:
      "pH тэнцвэртэй, мэдрэг арьсанд тохиромжтой өдөр тутмын цэвэрлэгч. Нүүр чанга татахгүй.",
    basePrice: 45000,
    rating: 4.7,
    reviewCount: 211,
    category: "Цэвэрлэгч",
    images: ["/product5.png", "/product2.png"],
    colors: [{ name: "150 мл", hex: "#FFF5F5" }],
    sizes: ["150 мл"],
  },
  {
    slug: "retinol-night-cream",
    name: "Retinol шөнийн крем",
    description: "0.5% Retinol агуулсан шөнийн нөхөн сэргээгч крем. Үрчлээ, толбо багасгана.",
    basePrice: 119000,
    badge: "ШИНЭ" as const,
    rating: 4.9,
    reviewCount: 87,
    category: "Чийгшүүлэгч",
    images: ["/product2.png", "/product4.png"],
    colors: [{ name: "50 мл", hex: "#FCE4EC" }],
    sizes: ["50 мл"],
  },
  {
    slug: "hyaluronic-serum",
    name: "Hyaluronic чийглэг сийрум",
    description: "Олон молекул жинтэй Hyaluronic хүчил. Арьсыг 10 цаг чийгшүүлнэ.",
    basePrice: 75000,
    rating: 4.8,
    reviewCount: 145,
    category: "Сийрум",
    images: ["/product1.png", "/product3.png"],
    colors: [{ name: "30 мл", hex: "#F8BBD0" }],
    sizes: ["30 мл"],
  },
  {
    slug: "rose-lip-balm",
    name: "Сарнайн уруулын тос",
    description: "Ши масло, сарнайн тостой чийгшүүлэгч уруулын тос. Гялбана.",
    basePrice: 25000,
    rating: 4.6,
    reviewCount: 309,
    category: "Уруулын арчилгаа",
    images: ["/product4.png", "/product5.png"],
    colors: [
      { name: "Сарнай", hex: "#F8BBD0" },
      { name: "Тунгалаг", hex: "#FFF5F5" },
    ],
    sizes: ["10 мл"],
  },
  {
    slug: "niacinamide-serum",
    name: "Niacinamide толбо арилгагч",
    description: "10% Niacinamide + 1% Цайр. Том нүх багасгана, толбо арилгана.",
    basePrice: 65000,
    badge: "ОНЦЛОХ" as const,
    rating: 4.7,
    reviewCount: 178,
    category: "Сийрум",
    images: ["/product1.png", "/product5.png"],
    colors: [{ name: "30 мл", hex: "#FCE4EC" }],
    sizes: ["30 мл"],
  },
  {
    slug: "exfoliating-toner",
    name: "AHA+BHA арилгагч тоник",
    description: "Хольцыг авч, нэгэн төрлийн арьс өгөх 7% AHA + 2% BHA найрлагатай тоник.",
    basePrice: 55000,
    rating: 4.5,
    reviewCount: 92,
    category: "Цэвэрлэгч",
    images: ["/product5.png", "/product1.png"],
    colors: [{ name: "100 мл", hex: "#FFE9E0" }],
    sizes: ["100 мл"],
  },
];

async function main() {
  console.log("🌸 Seeding skincare database...");

  // Idempotent: skip if already seeded (safe to run on every deploy)
  const existing = await prisma.product.count().catch(() => 0);
  if (existing > 0) {
    console.log(`✅ Already seeded (${existing} products) — skipping.`);
    return;
  }

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const adminPwd = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@monshop.mn",
      passwordHash: adminPwd,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const userPwd = await bcrypt.hash("test1234", 10);
  await prisma.user.create({
    data: {
      email: "test@monshop.mn",
      passwordHash: userPwd,
      name: "Туршилт хэрэглэгч",
      phone: "99112233",
      role: "CUSTOMER",
    },
  });

  const catsById: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({ data: { name: c.name, slug: c.slug } });
    catsById[c.name] = created.id;
  }

  for (const p of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        basePrice: p.basePrice,
        oldPrice: p.oldPrice ?? null,
        badge: p.badge ?? null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        categoryId: catsById[p.category] ?? null,
      },
    });

    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: { productId: product.id, url: p.images[i], alt: p.name, position: i },
      });
    }

    for (const color of p.colors) {
      for (const size of p.sizes) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: `${p.slug}-${color.name}-${size}`.toLowerCase().replace(/\s+/g, "-"),
            color: color.name,
            colorHex: color.hex,
            size,
            price: p.basePrice,
            stock: Math.floor(Math.random() * 50) + 10,
          },
        });
      }
    }
  }

  console.log("✅ Seeded!");
  console.log("👤 admin@monshop.mn / admin123");
  console.log("👤 test@monshop.mn / test1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
