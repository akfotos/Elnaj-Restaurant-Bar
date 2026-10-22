import { db } from "@/lib/db";
import { money } from "@/lib/format";
import TrackSearch from "@/components/TrackSearch";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { ORDER_TRACKING_STEPS as STEPS, getOrderTrackingIndex, getOrderTrackingLabel } from "@/lib/order-content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Track Order" };

export default async function TrackPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { order } = await searchParams;
  const found = order
    ? await db.order.findUnique({ where: { orderNumber: order.toUpperCase() }, include: { items: true, statusHistory: { orderBy: { createdAt: "desc" } } } })
    : null;

  const currentIdx = found ? getOrderTrackingIndex(found.status) : -1;

  return (
    <div className="storefront-page storefront-narrow">
      <PageIntro eyebrow="From our kitchen to you" title="Follow your order." description="Enter the order number shown after checkout to see the latest status recorded by our team. Reload this page when you want to check for a new update." className="page-intro-centered" />
      <TrackSearch initial={order ?? ""} />
      {!order && <p className="text-sm text-stone-500 leading-relaxed text-center mt-8">Signed in when you ordered? Your reference is also in your <Link href="/account" className="underline">account’s order history</Link>.</p>}
      {order && !found && <p className="text-center text-red-400 mt-6">Order not found. Check the number and try again.</p>}
      {found && (
        <div className="mt-10">
          {found.status === "CANCELLED" ? (
            <p className="text-center text-red-400 font-semibold">This order was cancelled.</p>
          ) : (
            <ol className="space-y-0">
              {STEPS.filter((s) => found.fulfillment === "DELIVERY" || s !== "OUT_FOR_DELIVERY").map((s) => {
                const idx = STEPS.indexOf(s);
                const done = currentIdx >= idx;
                const entry = [...found.statusHistory].reverse().find((h) => h.status === s);
                return (
                  <li key={s} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${done ? "bg-brand-500 border-brand-500 text-ink-900" : "border-stone-500 text-stone-500"}`}>{done ? "✓" : ""}</div>
                      {idx < STEPS.length - 1 && <div className={`w-0.5 flex-1 min-h-8 ${done ? "bg-brand-500" : "bg-stone-700"}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`font-medium ${done ? "" : "text-stone-500"}`}>{getOrderTrackingLabel(s, found.fulfillment)}</p>
                      {entry && <p className="text-xs text-stone-500">{new Date(entry.createdAt).toLocaleString()}{entry.note ? ` — ${entry.note}` : ""}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <div className="bg-ink-800 border border-black/10 rounded-xl p-5 mt-4">
            <p className="font-semibold mb-2">{found.orderNumber} · {money(found.total)}</p>
            {found.items.map((i) => (
              <p key={i.id} className="text-sm text-stone-500">{i.quantity}× {i.nameSnapshot}</p>
            ))}
          </div>
        </div>
      )}
      <p className="page-note">Need help with an order or a change to your details? <Link href="/support">Contact Elnaj</Link> and include your order number. Table requests are handled separately through <Link href="/reservation">reservations</Link>.</p>
    </div>
  );
}
