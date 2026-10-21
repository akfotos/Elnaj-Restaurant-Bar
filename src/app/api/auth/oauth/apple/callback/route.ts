import { NextRequest, NextResponse } from "next/server";
import { verifyState, signInWithOAuth } from "@/lib/oauth";

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

// Apple posts a form body: { id_token, state, user?: '{"name":{...}}' }
export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const form = await req.formData();
  const idToken = String(form.get("id_token") ?? "");
  const state = String(form.get("state") ?? "");

  if (!idToken || !(await verifyState("apple", state)))
    return NextResponse.redirect(`${origin}/login?oauth_error=apple`);

  // NOTE: for production, verify the id_token signature against Apple's JWKS
  // (https://appleid.apple.com/auth/keys) and check iss/aud/exp.
  const claims = decodeJwt(idToken);
  const email = claims?.email as string | undefined;
  if (!email) return NextResponse.redirect(`${origin}/login?oauth_error=apple`);

  // Apple only sends the user's name on the FIRST authorization
  let name = "";
  try {
    const userField = JSON.parse(String(form.get("user") ?? "{}"));
    name = [userField?.name?.firstName, userField?.name?.lastName].filter(Boolean).join(" ");
  } catch {}

  await signInWithOAuth(email, name);
  return NextResponse.redirect(`${origin}/account`);
}
