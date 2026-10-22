"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, lineTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";

type Zone = { id: string; name: string; postalCodes: string; fee: number; minOrder: number; etaMinutes: number };
type Addr = { id: string; label: string; line1: string; line2?: string | null; city: string; postalCode: string };

export default function CheckoutPage() {
  const { items, couponCode, clear } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Addr[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fulfillment: "DELIVERY",
    name: "", email: "", phone: "",
    addressId: "", line1: "", line2: "", city: "", postalCode: "",
    timeSlot: "ASAP", notes: "", paymentMethod: "cod",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/checkout-meta").then((r) => r.json()).then((d) => {
      setZones(d.zones); setSlots(d.slots); setAddresses(d.addresses); setSettings(d.settings);
      if (d.user) setForm((f) => ({ ...f, name: d.user.name, email: d.user.email, phone: d.user.phone ?? "" }));
    });
  }, []);

  if (!mounted) return null;
  if (items.length === 0)
    return <div className="storefront-page storefront-narrow"><PageIntro eyebrow="Checkout" title="Choose your meal first." description="Add your favourites to the basket before choosing delivery or pickup. You don’t need an account to place an order." /><Link href="/menu" className="dining-text-link">Explore the menu <span aria-hidden="true">↗</span></Link></div>;

  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const zone = zones.find((z) => z.postalCodes.split(",").map((s) => s.trim()).some((p) => form.postalCode.startsWith(p)));
  const deliveryFee = form.fulfillment === "DELIVERY" ? zone?.fee ?? 0 : 0;
  const taxRate = +(settings.taxRate ?? 0) / 100;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  const field = (k: keyof typeof form, label: string, props: Record<string, unknown> = {}) => (
    <label className="block">
      <span className="text-sm text-stone-500">{label}</span>
      <input
        value={form[k]}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="mt-1 w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm focus:border-brand-500"
        {...props}
      />
    </label>
  );

  const submit = async () => {
    setLoading(true); setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, items, couponCode }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong");
    clear();
    router.push(`/order-confirmation/${data.orderNumber}`);
  };

  return (
    <div className="storefront-page">
      <PageIntro eyebrow="Delivery or pickup" title="Make it your meal." description="Tell us where and when you’d like your food, add your contact details, and review your order. Our team will check availability after you submit it." />
      <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
      <div className="lg:col-span-2 space-y-8">

        <section className="bg-ink-800 border border-black/10 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Delivery or pickup</h2>
          <div className="flex gap-3">
            {settings.deliveryEnabled === "true" && (
              <button onClick={() => setForm({ ...form, fulfillment: "DELIVERY" })} className={`flex-1 rounded-lg border py-3 text-sm font-medium ${form.fulfillment === "DELIVERY" ? "border-brand-500 text-brand-500" : "border-black/15"}`}>
                🛵 Delivery
              </button>
            )}
            {settings.pickupEnabled === "true" && (
              <button onClick={() => setForm({ ...form, fulfillment: "PICKUP" })} className={`flex-1 rounded-lg border py-3 text-sm font-medium ${form.fulfillment === "PICKUP" ? "border-brand-500 text-brand-500" : "border-black/15"}`}>
                🛍️ Pickup — {settings.pickupAddress}
              </button>
            )}
          </div>
        </section>

        <section className="bg-ink-800 border border-black/10 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Your details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field("name", "Full name", { required: true })}
            {field("phone", "Phone", { required: true })}
            {field("email", "Email", { type: "email", required: true })}
          </div>
        </section>

        {form.fulfillment === "DELIVERY" && (
          <section className="bg-ink-800 border border-black/10 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold">Delivery address</h2>
            {addresses.length > 0 && (
              <select
                value={form.addressId}
                onChange={(e) => {
                  const a = addresses.find((x) => x.id === e.target.value);
                  setForm({ ...form, addressId: e.target.value, line1: a?.line1 ?? "", line2: a?.line2 ?? "", city: a?.city ?? "", postalCode: a?.postalCode ?? "" });
                }}
                className="w-full bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">New address…</option>
                {addresses.map((a) => <option key={a.id} value={a.id}>{a.label} — {a.line1}, {a.city}</option>)}
              </select>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {field("line1", "Street address")}
              {field("line2", "Apt / landmark (optional)")}
              {field("city", "City")}
              {field("postalCode", "Postal / area code")}
            </div>
            {form.postalCode && !zone && (
              <p className="text-sm text-amber-700">We may not deliver to this area — your order will be reviewed.</p>
            )}
            {zone && <p className="text-sm text-emerald-600">✓ {zone.name}: {money(zone.fee)} delivery, ~{zone.etaMinutes} min{zone.minOrder > 0 && subtotal < zone.minOrder ? ` — minimum order ${money(zone.minOrder)}` : ""}</p>}
          </section>
        )}

        <section className="bg-ink-800 border border-black/10 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Time &amp; notes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-stone-500">Preferred time</span>
              <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} className="mt-1 w-full bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm">
                {slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-stone-500">Payment method</span>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="mt-1 w-full bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm">
                <option value="cod">Cash on {form.fulfillment === "PICKUP" ? "pickup" : "delivery"}</option>
                <option value="momo">Mobile Money</option>
                <option value="card">Card (pay on arrival)</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-stone-500">Order notes / delivery instructions</span>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm h-20" placeholder="Allergies, gate code, spice level…" />
          </label>
        </section>
      </div>

      <aside className="bg-ink-800 border border-black/10 rounded-xl p-5 h-fit">
        <h2 className="font-bold mb-4">Your order</h2>
        <div className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={`${i.productId}|${i.variantName}|${(i.extras ?? []).map((e) => e.name).join(",")}`} className="flex justify-between gap-3">
              <span className="text-stone-600">{i.quantity}× {i.name}{i.variantName ? ` (${i.variantName})` : ""}
                {(i.extras ?? []).length > 0 && <span className="block text-xs text-brand-500">+ {i.extras!.map((e) => e.name).join(", ")}</span>}
              </span>
              <span>{money(lineTotal(i))}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 mt-4 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between text-stone-500"><span>Delivery</span><span>{money(deliveryFee)}</span></div>
          {tax > 0 && <div className="flex justify-between text-stone-500"><span>Tax</span><span>{money(tax)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-2"><span>Estimated total</span><span className="text-brand-500">{money(total)}</span></div>
        </div>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        <button onClick={submit} disabled={loading} className="w-full mt-5 bg-brand-500 disabled:opacity-50 text-ink-900 font-bold rounded-full py-3 hover:bg-brand-600">
          {loading ? "Placing order…" : "Place order"}
        </button>
        <p className="text-xs text-stone-500 mt-4 leading-relaxed">No online payment is taken on this page. Your selected payment method is recorded for the restaurant to arrange with you.</p>
        {couponCode && <p className="text-xs text-stone-500 mt-3 leading-relaxed">Promo code {couponCode} will be checked when the order is submitted. The estimate above does not include a promo discount.</p>}
      </aside>
      </div>
      <p className="page-note">Please check your address, phone number and order notes carefully. For an allergy or a request that needs confirmation, <Link href="/support">contact the team</Link> before placing your order.</p>
    </div>
  );
}
