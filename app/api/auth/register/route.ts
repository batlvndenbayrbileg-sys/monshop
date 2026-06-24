import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Имэйл буруу"),
  password: z.string().min(6, "Нууц үг 6+ тэмдэгт"),
  name: z.string().min(1, "Нэр оруулна уу"),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }
    const { email, password, name, phone } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Имэйл бүртгэгдсэн байна" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { email, passwordHash, name, phone, role: "CUSTOMER" },
    });

    const token = await signSession({
      userId: user.id,
      email: user.email,
      role: "CUSTOMER",
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Register failed:", err);
    return NextResponse.json({ error: "Алдаа гарлаа. Дахин оролдоно уу." }, { status: 500 });
  }
}
