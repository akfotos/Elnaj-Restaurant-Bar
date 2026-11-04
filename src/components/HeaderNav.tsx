"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["Home", "/"],
  ["About", "/about"],
  ["Menu", "/menu"],
  ["Events", "/events"],
  ["Contact", "/support"],
];

export default function HeaderNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="site-header-nav">
      {LINKS.map(([label, href]) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/menu" && pathname.startsWith("/product/"));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="site-header-nav-link"
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
