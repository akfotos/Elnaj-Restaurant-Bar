import { db } from "@/lib/db";
import { upsertZone, deleteZone } from "@/lib/admin-actions";
import { revalidatePath } from "next/cache";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DeliveryPage() {
  const zones = await db.deliveryZone.findMany();
  const input = "bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Delivery zones</h1>
      <form
        action={async (fd) => {
          "use server";
          await upsertZone({
            name: String(fd.get("name")),
            postalCodes: String(fd.get("postalCodes")),
            fee: +(fd.get("fee") ?? 0),
            minOrder: +(fd.get("minOrder") ?? 0),
            etaMinutes: +(fd.get("etaMinutes") ?? 45),
            isActive: true,
          });
          revalidatePath("/admin/delivery");
        }}
        className="grid sm:grid-cols-6 gap-3 mb-8 bg-ink-800 border border-black/10 rounded-xl p-4"
      >
        <input name="name" required placeholder="Zone name" className={input} />
        <input name="postalCodes" required placeholder="Postal prefixes (e.g. GA, 00233)" className={`${input} sm:col-span-2`} />
        <input name="fee" required type="number" step="0.01" placeholder="Fee" className={input} />
        <input name="minOrder" type="number" step="0.01" placeholder="Min order" className={input} />
        <input name="etaMinutes" type="number" placeholder="ETA min" className={input} />
        <button className="bg-brand-500 text-ink-900 text-sm font-semibold rounded-lg px-4 py-2 w-fit sm:col-span-6">Add zone</button>
      </form>
      <div className="bg-ink-800 border border-black/10 rounded-xl">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center gap-4 p-4 border-b border-black/5 last:border-0 text-sm">
            <p className="font-medium w-32">{z.name}</p>
            <p className="text-stone-500 flex-1">{z.postalCodes}</p>
            <p>{money(z.fee)}</p>
            <p className="text-stone-500">min {money(z.minOrder)}</p>
            <p className="text-stone-500">~{z.etaMinutes} min</p>
            <form action={async () => { "use server"; await deleteZone(z.id); }}>
              <button className="text-red-400 text-xs">Delete</button>
            </form>
          </div>
        ))}
        {zones.length === 0 && <p className="p-6 text-sm text-stone-500">No zones configured — delivery will be unavailable at checkout.</p>}
      </div>
    </div>
  );
}
