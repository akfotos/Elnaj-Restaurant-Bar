import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const user = await getSessionUser();
  const [zones, settings, addresses] = await Promise.all([
    db.deliveryZone.findMany({ where: { isActive: true } }),
    getSettings(),
    user ? db.address.findMany({ where: { userId: user.id } }) : [],
  ]);
  return NextResponse.json({
    zones,
    addresses,
    settings,
    slots: settings.timeSlots.split(",").map((s) => s.trim()),
    user: user ? { name: user.name, email: user.email, phone: user.phone } : null,
  });
}
