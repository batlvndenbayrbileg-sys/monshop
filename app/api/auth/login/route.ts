import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Имэйл/нууц үг буруу" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json({ error: "Бүртгэл олдсонгүй" }, { status: 400 });
  }
  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "Энэ хаяг Google-ээр бүртгэгдсэн. Google-ээр нэвтэрнэ үү." },
      { status: 400 }
    );
  }
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Нууц үг буруу байна" }, { status: 400 });
  }

  const token = await signSession({
    userId: user.id,
    email: user.email,
    role: user.role as "CUSTOMER" | "ADMIN",
  });
  await setSessionCookie(token);

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
