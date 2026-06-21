import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  PENDING: "Хүлээгдэж буй", PAID: "Төлсөн", SHIPPED: "Илгээсэн", DELIVERED: "Хүргэгдсэн", CANCELLED: "Цуцалсан",
};
const PAY: Record<string, string> = { QPAY: "QPay", KHAN: "Хаан банк", TRANSFER: "Шилжүүлэг", CASH: "Бэлэн" };

function csvCell(s: any) {
  const v = String(s ?? "");
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET(req: Request) {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const where: any = {};
  if (status) where.status = status;
  if (q) where.OR = [{ orderNumber: { contains: q } }, { shippingName: { contains: q } }, { shippingPhone: { contains: q } }];

  const orders = await db.order.findMany({ where, include: { items: true }, orderBy: { createdAt: "desc" } });

  const header = ["Дугаар", "Огноо", "Хүлээн авагч", "Утас", "Хот", "Дүүрэг", "Хаяг", "Бараа", "Дэд дүн", "Хүргэлт", "Нийт", "Төлбөр", "Төлөв"];
  const rows = orders.map((o) => [
    o.orderNumber,
    new Date(o.createdAt).toLocaleString("mn-MN"),
    o.shippingName,
    o.shippingPhone,
    o.shippingCity,
    o.shippingDistrict,
    o.shippingStreet,
    o.items.map((i) => `${i.name} (${i.size}) x${i.quantity}`).join("; "),
    o.subtotal,
    o.shippingCost,
    o.total,
    PAY[o.paymentMethod] ?? o.paymentMethod,
    STATUS[o.status] ?? o.status,
  ]);

  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  // BOM so Excel reads UTF-8 (Cyrillic) correctly
  const body = "﻿" + csv;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="monshop-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
