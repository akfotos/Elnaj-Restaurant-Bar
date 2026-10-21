import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const origin = req.nextUrl.origin;
  const state = randomBytes(16).toString("hex");

  let url: string | null = null;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      url =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
          client_id: clientId,
          redirect_uri: `${origin}/api/auth/oauth/google/callback`,
          response_type: "code",
          scope: "openid email profile",
          state,
        }).toString();
    }
  } else if (provider === "apple") {
    const clientId = process.env.APPLE_CLIENT_ID; // Services ID, e.g. com.elnaj.web
    if (clientId) {
      url =
        "https://appleid.apple.com/auth/authorize?" +
        new URLSearchParams({
          client_id: clientId,
          redirect_uri: `${origin}/api/auth/oauth/apple/callback`,
          response_type: "id_token",
          response_mode: "form_post",
          scope: "name email",
          state,
        }).toString();
    }
  }

  if (!url) return NextResponse.redirect(`${origin}/login?oauth_error=${provider}`);

  const res = NextResponse.redirect(url);
  res.cookies.set(`oauth_state_${provider}`, state, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
  return res;
}
