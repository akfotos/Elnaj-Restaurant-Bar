"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertProduct } from "@/lib/admin-actions";
import { DIETARY_LABELS } from "@/lib/format";
import type { Product } from "@prisma/client";

type Cat = { id: string; name: string };

export default function ProductForm({ product, categories }: { product?: Product; categories: Cat[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    image: product?.image ?? "",
    stock: product?.stock ?? 0,
    trackStock: product?.trackStock ?? true,
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isBestseller: product?.isBestseller ?? false,
    isSeasonal: product?.isSeasonal ?? false,
    ingredients: product?.ingredients ?? "",
    allergens: product?.allergens ?? "",
    dietaryLabels: product?.dietaryLabels?.split(",").filter(Boolean) ?? [] as string[],
    nutrition: product?.nutrition ?? "",
    storageNotes: product?.storageNotes ?? "",
    extras: product?.extras
      ? (JSON.parse(product.extras) as { name: string; price: number }[]).map((e) => `${e.name}: ${e.price}`).join("\n")
      : "",
    weightBased: product?.weightBased ?? false,
    unitLabel: product?.unitLabel ?? "each",
    spicyLevel: product?.spicyLevel ?? 0,
    prepTimeMins: product?.prepTimeMins ?? 20,
  });

  const input = "w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm focus:border-brand-500";
  const num = (v: string) => (v === "" ? 0 : +v);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          await upsertProduct({
            id: product?.id,
            ...f,
            price: num(String(f.price)),
            compareAtPrice: f.compareAtPrice === "" ? undefined : num(String(f.compareAtPrice)),
            stock: num(String(f.stock)),
            dietaryLabels: f.dietaryLabels.join(","),
            spicyLevel: num(String(f.spicyLevel)),
            prepTimeMins: num(String(f.prepTimeMins)),
            nutrition: f.nutrition || undefined,
            extras: f.extras.trim()
              ? JSON.stringify(
                  f.extras
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .map((l) => {
                      const [name, p] = l.split(":").map((s) => s.trim());
                      return { name, price: p === undefined || p === "" ? 0 : +p };
                    })
                )
              : undefined,
          });
          router.push("/admin/products");
        });
      }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block"><span className="text-xs text-stone-500">Name</span><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} /></label>
        <label className="block"><span className="text-xs text-stone-500">Category</span>
          <select value={f.categoryId} onChange={(e) => setF({ ...f, categoryId: e.target.value })} className={input}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2"><span className="text-xs text-stone-500">Description</span><textarea required value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={`${input} h-20`} /></label>
        <label className="block"><span className="text-xs text-stone-500">Price (GHS)</span><input required type="number" step="0.01" value={f.price} onChange={(e) => setF({ ...f, price: +e.target.value })} className={input} /></label>
        <label className="block"><span className="text-xs text-stone-500">Compare-at price (sale)</span><input type="number" step="0.01" value={f.compareAtPrice} onChange={(e) => setF({ ...f, compareAtPrice: e.target.value === "" ? "" : +e.target.value })} className={input} /></label>
        <label className="block"><span className="text-xs text-stone-500">Image URL</span><input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} className={input} placeholder="https://…" /></label>
        <label className="block"><span className="text-xs text-stone-500">Stock</span><input type="number" value={f.stock} onChange={(e) => setF({ ...f, stock: +e.target.value })} className={input} /></label>
        <label className="block"><span className="text-xs text-stone-500">Ingredients</span><textarea value={f.ingredients} onChange={(e) => setF({ ...f, ingredients: e.target.value })} className={`${input} h-16`} /></label>
        <label className="block"><span className="text-xs text-stone-500">Allergens (comma-separated)</span><input value={f.allergens} onChange={(e) => setF({ ...f, allergens: e.target.value })} className={input} placeholder="nuts, dairy, shellfish" /></label>
        <label className="block"><span className="text-xs text-stone-500">Nutrition (JSON)</span><input value={f.nutrition} onChange={(e) => setF({ ...f, nutrition: e.target.value })} className={input} placeholder='{"calories":450,"protein":"30g"}' /></label>
        <label className="block"><span className="text-xs text-stone-500">Storage notes</span><input value={f.storageNotes} onChange={(e) => setF({ ...f, storageNotes: e.target.value })} className={input} placeholder="Keep refrigerated…" /></label>
        <label className="block sm:col-span-2"><span className="text-xs text-stone-500">Add-ons (one per line: Name: price)</span><textarea value={f.extras} onChange={(e) => setF({ ...f, extras: e.target.value })} className={`${input} h-20`} placeholder={"Extra chicken: 15\nExtra goat meat: 20\nSide salad: 10\nExtra plantain: 8"} /></label>
        <label className="block"><span className="text-xs text-stone-500">Spicy level (0–3)</span><input type="number" min={0} max={3} value={f.spicyLevel} onChange={(e) => setF({ ...f, spicyLevel: +e.target.value })} className={input} /></label>
        <label className="block"><span className="text-xs text-stone-500">Prep time (mins)</span><input type="number" value={f.prepTimeMins} onChange={(e) => setF({ ...f, prepTimeMins: +e.target.value })} className={input} /></label>
      </div>

      <div>
        <span className="text-xs text-stone-500">Dietary labels</span>
        <div className="flex flex-wrap gap-3 mt-2">
          {DIETARY_LABELS.map((l) => (
            <label key={l} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={f.dietaryLabels.includes(l)} onChange={(e) => setF({ ...f, dietaryLabels: e.target.checked ? [...f.dietaryLabels, l] : f.dietaryLabels.filter((x) => x !== l) })} />
              {l}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {([["isActive", "Active"], ["trackStock", "Track stock"], ["isFeatured", "Featured"], ["isBestseller", "Bestseller"], ["isSeasonal", "Seasonal"], ["weightBased", "Weight-based"]] as const).map(([k, label]) => (
          <label key={k} className="flex items-center gap-1.5">
            <input type="checkbox" checked={Boolean(f[k])} onChange={(e) => setF({ ...f, [k]: e.target.checked })} /> {label}
          </label>
        ))}
        {f.weightBased && (
          <input value={f.unitLabel} onChange={(e) => setF({ ...f, unitLabel: e.target.value })} className={`${input} w-32`} placeholder="per kg" />
        )}
      </div>

      <div className="flex gap-3">
        <button disabled={pending} className="bg-brand-500 disabled:opacity-50 text-ink-900 font-bold rounded-full px-6 py-2.5">
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm text-stone-500">Cancel</button>
      </div>
    </form>
  );
}
