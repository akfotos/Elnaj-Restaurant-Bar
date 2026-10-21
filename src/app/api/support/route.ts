import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();
  if (!name || !email || !message) return NextResponse.json({ error: "All fields required" }, { status: 400 });
  await db.supportMessage.create({ data: { name, email, subject: subject ?? "General", message } });
  return NextResponse.json({ ok: true });
}
