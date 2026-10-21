"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

export default function CartButton() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 8z" strokeLinejoin="round"/>
        <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round"/>
      </svg>
      {mounted && count > 0 && (
        <span key={count} className="animate-cart-bump absolute -top-1 -right-1 bg-brand-500 text-ink-900 text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </Link>
  );
}
