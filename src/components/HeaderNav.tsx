"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["Home", "/"],
  ["About", "/about"],
  ["Menu", "/menu"],
  ["Contact", "/support"],
];

export default function HeaderNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-1 mx-auto px-2 py-1">
      {LINKS.map(([label, href]) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/menu" && pathname.startsWith("/product/"));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`text-sm px-4 py-2 transition ${
              active ? "text-white underline underline-offset-8 decoration-white/40" : "text-white/60 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
