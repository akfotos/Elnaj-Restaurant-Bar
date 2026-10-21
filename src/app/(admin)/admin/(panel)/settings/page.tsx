import { getSettings } from "@/lib/settings";
import { saveSettings } from "@/lib/admin-actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const FIELDS: [string, string, string?][] = [
  ["storeName", "Store name"],
  ["announcement", "Announcement banner"],
  ["currency", "Currency code"],
  ["taxRate", "Tax rate %", "number"],
  ["pickupAddress", "Pickup address"],
  ["timeSlots", "Time slots (comma-separated)"],
];

export default async function SettingsPage() {
  const s = await getSettings();
  const input = "w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm";

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form
        action={async (fd) => {
          "use server";
          const entries: Record<string, string> = {};
          for (const [k] of FIELDS) entries[k] = String(fd.get(k) ?? "");
          entries.deliveryEnabled = fd.get("deliveryEnabled") === "on" ? "true" : "false";
          entries.pickupEnabled = fd.get("pickupEnabled") === "on" ? "true" : "false";
          await saveSettings(entries);
          revalidatePath("/");
        }}
        className="space-y-4"
      >
        {FIELDS.map(([k, label, type]) => (
          <label key={k} className="block">
            <span className="text-sm text-stone-500">{label}</span>
            <input name={k} type={type ?? "text"} step="0.01" defaultValue={s[k]} className={`${input} mt-1`} />
          </label>
        ))}
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2"><input name="deliveryEnabled" type="checkbox" defaultChecked={s.deliveryEnabled === "true"} /> Delivery enabled</label>
          <label className="flex items-center gap-2"><input name="pickupEnabled" type="checkbox" defaultChecked={s.pickupEnabled === "true"} /> Pickup enabled</label>
        </div>
        <button className="bg-brand-500 text-ink-900 font-bold rounded-full px-6 py-2.5">Save settings</button>
      </form>
      <div className="mt-10 bg-ink-800 border border-black/10 rounded-xl p-5 text-sm text-stone-500">
        <h2 className="font-semibold text-stone-800 mb-2">Payment providers</h2>
        <p>Cash on delivery and Mobile Money are active. To accept online cards, Apple Pay or Google Pay, connect Stripe/Paystack keys via environment variables (<code className="text-brand-500">STRIPE_SECRET_KEY</code>, <code className="text-brand-500">PAYSTACK_SECRET_KEY</code>).</p>
      </div>
    </div>
  );
}
