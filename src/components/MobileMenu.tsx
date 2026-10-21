"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["Home", "/"],
  ["About Elnaj", "/about"],
  ["Full menu", "/menu"],
  ["Food", "/food"],
  ["Drinks", "/drinks"],
  ["Vegan", "/menu?tag=vegan"],
  ["Track Order", "/track"],
  ["Contact & enquiries", "/support"],
  ["FAQ", "/faq"],
  ["Guest guide & policies", "/policies"],
];

export default function MobileMenu({ signedIn, isAdmin, name }: { signedIn: boolean; isAdmin: boolean; name?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="xl:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="storefront-navigation"
        className="p-2 -ml-1 text-white"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        )}
      </button>
      {open && (
        <div className="animate-slide-down absolute left-0 right-0 top-full mt-1 mx-3 bg-ink-800 border border-black/10 rounded-2xl shadow-lg overflow-hidden">
          <nav id="storefront-navigation" aria-label="Main navigation" className="flex flex-col px-4 py-3 text-sm text-stone-800 max-h-[75svh] overflow-y-auto">
            {LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`py-3 border-b border-black/5 last:border-0 ${pathname === href ? "text-brand-500 font-medium" : ""}`}
              >
                {label}
              </Link>
            ))}
            <div className="py-3 flex items-center gap-4">
              {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="text-brand-500 font-medium">Admin</Link>}
              <Link href={signedIn ? "/account" : "/login"} onClick={() => setOpen(false)} className="text-brand-500 font-medium">
                {signedIn ? `Hi, ${name}` : "Sign in"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
