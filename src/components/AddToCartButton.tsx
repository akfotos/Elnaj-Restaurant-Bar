"use client";

import { useCart, type CartItem } from "@/lib/cart";
import { useState } from "react";

export default function AddToCartButton({ item, disabled }: { item: CartItem; disabled?: boolean }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={() => {
        add(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="btn-press text-sm font-semibold bg-brand-500 disabled:bg-stone-700 disabled:text-stone-500 text-ink-900 rounded-full px-4 py-1.5 hover:bg-brand-600"
    >
      {disabled ? "Sold out" : added ? "Added ✓" : "Add"}
    </button>
  );
}
