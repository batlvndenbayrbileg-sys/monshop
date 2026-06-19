import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Цэвэрлэгч", slug: "cleansers" },
  { name: "Чийгшүүлэгч", slug: "moisturizers" },
  { name: "Сийрум", slug: "serums" },
  { name: "Нарны тос", slug: "sunscreen" },
  { name: "Маск", slug: "masks" },
  { name: "Тоник", slug: "toners" },
  { name: "Нүдний арчилгаа", slug: "eye-care" },
  { name: "Уруулын арчилгаа", slug: "lip-care" },
];

const IMG: Record<string, string[]> = {
  serums: ["/product1.png", "/product3.png"],
  moisturizers: ["/product2.png", "/product5.png"],
  cleansers: ["/product5.png", "/product2.png"],
  sunscreen: ["/product3.png", "/product1.png"],
  masks: ["/product4.png", "/product3.png"],
  toners: ["/product5.png", "/product1.png"],
  "eye-care": ["/product1.png", "/product2.png"],
  "lip-care": ["/product2.png", "/product4.png"],
};

const SIZES: Record<string, string[]> = {
  serums: ["30 мл", "50 мл", "60 мл"],
  moisturizers: ["30 мл", "50 мл", "100 мл"],
  cleansers: ["100 мл", "150 мл", "200 мл"],
  sunscreen: ["50 мл", "60 мл"],
  masks: ["75 мл", "100 мл"],
  toners: ["100 мл", "150 мл", "200 мл"],
  "eye-care": ["15 мл", "30 мл"],
  "lip-care": ["10 мл", "15 мл"],
};

const HEX = "#F8BBD0";

type Seed = { name: string; desc: string; base: number; cat: string; badge?: string; rating: number; reviews: number };

