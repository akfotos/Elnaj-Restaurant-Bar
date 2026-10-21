import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const orders = await db.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: "desc" } });
  const rows = [
    ["order_number", "date", "customer", "email", "fulfillment", "status", "payment", "subtotal", "delivery", "discount", "tax", "total", "items"],
    ...orders.map((o) => [
      o.orderNumber, o.createdAt.toISOString(), o.user?.name ?? o.guestName ?? "", o.user?.email ?? o.guestEmail ?? "",
      o.fulfillment, o.status, `${o.paymentMethod}:${o.paymentStatus}`,
      o.subtotal, o.deliveryFee, o.discount, o.tax, o.total,
      o.items.map((i) => `${i.quantity}x ${i.nameSnapshot}`).join("; "),
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=orders.csv" },
  });
}
