import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Step 2: Google redirects back here with ?code=...
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("state") || "/account";
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=google`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange the code for an access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      console.error("Google token error:", tokens);
      return NextResponse.redirect(`${origin}/auth/login?error=google`);
    }

    // Fetch the Google profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();
    const email: string | undefined = profile.email;
    if (!email) {
      return NextResponse.redirect(`${origin}/auth/login?error=google`);
    }

    // Upsert the user (link by email if they already registered with password)
    const existing = await db.user.findUnique({ where: { email } });
    let user;
    if (existing) {
      user = await db.user.update({
        where: { email },
        data: {
          googleId: existing.googleId ?? profile.id,
          image: existing.image ?? profile.picture,
          name: existing.name ?? profile.name,
        },
      });
    } else {
      user = await db.user.create({
        data: {
          email,
          googleId: profile.id,
          image: profile.picture,
          name: profile.name,
          role: "CUSTOMER",
        },
      });
    }

    // Issue our own session cookie (same as password login)
    const token = await signSession({
      userId: user.id,
      email: user.email,
      role: user.role as "CUSTOMER" | "ADMIN",
    });
    await setSessionCookie(token);

    return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/account"}`);
  } catch (err) {
    console.error("Google callback failed:", err);
    return NextResponse.redirect(`${origin}/auth/login?error=google`);
  }
}
