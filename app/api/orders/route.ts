import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { orderNumber } from "@/lib/utils";

const itemSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().min(1),
});

const schema = z.object({
  email: z.string().email(),
  phone: z.string().min(6),
  paymentMethod: z.enum(["QPAY", "KHAN", "TRANSFER", "CASH"]),
  shippingName: z.string().min(1),
  shippingPhone: z.string().min(6),
  shippingCity: z.string().min(1),
  shippingDistrict: z.string().min(1),
  shippingStreet: z.string().min(1),
  shippingZip: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const user = await getCurrentUser();

  const variantIds = data.items.map((i) => i.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  if (variants.length !== variantIds.length) {
    return NextResponse.json({ error: "Бараа олдсонгүй" }, { status: 400 });
  }

  let subtotal = 0;
  const items = data.items.map((it) => {
    const v = variants.find((x) => x.id === it.variantId)!;
    if (v.stock < it.quantity) {
      throw new Error(`${v.product.name} (${v.size}/${v.color}) үлдэгдэл хүрэлцэхгүй`);
    }
    subtotal += v.price * it.quantity;
    return {
      productId: v.productId,
      variantId: v.id,
      name: v.product.name,
      color: v.color,
      size: v.size,
      price: v.price,
      quantity: it.quantity,
    };
  });

  const shippingCost = subtotal >= 100000 ? 0 : 8000;
  const total = subtotal + shippingCost;

  const order = await db.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        orderNumber: orderNumber(),
        userId: user?.id,
        email: data.email,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingCost,
        total,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingCity: data.shippingCity,
        shippingDistrict: data.shippingDistrict,
        shippingStreet: data.shippingStreet,
        shippingZip: data.shippingZip,
        notes: data.notes,
        items: { create: items },
      },
      include: { items: true },
    });
    for (const it of data.items) {
      await tx.productVariant.update({
        where: { id: it.variantId },
        data: { stock: { decrement: it.quantity } },
      });
    }
    return o;
  });

  return NextResponse.json({ order });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}
