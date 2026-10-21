import { db } from "@/lib/db";
import { money } from "@/lib/format";
import TrackSearch from "@/components/TrackSearch";

export const dynamic = "force-dynamic";
export const metadata = { title: "Track Order" };

const STEPS = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

export default async function TrackPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { order } = await searchParams;
  const found = order
    ? await db.order.findUnique({ where: { orderNumber: order.toUpperCase() }, include: { items: true, statusHistory: { orderBy: { createdAt: "desc" } } } })
    : null;

  const currentIdx = found ? STEPS.indexOf(found.status as string) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center">Track your order</h1>
      <TrackSearch initial={order ?? ""} />
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
                      <p className={`font-medium ${done ? "" : "text-stone-500"}`}>{s.replace(/_/g, " ")}</p>
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
    </div>
  );
}
