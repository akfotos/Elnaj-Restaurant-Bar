import { db } from "@/lib/db";
import { upsertCoupon } from "@/lib/admin-actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { code: "asc" } });
  const input = "bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Coupons &amp; promotions</h1>
      <form
        action={async (fd) => {
          "use server";
          await upsertCoupon({
            code: String(fd.get("code")),
            description: String(fd.get("description") ?? ""),
            percentOff: fd.get("percentOff") ? +String(fd.get("percentOff")) : undefined,
            amountOff: fd.get("amountOff") ? +String(fd.get("amountOff")) : undefined,
            minOrder: +(fd.get("minOrder") ?? 0),
            maxUses: fd.get("maxUses") ? +String(fd.get("maxUses")) : undefined,
            expiresAt: String(fd.get("expiresAt") ?? "") || undefined,
            isActive: true,
            freeDelivery: fd.get("freeDelivery") === "on",
          });
          revalidatePath("/admin/coupons");
        }}
        className="grid sm:grid-cols-4 gap-3 mb-8 bg-ink-800 border border-black/10 rounded-xl p-4"
      >
        <input name="code" required placeholder="CODE" className={input} />
        <input name="description" placeholder="Description" className={input} />
        <input name="percentOff" type="number" step="0.1" placeholder="% off" className={input} />
        <input name="amountOff" type="number" step="0.01" placeholder="Amount off" className={input} />
        <input name="minOrder" type="number" step="0.01" placeholder="Min order" className={input} />
        <input name="maxUses" type="number" placeholder="Max uses" className={input} />
        <input name="expiresAt" type="date" className={input} />
        <label className="flex items-center gap-2 text-sm"><input name="freeDelivery" type="checkbox" /> Free delivery</label>
        <button className="bg-brand-500 text-ink-900 text-sm font-semibold rounded-lg px-4 py-2 sm:col-span-4 w-fit">Create coupon</button>
      </form>
      <div className="bg-ink-800 border border-black/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-stone-500 border-b border-black/10">
            <tr><th className="p-3">Code</th><th className="p-3">Discount</th><th className="p-3">Min order</th><th className="p-3">Uses</th><th className="p-3">Expires</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="p-3 font-mono font-semibold text-brand-500">{c.code}</td>
                <td className="p-3">{c.percentOff ? `${c.percentOff}%` : c.amountOff ? `GHS ${c.amountOff}` : ""}{c.freeDelivery ? " + free delivery" : ""}</td>
                <td className="p-3 text-stone-500">{c.minOrder ? `GHS ${c.minOrder}` : "—"}</td>
                <td className="p-3 text-stone-500">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}</td>
                <td className="p-3 text-stone-500">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                <td className="p-3">{c.isActive ? <span className="text-emerald-600">Active</span> : <span className="text-stone-500">Inactive</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
