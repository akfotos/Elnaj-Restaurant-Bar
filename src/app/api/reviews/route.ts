import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { productId, rating, comment } = await req.json();
  if (!productId || !rating || rating < 1 || rating > 5) return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  await db.review.create({ data: { productId, userId: user.id, rating, comment } });
  return NextResponse.json({ ok: true });
}
