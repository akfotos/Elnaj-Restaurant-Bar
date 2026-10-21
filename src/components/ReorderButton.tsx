"use client";

import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

type Item = { productId: string; variantName?: string; quantity: number; unitPrice: number; name: string };

export default function ReorderButton({ items }: { items: Item[] }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  return (
    <button
      onClick={() => {
        items.forEach((i) => add({ productId: i.productId, slug: "", name: i.name, variantName: i.variantName, unitPrice: i.unitPrice, quantity: i.quantity }));
        router.push("/cart");
      }}
      className="text-sm border border-brand-500 text-brand-500 rounded-full px-4 py-1.5 hover:bg-brand-500 hover:text-ink-900"
    >
      Reorder
    </button>
  );
}
