import { NextRequest, NextResponse } from "next/server";
import { verifyState, signInWithOAuth } from "@/lib/oauth";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !(await verifyState("google", state)))
    return NextResponse.redirect(`${origin}/login?oauth_error=google`);

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/oauth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) throw new Error("token exchange failed");

    const profile = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }).then((r) => r.json());
    if (!profile.email) throw new Error("no email");

    await signInWithOAuth(profile.email, profile.name);
    return NextResponse.redirect(`${origin}/account`);
  } catch {
    return NextResponse.redirect(`${origin}/login?oauth_error=google`);
  }
}
