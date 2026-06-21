import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Step 1: redirect the user to Google's consent screen
export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google нэвтрэлт тохируулаагүй байна" }, { status: 500 });
  }

  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // optional ?next=/path to return to after login
  const next = new URL(req.url).searchParams.get("next") || "/account";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state: next,
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
