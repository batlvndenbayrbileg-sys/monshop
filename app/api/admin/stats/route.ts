import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const [orderCount, userCount, productCount, revenue, recentOrders] = await Promise.all([
    db.order.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count(),
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  return NextResponse.json({
    stats: {
      orders: orderCount,
      users: userCount,
      products: productCount,
      revenue: revenue._sum.total ?? 0,
    },
    recentOrders,
  });
}
