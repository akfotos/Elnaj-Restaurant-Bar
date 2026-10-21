"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddressForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "Home", line1: "", line2: "", city: "", postalCode: "", isDefault: false });
  const router = useRouter();
  const input = "w-full bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm";

  if (!open)
    return <button onClick={() => setOpen(true)} className="text-sm text-brand-500 border border-brand-500 rounded-full px-4 py-1.5">+ Add address</button>;

  return (
    <form
      className="bg-ink-800 border border-black/10 rounded-xl p-4 grid sm:grid-cols-2 gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setOpen(false);
        router.refresh();
      }}
    >
      <input required placeholder="Label (Home, Work…)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={input} />
      <input required placeholder="Street address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={input} />
      <input placeholder="Apt / landmark" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={input} />
      <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={input} />
      <input required placeholder="Postal / area code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className={input} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Set as default</label>
      <div className="sm:col-span-2 flex gap-3">
        <button className="bg-brand-500 text-ink-900 text-sm font-semibold rounded-lg px-4 py-2">Save</button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-stone-500">Cancel</button>
      </div>
    </form>
  );
}
