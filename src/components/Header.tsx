import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getSetting } from "@/lib/settings";
import CartButton from "@/components/CartButton";
import MobileMenu from "@/components/MobileMenu";
import HeaderNav from "@/components/HeaderNav";

export default async function Header() {
  const user = await getSessionUser();
  const announcement = await getSetting("announcement");
  return (
    <header id="top" className="sticky top-3 z-40 px-3 sm:px-4">
      {announcement && (
        <div className="text-stone-500 text-center text-[11px] py-2 px-4 -mt-3 mb-2">
          {announcement}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1c1917] text-[#fafaf9] rounded-full flex items-center gap-2 pl-3 pr-2 py-2 shadow-lg shadow-black/10 border border-white/5">
          <MobileMenu signedIn={!!user} isAdmin={!!user && user.role !== "CUSTOMER"} name={user?.name.split(" ")[0]} />
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 10.5a1.5 1.5 0 1 0 1.5 1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="font-bold tracking-tight text-base md:text-lg whitespace-nowrap">
              <span className="text-[#dca5b1]">Elnaj</span><span className="hidden min-[420px]:inline"> Restaurant &amp; Bar</span>
            </span>
          </Link>

          <HeaderNav />

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <CartButton />
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {user.role !== "CUSTOMER" && (
                    <Link href="/admin" className="text-sm font-medium text-white/80 hover:text-white px-3 py-2 rounded-full bg-white/10">Admin</Link>
                  )}
                  <Link href="/account" className="text-sm font-semibold bg-white text-[#1c1917] rounded-full px-5 py-2 hover:bg-[#e7e5e4] transition">
                    Hi, {user.name.split(" ")[0]}
                  </Link>
                </>
              ) : (
                <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 transition">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
