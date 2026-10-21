import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { label, line1, line2, city, postalCode, isDefault } = await req.json();
  if (!line1 || !city || !postalCode) return NextResponse.json({ error: "Address incomplete" }, { status: 400 });
  if (isDefault) await db.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
  const addr = await db.address.create({ data: { userId: user.id, label: label || "Home", line1, line2, city, postalCode, isDefault: !!isDefault } });
  return NextResponse.json(addr);
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await req.json();
  await db.address.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
