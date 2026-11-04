"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["Home", "/"],
  ["About Elnaj", "/about"],
  ["Menu", "/menu"],
  ["Book a table", "/reservation"],
  ["Private hire & events", "/events"],
  ["Track Order", "/track"],
  ["Contact & enquiries", "/support"],
  ["FAQ", "/faq"],
  ["Guest guide & policies", "/policies"],
];

export default function MobileMenu({ signedIn, isAdmin, name }: { signedIn: boolean; isAdmin: boolean; name?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return (
    <div ref={container} className="site-mobile-navigation">
      <button
        ref={toggle}
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="storefront-navigation"
        className="site-mobile-toggle"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={open ? "M6 6l12 12M6 18L18 6" : "M4 8h16M4 16h16"} strokeLinecap="round" /></svg>
      </button>
      {open && (
        <div className="site-mobile-panel">
          <nav id="storefront-navigation" aria-label="Main navigation">
            <p className="site-mobile-eyebrow">Explore Elnaj</p>
            {LINKS.map(([label, href]) => {
              const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`) || (href === "/menu" && pathname.startsWith("/product/"));
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className="site-mobile-link">
                  {label}<span aria-hidden="true">↗</span>
                </Link>
              );
            })}
            <div className="site-mobile-account">
              {isAdmin && <Link href="/admin" onClick={() => setOpen(false)}>Admin workspace</Link>}
              <Link href={signedIn ? "/account" : "/login"} onClick={() => setOpen(false)}>{signedIn ? `My account${name ? ` · ${name}` : ""}` : "Sign in"}</Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
