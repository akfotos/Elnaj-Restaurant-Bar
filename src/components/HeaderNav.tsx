"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["Home", "/"],
  ["Food", "/food"],
  ["Drinks", "/drinks"],
  ["Track", "/track"],
  ["Support", "/support"],
  ["FAQ", "/faq"],
];

export default function HeaderNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center mx-auto bg-white/10 rounded-full px-1.5 py-1">
      {LINKS.map(([label, href]) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm rounded-full px-4 py-1.5 transition ${
              active ? "bg-white text-[#1c1917] font-semibold" : "text-white/75 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
