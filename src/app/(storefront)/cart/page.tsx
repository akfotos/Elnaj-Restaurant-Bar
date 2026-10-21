"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, lineTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { useState } from "react";

export default function CartPage() {
  const { items, setQty, remove, setCoupon, couponCode } = useCart();
  const [code, setCode] = useState(couponCode ?? "");
  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);

  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/menu" className="inline-block mt-6 bg-brand-500 text-ink-900 font-bold rounded-full px-6 py-3">
          Browse the menu
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        {items.map((i) => (
          <div key={`${i.productId}|${i.variantName}|${(i.extras ?? []).map((e) => e.name).join(",")}`} className="flex gap-4 bg-ink-800 border border-black/10 rounded-xl p-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-ink-700 shrink-0">
              {i.image ? <Image src={i.image} alt={i.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center">🍽️</div>}
            </div>
            <div className="flex-1">
              <p className="font-medium">{i.name}{i.variantName ? ` · ${i.variantName}` : ""}</p>
              {(i.extras ?? []).length > 0 && (
                <p className="text-xs text-brand-500 mt-0.5">+ {i.extras!.map((e) => e.name).join(", ")}</p>
              )}
              <p className="text-sm text-stone-500">{money(i.unitPrice)} {i.weightBased ? i.unitLabel : "each"}</p>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  step={i.weightBased ? 0.25 : 1}
                  min={i.weightBased ? 0.25 : 1}
                  value={i.quantity}
                  onChange={(e) => setQty(i, +e.target.value)}
                  className="w-20 bg-ink-700 border border-black/10 rounded px-2 py-1 text-sm"
                />
                <button onClick={() => remove(i)} className="text-sm text-red-400 hover:underline">Remove</button>
              </div>
            </div>
            <p className="font-semibold">{money(lineTotal(i))}</p>
          </div>
        ))}
      </div>
      <aside className="bg-ink-800 border border-black/10 rounded-xl p-5 h-fit">
        <h2 className="font-bold mb-4">Order summary</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="flex-1 bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={() => setCoupon(code || undefined)} className="bg-ink-700 border border-black/15 rounded-lg px-3 text-sm hover:border-brand-500">Apply</button>
        </div>
        {couponCode && <p className="text-xs text-emerald-600 mb-3">Code {couponCode} will be validated at checkout</p>}
        <div className="flex justify-between text-sm py-2 border-t border-black/10">
          <span className="text-stone-500">Subtotal</span>
          <span className="font-semibold">{money(subtotal)}</span>
        </div>
        <p className="text-xs text-stone-500">Delivery fee and discounts calculated at checkout.</p>
        <Link href="/checkout" className="block text-center mt-5 bg-brand-500 text-ink-900 font-bold rounded-full py-3 hover:bg-brand-600">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
