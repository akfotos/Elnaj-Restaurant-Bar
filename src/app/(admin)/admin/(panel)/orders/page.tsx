import Link from "next/link";
import { db } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const status = sp.status ?? "";
  const orders = await db.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(q ? { OR: [{ orderNumber: { contains: q } }, { guestName: { contains: q } }, { guestEmail: { contains: q } }, { user: { name: { contains: q } } }] } : {}),
    },
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <form className="flex gap-3 mb-6">
        <input name="q" defaultValue={q} placeholder="Search order # or customer…" className="bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm w-72" />
        <select name="status" defaultValue={status} className="bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {["PENDING","CONFIRMED","PREPARING","READY","OUT_FOR_DELIVERY","DELIVERED","COMPLETED","CANCELLED"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="bg-brand-500 text-ink-900 text-sm font-semibold rounded-lg px-4">Filter</button>
        <a href="/api/admin/export/orders" className="ml-auto text-sm border border-black/15 rounded-lg px-4 py-2 hover:border-brand-500">Export CSV</a>
      </form>
      <div className="bg-ink-800 border border-black/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-stone-500 border-b border-black/10">
            <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3 text-right">Total</th><th className="p-3">Date</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-black/5 last:border-0 hover:bg-black/5">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-mono text-brand-500">{o.orderNumber}</Link></td>
                <td className="p-3">{o.user?.name ?? o.guestName ?? "—"}</td>
                <td className="p-3 text-stone-500">{o.fulfillment}</td>
                <td className="p-3"><span className="text-xs bg-ink-700 rounded-full px-2.5 py-1">{o.status.replace(/_/g, " ")}</span></td>
                <td className="p-3 text-stone-500">{o.paymentMethod} · {o.paymentStatus}</td>
                <td className="p-3 text-right font-semibold">{money(o.total)}</td>
                <td className="p-3 text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-sm text-stone-500">No orders found.</p>}
      </div>
    </div>
  );
}
