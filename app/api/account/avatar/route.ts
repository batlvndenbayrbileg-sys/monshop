import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  try {
    const { image } = await req.json().catch(() => ({}));
    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Зураг буруу байна" }, { status: 400 });
    }
    if (image.length > 3_000_000) {
      return NextResponse.json({ error: "Зураг хэт том байна" }, { status: 400 });
    }
    await db.user.update({ where: { id: user.id }, data: { image } });
    return NextResponse.json({ ok: true, image });
  } catch (err) {
    console.error("Avatar update failed:", err);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