const PRODUCTS: Seed[] = [
  // Сийрум (serums)
  { name: "Vitamin C 20% Гялалзуулагч сийрум", desc: "Толбо арилгаж, арьсыг гэрэлтүүлэх хүчирхэг антиоксидант сийрум.", base: 89000, cat: "serums", badge: "ШИНЭ", rating: 4.8, reviews: 1284 },
  { name: "Hyaluronic чийглэг сийрум", desc: "Олон молекул жинтэй Hyaluronic хүчил арьсыг 10 цаг чийгшүүлнэ.", base: 75000, cat: "serums", rating: 4.8, reviews: 945 },
  { name: "Niacinamide 10% толбо арилгагч", desc: "Том нүх багасгаж, өнгө тэгшитгэх Niacinamide + Цайр сийрум.", base: 65000, cat: "serums", badge: "ОНЦЛОХ", rating: 4.7, reviews: 1178 },
  { name: "Retinol 0.5% сэргээгч сийрум", desc: "Үрчлээ, нарийн шугам багасгах шөнийн нөхөн сэргээгч.", base: 119000, cat: "serums", badge: "ШИНЭ", rating: 4.9, reviews: 687 },
  { name: "Peptide бэхжүүлэгч сийрум", desc: "Арьсны уян хатан байдлыг нэмэгдүүлэх пептидийн цогцолбор.", base: 105000, cat: "serums", rating: 4.7, reviews: 412 },
  { name: "AHA 7% гялбаа өгөгч сийрум", desc: "Үхсэн эс зайлуулж, гялбаатай арьс өгөх хүчиллэг сийрум.", base: 69000, cat: "serums", rating: 4.5, reviews: 356 },
  { name: "Salicylic Acid 2% батга шийдэгч", desc: "Нүх цэвэрлэж, батга багасгах BHA сийрум.", base: 62000, cat: "serums", rating: 4.6, reviews: 523 },
  { name: "Azelaic Acid 10% тэгшитгэгч", desc: "Улайлт, толбо багасгах, өнгө тэгшитгэх сийрум.", base: 78000, cat: "serums", rating: 4.6, reviews: 289 },
  { name: "Vitamin B5 тайвшруулагч сийрум", desc: "Чийгшүүлж, арьсны хаалтыг бэхжүүлэх panthenol сийрум.", base: 58000, cat: "serums", rating: 4.7, reviews: 198 },
  { name: "Ferulic + E антиоксидант сийрум", desc: "Хүрээлэн буй орчны хор хөнөөлөөс хамгаалах антиоксидант.", base: 98000, cat: "serums", rating: 4.8, reviews: 167 },
  // Чийгшүүлэгч (moisturizers)
  { name: "Hyaluronic чийгшүүлэгч крем", desc: "Хөнгөн, бүх төрлийн арьсанд тохирох өдөр шөнийн чийгшүүлэгч.", base: 69000, cat: "moisturizers", badge: "ХЯМДРАЛ", rating: 4.7, reviews: 932 },
  { name: "Ceramide хаалт сэргээгч крем", desc: "Арьсны хамгаалалтын хаалтыг бэхжүүлэх ceramide крем.", base: 88000, cat: "moisturizers", rating: 4.8, reviews: 654 },
  { name: "Retinol шөнийн нөхөн крем", desc: "Шөнийн цагт арьсыг сэргээж, залуужуулах баялаг крем.", base: 119000, cat: "moisturizers", badge: "ШИНЭ", rating: 4.9, reviews: 421 },
  { name: "Gel-cream чийгшил", desc: "Тосны мэдрэмжгүй, шингэдэг гель-крем. Тослог арьсанд.", base: 64000, cat: "moisturizers", rating: 4.6, reviews: 378 },
  { name: "Rich баялаг шим тэжээлт крем", desc: "Хуурай арьсанд зориулсан өтгөн, шим тэжээлт крем.", base: 95000, cat: "moisturizers", rating: 4.7, reviews: 245 },
  { name: "Barrier тайвшруулах крем", desc: "Мэдрэг, цочроосон арьсыг тайвшруулах нөхөн крем.", base: 72000, cat: "moisturizers", rating: 4.8, reviews: 312 },
  { name: "Whipped хөнгөн чийгшүүлэгч", desc: "Агаар мэт хөнгөн, өдөр тутмын чийгшүүлэгч.", base: 59000, cat: "moisturizers", rating: 4.5, reviews: 189 },
  // Цэвэрлэгч (cleansers)
  { name: "Зөөлөн хөөстэй цэвэрлэгч", desc: "pH тэнцвэртэй, нүүр чанга татахгүй өдөр тутмын цэвэрлэгч.", base: 45000, cat: "cleansers", rating: 4.7, reviews: 1103 },
  { name: "Gel гүн цэвэрлэгч", desc: "Илүүдэл тос, хольцыг зайлуулах сэргэг гель цэвэрлэгч.", base: 48000, cat: "cleansers", rating: 4.6, reviews: 567 },
  { name: "Cleansing oil тос цэвэрлэгч", desc: "Будаг, SPF-ийг зөөлөн уусгах эхний шатны тос цэвэрлэгч.", base: 55000, cat: "cleansers", badge: "ОНЦЛОХ", rating: 4.8, reviews: 489 },
  { name: "Cream зөөлөн цэвэрлэгч", desc: "Хуурай, мэдрэг арьсанд зориулсан кремэн цэвэрлэгч.", base: 47000, cat: "cleansers", rating: 4.6, reviews: 234 },
  { name: "Micellar усан цэвэрлэгч", desc: "Зайлахгүйгээр будаг арилгах мицеллийн ус.", base: 39000, cat: "cleansers", rating: 4.5, reviews: 678 },
  { name: "Clay гүн цэвэрлэгч", desc: "Нүх цэвэрлэж, илүүдэл тос шингээх шаварлаг цэвэрлэгч.", base: 52000, cat: "cleansers", rating: 4.6, reviews: 198 },
  // Нарны тос (sunscreen)
  { name: "Glow нарны тос SPF 50+", desc: "Хөнгөн, цагаан үлдэгдэлгүй өдөр тутмын нарны хамгаалалт.", base: 59000, cat: "sunscreen", badge: "ХЯМДРАЛ", rating: 4.6, reviews: 745 },
  { name: "Tinted өнгөт нарны тос SPF 50", desc: "Арьсны өнгө тэгшитгэх өнгөт нарны хамгаалалт.", base: 65000, cat: "sunscreen", rating: 4.7, reviews: 423 },
  { name: "Mineral эрдэст нарны тос SPF 50", desc: "Цайр суурьтай, мэдрэг арьсанд зориулсан эрдэст хамгаалалт.", base: 68000, cat: "sunscreen", rating: 4.5, reviews: 256 },
  { name: "Stick авсаархан нарны тос SPF 50", desc: "Гар бохирдуулахгүй, дахин түрхэхэд тохиромжтой саваа.", base: 49000, cat: "sunscreen", badge: "ШИНЭ", rating: 4.4, reviews: 134 },
  // Маск (masks)
  { name: "Сарнайн шавар маск", desc: "Каолин шавар, сарнайн хандтай гүн цэвэрлэгч маск.", base: 49000, cat: "masks", badge: "ХЯМДРАЛ", rating: 4.5, reviews: 364 },
  { name: "Шөнийн чийгшүүлэх sleeping mask", desc: "Шөнийн турш чийгшүүлэх, өглөө гэрэлтэй арьс өгөх маск.", base: 58000, cat: "masks", rating: 4.7, reviews: 287 },
  { name: "Sheet чийгшүүлэх маск (5ш)", desc: "Эрчимтэй чийгшүүлэх даавуун маск, 5 ширхэг багц.", base: 35000, cat: "masks", rating: 4.6, reviews: 512 },
  { name: "Peel-off гялбаа маск", desc: "Үхсэн эс зайлуулж, гялбаатай арьс өгөх хуулагддаг маск.", base: 42000, cat: "masks", rating: 4.4, reviews: 176 },
  // Тоник (toners)
  { name: "AHA+BHA арилгагч тоник", desc: "Хольцыг авч, нэгэн төрлийн арьс өгөх хүчиллэг тоник.", base: 55000, cat: "toners", rating: 4.5, reviews: 392 },
  { name: "Чийгшүүлэх тоник", desc: "Цэвэрлэгчийн дараа арьсыг тэнцвэржүүлэх чийгшүүлэх тоник.", base: 48000, cat: "toners", badge: "ОНЦЛОХ", rating: 4.7, reviews: 445 },
  { name: "Тайвшруулах Centella тоник", desc: "Улайлт, цочролыг намдаах centella ханд бүхий тоник.", base: 52000, cat: "toners", rating: 4.8, reviews: 298 },
  // Нүдний арчилгаа (eye-care)
  { name: "Нүдний эргэн тойрны сийрум", desc: "Хаван, харласан тойрог багасгах хөнгөн нүдний сийрум.", base: 72000, cat: "eye-care", badge: "ШИНЭ", rating: 4.6, reviews: 211 },
  { name: "Retinol нүдний крем", desc: "Нүдний эргэн тойрны нарийн шугам багасгах крем.", base: 85000, cat: "eye-care", rating: 4.7, reviews: 156 },
  { name: "Гидрогель нүдний наалт (30 хос)", desc: "Хаван намдааж, чийгшүүлэх нүдний гидрогель наалт.", base: 45000, cat: "eye-care", rating: 4.5, reviews: 334 },
  // Уруулын арчилгаа (lip-care)
  { name: "Сарнайн уруулын тос", desc: "Ши масло, сарнайн тостой чийгшүүлэгч уруулын тос.", base: 25000, cat: "lip-care", rating: 4.6, reviews: 609 },
  { name: "Шөнийн уруулын маск", desc: "Шөнийн турш уруулыг тэжээх, зөөлрүүлэх маск.", base: 32000, cat: "lip-care", badge: "ОНЦЛОХ", rating: 4.8, reviews: 478 },
  { name: "Гялбаатай уруулын тос", desc: "Гялбаа нэмэх, чийгшүүлэх өнгөгүй уруулын тос.", base: 28000, cat: "lip-care", rating: 4.5, reviews: 256 },
];

