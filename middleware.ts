import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "monshop-dev-secret-please-change-in-production-min-32-chars"
);

async function getRoleFromCookie(token?: string): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("monshop_session")?.value;

  // Admin pages
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const role = await getRoleFromCookie(token);
    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Account pages
  if (pathname.startsWith("/account")) {
    const role = await getRoleFromCookie(token);
    if (!role) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
