import { db } from "@/lib/db";
import { money } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [orders, revenue, products, customers, lowStock, recent] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    db.product.count({ where: { isActive: true } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.findMany({ where: { isActive: true, trackStock: true, stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 8 }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const totalRevenue = revenue._sum.total ?? 0;
  const pending = await db.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } } });

  const stats = [
    ["Revenue", money(totalRevenue)],
    ["Orders", String(orders)],
    ["Avg order", orders ? money(totalRevenue / orders) : "—"],
    ["Active orders", String(pending)],
    ["Products", String(products)],
    ["Customers", String(customers)],
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(([k, v]) => (
          <div key={k} className="bg-ink-800 border border-black/10 rounded-xl p-5">
            <p className="text-sm text-stone-500">{k}</p>
            <p className="text-2xl font-bold mt-1">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-ink-800 border border-black/10 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-500">All →</Link>
          </div>
          {recent.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex justify-between text-sm py-2 border-b border-black/5 last:border-0 hover:text-brand-500">
              <span className="font-mono">{o.orderNumber}</span>
              <span className="text-stone-500">{o.status.replace(/_/g, " ")}</span>
              <span>{money(o.total)}</span>
            </Link>
          ))}
        </section>
        <section className="bg-ink-800 border border-black/10 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Low stock alerts</h2>
          {lowStock.length === 0 && <p className="text-sm text-stone-500">All stocked up.</p>}
          {lowStock.map((p) => (
            <div key={p.id} className="flex justify-between text-sm py-2 border-b border-black/5 last:border-0">
              <span>{p.name}</span>
              <span className={p.stock <= 0 ? "text-red-600" : "text-amber-600"}>{p.stock} left</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
