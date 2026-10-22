import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import PageIntro from "@/components/PageIntro";
import { getOrderContent } from "@/lib/order-content";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await db.order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) notFound();
  const copy = getOrderContent(order.status, order.fulfillment);

  return (
    <div className="storefront-page storefront-narrow text-center">
      <PageIntro eyebrow="Your Elnaj order" title={copy.title} description={copy.description} className="page-intro-centered" />
      <p className="text-stone-500">Reference <span className="text-brand-500 font-mono font-semibold">{order.orderNumber}</span></p>
      <p className="text-sm text-stone-500 mt-3">{order.fulfillment === "DELIVERY" ? "Delivery" : "Pickup"}{order.timeSlot ? ` · Requested time: ${order.timeSlot}` : ""}</p>
      <div className="bg-ink-800 border border-black/10 rounded-xl p-6 sm:p-8 mt-10 text-left">
        <h2 className="text-lg font-semibold mb-6">Order details</h2>
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm py-1.5">
            <span>{i.quantity}× {i.nameSnapshot}</span><span>{money(i.total)}</span>
          </div>
        ))}
        <div className="border-t border-black/10 mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−{money(order.discount)}</span></div>}
          <div className="flex justify-between text-stone-500"><span>Delivery</span><span>{money(order.deliveryFee)}</span></div>
          {order.tax > 0 && <div className="flex justify-between text-stone-500"><span>Tax</span><span>{money(order.tax)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-1"><span>Total</span><span className="text-brand-500">{money(order.total)}</span></div>
          <p className="text-xs text-stone-500 pt-1">Payment: {order.paymentMethod.toUpperCase()} · {order.paymentStatus}</p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href={`/track?order=${order.orderNumber}`} className="bg-brand-500 text-ink-900 font-bold rounded-full px-6 py-3">Track order</Link>
        <Link href="/menu" className="border border-black/20 rounded-full px-6 py-3">Back to menu</Link>
      </div>
      <p className="page-note">Have a question about this order? <Link href="/support">Contact the team</Link> and include the reference above. This page shows the recorded payment status; it does not itself process a payment.</p>
    </div>
  );
}
