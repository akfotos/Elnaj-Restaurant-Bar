import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseReservationRequest } from "@/lib/reservations";

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Please submit your request from this website." }, { status: 403, headers });
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "A JSON request is required." }, { status: 415, headers });
  if (Number(request.headers.get("content-length")) > 16000) return NextResponse.json({ error: "The request is too large." }, { status: 413, headers });
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 16000) return NextResponse.json({ error: "The request is too large." }, { status: 413, headers });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Please check the request and try again." }, { status: 400, headers });
  }
  const parsed = parseReservationRequest(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400, headers });
  try {
    const result = await db.$transaction(async (tx) => {
      const existing = await tx.reservation.findUnique({ where: { requestId: parsed.data.requestId } });
      if (existing) return { reservation: existing, created: false };
      const recent = await tx.reservation.count({ where: { email: parsed.data.email, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } } });
      if (recent >= 3) return { reservation: null, created: false };
      const reservation = await tx.reservation.create({ data: parsed.data });
      return { reservation, created: true };
    }, { isolationLevel: "Serializable" });
    if (!result.reservation) return NextResponse.json({ error: "You’ve submitted several requests recently. Please wait 15 minutes before trying again." }, { status: 429, headers: { ...headers, "Retry-After": "900" } });
    return NextResponse.json({ reference: result.reservation.id, status: result.reservation.status }, { status: result.created ? 201 : 200, headers });
  } catch {
    return NextResponse.json({ error: "We couldn’t save your reservation request. Please try again shortly or contact our team." }, { status: 503, headers });
  }
}
