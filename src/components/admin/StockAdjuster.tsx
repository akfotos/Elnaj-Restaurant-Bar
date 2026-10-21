"use client";

import { useTransition } from "react";
import { adjustStock } from "@/lib/admin-actions";

export default function StockAdjuster({ productId }: { productId: string }) {
  const [pending, start] = useTransition();
  const btn = "ml-1 text-xs border border-black/15 rounded px-1.5 hover:border-brand-500 disabled:opacity-40";
  return (
    <span className="inline-flex ml-2">
      <button disabled={pending} onClick={() => start(() => adjustStock(productId, -1))} className={btn}>−</button>
      <button disabled={pending} onClick={() => start(() => adjustStock(productId, 1))} className={btn}>+</button>
    </span>
  );
}
