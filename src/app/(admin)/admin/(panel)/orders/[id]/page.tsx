import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { money, ORDER_STATUSES } from "@/lib/format";
import OrderActions from "@/components/admin/OrderActions";

export const dynamic = "force-dynamic";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, user: true, address: true, statusHistory: { orderBy: { createdAt: "desc" } }, coupon: true, deliveryZone: true },
  });
  if (!order) notFound();
  const addr = order.addressSnapshot ? JSON.parse(order.addressSnapshot) : order.address;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono">{order.orderNumber}</h1>
          <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="bg-ink-700 rounded-full px-4 py-1.5 text-sm">{order.status.replace(/_/g, " ")}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-ink-800 border border-black/10 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Items</h2>
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm py-1.5">
              <span>{i.quantity}× {i.nameSnapshot}</span><span>{money(i.total)}</span>
            </div>
          ))}
          <div className="border-t border-black/10 mt-3 pt-3 text-sm space-y-1">
            <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount {order.coupon ? `(${order.coupon.code})` : ""}</span><span>−{money(order.discount)}</span></div>}
            <div className="flex justify-between text-stone-500"><span>Delivery {order.deliveryZone ? `(${order.deliveryZone.name})` : ""}</span><span>{money(order.deliveryFee)}</span></div>
            {order.tax > 0 && <div className="flex justify-between text-stone-500"><span>Tax</span><span>{money(order.tax)}</span></div>}
            <div className="flex justify-between font-bold pt-1"><span>Total</span><span>{money(order.total)}</span></div>
          </div>
        </section>

        <section className="bg-ink-800 border border-black/10 rounded-xl p-5 space-y-3 text-sm">
          <h2 className="font-semibold">Customer &amp; fulfillment</h2>
          <p>{order.user?.name ?? order.guestName} · {order.user?.email ?? order.guestEmail} · {order.guestPhone ?? order.user?.phone}</p>
          <p className="text-stone-500">{order.fulfillment}{order.timeSlot ? ` · ${order.timeSlot}` : ""}</p>
          {addr && <p className="text-stone-500">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city} {addr.postalCode}</p>}
          {order.notes && <p className="text-amber-700">Notes: {order.notes}</p>}
          <p className="text-stone-500">Payment: {order.paymentMethod} · <span className={order.paymentStatus === "PAID" ? "text-emerald-600" : "text-stone-600"}>{order.paymentStatus}</span></p>
        </section>
      </div>

      <OrderActions orderId={order.id} currentStatus={order.status} statuses={[...ORDER_STATUSES]} paymentStatus={order.paymentStatus} total={order.total} />

      <section className="bg-ink-800 border border-black/10 rounded-xl p-5">
        <h2 className="font-semibold mb-3">Status history</h2>
        {order.statusHistory.map((h) => (
          <p key={h.id} className="text-sm text-stone-500 py-1">
            <span className="text-stone-800 font-medium">{h.status.replace(/_/g, " ")}</span> — {new Date(h.createdAt).toLocaleString()}{h.note ? ` · ${h.note}` : ""}
          </p>
        ))}
      </section>
    </div>
  );
}