async function main() {
  console.log("🌸 Seeding skincare database...");

  // Skip on deploy if already seeded (keeps orders/users safe)
  if (!process.env.FORCE_SEED) {
    const existing = await prisma.product.count().catch(() => 0);
    if (existing > 0) {
      console.log(`✅ Already seeded (${existing} products) — skipping.`);
      return;
    }
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

  await prisma.user.create({
    data: { email: "admin@monshop.mn", passwordHash: await bcrypt.hash("admin123", 10), name: "Admin", role: "ADMIN" },
  });
  await prisma.user.create({
    data: { email: "test@monshop.mn", passwordHash: await bcrypt.hash("test1234", 10), name: "Туршилт хэрэглэгч", phone: "99112233", role: "CUSTOMER" },
  });

  const catId: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({ data: { name: c.name, slug: c.slug } });
    catId[c.slug] = created.id;
  }

  const slugify = (s: string, i: number) =>
    s.toLowerCase().replace(/[^a-z0-9а-яөүё]+/gi, "-").replace(/(^-|-$)/g, "").slice(0, 40) + "-" + i;

  let idx = 0;
  for (const p of PRODUCTS) {
    idx++;
    const images = IMG[p.cat] ?? ["/product1.png"];
    const sizes = SIZES[p.cat] ?? ["30 мл"];

    const product = await prisma.product.create({
      data: {
        slug: slugify(p.name, idx),
        name: p.name,
        description: p.desc,
        basePrice: p.base,
        oldPrice: p.badge === "ХЯМДРАЛ" ? Math.round(p.base * 1.35) : null,
        badge: p.badge ?? null,
        rating: p.rating,
        reviewCount: p.reviews,
        categoryId: catId[p.cat] ?? null,
      },
    });

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({ data: { productId: product.id, url: images[i], alt: p.name, position: i } });
    }

    // one shade, multiple ml sizes — price rises with size
    for (let s = 0; s < sizes.length; s++) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `${product.slug}-${s}`,
          color: "Үндсэн",
          colorHex: HEX,
          size: sizes[s],
          price: p.base + s * Math.round(p.base * 0.35),
          stock: Math.floor(Math.random() * 60) + 15,
        },
      });
    }
  }

  console.log(`✅ Seeded ${PRODUCTS.length} products!`);
  console.log("👤 admin@monshop.mn / admin123");
  console.log("👤 test@monshop.mn / test1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
