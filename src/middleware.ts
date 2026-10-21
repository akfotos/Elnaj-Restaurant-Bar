import { NextRequest, NextResponse } from "next/server";

const COOKIE = "elnaj_session";
const STAFF_ROLES = new Set(["ADMIN", "MANAGER", "STAFF"]);
const SECRET = process.env.SESSION_SECRET ?? "dev-secret";

// Verify "token.payload.sig" using WebCrypto (middleware runs on the edge —
// node:crypto is unavailable). Returns the decoded payload or null.
async function verifySession(raw: string | undefined): Promise<{ uid: string; role: string } | null> {
  if (!raw) return null;
  const [token, payload, sig] = raw.split(".");
  if (!token || !payload || !sig) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${token}.${payload}`))
  );
  const expected = [...sigBytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/login is always reachable
  if (pathname === "/admin/login") return NextResponse.next();

  const session = await verifySession(req.cookies.get(COOKIE)?.value);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?redirectedFrom=${pathname}`;
    return NextResponse.redirect(url);
  }
  if (!STAFF_ROLES.has(session.role)) {
    // signed-in customer trying to reach staff area → send to storefront
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
