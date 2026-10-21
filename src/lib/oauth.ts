import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function verifyState(provider: string, state: string | null) {
  const store = await cookies();
  const expected = store.get(`oauth_state_${provider}`)?.value;
  store.delete(`oauth_state_${provider}`);
  return !!state && !!expected && state === expected;
}

/** Find-or-create a user from an OAuth profile and start a session. */
export async function signInWithOAuth(email: string, name: string) {
  const normalized = email.toLowerCase();
  let user = await db.user.findUnique({ where: { email: normalized } });
  if (!user) {
    user = await db.user.create({
      data: {
        email: normalized,
        name: name || normalized.split("@")[0],
        passwordHash: await bcrypt.hash(randomBytes(32).toString("hex"), 10),
      },
    });
  }
  await createSession(user);
}
