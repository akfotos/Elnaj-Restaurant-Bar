import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

const SECRET = process.env.SESSION_SECRET ?? "dev-secret";
export const SESSION_COOKIE = "elnaj_session";
const sessions = new Map<string, { userId: string; expires: number }>();

export function signValue(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");

// Cookie format: token.base64url({uid,role}).signature
// Middleware verifies the signature + role without a DB hit; getSessionUser
// additionally checks the server-side session map so logout revokes access.
export async function createSession(user: Pick<User, "id" | "role">) {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { userId: user.id, expires: Date.now() + 1000 * 60 * 60 * 24 * 30 });
  const payload = b64(JSON.stringify({ uid: user.id, role: user.role }));
  const store = await cookies();
  store.set(SESSION_COOKIE, `${token}.${payload}.${signValue(`${token}.${payload}`)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) sessions.delete(raw.split(".")[0]);
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [token, payload, sig] = raw.split(".");
  const expected = signValue(`${token}.${payload}`);
  if (!token || !payload || !sig || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return null;
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) return null;
  return db.user.findUnique({ where: { id: session.userId } });
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role === "CUSTOMER") return null;
  return user;
}
