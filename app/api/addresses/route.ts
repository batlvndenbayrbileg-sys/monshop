import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  label: z.string().optional().nullable(),
  name: z.string().min(1),
  phone: z.string().min(6),
  city: z.string().min(1),
  district: z.string().min(1),
  street: z.string().min(1),
  zip: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  try {
    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ addresses });
  } catch (err) {
    console.error("List addresses failed:", err);
    return NextResponse.json({ addresses: [] });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  try {
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const d = parsed.data;

    // First address becomes default automatically.
    const count = await db.address.count({ where: { userId: user.id } });
    const makeDefault = d.isDefault || count === 0;
    if (makeDefault) {
      await db.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }

    const address = await db.address.create({
      data: {
        userId: user.id,
        label: d.label || null,
        name: d.name,
        phone: d.phone,
        city: d.city,
        district: d.district,
        street: d.street,
        zip: d.zip || null,
        isDefault: makeDefault,
      },
    });
    return NextResponse.json({ address });
  } catch (err) {
    console.error("Create address failed:", err);
    return NextResponse.json({ error: "Хаяг хадгалахад алдаа гарлаа" }, { status: 500 });
  }
}
