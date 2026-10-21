"use client";

import { useState } from "react";
import { useCart, type Extra } from "@/lib/cart";
import { money } from "@/lib/format";
import type { Product, ProductVariant } from "@prisma/client";

export default function ProductPurchase({ product }: { product: Product & { variants: ProductVariant[] } }) {
  const add = useCart((s) => s.add);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [qty, setQty] = useState(product.weightBased ? 0.5 : 1);
  const [added, setAdded] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const price = variant?.price ?? product.price;
  const out = product.trackStock && product.stock <= 0 && !variant;

  const extras: Extra[] = product.extras ? JSON.parse(product.extras) : [];
  const chosen = extras.filter((e) => selected.includes(e.name));
  const extrasSum = chosen.reduce((s, e) => s + e.price, 0);
  const unitTotal = price + extrasSum;

  return (
    <div className="mt-6 bg-ink-800 border border-black/10 rounded-xl p-4">
      {product.variants.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Size / option</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setVariant(null)}
              className={`text-sm rounded-full px-4 py-1.5 border ${!variant ? "border-brand-500 text-brand-500" : "border-black/15"}`}
            >
              Standard · {money(product.price)}
            </button>
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariant(v)}
                disabled={v.stock <= 0}
                className={`text-sm rounded-full px-4 py-1.5 border disabled:opacity-40 ${variant?.id === v.id ? "border-brand-500 text-brand-500" : "border-black/15"}`}
              >
                {v.name} · {money(v.price)}
              </button>
            ))}
          </div>
        </div>
      )}
      {extras.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Add extras <span className="text-stone-500 font-normal">(optional)</span></p>
          <div className="flex flex-wrap gap-2">
            {extras.map((e) => {
              const on = selected.includes(e.name);
              return (
                <button
                  key={e.name}
                  type="button"
                  onClick={() => setSelected((s) => (on ? s.filter((x) => x !== e.name) : [...s, e.name]))}
                  className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${
                    on ? "border-brand-500 bg-brand-500/10 text-brand-500" : "border-black/15 text-stone-600 hover:border-black/30"
                  }`}
                >
                  {on ? "✓ " : "+ "}{e.name}{e.price > 0 ? ` · ${money(e.price)}` : " · free"}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-black/15 rounded-full">
          <button onClick={() => setQty(Math.max(product.weightBased ? 0.25 : 1, +(qty - (product.weightBased ? 0.25 : 1)).toFixed(2)))} className="px-3 py-1.5 text-lg">−</button>
          <span className="w-14 text-center text-sm">{qty}{product.weightBased ? ` ${product.unitLabel.replace("per ", "")}` : ""}</span>
          <button onClick={() => setQty(+(qty + (product.weightBased ? 0.25 : 1)).toFixed(2))} className="px-3 py-1.5 text-lg">+</button>
        </div>
        <button
          disabled={out || (variant !== null && variant.stock <= 0)}
          onClick={() => {
            add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              variantName: variant?.name,
              extras: chosen,
              unitPrice: price,
              quantity: qty,
              weightBased: product.weightBased,
              unitLabel: product.unitLabel,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 1200);
          }}
          className="flex-1 bg-brand-500 disabled:bg-stone-700 disabled:text-stone-500 text-ink-900 font-bold rounded-full py-2.5 hover:bg-brand-600"
        >
          {out ? "Out of stock" : added ? "Added ✓" : `Add to cart — ${money(unitTotal * qty)}`}
        </button>
      </div>
    </div>
  );
}
